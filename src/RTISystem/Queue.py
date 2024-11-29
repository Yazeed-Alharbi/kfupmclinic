import rticonnextdds_connector as rti
import json
import threading
import time
import sys
import os
import queue
from websockets import serve
from websockets.exceptions import ConnectionClosed
import asyncio
from Config import *

newEntries = {}
entries = {}
lock = threading.Lock()
connectLock = threading.Lock()
connected_clients = set()  # To track connected WebSocket clients
message_queue = queue.Queue()  # Queue for communication between threads
previous_patients = []

# Function to send messages to all connected WebSocket clients
async def broadcast():
    """
    Send the updated queue and the last two finished patients to all connected WebSocket clients.
    """
    to_remove = []
    message = json.dumps({
        "entries": entries,  # Current queue
        "finishedPatients": previous_patients  # Last two finished patients
    })  # Combine both into the message payload

    with connectLock:
        for websocket in connected_clients:
            try:
                await websocket.send(message)  # Send the combined message
            except ConnectionClosed:
                to_remove.append(websocket)

        # Remove disconnected clients
        for websocket in to_remove:
            connected_clients.remove(websocket)


# WebSocket handler function
async def websocket_handler(websocket, path):
    """
    Handle WebSocket connections and send initial data to connected clients.
    """
    with connectLock:
        connected_clients.add(websocket)
        with lock:
            # Send both entries and previous patients
            await websocket.send(json.dumps({
                "entries": entries,
                "finishedPatients": previous_patients
            }))

    try:
        async for message in websocket:
            pass  # Keep connection alive
    finally:
        with connectLock:
            connected_clients.remove(websocket)
            print("Removed WebSocket connection")


# DDS task to receive check-in updates
def recieveCheckIn(checkInReader, queueWriter):
    while True:
        checkInReader.take()
        for sample in checkInReader.samples.valid_data_iter:
            appointment_id = int(sample.get_number("appointmentID"))
            patient_id = int(sample.get_number("patientID"))
            doctor_id = int(sample.get_number("doctorID"))
            priority = int(sample.get_number("Priority"))
            doctor = sample.get_string("doctorName")
            patient_name = sample.get_string("patientName")
            department = sample.get_string("department")
            
            queue_entry = {
                "appointmentID": appointment_id,
                "patientID": patient_id,
                "doctorID": doctor_id,
                "Priority": priority,
                "doctorName": doctor,
                "patientName": patient_name,
                "department": department,
                "entered": False,
                "finished": False
            }

            print(f"Received Appointment {appointment_id}")
            print(queue_entry)
            with lock:
                if department not in entries:
                    entries[department] = {}
                if doctor not in entries[department]:
                    entries[department][doctor] = {0: [], 1: []}
                
                entries[department][doctor][priority].append(queue_entry)
                publishQueue(queueWriter, queue_entry)
                print(entries)
            # Place updated data in the queue for the WebSocket thread to broadcast
            asyncio.run(broadcast())  # Send the entire queue to connected WebSockets
        
        time.sleep(1)

# Function to publish updates to DDS
def publishQueue(queueWriter, payload):
    try:
        print("publishing payload",payload)
        queueWriter.instance.set_number("appointmentID", int(payload["appointmentID"]))
        queueWriter.instance.set_number("patientID", int(payload["patientID"]))
        queueWriter.instance.set_number("doctorID", payload["doctorID"])
        queueWriter.instance.set_number("Priority", payload["Priority"])
        queueWriter.instance.set_string("doctorName",payload['doctorName'])
        queueWriter.instance.set_string("patientName",payload['patientName'])
        queueWriter.instance.set_string("department",payload['department'])
        queueWriter.instance.set_boolean("entered",payload['entered'])
        queueWriter.instance.set_boolean("finished",payload['finished'])
        queueWriter.write()
    except Exception as e:
        print(f"Error encountered when writing to queue topic: {e}")

def add_to_previous_patients(patient):
    global previous_patients
    previous_patients.append(patient)
    if len(previous_patients) > 2:  # Keep only the last 2 patients
        previous_patients.pop(0)
    print(f"Updated previous patients list: {previous_patients}")

# DDS task to receive doctor finish updates
def recieveDoctorFinish(queueReader, queueUpdateWriter):
    while True:
        queueReader.take()
        for sample in queueReader.samples.valid_data_iter:
            appointment_id = sample.get_number("appointmentID")
            patient_id = sample.get_number("patientID")
            doctor_id = sample.get_number("doctorID")
            priority = sample.get_number("Priority")
            doctor = sample.get_string("doctorName")
            patient_name = sample.get_string("patientName")
            department = sample.get_string("department")
            finished = sample.get_boolean("finished")
            entered = sample.get_boolean("entered")

            with lock:
                if department not in entries:
                    continue
                if doctor not in entries[department]:
                    continue
                finished = bool(finished)
                entered = bool(entered)

                queue_entry = {
                    "appointmentID": appointment_id,
                    "patientID": patient_id,
                    "doctorID": doctor_id,
                    "Priority": priority,
                    "doctorName": doctor,
                    "patientName": patient_name,
                    "department": department,
                    "entered": entered,
                    "finished": finished
                }

                print("Received doctor finish update:", queue_entry)

                entries_list = entries[department][doctor][priority]
                # Find the entry with matching appointment ID
                for entry in entries_list[:]:  # Iterate over a copy of the list
                    if entry["appointmentID"] == appointment_id:
                        if finished:
                            # Add to previous patients before removing
                            add_to_previous_patients(entry)
                            entries_list.remove(entry)
                        elif entered:
                            entry.update(queue_entry)
                        break  # Exit the loop after processing
                else:
                    print(f"Appointment ID {appointment_id} not found in entries.")

                publishQueue(queueUpdateWriter, queue_entry)

            asyncio.run(broadcast())  # Send updated data to WebSocket clients
        time.sleep(1)


# WebSocket server setup
async def websocket_server():
    """
    WebSocket server to handle incoming connections.
    """
    server = await serve(websocket_handler, host=QUEUE_HOST, port=QUEUE_PORT)
    print(f"WebSocket server running on ws://{QUEUE_HOST}:{QUEUE_PORT}")
    await server.wait_closed()

# Function to start DDS tasks in a separate thread
def start_dds_tasks():
    with rti.open_connector(
        config_name="ClinicParticipants::QueueDisplay",
        url="clinic.xml"
    ) as connector:
        
        checkInReader = connector.get_input("CheckedInSubscriber::CheckInTopicReader")
        queueWriter = connector.get_output("QueueWriter::QueueTopicWriter")
        
        # Start receiving check-ins and doctor finishes
        threading.Thread(target=recieveCheckIn, args=(checkInReader, queueWriter), daemon=True).start()
        # threading.Thread(target=recieveDoctorFinish, args=(queueReader,), daemon=True).start()
        # Block to keep the DDS tasks running
        with rti.open_connector(
        config_name="ClinicParticipants::QueueDisplay",
        url="clinic.xml"
        ) as connector2:
            queueUpdateWriter = connector.get_output("QueueWriter::QueueTopicWriter")
            queueReader = connector2.get_input("QueueTopicSubscriber::QueueTopicReader")
            threading.Thread(target=recieveDoctorFinish, args=(queueReader,queueUpdateWriter), daemon=True).start()
            while True:
                time.sleep(1)
    
        

# Start WebSocket server in a separate thread
def start_websocket_server():
    asyncio.run(websocket_server())

def main():
    # Start DDS tasks and WebSocket server in separate threads
    threading.Thread(target=start_dds_tasks, daemon=True).start()
    start_websocket_server()

if __name__ == "__main__":
    main()
