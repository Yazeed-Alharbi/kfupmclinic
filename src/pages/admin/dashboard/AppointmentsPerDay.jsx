import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import supabase from "../../../commonComponents/supabase";

export default function AppointmentsPerDay() {
  const [data, setData] = useState([]); // State to store processed data

  const fetchData = async () => {
    try {
      const currentDate = new Date();
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(currentDate.getDate() - 100);

      const { data: appointments, error } = await supabase
        .from('Appointment')
        .select('*')
        .gte('AppDate', oneWeekAgo.toISOString())
        .lte('AppDate', currentDate.toISOString())
        .order('AppDate', { ascending: true });

      if (error) {
        console.error("Error fetching appointments:", error);
        return;
      }

      const processedData = [];

      appointments.forEach((element) => {
        const parsedDate = new Date(element.AppDate);
        const month = (parsedDate.getMonth() + 1).toString().padStart(2, "0");
        const day = parsedDate.getDate().toString().padStart(2, "0");
        const formattedDate = `${month}/${day}`;

        const existingDay = processedData.find((item) => item.day === formattedDate);

        if (existingDay) {
          existingDay.appointments++;
        } else {
          processedData.push({ day: formattedDate, appointments: 1 });
        }
      });

      setData(processedData); // Update the state with the processed data
    } catch (error) {
      console.error("Error processing data:", error);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch data initially

    const interval = setInterval(() => {
      fetchData(); // Fetch data every 3 seconds
    }, 3000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <div className="w-full h-[300px]">
      <h3 className="text-lg font-semibold mb-2">Appointments per Day</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="appointments" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
