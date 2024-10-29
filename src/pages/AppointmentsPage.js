import React from "react";
import MainLayout from "../commonComponents/MainLayout";
import { FaCalendarPlus, FaCalendarCheck } from "react-icons/fa";

const AppointmentsPage = () => {
  const sidebarButtons = [
    { label: "Schedule Appointment", icon: FaCalendarPlus, path: "/schedule-appointment" },
    { label: "Appointments", icon: FaCalendarCheck, path: "/appointments" },
  ];

  return (
    <MainLayout title="Appointments" sidebarButtons={sidebarButtons} userName="Someone" userType="Patient">
      <div>
        {/* Content of AppointmentsPage */}
      </div>
    </MainLayout>
  );
};

export default AppointmentsPage;
