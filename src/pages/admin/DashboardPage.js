import React from "react";
import MainLayout from "../../commonComponents/MainLayout";
import { FaCalendarCheck, FaCalendarPlus, FaWalking, FaChartPie } from "react-icons/fa";
import { Divider } from "@nextui-org/react";
import { RiCalendarScheduleFill } from "react-icons/ri";
import AppointmentsPerDay  from "./dashboard/AppointmentsPerDay";
import  AppointmentsPerClinic from "./dashboard/AppointmentsPerClinic";
import { AverageWaitingTime } from "./dashboard/AverageWaitingTime";
import { AppointmentStatusPieChart } from "./dashboard/AppointmentStatusPieChart";


const DashboardPage = () => {
  const sidebarButtons = [
    {label: "Dashboard", icon: FaChartPie, path: "/dashboard"},
    { label: "Generate Appointment", icon: FaCalendarPlus, path: "/generate-appointment" },
    { label: "Schedule Appointment", icon: FaCalendarCheck, path: "/admin-schedule-appointment" },
    { label: "Doctor Schedule", icon: RiCalendarScheduleFill, path: "/admin-doctor-schedule" },
    { label: "Queue Management", icon: FaWalking, path: "/queue-management" },
  ];

  return (
    <MainLayout
      title="Dashboard"
      sidebarButtons={sidebarButtons}
      userName="Yazeed Almanie"
      userType="Admin"
    >
      <div className="p-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Divider />
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Welcome, Admin!</h2>
          <p className="text-gray-600 mt-2 mb-6">
            Here's an overview of your clinic's performance.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AppointmentsPerDay />
          <AppointmentsPerClinic />
          <AverageWaitingTime />
          <AppointmentStatusPieChart />
        </div>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;

