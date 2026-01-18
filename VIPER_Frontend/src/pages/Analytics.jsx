import { useState } from "react";
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
  Legend,
} from "recharts";
import {
  TrendingUp,
  Flame,
  AlertCircle,
  Clock,
  Activity,
} from "lucide-react";
import Navbar from "../components/Navbar";

/* ---------------- MOCK DATA ---------------- */

const degradationData = [
  { time: "00:00", cracks: 2, blockages: 1, corrosion: 3 },
  { time: "04:00", cracks: 3, blockages: 1, corrosion: 4 },
  { time: "08:00", cracks: 5, blockages: 2, corrosion: 5 },
  { time: "12:00", cracks: 4, blockages: 3, corrosion: 7 },
  { time: "16:00", cracks: 8, blockages: 2, corrosion: 6 },
  { time: "20:00", cracks: 6, blockages: 4, corrosion: 9 },
  { time: "24:00", cracks: 9, blockages: 3, corrosion: 8 },
];

const gasData = [
  { zone: "Zone A", ch4: 32, co: 15 },
  { zone: "Zone B", ch4: 45, co: 28 },
  { zone: "Zone C", ch4: 78, co: 42 },
  { zone: "Zone D", ch4: 23, co: 18 },
  { zone: "Zone E", ch4: 56, co: 35 },
];

const recentDetections = [
  { id: 1, type: "Crack", timestamp: "14:32:15", severity: "high", confidence: 94 },
  { id: 2, type: "Corrosion", timestamp: "14:28:42", severity: "medium", confidence: 87 },
  { id: 3, type: "Blockage", timestamp: "14:21:08", severity: "low", confidence: 92 },
  { id: 4, type: "Crack", timestamp: "14:15:33", severity: "high", confidence: 89 },
  { id: 5, type: "Corrosion", timestamp: "14:08:19", severity: "medium", confidence: 78 },
  { id: 6, type: "Crack", timestamp: "13:55:44", severity: "low", confidence: 65 },
];

/* ---------------- CUSTOM TOOLTIP ---------------- */

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-background border border-border rounded-lg p-3 shadow-md">
      <p className="text-xs font-semibold mb-2">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-xs" style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
};

/* ---------------- PAGE ---------------- */

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("24h");

  const severityClass = (level) => {
    switch (level) {
      case "high":
        return "text-red-500 bg-red-500/10 border-red-500/30";
      case "medium":
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/30";
      case "low":
        return "text-green-500 bg-green-500/10 border-green-500/30";
      default:
        return "text-muted-foreground bg-muted border-border";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 px-6 pb-10">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Mission Metrics</h1>
            <p className="text-sm text-muted-foreground">
              Detection analysis & degradation logs
            </p>
          </div>

          <div className="flex gap-2">
            {["24h", "7d", "30d"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 text-xs rounded-lg border transition
                  ${
                    timeRange === range
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:border-primary"
                  }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-12 gap-6">
          {/* LINE CHART */}
          <div className="col-span-8 bg-card rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-semibold uppercase">
                  Temporal Degradation
                </h3>
              </div>
              <div className="flex items-center gap-1 text-primary text-xs">
                <Activity className="w-4 h-4" />
                Real-time
              </div>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer>
                <LineChart data={degradationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line type="monotone" dataKey="cracks" stroke="#ef4444" strokeWidth={2} />
                  <Line type="monotone" dataKey="blockages" stroke="#f59e0b" strokeWidth={2} />
                  <Line type="monotone" dataKey="corrosion" stroke="#fb923c" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* BAR CHART */}
          <div className="col-span-4 bg-card rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-semibold uppercase">Gas Levels</h3>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer>
                <BarChart data={gasData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="zone" type="category" width={70} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="ch4" fill="#fb923c" />
                  <Bar dataKey="co" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* TABLE */}
          <div className="col-span-12 bg-card rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-semibold uppercase">
                  Recent Detections
                </h3>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-4 h-4" />
                Updated 14:32:15
              </div>
            </div>

            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2">ID</th>
                  <th className="text-left py-2">Type</th>
                  <th className="text-left py-2">Time</th>
                  <th className="text-left py-2">Severity</th>
                  <th className="text-left py-2">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {recentDetections.map((d) => (
                  <tr key={d.id} className="border-b border-border/50">
                    <td className="py-2 font-mono">#{d.id}</td>
                    <td>{d.type}</td>
                    <td className="font-mono">{d.timestamp}</td>
                    <td>
                      <span
                        className={`px-2 py-1 text-xs rounded border ${severityClass(
                          d.severity
                        )}`}
                      >
                        {d.severity}
                      </span>
                    </td>
                    <td className="text-primary font-mono">
                      {d.confidence}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
