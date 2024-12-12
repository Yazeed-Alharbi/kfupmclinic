import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import supabase from "../../../commonComponents/supabase";
let dataa = await supabase
  .from('Appointment')
  .select('*');

console.log(dataa);
let dataArray = dataa.data;
let afterProcessing = [];

// Process the data to count appointments by clinic
dataArray.forEach(element => {
  // Trim Arabic and the hyphen from the clinic name
  let trimmedClinic = element.clinic.split('-')[0].trim().split(' ')[0];

  // Check if the clinic already exists in the array
  let existingClinic = afterProcessing.find(item => item.clinic === trimmedClinic);

  if (existingClinic) {
    // If the clinic exists, increment its appointment count
    existingClinic.appointments++;
  } else {
    // If the clinic does not exist, add it with an initial count of 1
    afterProcessing.push({ clinic: trimmedClinic, appointments: 1 });
  }
});

const data = afterProcessing;


export default function AppointmentsPerClinic() {
  return (
    <div className="w-full h-[300px]">
      <h3 className="text-lg font-semibold mb-2">Appointments per Clinic</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="clinic" type="category"  width={150} />
          <Tooltip />
          <Legend />
          <Bar dataKey="appointments" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

