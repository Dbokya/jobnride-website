import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register required components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ReportsAndAnalytics() {
  const [weeklyData, setWeeklyData] = useState([]);

  useEffect(() => {
    const chartData = async () => {
      const rides = await getDocs(collection(db, 'rides'));
      // Data transformation example: count rides per day
      const counts = {};
      rides.docs.forEach(d => {
        const dt = d.data().createdAt.toDate().toLocaleDateString();
        counts[dt] = (counts[dt] || 0) + 1;
      });
      setWeeklyData(Object.entries(counts));
    };
    chartData();
  }, []);

  const data = {
    labels: weeklyData.map(([date]) => date),
    datasets: [
      {
        label: 'Rides per Day',
        data: weeklyData.map(([_, count]) => count),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Rides per Day',
      },
    },
  };

  return (
    <div>
      <h2>Reports & Analytics</h2>
      <Bar data={data} options={options} />
    </div>
  );
}