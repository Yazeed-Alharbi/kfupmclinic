import React, { useState, useEffect } from "react";
import { Chip } from "@nextui-org/react";
import kfupmlogo from "../assets/kfupmlogo.png";

const QueuePage2 = () => {
  const queues = [
    {
      clinicName: "Dental Clinic",
      doctors: [
        {
          doctorName: "Dr. Smith",
          patients: [
            { name: "Rashed Almanie", appointmentId: 101, room: "1001" },
            { name: "Yazeed Alharbi", appointmentId: 102, room: "1002" },
            { name: "Abdulaziz Almutairi", appointmentId: 103, room: "1003" },
          ],
        },
        {
          doctorName: "Dr. Brown",
          patients: [
            { name: "Turki Alsomari", appointmentId: 104, room: "1004" },
            { name: "Rayan Alamrani", appointmentId: 105, room: "1005" },
          ],
        },
      ],
    },
    {
      clinicName: "Cardiology Clinic",
      doctors: [
        {
          doctorName: "Dr. Lee",
          patients: [
            { name: "Patient A", appointmentId: 201, room: "2001" },
            { name: "Patient B", appointmentId: 202, room: "2002" },
          ],
        },
        {
          doctorName: "Dr. Kim",
          patients: [
            { name: "Patient C", appointmentId: 203, room: "2003" },
            { name: "Patient D", appointmentId: 204, room: "2004" },
          ],
        },
      ],
    },
  ];

  const [currentClinicIndex, setCurrentClinicIndex] = useState(0);
  const [currentDoctorIndex, setCurrentDoctorIndex] = useState(0);
  const [showAd, setShowAd] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (showAd) {
        setShowAd(false);
      } else {
        const currentClinic = queues[currentClinicIndex];
        if (currentDoctorIndex < currentClinic.doctors.length - 1) {
          setCurrentDoctorIndex((prev) => prev + 1);
        } else if (currentClinicIndex < queues.length - 1) {
          setCurrentClinicIndex((prev) => prev + 1);
          setCurrentDoctorIndex(0);
        } else {
          setCurrentClinicIndex(0);
          setCurrentDoctorIndex(0);
          setShowAd(true);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentClinicIndex, currentDoctorIndex, showAd, queues]);

  const currentClinic = queues[currentClinicIndex];
  const currentDoctor = currentClinic.doctors[currentDoctorIndex];

  const currentPatientQueue = currentDoctor.patients.map((patient, index) => {
    if (index < 1) {
      return { ...patient, state: "previous" };
    } else if (index === 1) {
      return { ...patient, state: "current" };
    } else {
      return { ...patient, state: "future" };
    }
  });

  return (
    <div className="h-screen w-screen flex flex-col">
      <div className="p-4 h-24 sm:h-16 flex items-center justify-center relative mt-4 border-b bg-white">
        <div className="absolute left-4 flex items-center space-x-3">
          <img src={kfupmlogo} className="w-10" alt="KFUPM Logo" />
          <div className="font-semibold text-xl text-kfupmgreen">
            KFUPM <span className="text-textgray">Clinic</span>
          </div>
        </div>
        <div className="font-semibold text-2xl text-textgray">Queue</div>
      </div>

      <div className="bg-gray-100 flex-grow p-8 space-y-8">
        {showAd ? (
          <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center">
            <p className="text-4xl font-bold text-kfupmgreen">Ad!</p>
            <p className="text-xl text-gray-500 mt-4">Text</p>
          </div>
        ) : (
          <>
            <p className="text-2xl text-textgray font-semibold">Department</p>
            <div className="flex space-x-4">
              {queues.map((clinic, index) => (
                <Chip
                  key={clinic.clinicName}
                  className={`min-w-40 py-3 px-6 rounded-lg ${
                    index === currentClinicIndex
                      ? "bg-kfupmgreen text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  <span className="font-semibold text-lg">
                    {clinic.clinicName}
                  </span>
                </Chip>
              ))}
            </div>

            <p className="text-2xl text-textgray font-semibold">Doctor</p>
            <div className="flex space-x-4">
              {currentClinic.doctors.map((doctor, index) => (
                <Chip
                  key={doctor.doctorName}
                  className={`min-w-40 py-3 px-6 rounded-lg ${
                    index === currentDoctorIndex
                      ? "bg-kfupmgreen text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  <span className="font-semibold text-lg">
                    {doctor.doctorName}
                  </span>
                </Chip>
              ))}
            </div>

            <p className="text-2xl text-textgray font-semibold">Patient</p>
            <div className="flex gap-8">
              <div className="bg-kfupmgreen text-white p-6 rounded-xl w-96 flex flex-col items-center">
                <p className="text-lg font-medium">Patient</p>
                <p className="text-2xl font-bold">
                  {currentPatientQueue.find(
                    (patient) => patient.state === "current"
                  )?.name || "No Current Patient"}
                </p>
                <p className="text-lg font-medium mt-4">Appointment ID</p>
                <p className="text-2xl font-bold">
                  {currentPatientQueue.find(
                    (patient) => patient.state === "current"
                  )?.appointmentId || "-"}
                </p>
                <p className="text-lg font-medium mt-4">Room</p>
                <p className="text-2xl font-bold">
                  {currentPatientQueue.find(
                    (patient) => patient.state === "current"
                  )?.room || "-"}
                </p>
              </div>

              <div className="flex flex-col space-y-4">
                {currentPatientQueue.map((patient) => (
                  <Chip
                    key={patient.name}
                    className={`min-w-96 py-3 px-6 rounded-lg ${
                      patient.state === "previous"
                        ? "opacity-50 border border-kfupmgreen text-gray-500"
                        : patient.state === "current"
                        ? "bg-green-100 text-kfupmgreen border border-kfupmgreen"
                        : "border border-kfupmgreen text-gray-500 bg-white"
                    }`}
                  >
                    <span className="font-semibold text-lg">{patient.name}</span>
                  </Chip>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QueuePage2;
