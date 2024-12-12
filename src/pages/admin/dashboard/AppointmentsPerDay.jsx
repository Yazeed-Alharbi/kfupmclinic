import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import supabase from "../../../commonComponents/supabase";

const currentDate = new Date();
const oneWeekAgo = new Date();
oneWeekAgo.setDate(currentDate.getDate() -100);
console.log(oneWeekAgo.toISOString())
// let llll = await supabase.from('Appointment').select('*').eq('doctorID',1)
let dataa  = await supabase
        .from('Appointment').select('*')
        .gte('AppDate', oneWeekAgo.toISOString())
        .lte('AppDate', currentDate.toISOString())
        .order('AppDate', { ascending: true });
        let dataArray = dataa.data;
        console.log(dataArray);
        let afterProcessing = [];
        
        dataArray.forEach(element => {
          let parsedDate = new Date(element.AppDate);
          let month = (parsedDate.getMonth() + 1).toString().padStart(2, "0"); // Add leading zero if needed
          let day = parsedDate.getDate().toString().padStart(2, "0"); // Add leading zero if needed
        
          let formattedDate = `${month}/${day}`;
        
          // Check if formattedDate already exists in the array
          let existingDay = afterProcessing.find(item => item.day === formattedDate);
          
          if (existingDay) {
            // If the day exists, increment the appointment count
            existingDay.appointments++;
          } else {
            // If the day does not exist, add a new entry with 1 appointment
            afterProcessing.push({ day: formattedDate, appointments: 1 });
          }
        });
        
        console.log(afterProcessing);
        
const data = afterProcessing

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

