import React from "react";
import MainLayout from "../commonComponents/MainLayout";
import { FaCalendarPlus, FaCalendarCheck } from "react-icons/fa";
import { RiCalendarScheduleFill } from "react-icons/ri";

const AdminScheduleAppointmentPage = () => {
  const sidebarButtons = [
    { label: "Generate Appointment", icon: FaCalendarPlus, path: "/generate-appointment" },
    { label: "Schedule Appointment", icon: FaCalendarCheck, path: "/admin-schedule-appointment" },
    { label: "Doctor Schedule", icon: RiCalendarScheduleFill, path: "/admin-doctor-schedule" },
  ];

  return (
    <MainLayout title="Schedule Appointment" sidebarButtons={sidebarButtons} userName="Someone" userType="Admin">
      <div>
        {/* Content of AdminScheduleAppointmentPage */}
      </div>
    </MainLayout>
  );
};

export default AdminScheduleAppointmentPage;
