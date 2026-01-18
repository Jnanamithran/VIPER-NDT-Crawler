import React, { useState, useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { TrendingUp, Activity, AlertTriangle, Clock } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('24h');
  const [detectionStats, setDetectionStats] = useState({
    totalDetections: 0,
    uniqueObjects: 0,
    averageConfidence: 0,
    activeAlerts: 0
  });

  // Real data will come from API
  useEffect(() => {
    // TODO: Fetch real data from API
    // fetch(`${aiServer}/api/analytics/${timeRange}`)...
  }, [timeRange]);

  // Detection Trend Data - Empty state
  const detectionTrendData = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'],
    datasets: [
      {
        label: 'Detections',
        data: [0, 0, 0, 0, 0, 0, 0],
        borderColor: 'rgb(156, 163, 175)',
        backgroundColor: 'rgba(156, 163, 175, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ]
  };

  // Object Type Distribution - Empty state
  const objectTypeData = {
    labels: ['Person', 'Vehicle', 'Package', 'Animal', 'Other'],
    datasets: [
      {
        data: [0, 0, 0, 0, 0],
        backgroundColor: [
          'rgba(75, 85, 99, 0.8)',
          'rgba(107, 114, 128, 0.8)',
          'rgba(156, 163, 175, 0.8)',
          'rgba(209, 213, 219, 0.8)',
          'rgba(229, 231, 235, 0.8)',
        ],
        borderWidth: 0,
      }
    ]
  };

  // Hourly Activity Data - Empty state
  const hourlyActivityData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Detections',
        data: [0, 0, 0, 0, 0, 0, 0],
        backgroundColor: 'rgba(156, 163, 175, 0.8)',
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      }
    }
  };

  return (
    <div className="space-y-8 min-h-screen bg-black text-gray-100">
      {/* Header */}
      <div className="bg-black border-b-4 border-gray-900 p-6 rounded-xl shadow-2xl border-gray-800">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-100 mb-2 flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              Analytics Dashboard
            </h1>
            <p className="text-gray-400 text-sm font-medium">
              Detection Insights & Performance Metrics
            </p>
          </div>
          
          {/* Time Range Selector */}
          <div className="flex gap-2">
            {['24h', '7d', '30d'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                  timeRange === range
                    ? 'bg-gray-900 border border-gray-800 text-white shadow-lg'
                    : 'bg-black text-gray-400 border-2 border-gray-900 hover:border-gray-800'
                }`}
              >
                {range === '24h' ? 'Last 24 Hours' : range === '7d' ? 'Last 7 Days' : 'Last 30 Days'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-black to-gray-900 border border-gray-800 text-white p-6 rounded-xl shadow-lg">
          <Activity className="w-8 h-8 mb-3 opacity-80" />
          <div className="text-3xl font-bold mb-1">{detectionStats.totalDetections}</div>
          <div className="text-sm opacity-80 uppercase tracking-wider">Total Detections</div>
        </div>

        <div className="bg-gradient-to-br from-black to-gray-900 border border-gray-800 text-white p-6 rounded-xl shadow-lg">
          <Activity className="w-8 h-8 mb-3 opacity-80" />
          <div className="text-3xl font-bold mb-1">{detectionStats.uniqueObjects}</div>
          <div className="text-sm opacity-80 uppercase tracking-wider">Unique Objects</div>
        </div>

        <div className="bg-gradient-to-br from-black to-gray-900 border border-gray-800 text-white p-6 rounded-xl shadow-lg">
          <Activity className="w-8 h-8 mb-3 opacity-80" />
          <div className="text-3xl font-bold mb-1">{detectionStats.averageConfidence}%</div>
          <div className="text-sm opacity-80 uppercase tracking-wider">Avg Confidence</div>
        </div>

        <div className="bg-gradient-to-br from-black to-gray-900 border border-gray-800 text-white p-6 rounded-xl shadow-lg">
          <AlertTriangle className="w-8 h-8 mb-3 opacity-80" />
          <div className="text-3xl font-bold mb-1">{detectionStats.activeAlerts}</div>
          <div className="text-sm opacity-80 uppercase tracking-wider">Active Alerts</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Detection Trend */}
        <div className="bg-black border border-gray-900 p-6 rounded-xl shadow-2xl">
          <h2 className="text-xl font-bold text-gray-200 mb-4">Detection Trend</h2>
          <div className="h-80">
            <Line data={detectionTrendData} options={chartOptions} />
          </div>
        </div>

        {/* Object Distribution */}
        <div className="bg-black border border-gray-900 p-6 rounded-xl shadow-2xl">
          <h2 className="text-xl font-bold text-gray-200 mb-4">Object Distribution</h2>
          <div className="h-80">
            <Doughnut data={objectTypeData} options={doughnutOptions} />
          </div>
        </div>

        {/* Weekly Activity */}
        <div className="bg-black border border-gray-900 p-6 rounded-xl shadow-2xl lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-200 mb-4">Weekly Activity</h2>
          <div className="h-80">
            <Bar data={hourlyActivityData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Recent Detections Table */}
      <div className="bg-black border border-gray-900 rounded-xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b-2 border-gray-900">
          <h2 className="text-xl font-bold text-gray-200">Recent Detections</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Object</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Confidence</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-900">
              {([]).length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    No detections data available. Data will appear when connected to the API.
                  </td>
                </tr>
              ) : (
                [].map((detection, index) => (
                  <tr key={index} className="hover:bg-gray-900 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-mono">
                      {detection.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">
                      {detection.object}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-900 rounded-full h-2 max-w-[100px]">
                          <div 
                            className="bg-gray-600 h-2 rounded-full" 
                            style={{ width: `${detection.confidence}%` }}
                          />
                        </div>
                        <span className="font-bold text-gray-200">{detection.confidence}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {detection.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        detection.status === 'Active' 
                          ? 'bg-gray-800 text-gray-300 border border-gray-700' 
                          : 'bg-black text-gray-500 border border-gray-900'
                      }`}>
                        {detection.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
