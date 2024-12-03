import React, { useState, useEffect } from "react";
import MainLayout from "../../commonComponents/MainLayout";
import { FaCalendarPlus } from "react-icons/fa";
import { FaPersonWalkingDashedLineArrowRight } from "react-icons/fa6";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Button, Divider, Avatar } from "@nextui-org/react";
import { useWebSocket } from "../../hooks/useWebSocket";
import config from "../../commonComponents/config"

const DoctorQueue = () => {
  const sidebarButtons = [
    { label: "Appointments schedule", icon: FaCalendarPlus, path: "/doctor-schedule" },
    { label: "My Patients' Queue", icon: FaPersonWalkingDashedLineArrowRight, path: "/doctor-queue" },
  ];

  const [queueData, setQueueData] = useState({});
  const [socketConnected, setSocketConnected] = useState(true);
  const { sendMessage, lastMessage } = useWebSocket(`ws://${config.DOCTOR_HOST}}:${config.DOCTOR_PORT}`);

  // Static user information from local storage
  const user = JSON.parse(localStorage.getItem("user"));
  const doctorID = user?.docID || "Unknown User";
  const doctorName = user?.Name || "Unknown Name";

  useEffect(() => {
    const socket = new WebSocket(`ws://${config.DOCTOR_HOST}}:${config.DOCTOR_PORT}`);

    socket.onopen = () => {
      console.log("Connected to WebSocket server.");
      setSocketConnected(true);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed.");
      setSocketConnected(false);
    };

    socket.onerror = () => {
      console.error("WebSocket error occurred.");
      setSocketConnected(false);
    };

    return () => socket.close();
  }, []);

  useEffect(() => {
    if (lastMessage) {
      const data = JSON.parse(lastMessage);
      const filteredData = filterQueueDataForDoctor(data, doctorID, doctorName);
      setQueueData(filteredData);
    }
  }, [lastMessage]);

  const filterQueueDataForDoctor = (data, doctorID, doctorName) => {
    const filteredData = {};
    Object.entries(data).forEach(([department, departmentData]) => {
      if (departmentData[doctorName]) {
        filteredData[department] = {
          [doctorName]: departmentData[doctorName],
        };
      }
    });
    return filteredData;
  };

  const handleAction = (action, entry) => {
    sendMessage(JSON.stringify({ Command: action, Entry: entry }));

    setQueueData((prevData) => {
      const newData = JSON.parse(JSON.stringify(prevData));
      const departmentData = newData[entry.department];
      const doctorData = departmentData[doctorName];
      const priorityData = doctorData[entry.Priority.toString()];

      const updatedEntry = priorityData.find((e) => e.appointmentID === entry.appointmentID);
      if (updatedEntry) {
        if (action === "enter") {
          updatedEntry.entered = true;
        } else if (action === "finish") {
          updatedEntry.entered = true;
          updatedEntry.finished = true;
        }
      }

      return newData;
    });
  };

  const renderQueue = () => {
    return Object.entries(queueData).map(([department, departmentData]) => (
      <div key={department} className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Department: {department}</h2>
        {Object.entries(departmentData).map(([doctor, doctorData]) => (
          <div key={doctor} className="mb-6">
            <h3 className="text-xl font-semibold mb-2">{doctor}</h3>
            <Table aria-label="Queue for doctor">
              <TableHeader>
                <TableColumn>Priority</TableColumn>
                <TableColumn>Appointment ID</TableColumn>
                <TableColumn>Patient</TableColumn>
                <TableColumn>Entered</TableColumn>
                <TableColumn>Finished</TableColumn>
                <TableColumn>Actions</TableColumn>
              </TableHeader>
              <TableBody>
                {Object.entries(doctorData).flatMap(([priority, entries]) =>
                  entries.map((entry, index) => (
                    <TableRow key={`${entry.appointmentID}-${index}`}>
                      <TableCell>
                        <Chip color={priority === "0" ? "danger" : priority === "1" ? "primary" : "success"}>
                          {priority === "0" ? "High" : priority === "1" ? "Normal" : "Low"}
                        </Chip>
                      </TableCell>
                      <TableCell>{entry.appointmentID}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar name={entry.patientName} size="sm" />
                          <div>
                            <p>{entry.patientName}</p>
                            <p className="text-small text-default-500">ID: {entry.patientID}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={entry.entered ? "text-success" : ""}>
                          {entry.entered ? "Yes" : "No"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={entry.finished ? "text-success" : ""}>
                          {entry.finished ? "Yes" : "No"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {!entry.entered && (
                            <Button
                              size="sm"
                              color="primary"
                              onClick={() => handleAction("enter", { ...entry, department, doctorName: doctor, priority })}
                            >
                              Enter
                            </Button>
                          )}
                          {entry.entered && !entry.finished && (
                            <Button
                              size="sm"
                              color="success"
                              onClick={() => handleAction("finish", { ...entry, department, doctorName: doctor, priority })}
                            >
                              Finish
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        ))}
      </div>
    ));
  };

  return (
    <MainLayout title="My Patients' Queue" sidebarButtons={sidebarButtons} userName={doctorName} userType="Doctor">
      <div className="p-6">
        {!socketConnected && (
          <div className="bg-red-500 text-white text-center py-2 rounded mb-4">
            <p>Disconnected from the socket. Please check your connection.</p>
          </div>
        )}
        <h1 className="text-3xl font-bold mb-6">My Patient Queue</h1>
        <Divider className="my-4" />
        {Object.keys(queueData).length === 0 ? (
          <p className="text-center text-xl">No patients in the queue at the moment.</p>
        ) : (
          renderQueue()
        )}
      </div>
    </MainLayout>
  );
};

export default DoctorQueue;
