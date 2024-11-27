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
sys.path.append(os.path.abspath("C:/Users/rayan/OneDrive/Documents/GitHub/kfupmclinic/src/RTISystem/RTITest"))
from Config import *

newEntries = {}
entries = {}
lock = threading.Lock()
connectLock = threading.Lock()
connected_clients = set()  # To track connected WebSocket clients
message_queue = queue.Queue()  # Queue for communication between threads

# Function to send messages to all connected WebSocket clients
async def broadcast():
    """
    Send the entire updated queue to all connected WebSocket clients.
    """
    to_remove = []
    message = json.dumps(entries)  # Convert entire entries queue to JSON

    with connectLock:
        for websocket in connected_clients:
            try:
                # Send the message to the WebSocket
                await websocket.send(message)
            except ConnectionClosed:
                to_remove.append(websocket)

        # Remove disconnected clients
        for websocket in to_remove:
            connected_clients.remove(websocket)

# WebSocket handler function
async def websocket_handler(websocket, path):
    """
    Handle WebSocket connections and manage the connected clients.
    """
    with connectLock:
        connected_clients.add(websocket)
        with lock:
                await websocket.send(json.dumps(entries))
        
    try:
        async for message in websocket:  # Keep the connection alive for potential client messages
            pass
    finally:
        with connectLock:
            connected_clients.remove(websocket)
            print("removed Connection")

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
                "department": department
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
        queueWriter.instance.set_dictionary(payload)
        queueWriter.write()
    except Exception as e:
        print(f"Error encountered when writing to queue topic: {e}")

# DDS task to receive doctor finish updates
def recieveDoctorFinish(queueReader):
    while True:
        queueReader.take()
        for sample in queueReader.samples.valid_data_iter:
            appointment_id = sample.get_number("appointmentID")
            patient_id = sample.get_number("patientID")
            doctor_id = sample.get_number("doctorID")
            priority = sample.get_number("Priority")
            doctor = sample.get_string("doctorName")
            patient_name = sample.get_string("patientName")
            department = sample.get_string("Department")

            with lock:
                if department not in entries:
                    continue
                if doctor not in entries[department]:
                    continue

                queue_entry = {
                    "appointmentID": appointment_id,
                    "patientID": patient_id,
                    "doctorID": doctor_id,
                    "Priority": priority,
                    "doctorName": doctor,
                    "patientName": patient_name,
                    "Department": department
                }
                
                if queue_entry in entries[department][doctor][priority]:
                    entries[department][doctor][priority].remove(queue_entry)
        
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
        queueReader = connector.get_input("CheckedInSubscriber::QueueTopicReader")
        checkInReader = connector.get_input("CheckedInSubscriber::CheckInTopicReader")
        queueWriter = connector.get_output("QueueWriter::QueueTopicWriter")

        # Start receiving check-ins and doctor finishes
        threading.Thread(target=recieveCheckIn, args=(checkInReader, queueWriter), daemon=True).start()
        # threading.Thread(target=recieveDoctorFinish, args=(queueReader,), daemon=True).start()

        # Block to keep the DDS tasks running
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
