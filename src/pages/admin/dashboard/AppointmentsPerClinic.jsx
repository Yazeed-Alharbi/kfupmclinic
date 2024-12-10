import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { clinic: 'Cardiology', appointments: 45 },
  { clinic: 'Dermatology', appointments: 30 },
  { clinic: 'Neurology', appointments: 35 },
  { clinic: 'Pediatrics', appointments: 50 },
  { clinic: 'Orthopedics', appointments: 40 },
];

export default function AppointmentsPerClinic() {
  return (
    <div className="w-full h-[300px]">
      <h3 className="text-lg font-semibold mb-2">Appointments per Clinic</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="clinic" type="category" />
          <Tooltip />
          <Legend />
          <Bar dataKey="appointments" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

