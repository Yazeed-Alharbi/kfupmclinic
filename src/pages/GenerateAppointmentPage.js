import React, { useState } from "react";
import MainLayout from "../commonComponents/MainLayout";
import { FaCalendarPlus, FaCalendarCheck } from "react-icons/fa";
import { RiCalendarScheduleFill } from "react-icons/ri";
import { Select, SelectItem, CheckboxGroup, Checkbox, Button } from "@nextui-org/react"
export const clinics = [
  { key: "Internal Medicine Clinic", label: "Internal Medicine Clinic" },
  { key: "Ophthalmology Clinic", label: "Ophthalmology Clinic" },
  { key: "Dermatology Clinic", label: "Dermatology Clinic" },
  { key: "Dental clinic", label: "Dental clinic" },
];

export const doctors = {
  "Internal Medicine Clinic": [
    { key: "Dr. Scut Tom", label: "Dr. Scut Tom" },
    { key: "Dr. Amina Ahmed", label: "Dr. Amina Ahmed" },
  ],
  "Ophthalmology Clinic": [
    { key: "Dr. Banabas Paul", label: "Dr. Banabas Paul" },
    { key: "Dr. Ayo Jones", label: "Dr. Ayo Jones" },
    { key: "Dr. Michael Stwart", label: "Dr. Michael Stwart" },
  ],
  "Dermatology Clinic": [
    { key: "Dr. Kemi Olowojeje", label: "Dr. Kemi Olowojeje" },
    { key: "Dr. Ebuka Kelechi", label: "Dr. Ebuka Kelechi" },
  ],
  "Dental clinic": [{ key: "Dr. Ibrahim Yekeni", label: "Dental clinic" }],
};

const GenerateAppointmentPage = () => {
  const sidebarButtons = [
    { label: "Generate Appointment", icon: FaCalendarPlus, path: "/generate-appointment" },
    { label: "Schedule Appointment", icon: FaCalendarCheck, path: "/admin-schedule-appointment" },
    { label: "Doctor Schedule", icon: RiCalendarScheduleFill, path: "/admin-doctor-schedule" },
  ];

  const handleClinicChange = (e) => {
    setClinicValue(e)
    setDocotrValue("")
  }
  const handleDoctorChange = (e) => {
    setDocotrValue(e)
  }
  let showSchedule = false;
  const [clinicValue, setClinicValue] = useState("")
  const [doctorValue, setDocotrValue] = useState("")


  return (
    <MainLayout title="Generate Appointment" sidebarButtons={sidebarButtons} userName="Rayan Alamrani" userType="Admin">


      {!showSchedule ? (
        <>
          <div className=" items-start flex w-full flex-wrap md:flex-nowrap gap-4 ml-10 mt-10 mb-5">
            <Select
              label="Select a clinic"
              className="max-w-xs"
              onChange={(e) => handleClinicChange(e.target.value)}
              placeholder="Choose a clinic"
            >
              {(clinics.map((clinic) => (
                <SelectItem key={clinic.key} value={clinic.key}>
                  {clinic.label}
                </SelectItem>
              )))
              }
            </Select>

            <Select
              isDisabled={!clinicValue}
              label="Doctor"
              placeholder="Choose a clinic"
              className="max-w-xs"
              onChange={(e) => handleDoctorChange(e)}
            >
              {clinicValue &&
                doctors[clinicValue].map((doctor) => (
                  <SelectItem key={doctor.key} value={doctor.key}>
                    {doctor.label}
                  </SelectItem>
                ))}
            </Select>
            <CheckboxGroup
              label="Select cities"
              defaultValue={["Sunday", "Wednesday"]}
              className="flex-initial w-60"
            >
              <div className="h-full x flex flex-wrap max-h-70 justify-start gap-4 content-start ">
                <Checkbox value="Sunday">Sunday</Checkbox>
                <Checkbox value="Monday">Monday</Checkbox>
                <Checkbox value="Tuesday">Tuesday</Checkbox>
                <Checkbox value="Wednesday">Wednesday</Checkbox>
                <Checkbox value="Thursday">Thursday</Checkbox>
                <Checkbox value="Friday">Friday</Checkbox>
                <Checkbox value="Saturday">Saturday</Checkbox>
              </div>
            </CheckboxGroup>
          </div>
          <div className="buttonDiv ">
            <Button className="ml-10 bg-kfupmgreen text-white" >
              View Schedule
            </Button>
            <Button className="ml-10 bg-kfupmgreen text-white" >
              View Schedule
            </Button>
          </div>
        </>
      ) : (<div><p>1</p></div>)
      }

    </MainLayout>
  );
};

export default GenerateAppointmentPage;
