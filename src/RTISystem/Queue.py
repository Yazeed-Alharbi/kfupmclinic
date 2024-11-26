"""
The Queue is a priority queue, currently we will use priorities 0, and 1. 
1- appointments who are checked in but not finished are called, this is from a database in supabase
ignore the one in the xml.  
2- appointments are then turned into queue structs
3- those are then placed according to their priority, the priority is a dictionary 0, and 1 are the entries with each corrosponding to
a list, this dictionary is provided to anyone connecting to the websocket.
4- new queue entries are published to the queue topic 
5- they the database should be checked every 30 seconds for updates, which should be reflected in the queues, whether a new checked in
appointment appears or another pre existing appointment is now finished, in which case it should be removed 
6- the code should be multithreaded or multiproccessed, where a thread would be used for the websocket communication and publishing to
the queue topic, and another thread would be used for checking the database for updates

7- the following code is a skeleton
""" 
import rticonnextdds_connector as rti
import json
import asyncio
from websockets.asyncio.server import serve
from functools import partial
import threading
from supabase import create_client
from time import sleep

# Initialize Supabase client
url = "https://zymxgpzqnwphdnuyhzmn.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5bXhncHpxbndwaGRudXloem1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI1NjIxMzIsImV4cCI6MjA0ODEzODEzMn0.efCMEiXg7e1Zh-Mwa5DmnzaUJ6pcI2E1EaOmozIdjYU"
supabase = create_client(url, key)

# Global variables
lock = threading.Lock()
databaseDictionary = {}  # Current state of the appointments in the queue
hierarchical_queue = {}  # Queue organized by department -> doctor -> priority
seen_appointments = set()  # Tracks appointments already in the queue


# Function to fetch and update the queue from the database
def read_database():
    global databaseDictionary, hierarchical_queue, seen_appointments

    with lock:
        # Fetch only checked-in appointments from the database
        response = supabase.table("Appointment").select("*").eq("checkedIn", True).execute()

        if response.data:
            updated_dict = {}
            new_hierarchical_queue = {}
            new_entries = []

            for appointment in response.data:
                appointment_id = appointment["appointmentId"]

                # Remove finished appointments
                if appointment["Finished"]:
                    if appointment_id in databaseDictionary:
                        print(f"Removing finished appointment: {appointment_id}")
                    continue

                # Organize queue entry
                queue_entry = {
                    "appointmentID": appointment["appointmentId"],
                    "patientID": appointment["patientID"],
                    "doctorID": appointment["doctorID"],
                    "Priority": appointment["Priority"],
                    "doctorName": appointment["doctorName"],
                    "patientName": appointment["patientName"],
                    "department": appointment["department"]
                }

                # Update hierarchical structure
                department = appointment["department"]
                doctor_name = appointment["doctorName"]
                priority = appointment["Priority"]

                if department not in new_hierarchical_queue:
                    new_hierarchical_queue[department] = {}
                if doctor_name not in new_hierarchical_queue[department]:
                    new_hierarchical_queue[department][doctor_name] = {0: [], 1: []}

                new_hierarchical_queue[department][doctor_name][priority].append(queue_entry)
                updated_dict[appointment_id] = queue_entry

                # Detect new appointments
                if appointment_id not in seen_appointments:
                    new_entries.append(queue_entry)

            # Update global state
            databaseDictionary = updated_dict
            hierarchical_queue = new_hierarchical_queue
            seen_appointments = set(updated_dict.keys())

            return new_entries
        else:
            return []


# Function to handle WebSocket communication
async def handle_queue(websocket, writer):
    global hierarchical_queue

    while True:
        with lock:
            queue_snapshot = json.dumps(hierarchical_queue)

        # Send the updated hierarchical queue to the WebSocket client
        await websocket.send(queue_snapshot)
        await asyncio.sleep(1)  # Adjust frequency as needed


# Function to publish new queue entries to DDS
async def publish_queue(new_entries, writer):
    for queue_entry in new_entries:
        with lock:
            writer.instance.set_dictionary(queue_entry)
            writer.write()
            print(f"Published new queue entry to QueueTopic: {queue_entry}")


# Function to monitor the database for updates
def monitor_database(writer):
    while True:
        new_entries = read_database()
        print(new_entries)
        # Publish only new entries to DDS
        if new_entries:
            asyncio.run(publish_queue(new_entries, writer))

        sleep(30)  # Check for updates every 30 seconds


async def main():
    with rti.open_connector(
        config_name="ClinicParticipants::ReceptionCheckIn",
        url="clinic.xml"
    ) as connector:
        writer = connector.get_output("CheckInPublisher::QueueWriter")
        print("DDS Connector initialized.")

        # Use functools.partial to pass the writer to the handler
        handler = partial(handle_queue, writer=writer)

        # Start the WebSocket server
        websocket_thread = threading.Thread(target=asyncio.run, args=(serve(handler, "localhost", 8765),))
        websocket_thread.start()
        print("WebSocket server started on ws://localhost:8765")

        # Start the database monitoring thread
        db_thread = threading.Thread(target=monitor_database, args=(writer,))
        db_thread.start()

        # Keep the main thread running
        websocket_thread.join()
        db_thread.join()


if __name__ == "__main__":
    asyncio.run(main())
