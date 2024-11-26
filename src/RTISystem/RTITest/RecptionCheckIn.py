# # import rticonnextdds_connector as rti
# # import json
# # import asyncio
# # from websockets.asyncio.server import serve
# # from functools import partial
# # from Config import SUPABASE_URL, SUPABASE_KEY, HOST, PORT
# # from supabase import create_client, Client

# # supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# # async def recived_appointment_data(websocket,writer):
# #     async for message in websocket:
# #         try:
# #             print(f"Received raw message: '{message}'")
# #             appointmentId_data = json.loads(message)  # Parse incoming JSON
# #             appointmentId = appointmentId_data.appointmentId
# #             # Validate required fields
# #             if appointmentId != []:
# #               response = supabase.table("Appointment").select("*").eq("appointmentId", appointmentId).execute()
# #               print("Record:", response.data)
# #                 # await publish_to_appointment_queue(appointment_data,writer)
# #             else:
# #                 print("Error appointment not in db.")
            

# #         except json.JSONDecodeError as e:
# #             print(f"Invalid JSON received: {e}")
# #         except Exception as e:
# #             print(f"Error during processing: {e}")


# # async def update_appointment_database():




# # async def publish_to_appointment_queue(appointment_data, writer):

# #     try:
# #         writer.instance.set_number("patientID", patient_data["patientID"])
# #         writer.instance.set_string("name", patient_data["name"])
# #         writer.instance.set_string("Email", patient_data["Email"])
# #         writer.instance.set_string("ContactNumber", patient_data["ContactNumber"])
        
# #         print(f"Publishing to DDS: {patient_data}")
# #         writer.write()
# #     except Exception as e:
# #         print(f"Error during DDS publishing: {e}")   


      


# # async def main():

# #     with rti.open_connector(
# #         config_name="ClinicParticipants::ReceptionCheckIn",
# #         url="clinic.xml"
# #     ) as connector:
# #         queue_writer = connector.get_output("CheckInPublisher::QueueWriter")
# #         appointment_reader = connector.get_input("AppointmentSubscription::AppointmentReader")

# #         print("DDS Connector initialized.")

# #         # Use functools.partial to pass the writer to the handler
# #         handler = partial(recived_appointment_data, writer=queue_writer)

# #         # Start the WebSocket server
# #         async with serve(handler, HOST, PORT):
# #             print("WebSocket server started on ws://{HOST}:{PORT}")
# #             await asyncio.Future()  # Run forever

# # if __name__ == "__main__":
# #     asyncio.run(main())


# from functools import partial
# import rticonnextdds_connector as rti
# import json
# import asyncio
# from websockets.asyncio.server import serve
# from Config import SUPABASE_URL, SUPABASE_KEY, HOST, PORT
# from supabase import create_client, Client

# # Initialize Supabase client
# supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# async def received_appointment_data(appointment_id, writer):
#     """
#     Handles processing of received appointment data, including fetching details from the database,
#     updating the record, and publishing to DDS.
#     """
#     try:
#         print(f"Processing appointment ID: {appointment_id}")
#         if appointment_id:
#             response = supabase.table("Appointment").select("*").eq("appointmentId", appointment_id).execute()
#             print("Record:", response.data)
#             await update_to_checkin_appointment(appointment_id)
#             await publish_to_appointment_queue(response.data, writer)
#         else:
#             print("Error: appointment ID is empty.")
#     except Exception as e:
#         print(f"Error during processing: {e}")

# async def update_to_checkin_appointment(appointment_id):
#     response = supabase.table("Appointment").update({"checkedIn": True}).eq("appointmentId", appointment_id).execute()
#     if response.error:
#         print("Error updating data:", response.error)
#     else:
#         print("Data updated successfully:", response.data)
# ####################################################################
# async def read_appointment_data(reader, writer):
#     while True:
        
