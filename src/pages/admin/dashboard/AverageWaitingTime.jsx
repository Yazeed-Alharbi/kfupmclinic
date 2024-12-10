import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { clinic: 'Cardiology', avgWaitTime: 15 },
  { clinic: 'Dermatology', avgWaitTime: 10 },
  { clinic: 'Neurology', avgWaitTime: 20 },
  { clinic: 'Pediatrics', avgWaitTime: 12 },
  { clinic: 'Orthopedics', avgWaitTime: 18 },
];

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

