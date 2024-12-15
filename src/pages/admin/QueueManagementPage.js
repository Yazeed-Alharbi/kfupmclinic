import React, { useState, useEffect, useRef } from "react";
import MainLayout from "../../commonComponents/MainLayout";
import { FaCalendarCheck, FaCalendarPlus, FaWalking, FaChartPie } from "react-icons/fa";
import { Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Divider, User, Chip } from "@nextui-org/react";
import { RiCalendarScheduleFill } from "react-icons/ri";
import supabase from "../../commonComponents/supabase";
import config from "../../commonComponents/config";

const QueueManagementPage = () => {
  const sidebarButtons = [
    {label: "Dashboard", icon: FaChartPie, path: "/dashboard"},
    { label: "Generate Appointment", icon: FaCalendarPlus, path: "/generate-appointment" },
    { label: "Schedule Appointment", icon: FaCalendarCheck, path: "/admin-schedule-appointment" },
    { label: "Doctor Schedule", icon: RiCalendarScheduleFill, path: "/admin-doctor-schedule" },
    { label: "Queue Management", icon: FaWalking, path: "/queue-management" },
  ];

  const [appointments, setAppointments] = useState([]);
  const [socketConnected, setSocketConnected] = useState(true);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = new WebSocket(`ws://${config.HOST}:${config.PORT}`);

    socketRef.current.onopen = () => {
      console.log("WebSocket connection opened.");
      setSocketConnected(true);
    };

    socketRef.current.onmessage = (event) => {
      console.log("Received from server:", event.data);
      try {
        const message = JSON.parse(event.data);
        if (message.type === "checkInConfirmation" && message.appointmentId) {
          setAppointments((prevAppointments) =>
            prevAppointments.map((appointment) =>
              appointment.appointmentId === message.appointmentId
                ? { ...appointment, checkedIn: true }
                : appointment
            )
          );
          console.log(`Appointment ID ${message.appointmentId} marked as Checked In.`);
        } else if (message.type === "error" && message.message) {
          console.error("Server Error:", message.message);
        }
      } catch (err) {
        console.error("Error parsing WebSocket message:", err);
      }
    };

    socketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      setSocketConnected(false);
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket connection closed.");
      setSocketConnected(false);
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
      const today = new Date().toISOString().split("T")[0];
      const { data, error } = await supabase
        .from("Appointment")
        .select("Priority, appointmentId, patientID, patientName, doctorName, roomNumber, scheduledTime, checkedIn")
        .eq("AppDate", today);

      if (error) {
        console.error("Error fetching appointments:", error);
      } else {
        setAppointments(data || []);
      }
    };

    fetchAppointments();

    const intervalId = setInterval(fetchAppointments, 3000);

    return () => clearInterval(intervalId);
  }, []);

  const handleCheckIn = async (appointmentId) => {
    const now = new Date();
    const currentTime = now.toTimeString().split(" ")[0]; // Extract "HH:MM:SS" from the current time
  
    try {

      const { error } = await supabase
        .from("Appointment")
        .update({ checkedIn: true, checkInTime: currentTime })
        .eq("appointmentId", appointmentId);
  
      if (error) {
        console.error("Error updating check-in time:", error.message);
        return;
      }
  
      console.log(`Appointment ID ${appointmentId} marked as Checked In.`);
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.appointmentId === appointmentId
            ? { ...appointment, checkedIn: true, checkInTime: currentTime }
            : appointment
        )
      );

      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        const data = { appointmentId };
        socketRef.current.send(JSON.stringify(data));
        console.log(`Sent Appointment ID to server: ${appointmentId}`);
      } else {
        console.error("WebSocket is not open. Unable to send Appointment ID.");
      }
    } catch (err) {
      console.error("Error in handleCheckIn:", err.message);
    }
  };
  

  return (
    <MainLayout
      title="Queue Management"
      sidebarButtons={sidebarButtons}
      userName="Yazeed Alharbi"
      userType="Admin"
    >
      <div className="p-6">
        {!socketConnected && (
          <div className="bg-red-500 text-white text-center py-2 rounded mb-4">
            <p>Disconnected from the socket. Please check your connection.</p>
          </div>
        )}
        
        <Table aria-label="Appointments for Today" className="w-full">
          <TableHeader>
            <TableColumn>Priority</TableColumn>
            <TableColumn>Appointment ID</TableColumn>
            <TableColumn>Patient</TableColumn>
            <TableColumn>Doctor Name</TableColumn>
            <TableColumn>Room Number</TableColumn>
            <TableColumn>Scheduled Time</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableHeader>
          <TableBody>
            {appointments && appointments.length > 0 ? (
              appointments.map((appointment) => (
                <TableRow key={appointment.appointmentId}>
                  <TableCell>
                  <Chip color={appointment.Priority == "0" ? "danger" : appointment.Priority == "1" ? "primary" : "success"}>
                          {appointment.Priority == "0" ? "High" : appointment.Priority == "1" ? "Normal" : "Low"}
                  </Chip>
                  </TableCell>
                  <TableCell>{appointment.appointmentId}</TableCell>
                  <TableCell>
                      <User name={appointment.patientName} description={`ID:${appointment.patientID}`}/>
                  </TableCell>
                  <TableCell>{appointment.doctorName}</TableCell>
                  <TableCell>{appointment.roomNumber || "N/A"}</TableCell>
                  <TableCell>{appointment.scheduledTime}</TableCell>
                  <TableCell>
                    {appointment.checkedIn ? (
                      <span className="text-green-500 font-normal">Checked In</span>
                    ) : (
                      <Button
                        size="sm"
                        className="bg-kfupmgreen text-white"
                        
                        onClick={() => handleCheckIn(appointment.appointmentId)}
                      >
                        Check In
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow key="no-appointments">
                <TableCell className="text-center" style={{ textAlign: "center" }}>
                  No appointments for today.
                </TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </MainLayout>
  );
};

export default QueueManagementPage;
