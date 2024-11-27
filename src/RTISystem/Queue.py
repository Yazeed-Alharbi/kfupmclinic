import rticonnextdds_connector as rti
import json
import asyncio
from websockets.asyncio.server import serve
from functools import partial
import threading
import sys 
import os
sys.path.append(os.path.abspath("C:/Users/rayan/OneDrive/Documents/GitHub/kfupmclinic/src/RTISystem/RTITest"))
from Config import *
newEntries = {}
entries = {}
lock = threading.Lock()
async def recieveCheckIn(checkInreader, queueWriter, path):
    # Example logic
    while True:
        checkInreader.read()
        for sample in checkInreader.samples.valid_data_iter:
            appointment_id = sample.get_number("appointmentID")
            patient_id = sample.get_number("patientID")
            doctor_id = sample.get_number("doctorID")
            priority = sample.get_number("Priority")
            doctor = sample.get_string("doctorName")
            patient_name = sample.get_string("patientName")
            department = sample.get_string("Department")
            
            if department not in newEntries:
                newEntries[sample.get_string('Department')] = {}
            if doctor not in newEntries[department]:
                newEntries[department][doctor] = {0:[],1:[]}
            queue_entry = {
                    "appointmentID": appointment_id,
                    "patientID": patient_id,
                    "doctorID": doctor_id,
                    "Priority": priority,
                    "doctorName": doctor,
                    "patientName": patient_name,
                    "Department": department
                }
            newEntries[department][doctor][priority].append(queue_entry)
            recieveDoctorfinish(json.dumps(queue_entry))
            #TODO add the publish to the websocket
            #TODO handle doctor logic
            
        await asyncio.sleep(1)

def recieveDoctorfinish(queueWriter,payload):
    try:
        queueWriter.instance.set_from_json(json.dumps(payload))
        queueWriter.write()
    except:
        print("Error encountered when writing to queue topic")
    print()

def publishQueue():
    print()
async def websocket_server_task(checkInReader, queueWriter):
    websocket_server = await serve(
        partial(recieveCheckIn, checkInreader=checkInReader, queueWriter=queueWriter),
        host=QUEUE_HOST,
        port=QUEUE_PORT
    )
    print(f"WebSocket server running on ws://{QUEUE_HOST}:{QUEUE_PORT}")
    await websocket_server.wait_closed()

def run_websocket_server_in_thread(checkInReader, queueWriter):
    # Set up an event loop in the thread
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(websocket_server_task(checkInReader, queueWriter))

def main():
    with rti.open_connector(
        config_name="ClinicParticipants::QueueDisplay",
        url="clinic.xml"
    ) as connector:
        # queue reader, followed by queue writer followed by check in reader 
        queueReader = connector.get_input("CheckedInSubscriber::QueueTopicReader")
        checkInReader = connector.get_input("CheckedInSubscriber::CheckInTopicReader")
        queueWriter = connector.get_output("QueueWriter::QueueTopicWriter")
        
        # Run the WebSocket server in a separate thread
        webSocket_thread = threading.Thread(target=run_websocket_server_in_thread, args=(checkInReader, queueWriter))
        webSocket_thread.start()

        # Join or handle other DDS-related logic here
        webSocket_thread.join()
    
if __name__ == "__main__":
    main()
