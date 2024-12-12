import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import supabase from "../../../commonComponents/supabase";

// Fetch data from Supabase
let dataa = await supabase
  .from('Appointment')
  .select('*');

console.log(dataa);

let dataArray = dataa.data || [];

// Initialize counters
let completedCount = 0;
let enteredCount = 0;
let scheduledCount = 0;

// Iterate through the data and count based on conditions
dataArray.forEach(element => {
  if (element.Finished === true) {
    completedCount++;
  }
  if (element.entered === true) {
    enteredCount++;
  }
  if (element.checkedIn === false) {
    scheduledCount++;
  }
});

// Create the final array in the desired format
const afterProcessing = [
  { name: 'Completed', value: completedCount },
  { name: 'Entered', value: enteredCount },
  { name: 'Scheduled', value: scheduledCount },
];

console.log("Final Processed Data:", afterProcessing);

const data = afterProcessing;
// const data = [
//   { name: 'Completed', value: 400 },
//   { name: 'Entered', value: 300 },
//   { name: 'Scheduled', value: 100 },
//     { name: 'Cancelled', value: 200 },
// ];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export function AppointmentStatusPieChart() {
  return (
    <div className="w-full h-[300px]">
      <h3 className="text-lg font-semibold mb-2">Appointment Status Distribution</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

