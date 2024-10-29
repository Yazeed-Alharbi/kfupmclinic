import React from "react";
import MainLayout from "../commonComponents/MainLayout";
import { FaCalendarPlus, FaCalendarCheck } from "react-icons/fa";
import { RiCalendarScheduleFill } from "react-icons/ri";

const AdminDoctorSchedulePage = () => {
  const sidebarButtons = [
    { label: "Generate Appointment", icon: FaCalendarPlus, path: "/generate-appointment" },
    { label: "Schedule Appointment", icon: FaCalendarCheck, path: "/admin-schedule-appointment" },
    { label: "Doctor Schedule", icon: RiCalendarScheduleFill, path: "/admin-doctor-schedule" },
  ];

  return (
    <MainLayout title="Doctor Schedule" sidebarButtons={sidebarButtons} userName="Turki Alsomari" userType="Admin">
      <div>
        {/* Content of AdminDoctorSchedulePage */}
      </div>
    </MainLayout>
  );
};

export default AdminDoctorSchedulePage;
