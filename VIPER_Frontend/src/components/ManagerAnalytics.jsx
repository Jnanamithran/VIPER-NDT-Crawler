import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { TrendingUp, Flame, Activity } from 'lucide-react';
import { fetchDetectionHistory } from '../services/api';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 border border-primary/30">
        <p className="font-display text-sm text-primary mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const ManagerAnalytics = () => {
  const [timeRange, setTimeRange] = useState('24h');
  const [degradationData, setDegradationData] = useState([]);
  const [gasData, setGasData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detectionCount, setDetectionCount] = useState(0);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        const history = await fetchDetectionHistory();

        if (history && history.length > 0) {
          setDetectionCount(history.length);

          // Generate degradation data from detections
          const detectionsByType = {};
          history.forEach(d => {
            const label = d.label || 'Unknown';
            if (!detectionsByType[label]) {
              detectionsByType[label] = 0;
            }
            detectionsByType[label]++;
          });

          // Create hourly degradation data
          const timeSlots = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'];
          const newDegradationData = timeSlots.map((time, index) => {
            const detectionCount = Object.values(detectionsByType).length > 0
              ? Math.max(1, Math.floor(Object.values(detectionsByType).reduce((a, b) => a + b, 0) / timeSlots.length) + index)
              : 0;
            return {
              time,
              cracks: Math.floor(detectionCount * 0.4),
              blockages: Math.floor(detectionCount * 0.3),
              corrosion: Math.floor(detectionCount * 0.3),
            };
          });
          setDegradationData(newDegradationData);

          // Generate gas accumulation data from detections
          const detectionTypeLabels = Object.keys(detectionsByType);
          const gasZones = detectionTypeLabels.slice(0, 5).length > 0
            ? detectionTypeLabels.slice(0, 5).map((label, idx) => ({
              zone: `Zone ${String.fromCharCode(65 + idx)}`,
              ch4: 20 + (detectionsByType[label] || 0) * 5,
              co: 10 + (detectionsByType[label] || 0) * 3,
            }))
            : [
              { zone: 'Zone A', ch4: 32, co: 15 },
              { zone: 'Zone B', ch4: 45, co: 28 },
              { zone: 'Zone C', ch4: 78, co: 42 },
              { zone: 'Zone D', ch4: 23, co: 18 },
              { zone: 'Zone E', ch4: 56, co: 35 },
            ];
          setGasData(gasZones);
        } else {
          setDegradationData([]);
          setGasData([]);
          setDetectionCount(0);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error loading analytics:', error);
        setLoading(false);
      }
    };

    loadHistory();
    const interval = setInterval(loadHistory, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-wider mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground">
            Detection analysis and temporal degradation logs
          </p>
        </div>
        <div className="flex items-center gap-2">
          {['24h', '7d', '30d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-display text-xs tracking-wider uppercase transition-all duration-200 border ${
                timeRange === range
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-transparent text-muted-foreground border-border hover:border-primary/50'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Temporal Degradation */}
        <div className="glass-card-glow p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="font-display text-sm tracking-wider uppercase">Temporal Degradation</h3>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              <span className="text-xs font-display text-primary uppercase tracking-wider">Real-time</span>
            </div>
          </div>
          <div className="h-72">
            {loading ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>Loading data...</p>
              </div>
            ) : degradationData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={degradationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 20% 18%)" />
                  <XAxis dataKey="time" stroke="hsl(215 15% 55%)" tick={{ fontSize: 11 }} />
                  <YAxis stroke="hsl(215 15% 55%)" tick={{ fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} formatter={(value) => <span className="text-xs uppercase">{value}</span>} />
                  <Line type="monotone" dataKey="cracks" stroke="hsl(0 72% 51%)" strokeWidth={2} dot={{ fill: 'hsl(0 72% 51%)', strokeWidth: 0, r: 4 }} activeDot={{ r: 6, stroke: 'hsl(0 72% 51%)', strokeWidth: 2 }} />
                  <Line type="monotone" dataKey="blockages" stroke="hsl(38 92% 50%)" strokeWidth={2} dot={{ fill: 'hsl(38 92% 50%)', strokeWidth: 0, r: 4 }} activeDot={{ r: 6, stroke: 'hsl(38 92% 50%)', strokeWidth: 2 }} />
                  <Line type="monotone" dataKey="corrosion" stroke="hsl(24 100% 50%)" strokeWidth={2} dot={{ fill: 'hsl(24 100% 50%)', strokeWidth: 0, r: 4 }} activeDot={{ r: 6, stroke: 'hsl(24 100% 50%)', strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>No data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Gas Accumulation */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <Flame className="w-5 h-5 text-primary" />
            <h3 className="font-display text-sm tracking-wider uppercase">Gas Accumulation by Zone</h3>
          </div>
          <div className="h-72">
            {loading ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>Loading data...</p>
              </div>
            ) : gasData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gasData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 20% 18%)" />
                  <XAxis type="number" stroke="hsl(215 15% 55%)" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="zone" type="category" stroke="hsl(215 15% 55%)" tick={{ fontSize: 11 }} width={60} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: '10px' }} formatter={(value) => <span className="text-xs uppercase">{value}</span>} />
                  <Bar dataKey="ch4" fill="hsl(24 100% 50%)" radius={[0, 4, 4, 0]} name="CH4" />
                  <Bar dataKey="co" fill="hsl(38 92% 50%)" radius={[0, 4, 4, 0]} name="CO" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>No data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <p className="text-muted-foreground text-sm mb-2 uppercase tracking-wider">Total Detections</p>
          <p className="font-display text-3xl font-bold">{detectionCount}</p>
        </div>
        <div className="glass-card p-6">
          <p className="text-muted-foreground text-sm mb-2 uppercase tracking-wider">Avg. Confidence</p>
          <p className="font-display text-3xl font-bold">—</p>
        </div>
        <div className="glass-card p-6">
          <p className="text-muted-foreground text-sm mb-2 uppercase tracking-wider">Detection Rate</p>
          <p className="font-display text-3xl font-bold">—</p>
        </div>
      </div>
    </div>
  );
};

export default ManagerAnalytics;
