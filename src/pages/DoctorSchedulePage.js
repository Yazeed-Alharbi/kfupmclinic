import React from "react";
import MainLayout from "../commonComponents/MainLayout";
import { FaCalendarPlus, FaCalendarCheck } from "react-icons/fa";

const DoctorSchedulePage = () => {
  const sidebarButtons = [
    { label: "Schedule Appointment", icon: FaCalendarPlus, path: "/doctor-schedule" },
  ];

  return (
    <MainLayout title="My Schedule" sidebarButtons={sidebarButtons} userName="Someone" userType="Doctor">
      <div>
        {/* Content of DoctorSchedulePage */}
      </div>
    </MainLayout>
  );
};

export default DoctorSchedulePage;
