import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import supabase from "../../../commonComponents/supabase";

export default function AppointmentsPerClinic() {
  const [data, setData] = useState([]); // State to store processed data

  const fetchData = async () => {
    try {
      const { data: appointments, error } = await supabase
        .from('Appointment')
        .select('*');

      if (error) {
        console.error("Error fetching appointments:", error);
        return;
      }

      const processedData = [];

      // Process the data to count appointments by clinic
      appointments.forEach((element) => {
        // Trim Arabic and the hyphen from the clinic name
        let trimmedClinic = element.clinic.split('-')[0].trim().split(' ')[0];

        // Check if the clinic already exists in the array
        let existingClinic = processedData.find(item => item.clinic === trimmedClinic);

        if (existingClinic) {
          // If the clinic exists, increment its appointment count
          existingClinic.appointments++;
        } else {
          // If the clinic does not exist, add it with an initial count of 1
          processedData.push({ clinic: trimmedClinic, appointments: 1 });
        }
      });

      setData(processedData); // Update the state with processed data
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
      <h3 className="text-lg font-semibold mb-2">Appointments per Clinic</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="clinic" type="category" width={150} />
          <Tooltip />
          <Legend />
          <Bar dataKey="appointments" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
