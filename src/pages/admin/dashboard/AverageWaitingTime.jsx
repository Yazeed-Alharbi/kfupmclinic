import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import supabase from "../../../commonComponents/supabase";


let dataa = await supabase
  .from('Appointment')
  .select('*');

console.log(dataa);
let dataArray = dataa.data || [];
let afterProcessing = [];

// Helper function to parse time strings
const parseTime = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes; // Convert to total minutes
};

dataArray.forEach(element => {
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
  let existingClinic = afterProcessing.find(item => item.clinic === trimmedClinic);

  if (existingClinic) {
    // Update total waiting time and count
    existingClinic.totalWaitingTime += waitingTime;
    existingClinic.count++;
  } else {
    // Add a new entry with initial waiting time and count
    afterProcessing.push({ clinic: trimmedClinic, totalWaitingTime: waitingTime, count: 1 });
  }
});

// Calculate average waiting time for each clinic
afterProcessing = afterProcessing.map(item => ({
  clinic: item.clinic,
  avgWaitTime: Number((item.totalWaitingTime / item.count).toFixed(2)) // Rounded to 2 decimal places
}));

console.log("Final Processed Data by Clinic:", afterProcessing);
const data = afterProcessing;

// const data = [
//   { clinic: 'Cardiology', avgWaitTime: 15 },
//   { clinic: 'Dermatology', avgWaitTime: 10 },
//   { clinic: 'Neurology', avgWaitTime: 20 },
//   { clinic: 'Pediatrics', avgWaitTime: 12 },
//   { clinic: 'Orthopedics', avgWaitTime: 18 },
// ];

export function AverageWaitingTime() {
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

