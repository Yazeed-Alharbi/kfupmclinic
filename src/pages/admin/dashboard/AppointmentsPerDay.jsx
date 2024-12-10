import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { day: 'Mon', appointments: 12 },
  { day: 'Tue', appointments: 19 },
  { day: 'Wed', appointments: 15 },
  { day: 'Thu', appointments: 22 },
  { day: 'Fri', appointments: 18 },
  { day: 'Sat', appointments: 10 },
  { day: 'Sun', appointments: 8 },
];

export default function AppointmentsPerDay() {
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

