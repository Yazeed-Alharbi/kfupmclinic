import { Card } from '@nextui-org/react';
import React, { useState, useEffect } from 'react';
import config from '../../../commonComponents/config';

export default function SystemStatus() {
  // State to track the connection status for each service
  const [statuses, setStatuses] = useState({
    queue: false,
    reception: false,
    kiosk: false,
    doctor: false,
  });

  const initializeSocket = (host, port, serviceName) => {
    const ws = new WebSocket(`ws://${host}:${port}`);

    ws.onopen = () => {
      console.log(`${serviceName} connected`);
      setStatuses((prevStatuses) => ({
        ...prevStatuses,
        [serviceName]: true,
      }));
    };

    ws.onclose = () => {
      console.log(`${serviceName} disconnected`);
      setStatuses((prevStatuses) => ({
        ...prevStatuses,
        [serviceName]: false,
      }));

      // Retry connection immediately
      initializeSocket(host, port, serviceName);
    };

    ws.onerror = (error) => {
      console.error(`${serviceName} socket error:`, error);
      setStatuses((prevStatuses) => ({
        ...prevStatuses,
        [serviceName]: false,
      }));
      ws.close(); // Close the socket to trigger reconnection
    };

    return ws;
  };

  useEffect(() => {
    const queueSocket = initializeSocket(config.QUEUE_HOST, config.QUEUE_PORT, 'queue');
    const receptionSocket = initializeSocket(config.HOST, config.PORT, 'reception');
    const kioskSocket = initializeSocket(config.KIOSK_HOST, config.KIOSK_PORT, 'kiosk');
    const doctorSocket = initializeSocket(config.DOCTOR_HOST, config.DOCTOR_PORT, 'doctor');

    return () => {
      queueSocket.close();
      receptionSocket.close();
      kioskSocket.close();
      doctorSocket.close();
    };
  }, []);

  return (
    <div className="w-full h-[300px]">
      <h3 className="text-lg font-semibold mb-2">System Status</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full h-full pb-16">
        <Card
          className={`w-full h-full shadow-md flex justify-center items-center pl-6 ${
            statuses.queue ? 'bg-white' : 'bg-red-500'
          }`}
        >
          <div className="flex items-center w-full gap-6">
            <div className="w-10 flex justify-center">
              <span
                className={`w-6 h-6 rounded-full ${
                  statuses.queue ? 'bg-green-500' : 'bg-white'
                }`}
              ></span>
            </div>
            <div className="flex-1">
              <p
                className={`text-3xl font-medium ${
                  statuses.queue ? 'text-black' : 'text-white'
                }`}
              >
                Queue
              </p>
            </div>
          </div>
        </Card>

        <Card
          className={`w-full h-full shadow-md flex justify-center items-center pl-6 ${
            statuses.reception ? 'bg-white' : 'bg-red-500'
          }`}
        >
          <div className="flex items-center w-full gap-6">
            <div className="w-10 flex justify-center">
              <span
                className={`w-6 h-6 rounded-full ${
                  statuses.reception ? 'bg-green-500' : 'bg-white'
                }`}
              ></span>
            </div>
            <div className="flex-1">
              <p
                className={`text-3xl font-medium ${
                  statuses.reception ? 'text-black' : 'text-white'
                }`}
              >
                Reception
              </p>
            </div>
          </div>
        </Card>

        <Card
          className={`w-full h-full shadow-md flex justify-center items-center pl-6 ${
            statuses.kiosk ? 'bg-white' : 'bg-red-500'
          }`}
        >
          <div className="flex items-center w-full gap-6">
            <div className="w-10 flex justify-center">
              <span
                className={`w-6 h-6 rounded-full ${
                  statuses.kiosk ? 'bg-green-500' : 'bg-white'
                }`}
              ></span>
            </div>
            <div className="flex-1">
              <p
                className={`text-3xl font-medium ${
                  statuses.kiosk ? 'text-black' : 'text-white'
                }`}
              >
                Kiosk
              </p>
            </div>
          </div>
        </Card>

        <Card
          className={`w-full h-full shadow-md flex justify-center items-center pl-6 ${
            statuses.doctor ? 'bg-white' : 'bg-red-500'
          }`}
        >
          <div className="flex items-center w-full gap-6">
            <div className="w-10 flex justify-center">
              <span
                className={`w-6 h-6 rounded-full ${
                  statuses.doctor ? 'bg-green-500' : 'bg-white'
                }`}
              ></span>
            </div>
            <div className="flex-1">
              <p
                className={`text-3xl font-medium ${
                  statuses.doctor ? 'text-black' : 'text-white'
                }`}
              >
                Doctor
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
