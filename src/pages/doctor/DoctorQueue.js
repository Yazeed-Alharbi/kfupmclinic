import React, { useState } from "react";
import MainLayout from "../../commonComponents/MainLayout";
import { FaCalendarPlus } from "react-icons/fa";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Button,   Divider,Avatar} from "@nextui-org/react";
import { FaPersonWalkingDashedLineArrowRight } from "react-icons/fa6";

// Dummy data for appointments
const appointments = [
  { id: 1, date: "2024-03-15", time: "7:30 AM", Patient: "Mohammed Abdo",SN:"129173940",MedRec:"HP431A5", AGE: "56", Blood:"A" , status: "Confirmed" },
  { id: 2, date: "2024-03-15", time: "8:10 AM", Patient: "Nodi Olz",SN:"113566940", MedRec:"HP433A6",AGE: "55", Blood:"A+" , status: "Pending" },
  { id: 3, date: "2024-03-15", time: "11:15 AM", Patient: "Rayan Alamrani",SN:"929773940", MedRec:"HP567A8",AGE: "84", Blood:"AB" , status: "Pending" },
  { id: 4, date: "2024-03-16", time: "1:00 PM", Patient: "John Smith",SN:"444173943", MedRec:"HP890A9",AGE: "45" , Blood:"O" , status: "Pending" },
  { id: 5, date: "2024-03-17", time: "1:30 PM", Patient: "Turki Alsamari",SN:"321934940", MedRec:"HP123A2",AGE: "55", Blood:"B" , status: "Cancelled" },
];



const statusColorMap = {
  Confirmed: "success",
  Pending: "warning",
  Cancelled: "danger",
};

const AppointmentsPage = () => {
  const sidebarButtons = [
    { label: "Appointments schedule", icon: FaCalendarPlus, path: "/doctor-schedule" },
    { label: "Patients Queue", icon: FaPersonWalkingDashedLineArrowRight, path: "/doctor-queue" },
  ];

  const handlePatient = (appointmentID) => {
    setPatient(appointmentID)
    setPatientArraived(true)

  }

  const handlePatientArraival = () => {
    setPatientArraived(false)
    appointments[patient-1].status="Confirmed"
  }

  const GoBack = ()=>{
    setPatientArraived(false)
  }

  const [patient,setPatient] = useState("");
  const [PatientArraived, setPatientArraived] = useState(false);

  const renderCell = (appointment, columnKey) => {
    const cellValue = appointment[columnKey];

    switch (columnKey) {
      case "status":
        return (
          <Chip color={statusColorMap[appointment.status]} variant="flat">
            {cellValue}
          </Chip>
        );
      case "actions":
        return (
          <div className="flex gap-2">
             {appointment.status === 'Pending' &&<Button color="primary" value={appointment} onClick={() => handlePatient(appointment.id)} className={`bg-kfupmgreen text-white `} >
                Initiate Diagnosis
              </Button>}
              {appointment.status === 'Cancelled' &&<Button isDisabled color="primary" className={`bg-danger text-white `} >
                Cancelled
              </Button>}
              {appointment.status === 'Confirmed' &&<Button isDisabled color="primary" className={`bg-kfupmgreen text-white `} >
                Prescription Served
              </Button>}
          </div>
        );
      default:
        return cellValue;
    }
  };

  return (
    <MainLayout title="Appointments" sidebarButtons={sidebarButtons} userName="Dr.Ali smith" userType="Doctor">
      {!PatientArraived?(
      <>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Patients Appointments</h1>
        <Table aria-label="Appointments table">
          <TableHeader>
            <TableColumn>DATE</TableColumn>
            <TableColumn>TIME</TableColumn>
            <TableColumn>PATIENT NAME</TableColumn>
            <TableColumn>AGE</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>{appointment.date}</TableCell>
                <TableCell>{appointment.time}</TableCell>
                <TableCell>{appointment.Patient}</TableCell>
                <TableCell>{appointment.AGE}</TableCell>
                <TableCell>{renderCell(appointment, "status")}</TableCell>
                <TableCell>{renderCell(appointment, "actions")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>  
      </div>
      </>
      ):(
      <>
              <div className="ml-10 mt-10">
          <div className="max-w-md">
            <div className="flex gap-4 items-center">
              <Avatar className="mb-4" showFallback src='https://images.unsplash.com/broken' />
            </div>
            <div className="space-y-1">
              <h3 className="text-medium font-medium">Appointment Details</h3>
              <p className="text-small text-default-400">Patient Name : {appointments[patient-1].Patient}</p>
              <p className="text-small text-default-400">National Number : {appointments[patient-1].SN}</p>
              <p className="text-small text-default-400">Medical Record : {appointments[patient-1].MedRec}</p>
              <p className="text-small text-default-400">Age : {appointments[patient-1].AGE}</p>
              <p className="text-small text-default-400">Blood Type : {appointments[patient-1].Blood}</p>
            </div>
            <Divider className="my-4" />
          </div>

          <Button className="bg-kfupmgreen text-white" onClick={handlePatientArraival}>
            Finish Appointment
          </Button>

          <Button className="ml-2"onClick={GoBack} >
            Go back
          </Button>
        </div>
      
      </>

)}
    </MainLayout>
  );
};

export default AppointmentsPage;