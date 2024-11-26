import rticonnextdds_connector as rti

def print_patient_info():
    with rti.open_connector(
        config_name="ClinicParticipants::Appointment Management System",
        url="clinic.xml"
    ) as connector:
        reader = connector.get_input("CheckInPublisher::PatientReader")
        read= []
        while True:
            reader.read()
            for sample in reader.samples.valid_data_iter:
                patient_id = sample.get_number("patientID")
                if patient_id  not in read:
                    read.append(patient_id)
                    name = sample.get_string("name")
                    email = sample.get_string("Email")
                    contact_number = sample.get_string("ContactNumber")
                    print(f"Received: PatientID={patient_id}, Name={name}, Email={email}, ContactNumber={contact_number}")

if __name__ == "__main__":
    print_patient_info()