import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler
);

const Analytics = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/history');
        const data = await response.json();
        
        // Logic to group detections by time for the chart
        const labels = data.map(log => log.time).reverse();
        const values = data.map((_, index) => index + 1); // Mock growth trend

        setChartData({
          labels,
          datasets: [{
            label: 'Identified Anomalies',
            data: values,
            borderColor: '#ea580c', // Viper Orange
            backgroundColor: 'rgba(234, 88, 12, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            borderWidth: 3,
          }]
        });
      } catch (error) {
        console.error("Error identifying chart trends:", error);
      }
    };
    fetchHistory();
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#ea580c',
        bodyColor: '#cbd5e1',
        borderColor: '#1e293b',
        borderWidth: 1,
      }
    },
    scales: {
      y: { ticks: { color: '#64748b' }, grid: { color: '#1e293b' } },
      x: { ticks: { color: '#64748b' }, grid: { display: false } }
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header className="border-b border-slate-800 pb-8">
        <h2 className="text-5xl font-black italic tracking-tighter uppercase text-white">
          Mission Metrics
        </h2>
        <p className="text-slate-500 text-sm font-bold tracking-wide mt-2">
          IDENTIFYING TEMPORAL DEGRADATION LOGS
        </p>
      </header>

      {/* Dynamic Chart Container */}
      <div className="bg-slate-900 rounded-[2.5rem] p-10 border border-slate-800 shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-slate-400 font-black uppercase text-xs tracking-widest">
            Detection Growth Over Time
          </h3>
          <span className="text-[10px] text-orange-500 font-bold px-3 py-1 bg-orange-500/10 rounded-full border border-orange-500/20">
            REAL-TIME SYNC
          </span>
        </div>
        <div className="h-80">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Analytics;