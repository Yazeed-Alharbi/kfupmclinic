import React, { useState } from "react";
import MainLayout from "../../commonComponents/MainLayout";
import { FaCalendarCheck, FaCalendarPlus } from "react-icons/fa";
import { FaPersonWalkingDashedLineArrowRight } from "react-icons/fa6";
import profileImage from "../../assets/default-avatar.jpg";
import backgroundImage from "../../assets/KFUPM_LOGO_WHITE.png";
import backgroundImage2 from "../../assets/KFUPM_LOGO.png";
import { Button, Divider } from "@nextui-org/react";
import { RiCalendarScheduleFill } from "react-icons/ri";

const initialQueue = [
    { key: "1", name: "Abdullah", clinic: "Dental Clinic", doctor: "David Green", room: "3" },
    { key: "2", name: "Sarah", clinic: "Eye Clinic", doctor: "Emma Brown", room: "2" },
    { key: "3", name: "John", clinic: "Pediatrics", doctor: "Michael Johnson", room: "1" },
];

const QueueManagementPage = () => {
    const sidebarButtons = [
        { label: "Generate Appointment", icon: FaCalendarPlus, path: "/generate-appointment" },
        { label: "Schedule Appointment", icon: FaCalendarCheck, path: "/admin-schedule-appointment" },
        { label: "Doctor Schedule", icon: RiCalendarScheduleFill, path: "/admin-doctor-schedule" },
        { label: "Queue Management", icon: FaPersonWalkingDashedLineArrowRight, path: "/queue-management" },
    ];

    const [currentQueueIndex, setCurrentQueueIndex] = useState(0);
    const [paused, setPaused] = useState(false);

    const handlePause = () => {
        setPaused(!paused);
    };

    const handleNext = () => {
        if (currentQueueIndex < initialQueue.length - 1) {
            setCurrentQueueIndex(currentQueueIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQueueIndex > 0) {
            setCurrentQueueIndex(currentQueueIndex - 1);
        }
    };

    const currentPatient = initialQueue[currentQueueIndex];

    return (
        <MainLayout title="Queue Management" sidebarButtons={sidebarButtons} userName="Yazeed Alharbi" userType="Admin">
            <div className="flex flex-col items-center justify-center h-full">
                <div className="flex space-x-8">
                    <div className={`relative w-96 h-52 rounded-xl flex flex-col items-center p-4 ${paused ? "bg-gray-400" : "bg-kfupmgreen"} overflow-hidden`}>
                        <img
                            src={backgroundImage}
                            alt="Background"
                            className="absolute top-4 right-4 opacity-15 h-72 pointer-events-none"
                            style={{ zIndex: 0 }}
                        />
                        <p className="text-white text-xl" style={{ zIndex: 1 }}>Queue</p>
                        <p className="text-white text-8xl pt-6 font-semibold" style={{ zIndex: 1 }}>{currentQueueIndex + 1}</p>
                    </div>

                    <div className={`relative w-96 border-kfupmgreen border-1 h-52 rounded-xl ${paused ? "bg-gray-300" : "bg-white"} overflow-hidden`}>
                        <img
                            src={backgroundImage2}
                            alt="Background"
                            className="absolute top-4 right-4 opacity-10 h-72 pointer-events-none"
                            style={{ zIndex: 0 }}
                        />
                        <div className="flex flex-col items-center justify-center h-full space-y-4" style={{ zIndex: 1 }}>
                            <div className="flex flex-col items-center space-y-2">
                                <img src={profileImage} className="w-11 h-11" alt="Profile" />
                                <p className="text-lg font-medium">{currentPatient.name}</p>
                            </div>
                            <div className="flex space-x-2">
                                <div className="flex flex-col items-center">
                                    <p className="text-sm text-textlightgray">Clinic</p>
                                    <p className="max-w-min">{currentPatient.clinic}</p>
                                </div>
                                <Divider orientation="vertical" />
                                <div className="flex flex-col items-center">
                                    <p className="text-sm text-textlightgray">Doctor</p>
                                    <p className="max-w-min">{currentPatient.doctor}</p>
                                </div>
                                <Divider orientation="vertical" />
                                <div className="flex flex-col items-center">
                                    <p className="text-sm text-textlightgray">Room</p>
                                    <p className="">{currentPatient.room}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex space-x-4 mt-8">
                    <Button
                        className={`${
                            paused || currentQueueIndex === 0
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-[#F7CCD7] text-[#D7042F]"
                        }`}
                        onClick={handlePrevious}
                        disabled={paused || currentQueueIndex === 0}
                    >
                        Previous
                    </Button>
                    <Button
                        className="bg-[#FFECCA] text-[#EFAA01]"
                        onClick={handlePause}
                    >
                        {paused ? "Resume" : "Pause"}
                    </Button>
                    <Button
                        className={`${
                            paused || currentQueueIndex === initialQueue.length - 1
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-[#C8F1DD] text-kfupmgreen"
                        }`}
                        onClick={handleNext}
                        disabled={paused || currentQueueIndex === initialQueue.length - 1}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </MainLayout>
    );
};

export default QueueManagementPage;
