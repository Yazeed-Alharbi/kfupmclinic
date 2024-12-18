import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import supabase from "../../../commonComponents/supabase";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export function AppointmentStatusPieChart() {
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

      // Initialize counters
      let completedCount = 0;
      let enteredCount = 0;
      let scheduledCount = 0;

      // Iterate through the data and count based on conditions
      appointments.forEach((element) => {
        if (element.Finished === true) {
          completedCount++;
        }
        if (element.entered === true && element.Finished===false) {
          enteredCount++;
        }
        if (element.checkedIn === false) {
          scheduledCount++;
        }
      });

      // Create the final array in the desired format
      const processedData = [
        { name: 'Completed', value: completedCount },
        { name: 'Entered', value: enteredCount },
        { name: 'Scheduled', value: scheduledCount },
      ];

      setData(processedData); // Update state with processed data
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
