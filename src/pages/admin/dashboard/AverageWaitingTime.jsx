import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import supabase from "../../../commonComponents/supabase";

export function AverageWaitingTime() {
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

      // Helper function to parse time strings
      const parseTime = (timeStr) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes; // Convert to total minutes
      };

      appointments.forEach((element) => {
        if (!element.checkInTime || !element.enterTime || !element.clinic) {
          console.warn(`Invalid entry skipped:`, element);
          return; // Skip invalid entries
        }

        // Trim Arabic and the hyphen from the clinic name
        let trimmedClinic = element.clinic.split('-')[0].trim();

        // Parse checkInTime and enterTime
        let checkInMinutes = parseTime(element.checkInTime);
        let enterMinutes = parseTime(element.enterTime);

        // Handle cases where `enterTime` is earlier (spanning midnight)
        if (enterMinutes < checkInMinutes) {
          enterMinutes += 24 * 60; // Add 24 hours in minutes
        }

        // Calculate waiting time in minutes
        let waitingTime = enterMinutes - checkInMinutes;

        if (waitingTime < 0) {
          console.warn(`Negative waiting time skipped:`, element);
          return; // Skip cases with invalid waiting times
        }

        // Check if the clinic already exists in the array
        let existingClinic = processedData.find(item => item.clinic === trimmedClinic);

        if (existingClinic) {
          // Update total waiting time and count
          existingClinic.totalWaitingTime += waitingTime;
          existingClinic.count++;
        } else {
          // Add a new entry with initial waiting time and count
          processedData.push({ clinic: trimmedClinic, totalWaitingTime: waitingTime, count: 1 });
        }
      });

      // Calculate average waiting time for each clinic
      const finalData = processedData.map(item => ({
        clinic: item.clinic,
        avgWaitTime: Number((item.totalWaitingTime / item.count).toFixed(2)) // Rounded to 2 decimal places
      }));

      setData(finalData); // Update state with processed data
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
      <h3 className="text-lg font-semibold mb-2">Average Waiting Time per Clinic</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="clinic" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="avgWaitTime" fill="#ffc658" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
