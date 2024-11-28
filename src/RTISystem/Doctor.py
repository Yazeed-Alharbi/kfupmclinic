from functools import partial
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

# Function to send messages to all connected WebSocket clients
async def broadcast():
    """
    Send the entire updated queue to all connected WebSocket clients.
    """
    to_remove = []
    message = json.dumps(entries)  # Convert entire entries queue to JSON
    print("BroadCasting")
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
async def websocket_handler(websocket, path,queueWriter):
    """
    Handle WebSocket connections and manage the connected clients.
    """
    with connectLock:
        connected_clients.add(websocket)
        with lock:
            await websocket.send(json.dumps(entries))  # Send current entries to the new client

    try:
        # Keep the connection alive to process incoming messages
        async for message in websocket:
            try:
                payload = json.loads(message)  # Parse JSON message
                if "Command" in payload and "Entry" in payload:
                    print(f"Received Command: {payload['Command']} for Entry: {payload['Entry']}")
                    # Process command and update DDS
                    await recieveCommand(payload, queueWriter)
                else:
                    print(f"Invalid WebSocket message: {message}")
            except json.JSONDecodeError:
                print(f"Failed to decode WebSocket message: {message}")
    finally:
        with connectLock:
            connected_clients.remove(websocket)
            print("Removed WebSocket connection")

# DDS task to receive check-in updates
def recieveInQueue(QueueReader):
    while True:
        QueueReader.take()
        for sample in QueueReader.samples.valid_data_iter:
            appointment_id = sample.get_number("appointmentID")
            patient_id = sample.get_number("patientID")
            doctor_id = sample.get_number("doctorID")
            priority = sample.get_number("Priority")
            doctor = sample.get_string("doctorName")
            patient_name = sample.get_string("patientName")
            department = sample.get_string("department")
            finished  = sample.get_boolean("finished")
            entered  = sample.get_boolean("entered")
            if finished:
                finished = True
            else:
                finished = False
            if entered:
                entered = True
            else:
                entered = False 
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

            print(f"Received Appointment {appointment_id}")
            print(queue_entry)
            with lock:
                found = False
                inserted = False
                try:
                    if queue_entry in entries[department][doctor][priority]:
                        found = True
                    else:
                        for i in range(len(entries[department][doctor][priority])):
                            if entries[department][doctor][priority][i]["appointmentID"] == appointment_id:
                                entries[department][doctor][priority].pop(i)
                                entries[department][doctor][priority].insert(i,queue_entry)
                                inserted = True
                                
                                
                except:
                        found = False
                if (not found) and (not inserted):
                    if department not in entries:
                        entries[department] = {}
                    if doctor not in entries[department]:
                        entries[department][doctor] = {0: [], 1: []}
                    
                    entries[department][doctor][priority].append(queue_entry)
                print(entries)
            # Place updated data in the queue for the WebSocket thread to broadcast
            asyncio.run(broadcast())  # Send the entire queue to connected WebSockets
        
        time.sleep(1)
async def recieveCommand(payload,queueWriter):
    # function recieves payload, does updates, pushes the updates to both supabase and the queue 
    toPublish = None
    if not payload["Command"]:
        print("No command given")
        return
    if not payload["Entry"]:
        print("No Entry given")       
        return
    entry = payload["Entry"]
    department = entry['department'] 
    doctor = entry['doctorName']
    priority = entry['Priority']
    appointment_id = entry['appointmentID']
    with lock:
        if payload["Command"] == "enter":
            for i in range(len(entries[department][doctor][priority])):
                        if entries[department][doctor][priority][i]["appointmentID"] == appointment_id:
                                entries[department][doctor][priority][i]["entered"] = True
                                toPublish = entries[department][doctor][priority][i]
        elif payload["Command"] == "finish":
            for i in range(len(entries[department][doctor][priority])):
                        if entries[department][doctor][priority][i]["appointmentID"] == appointment_id:
                                entries[department][doctor][priority][i]["finished"] = True
                                entries[department][doctor][priority][i]["entered"] = True
                                toPublish = entries[department][doctor][priority][i]
        if toPublish:
            print("Found publication:\n",toPublish)
            publishQueue(queueWriter,toPublish)
        else:
            print("Nothing to publish")
    await asyncio.create_task(broadcast())
        
# Function to publish updates to DDS
def publishQueue(queueWriter, payload):
    try:
        
        print(payload)
        print("----")
        queueWriter.instance.set_number("appointmentID", int(payload["appointmentID"]))
        queueWriter.instance.set_number("patientID", int( payload["patientID"]))
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

# DDS task to receive doctor finish updates

# WebSocket server setup
async def websocket_server(queueWriter):
    """
    WebSocket server to handle incoming connections.
    """
    server = await serve(partial(websocket_handler,queueWriter=queueWriter), host=DOCTOR_HOST, port=DOCTOR_PORT)
    print(f"WebSocket server running on ws://{DOCTOR_HOST}:{DOCTOR_PORT}")
    await server.wait_closed()

# Function to start DDS tasks in a separate thread
def start_dds_tasks():
    with rti.open_connector(
        config_name="ClinicParticipants::Doctor",
        url="clinic.xml"
    ) as connector:
        queueWriter = connector.get_output("QueuePublisher::QueueTopicWriter")
        queueReader = connector.get_input("QueueSubscriber::QueueTopicReader")
        threading.Thread(target=recieveInQueue, args=(queueReader,), daemon=True).start()

        start_websocket_server(queueWriter)

        # Start receiving check-ins and doctor finishes
        # threading.Thread(target=recieveCheckIn, args=(checkInReader, queueWriter), daemon=True).start()
        # # threading.Thread(target=recieveDoctorFinish, args=(queueReader,), daemon=True).start()
        # threading.Thread(target=recieveDoctorFinish, args=(queueReader,), daemon=True).start()
        # Block to keep the DDS tasks running
        while True:
            time.sleep(1)

# Start WebSocket server in a separate thread
def start_websocket_server(queueWriter):
    asyncio.run(websocket_server(queueWriter))

def main():
    # Start DDS tasks and WebSocket server in separate threads
    print(1
    )
    t1= threading.Thread(target=start_dds_tasks, daemon=True)
    t1.start()
    t1.join()

if __name__ == "__main__":
    
    main()
