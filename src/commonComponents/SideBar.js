import React from "react";
import { Button, User } from "@nextui-org/react";
import kfupmlogo from "../assets/kfupmlogo.png"
import { FaCalendarPlus } from "react-icons/fa";
import { FaCalendarCheck } from "react-icons/fa6";

const SideBar = () => {

    return (
        <div className="bg-white z-0 min-w-72 max-w-72 relative">
        <aside className="h-full border-r border-gray-200 flex flex-col">
            <div className="p-4 h-24 sm:h-16 flex items-center justify-center space-x-3 mt-4">
                <img src={kfupmlogo} className="w-10"></img>
                <div className="font-semibold text-xl text-kfupmgreen">KFUPM <span className="text-textgray">Clinic</span></div>
            </div>

            <div className="flex flex-col justify-between flex-1">
            <div className="space-y-8 flex">
                <div className="space-y-2 p-2 pt-4">
                
                <div className="pl-2 pt-2 pr-2 space-y-8 min-w-full ">
                    
                    <Button
                    ripple={true}
                    startContent={<FaCalendarPlus className="mr-2" />}
                    className="text-start flex justify-start px-4 font-normal text-base min-w-full max-w-full bg-transparent text-textlightgray relative py-4 focus:outline-none rounded-lg"
                    >
                    Schedule Appointment
                    </Button>
                    <Button
                    ripple={true}
                    startContent={<FaCalendarCheck className="mr-2" />}
                    className="text-start flex justify-start px-4 font-normal text-base min-w-full max-w-full bg-transparent text-textlightgray relative py-4 focus:outline-none rounded-lg"
                    >
                    Appointments
                    </Button>

                </div>
                
                </div>
             
            </div>
            <div className="p-4">

            

            </div>
            </div>
        </aside>
        </div>
    );
    };

    export default SideBar;
