import React, { useState, useEffect, useRef } from "react";
import MainLayout from "../../commonComponents/MainLayout";
import { FaCalendarCheck, FaCalendarPlus, FaWalking, FaChartPie } from "react-icons/fa";
import { Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Divider, User, Chip } from "@nextui-org/react";
import { RiCalendarScheduleFill } from "react-icons/ri";
import supabase from "../../commonComponents/supabase";
import config from "../../commonComponents/config";

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
      title="Queue Management"
      sidebarButtons={sidebarButtons}
      userName="Yazeed Almanie"
      userType="Admin"
    >
      <div className="p-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Divider />
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Welcome, Admin!</h2>
          <p className="text-gray-600 mt-2">
            You can manage appointments, schedules, and queues from the sidebar.
          </p>
        </div>
    
        
      </div>
    </MainLayout>
  );
};

export default DashboardPage;
