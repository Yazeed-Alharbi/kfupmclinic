import React from "react";
import MainLayout from "../commonComponents/MainLayout";
import { FaCalendarPlus, FaCalendarCheck } from "react-icons/fa";

const ScheduleAppointmentPage = () => {
  const sidebarButtons = [
    { label: "Schedule Appointment", icon: FaCalendarPlus, path: "/schedule-appointment" },
    { label: "Appointments", icon: FaCalendarCheck, path: "/appointments" },
  ];

  return (
    <MainLayout title="Schedule Appointment" sidebarButtons={sidebarButtons} userName="Abdullah Alalawi" userType="Patient">
      <div>
        {/* Content of ScheduleAppointmentPage */}
      </div>
    </MainLayout>
  );
};

export default ScheduleAppointmentPage;
