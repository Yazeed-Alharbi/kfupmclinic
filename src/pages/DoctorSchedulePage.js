import React, { useState } from "react";
import MainLayout from "../commonComponents/MainLayout";
import { FaCalendarPlus } from "react-icons/fa";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Button,
  Divider,
  Avatar
} from "@nextui-org/react";

const initialRows = [
  { key: "1", name: "Tony Reichert", role: "CEO", status: "Active" },
  { key: "2", name: "Zoey Lang", role: "Technical Lead", status: "Paused" },
  { key: "3", name: "Jane Fisher", role: "Senior Developer", status: "Active" },
  { key: "4", name: "William Howard", role: "Community Manager", status: "Vacation" },
];

const DoctorSchedulePage = () => {
  const sidebarButtons = [
    { label: "Schedule Appointment", icon: FaCalendarPlus, path: "/doctor-schedule" },
  ];
  
  const [selectedRow, setSelectedRow] = useState(null);
  const [appointments, setAppointments] = useState(initialRows); // Initialize with the existing rows

  const handleRowClick = (row) => {
    const updatedRow = appointments.find((appointment) => appointment.key === row.key);
    setSelectedRow(updatedRow);
  };
  

  const handleFinish = () => {
    if (selectedRow) {
      const updatedAppointments = appointments.map((appointment) =>
        appointment.key === selectedRow.key
          ? { ...appointment, status: "Finished" } // Update the status to "Finished"
          : appointment
      );
      setAppointments(updatedAppointments);
      setSelectedRow(null); // Clear selection after finishing
    }
  };

  return (
    <MainLayout title="My Schedule" sidebarButtons={sidebarButtons} userName="Someone" userType="Doctor">
      {!selectedRow ? (
        <div className="flex flex-col gap-3 flex-wrap md:flex-nowrap gap-4 ml-10 mt-10 mb-5 mr-10">
          <Table
            aria-label="Doctor Schedule Table"
            selectionMode="single"
            onSelectionChange={handleRowClick}
          >
            <TableHeader>
              <TableColumn>NAME</TableColumn>
              <TableColumn>ROLE</TableColumn>
              <TableColumn>STATUS</TableColumn>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow
                  key={appointment.key}
                  onClick={() => handleRowClick(appointment)}
                  isSelected={selectedRow?.key === appointment.key}
                >
                  <TableCell>{appointment.name}</TableCell>
                  <TableCell>{appointment.role}</TableCell>
                  <TableCell>{appointment.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="ml-10 mt-10">
          <div className="max-w-md">
            <div className="flex gap-4 items-center">
              <Avatar className="mb-4" showFallback src='https://images.unsplash.com/broken' />
            </div>
            <div className="space-y-1">
              <h3 className="text-medium font-medium">Appointment Details</h3>
              <p className="text-small text-default-400">For {selectedRow.name}</p>
              <p className="text-small text-default-400">Role: {selectedRow.role}</p>
              <p className="text-small text-default-400">Current Status: {selectedRow.status}</p>
            </div>
            <Divider className="my-4" />
          </div>

          <Button className="bg-kfupmgreen text-white" onClick={handleFinish}>
            Finish Appointment
          </Button>

          <Button className="ml-2" onClick={() => setSelectedRow(null)}>
            Go back
          </Button>
        </div>
      )}
    </MainLayout>
  );
};

export default DoctorSchedulePage;
