import React from "react";
import MainLayout from "../commonComponents/MainLayout";
import { FaCalendarPlus, FaCalendarCheck } from "react-icons/fa";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Button, Tooltip } from "@nextui-org/react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

// Dummy data for appointments
const appointments = [
  { id: 1, date: "2024-03-15", time: "10:00 AM", doctor: "Dr. Smith", specialty: "Cardiology", status: "Confirmed" },
  { id: 2, date: "2024-03-18", time: "2:30 PM", doctor: "Dr. Johnson", specialty: "Dermatology", status: "Pending" },
  { id: 3, date: "2024-03-20", time: "11:15 AM", doctor: "Dr. Williams", specialty: "Orthopedics", status: "Confirmed" },
  { id: 4, date: "2024-03-22", time: "3:45 PM", doctor: "Dr. Brown", specialty: "Neurology", status: "Cancelled" },
  { id: 5, date: "2024-03-25", time: "9:30 AM", doctor: "Dr. Davis", specialty: "Pediatrics", status: "Confirmed" },
];

const statusColorMap = {
  Confirmed: "success",
  Pending: "warning",
  Cancelled: "danger",
};

const AppointmentsPage = () => {
  const sidebarButtons = [
    { label: "Schedule Appointment", icon: FaCalendarPlus, path: "/schedule-appointment" },
    { label: "Appointments", icon: FaCalendarCheck, path: "/appointments" },
  ];

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
            <Tooltip content="View Details">
              <Button isIconOnly size="sm" variant="light">
                <FaEye />
              </Button>
            </Tooltip>
            <Tooltip content="Edit Appointment">
              <Button isIconOnly size="sm" variant="light">
                <FaEdit />
              </Button>
            </Tooltip>
            <Tooltip content="Cancel Appointment" color="danger">
              <Button isIconOnly size="sm" variant="light" color="danger">
                <FaTrash />
              </Button>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  };

  return (
    <MainLayout title="Appointments" sidebarButtons={sidebarButtons} userName="Rashed Almanie" userType="Patient">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Your Appointments</h1>
        <Table aria-label="Appointments table">
          <TableHeader>
            <TableColumn>DATE</TableColumn>
            <TableColumn>TIME</TableColumn>
            <TableColumn>DOCTOR</TableColumn>
            <TableColumn>SPECIALTY</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>{appointment.date}</TableCell>
                <TableCell>{appointment.time}</TableCell>
                <TableCell>{appointment.doctor}</TableCell>
                <TableCell>{appointment.specialty}</TableCell>
                <TableCell>{renderCell(appointment, "status")}</TableCell>
                <TableCell>{renderCell(appointment, "actions")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </MainLayout>
  );
};

export default AppointmentsPage;