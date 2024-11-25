import rticonnextdds_connector as rti
import json
import asyncio
from websockets.asyncio.server import serve
from functools import partial

async def receive_patient_info(websocket, writer):

    async for message in websocket:
        try:
            print(f"Received raw message: '{message}'")
            patient_data = json.loads(message)  # Parse incoming JSON

            # Validate required fields
            if all(key in patient_data for key in ("patientID", "name", "Email", "ContactNumber")):
                await publish_patient_info(patient_data, writer)
            else:
                print("Error: Missing required fields in patient data")

        except json.JSONDecodeError as e:
            print(f"Invalid JSON received: {e}")
        except Exception as e:
            print(f"Error during processing: {e}")

async def publish_patient_info(patient_data, writer):

    try:
        writer.instance.set_number("patientID", patient_data["patientID"])
        writer.instance.set_string("name", patient_data["name"])
        writer.instance.set_string("Email", patient_data["Email"])
        writer.instance.set_string("ContactNumber", patient_data["ContactNumber"])
        
        print(f"Publishing to DDS: {patient_data}")
        writer.write()
    except Exception as e:
        print(f"Error during DDS publishing: {e}")

async def main():

    with rti.open_connector(
        config_name="ClinicParticipants::Patient Management System",
        url="clinic.xml"
    ) as connector:
        writer = connector.get_output("PatientPublisher::PatientInfoWriter")
        print("DDS Connector initialized.")

        # Use functools.partial to pass the writer to the handler
        handler = partial(receive_patient_info, writer=writer)

        # Start the WebSocket server
        async with serve(handler, "localhost", 8765):
            print("WebSocket server started on ws://localhost:8765")
            await asyncio.Future()  # Run forever

if __name__ == "__main__":
    asyncio.run(main())
