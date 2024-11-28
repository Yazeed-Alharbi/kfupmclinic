import React from "react";
import MainLayout from "../../commonComponents/MainLayout";
import { FaCalendarPlus, FaCalendarCheck } from "react-icons/fa";
import { FaPersonWalkingDashedLineArrowRight } from "react-icons/fa6";
import backgroundImage from "../../assets/KFUPM_LOGO_WHITE.png";


const sidebarButtons = [
    { label: "Schedule Appointment", icon: FaCalendarPlus, path: "/schedule-appointment" },
    { label: "Appointments", icon: FaCalendarCheck, path: "/appointments" },
    { label: "Queue", icon: FaPersonWalkingDashedLineArrowRight, path: "/queue" },
];

const QueuePage = () => {
    return (
        <MainLayout title="Queue" sidebarButtons={sidebarButtons} userName="Yazeed Alharbi" userType="Patient">
            <div className="flex justify-center h-full mt-16">
                <div className="relative w-96 h-60 rounded-xl flex flex-col items-center p-4 bg-kfupmgreen overflow-hidden">
                    <img
                        src={backgroundImage}
                        alt="Background"
                        className="absolute top-4 right-4 opacity-15 h-72 pointer-events-none"
                        style={{ zIndex: 0 }}
                    />
                    <p className="text-white text-xl" style={{ zIndex: 1 }}>Queue</p>
                    <p className="text-white text-8xl pt-6 font-semibold" style={{ zIndex: 1 }}>52</p>
                    <p className="text-white text-xl pt-6" style={{ zIndex: 1 }}>Estimated time is 30 mins</p>
                </div>
            </div>
        </MainLayout>
    );
};

export default QueuePage;
