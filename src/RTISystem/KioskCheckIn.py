import asyncio
import json
import websockets
from functools import partial
import rticonnextdds_connector as rti
from Config import *
from supabase import create_client, Client
##############################
##
## This code is for checkin The interface should have input.
## The user input is number (appointment ID)
## The output is to the queue like this 
## [{'appointmentId': 100, 'patientID': 1, 'clinic': 'Internal Medicine Clinic - عيادة الباطنية', 'scheduledTime': '10:00 AM', 'Priority': 1, 'Finished': False, 'checkedIn': True, 'roomNumber': 101, 'doctorID': 1, 'doctorName': 'Dr. Abdullah Alrashed', 'patientName': 'Ali', 'AppDate': '2024-12-03'}]
###############################
# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

async def process_appointment_id(websocket, path, queue_writer):
    async for message in websocket:
        try:
            data = json.loads(message)
            appointment_id = data.get("appointmentId")

            if not appointment_id:
                response = {
                    "status": "error",
                    "message": "Invalid appointment ID received."
                }
                await websocket.send(json.dumps(response))
                continue

            print(f"Received appointment ID: {appointment_id}")

            # Fetch appointment data from Supabase
            response = supabase.table("Appointment").select("*").eq("appointmentId", appointment_id).execute()
            if response.data:
                appointment = response.data[0]
                if appointment['checkedIn']:
                    response = {
                        "status": "info",
                        "message": f"Appointment with ID {appointment_id} is already checked in."
                    }
                else:
                    await update_to_checkin_appointment(appointment_id)
                    await publish_to_appointment_queue(response.data, queue_writer)
                    response = {
                        "status": "success",
                        "message": f"Appointment ID {appointment_id} processed successfully."
                    }
            else:
                response = {
                    "status": "error",
                    "message": f"Appointment ID {appointment_id} not found in the database."
                }

            # Send response back to the client
            await websocket.send(json.dumps(response))

        except Exception as e:
            error_message = {
                "status": "error",
                "message": f"Error processing data: {e}"
            }
            print(error_message)
            await websocket.send(json.dumps(error_message))


async def publish_to_appointment_queue(appointment_data, writer):
    try:
        writer.instance.set_number("appointmentID", appointment_data[0]["appointmentId"])
        writer.instance.set_number("patientID", appointment_data[0]["patientID"])
        writer.instance.set_number("doctorID", appointment_data[0]["doctorID"])
        writer.instance.set_number("Priority", appointment_data[0]["Priority"])
        writer.instance.set_string("doctorName", appointment_data[0]["doctorName"])
        writer.instance.set_string("patientName", appointment_data[0]["patientName"])
        writer.instance.set_string("department", appointment_data[0]["clinic"])
        writer.instance.set_boolean("finished", False)
        writer.instance.set_boolean("entered", False)
        writer.write()
        print(f"Published to DDS: {appointment_data}")
    except Exception as e:
        print(f"Error during DDS publishing: {e}")
async def update_to_checkin_appointment(appointment_id):
    response = supabase.table("Appointment").update({"checkedIn": True}).eq("appointmentId", appointment_id).execute()
    print(response)
    # if response.error:
    #     print("Error updating data:", response.error)
    # else:
    #     print("Data updated successfully:", response.data)
async def main():
    # Initialize DDS Connector
    with rti.open_connector(
        config_name="ClinicParticipants::Ticket Dispenser Check In",
        url="Clinic.xml"
    ) as connector:
        queue_writer = connector.get_output("CheckInPublisher::QueueTopicWriter")

        # Start WebSocket server
        websocket_server = websockets.serve(
            partial(process_appointment_id, queue_writer=queue_writer),
            host=KIOSK_HOST,
            port=KIOSK_PORT
        )

        print("WebSocket server running on ws://localhost:",KIOSK_PORT)
        await websocket_server
        await asyncio.Future()  # Keep the server running

if __name__ == "__main__":
    asyncio.run(main())
