import React, { useState, useEffect } from "react";
import { Chip } from "@nextui-org/react";
import kfupmlogo from "../assets/kfupmlogo.png";
import config from "../commonComponents/config"

const QueuePage2 = () => {
  const [queues, setQueues] = useState({});
  const [finishedPatients, setFinishedPatients] = useState([]);
  const [currentClinicIndex, setCurrentClinicIndex] = useState(0);
  const [currentDoctorIndex, setCurrentDoctorIndex] = useState(0);
  const [showAd, setShowAd] = useState(false);

  const WEBSOCKET_URL = `ws://${config.QUEUE_HOST}:${config.QUEUE_PORT}`;

  useEffect(() => {
    const socket = new WebSocket(WEBSOCKET_URL);

    socket.onopen = () => {
      console.log("Connected to WebSocket server.");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received data from WebSocket:", data);

      setQueues({ ...data.entries });
      setFinishedPatients([...data.finishedPatients]);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      socket.close();
    };
  }, []);
  useEffect(() => {
    if (Object.keys(queues).length > 0) {
      setCurrentClinicIndex(0);
      setCurrentDoctorIndex(0);
    }
  }, [queues]);

  useEffect(() => {
    const interval = setInterval(() => {
      const clinicKeys = Object.keys(queues);

      if (showAd) {
        setShowAd(false);
      } else if (clinicKeys.length === 0) {
        
        setShowAd(true);
      } else {
        
        const currentClinic = queues[clinicKeys[currentClinicIndex]];
        const doctorsInCurrentClinic = Object.keys(currentClinic || {});

        if (currentDoctorIndex < doctorsInCurrentClinic.length - 1) {
          setCurrentDoctorIndex((prev) => prev + 1);
        } else if (currentClinicIndex < clinicKeys.length - 1) {
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
  }, [queues, currentClinicIndex, currentDoctorIndex, showAd]);

  const clinicKeys = Object.keys(queues);
  const currentClinic =
    clinicKeys.length > 0 ? queues[clinicKeys[currentClinicIndex]] : null;
  const currentDoctorKey = currentClinic
    ? Object.keys(currentClinic)[currentDoctorIndex]
    : null;
  const currentDoctor = currentDoctorKey
    ? currentClinic[currentDoctorKey]
    : null;

  useEffect(() => {
    console.log("Updated Queues:", queues);
    console.log("Updated Finished Patients:", finishedPatients);
  }, [queues, finishedPatients]);

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
        ) : clinicKeys.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-2xl text-textgray font-semibold">
              No active clinics at the moment.
            </p>
          </div>
        ) : (
          <>
            <p className="text-2xl text-textgray font-semibold">Department</p>
            <div className="flex space-x-4">
              {clinicKeys.map((clinicName, index) => (
                <Chip
                  key={clinicName}
                  className={`min-w-40 py-3 px-6 rounded-lg ${
                    index === currentClinicIndex
                      ? "bg-kfupmgreen text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  <span className="font-semibold text-lg">{clinicName}</span>
                </Chip>
              ))}
            </div>

            <p className="text-2xl text-textgray font-semibold">Doctor</p>
            <div className="flex space-x-4">
              {currentClinic &&
                Object.keys(currentClinic).map((doctorName, index) => (
                  <Chip
                    key={doctorName}
                    className={`min-w-40 py-3 px-6 rounded-lg ${
                      index === currentDoctorIndex
                        ? "bg-kfupmgreen text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    <span className="font-semibold text-lg">{doctorName}</span>
                  </Chip>
                ))}
            </div>

            {currentDoctor && (
              <>
                <p className="text-2xl text-textgray font-semibold">Patient</p>
                <div className="flex gap-8">
                  <div className="flex flex-col space-y-4">
                    {finishedPatients
                      .filter(
                        (patient) => patient.doctorName === currentDoctorKey
                      )
                      .map((patient) => (
                        <Chip
                          key={`finished-${patient.appointmentID}`}
                          className="min-w-96 py-3 px-6 rounded-lg bg-gray-300 text-gray-600 border border-gray-400"
                        >
                          <span className="font-semibold text-lg">
                            {patient.patientName}
                          </span>
                        </Chip>
                      ))}

                    {(() => {
                      // Collect all patients into a single array
                      const allPatients = [];
                      Object.keys(currentDoctor).forEach((priority) => {
                        allPatients.push(...currentDoctor[priority]);
                      });

                      //patients with entered=true come first
                      allPatients.sort((a, b) => {
                        if (a.entered && !b.entered) return -1;
                        if (!a.entered && b.entered) return 1;
                        // if both have the same 'entered' status, sort by priority
                        if (a.Priority !== b.Priority)
                          return a.Priority - b.Priority;
                        return 0;
                      });

                      return allPatients.map((patient) => (
                        <Chip
                          key={patient.appointmentID}
                          className={`min-w-96 py-3 px-6 rounded-lg ${
                            patient.finished
                              ? "opacity-50 border border-gray-500 text-gray-500"
                              : patient.entered
                              ? "bg-kfupmgreen text-white border border-kfupmgreen"
                              : "border border-kfupmgreen text-gray-500 bg-white"
                          }`}
                        >
                          <span className="font-semibold text-lg">
                            {patient.patientName}
                          </span>
                        </Chip>
                      ));
                    })()}
                  </div>

                  {/* Display the details of the first patient */}
                  {(() => {
                   
                    const allPatients = [];
                    Object.keys(currentDoctor).forEach((priority) => {
                      allPatients.push(...currentDoctor[priority]);
                    });

                    allPatients.sort((a, b) => {
                      if (a.entered && !b.entered) return -1;
                      if (!a.entered && b.entered) return 1;
                      if (a.Priority !== b.Priority)
                        return a.Priority - b.Priority;
                      return 0;
                    });

                    const firstPatient = allPatients[0];

                    return firstPatient ? (
                      <div
                        className={`${
                          firstPatient.entered
                            ? "bg-kfupmgreen text-white"
                            : "bg-white text-kfupmgreen"
                        } p-6 rounded-xl w-96 flex flex-col items-center`}
                      >
                        <p className="text-lg font-medium">Patient</p>
                        <p className="text-2xl font-bold">
                          {firstPatient.patientName || "No Current Patient"}
                        </p>
                        <p className="text-lg font-medium mt-4">Patient ID</p>
                        <p className="text-2xl font-bold">
                          {firstPatient.patientID || "-"}
                        </p>
                        <p className="text-lg font-medium mt-4">
                          Appointment ID
                        </p>
                        <p className="text-2xl font-bold">
                          {firstPatient.appointmentID || "-"}
                        </p>
                      </div>
                    ) : null;
                  })()}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default QueuePage2;