#             reader.take()
#             for sample in reader.samples.valid_data_iter:
#                 patient_id = sample.get_string("patientID")
#                 print(f"Received patient ID from DDS: {patient_id}")
#                 await received_appointment_data(patient_id, writer)
        

# #######################################################################
# async def publish_to_appointment_queue(appointment_data, writer):
#     try:
#         writer.instance.set_number("appointmentID", appointment_data[0]["appointmentId"])
#         writer.instance.set_number("patientID", appointment_data[0]["patientID"])
#         writer.instance.set_number("doctorID", appointment_data[0]["doctorID"])
#         writer.instance.set_number("Priority", appointment_data[0]["Priority"])
#         writer.instance.set_string("doctorName", appointment_data[0]["doctorName"])
#         writer.instance.set_string("patientName", appointment_data[0]["patientName"])
#         print(f"Publishing to DDS: {appointment_data}")
#         writer.write()
#     except Exception as e:
#         print(f"Error during DDS publishing: {e}")

# #########################################################################



# async def main():
#     with rti.open_connector(
#         config_name="ClinicParticipants::ReceptionCheckIn",
#         url="../Clinic.xml"
#     ) as connector:
#         queue_writer = connector.get_output("CheckInPublisher::QueueWriter")
#         appointment_reader = connector.get_input("AppointmentSubscription::AppointmentReader")

#         print("DDS Connector initialized.")
#          # Launch reading and processing in an async task
#         read_task = asyncio.create_task(read_appointment_data(appointment_reader, queue_writer))

#         try:
#             print("Waiting for DDS events...")
#             # Run the tasks until the program is stopped
#             await read_task
#         except asyncio.CancelledError:
#             print("Shutting down gracefully...")
#         finally:
#             read_task.cancel()
#             await read_task

        

# if __name__ == "__main__":
#     asyncio.run(main())

import asyncio
import json
import websockets
from functools import partial
import rticonnextdds_connector as rti
from Config import SUPABASE_URL, SUPABASE_KEY
from supabase import create_client, Client

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

async def process_appointment_id(websocket, path, queue_writer):
    async for message in websocket:
        try:
            data = json.loads(message)
            appointment_id = data.get("appointmentId")

            if not appointment_id:
                await websocket.send("Invalid appointment ID received.")
                continue

            print(f"Received appointment ID: {appointment_id}")

            # Fetch appointment data from Supabase
            response = supabase.table("Appointment").select("*").eq("appointmentId", appointment_id).execute()
            if response.data:
                # Publish to DDS
                await update_to_checkin_appointment(appointment_id)
                await publish_to_appointment_queue(response.data, queue_writer)
                await websocket.send(f"Appointment ID {appointment_id} processed successfully.")
            else:
                await websocket.send(f"Appointment ID {appointment_id} not found in the database.")
        except Exception as e:
            error_message = f"Error processing data: {e}"
            print(error_message)
            await websocket.send(error_message)

async def publish_to_appointment_queue(appointment_data, writer):
    try:
        writer.instance.set_number("appointmentID", appointment_data[0]["appointmentId"])
        writer.instance.set_number("patientID", appointment_data[0]["patientID"])
        writer.instance.set_number("doctorID", appointment_data[0]["doctorID"])
        writer.instance.set_number("Priority", appointment_data[0]["Priority"])
        writer.instance.set_string("doctorName", appointment_data[0]["doctorName"])
        writer.instance.set_string("patientName", appointment_data[0]["patientName"])
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
        config_name="ClinicParticipants::ReceptionCheckIn",
        url="../Clinic.xml"
    ) as connector:
        queue_writer = connector.get_output("CheckInPublisher::QueueWriter")

        # Start WebSocket server
        websocket_server = websockets.serve(
            partial(process_appointment_id, queue_writer=queue_writer),
            host="localhost",
            port=8765
        )

        print("WebSocket server running on ws://localhost:8765")
        await websocket_server
        await asyncio.Future()  # Keep the server running

if __name__ == "__main__":
    asyncio.run(main())
