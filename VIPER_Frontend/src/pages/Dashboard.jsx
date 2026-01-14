import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [telemetry, setTelemetry] = useState({ temp: "---", status: "CONNECTING" });
  const [cameraConnected, setCameraConnected] = useState(false);
  const [telemetryError, setTelemetryError] = useState(false);

  // Identify Pi Health status every 5 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('http://10.203.55.170:5000/telemetry', { signal: AbortSignal.timeout(3000) });
        if (res.ok) {
          const data = await res.json();
          setTelemetry(data);
          setTelemetryError(false);
        }
      } catch (e) {
        console.error('Telemetry Error:', e.message);
        setTelemetry({ temp: "N/A", status: "DISCONNECTED" });
        setTelemetryError(true);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Check camera connection by image load
  const handleImageLoad = () => {
    setCameraConnected(true);
  };

  const handleImageError = () => {
    setCameraConnected(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">PILOT HUD</h1>
          <p className="text-slate-400 text-sm font-bold">Real-time edge node monitoring</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">System Status</p>
            <p className={`text-lg font-black ${telemetryError ? 'text-red-500' : 'text-green-500'}`}>
              {telemetryError ? 'OFFLINE' : 'ONLINE'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid - Responsive */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-max">
        
        {/* Main AI Feed Viewport - Full width on mobile, 7/12 on medium, 8/12 on large, 9/12 on xl */}
        <div className="col-span-1 md:col-span-7 lg:col-span-8 xl:col-span-9">
          <div className="relative w-full bg-black rounded-3xl border-2 border-slate-800 overflow-hidden shadow-2xl group hover:border-slate-700 transition-colors duration-300">
            <div className="aspect-video w-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-black">
              {cameraConnected ? (
                <img 
                  src="http://localhost:5001/ai_feed" 
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  className="w-full h-full object-cover group-hover:brightness-110 transition-all duration-300" 
                  alt="V.I.P.E.R. AI Feed" 
                />
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full gap-4">
                  <div className="text-6xl">📹</div>
                  <p className="text-slate-400 font-bold text-lg">Camera Feed Unavailable</p>
                  <p className="text-slate-500 text-sm">Make sure the Pi camera service is running at:</p>
                  <code className="text-orange-500 font-mono text-xs bg-slate-700/50 px-4 py-2 rounded">http://localhost:5001/ai_feed</code>
                </div>
              )}
            </div>
            
            {/* HUD Overlays */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Top Left - Status Badges */}
              <div className="absolute top-6 left-6 flex gap-3">
                <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-full text-xs font-black tracking-widest animate-pulse shadow-lg shadow-red-600/50">
                  ● LIVE STREAM
                </div>
                <div className="bg-slate-900/80 backdrop-blur-md text-slate-300 px-4 py-2 rounded-full text-xs font-black border border-slate-700 shadow-lg">
                  YOLOV8S ACTIVE
                </div>
              </div>

              {/* Top Right - FPS Counter */}
              <div className="absolute top-6 right-6 bg-slate-900/80 backdrop-blur-md text-orange-500 px-4 py-2 rounded-full text-xs font-bold border border-slate-700 shadow-lg">
                FPS: 30 | RES: 1920x1080
              </div>

              {/* Bottom - Recording Indicator */}
              <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-slate-700 shadow-lg">
                <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                <span className="text-slate-300 text-xs font-bold">RECORDING</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Telemetry & Controls - Full width on mobile, 5/12 on medium, 4/12 on large, 3/12 on xl */}
        <div className="col-span-1 md:col-span-5 lg:col-span-4 xl:col-span-3 space-y-6">
          
          {/* Status Panel */}
          <div className="bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900 p-6 rounded-2xl border border-slate-700/30 shadow-2xl hover:border-slate-600/50 hover:shadow-slate-900/50 transition-all duration-300 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-slate-300 text-xs font-black uppercase tracking-[0.15em]">Edge Node Status</h3>
              <span className={`w-3 h-3 rounded-full animate-pulse ${telemetryError ? 'bg-red-500' : 'bg-green-500'}`}></span>
            </div>
            
            {telemetryError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
                <p className="text-red-400 text-xs font-bold">⚠ Cannot reach Pi at 10.203.55.170:5000</p>
              </div>
            )}
            
            <div className="space-y-4">
              {/* Temperature */}
              <div className="flex justify-between items-center pb-4 border-b border-slate-700/50">
                <span className="text-sm font-bold text-slate-400">Core Temp</span>
                <div className="flex items-center gap-2">
                  <span className={`font-mono font-bold text-lg ${telemetry.temp.includes('6') || telemetry.temp === 'N/A' ? 'text-red-500' : 'text-orange-500'}`}>
                    {telemetry.temp}°C
                  </span>
                  <div className="w-6 h-6 rounded-full bg-slate-700/50 flex items-center justify-center text-orange-500 text-xs font-bold">
                    ▲
                  </div>
                </div>
              </div>

              {/* Link State */}
              <div className="flex justify-between items-center pb-4 border-b border-slate-700/50">
                <span className="text-sm font-bold text-slate-400">Link State</span>
                <span className={`text-xs font-black px-3 py-1 rounded-full transition-all ${telemetry.status === 'STABLE' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                  {telemetry.status}
                </span>
              </div>

              {/* Uptime */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-400">Uptime</span>
                <span className="font-mono text-slate-300 font-bold text-sm">{telemetryError ? '--:--' : '47h 23m'}</span>
              </div>
            </div>
          </div>

          {/* Emergency Override Panel */}
          <div className="bg-gradient-to-br from-orange-600/90 via-orange-700/80 to-orange-800/90 p-6 rounded-2xl text-white shadow-2xl shadow-orange-600/30 border border-orange-500/40 hover:shadow-orange-500/40 transition-all duration-300 backdrop-blur-sm">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-black text-xs uppercase tracking-widest mb-1">Manual Override</h3>
                <p className="text-xs font-bold leading-relaxed opacity-90">Emergency Brake & Manual Steer</p>
              </div>
              <span className="text-2xl">⚡</span>
            </div>
            <button className="w-full mt-4 px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white font-black uppercase text-xs tracking-wider rounded-lg transition-all duration-200 border border-white/40 backdrop-blur-sm active:scale-95">
              Activate Override
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900 p-6 rounded-2xl border border-slate-700/30 shadow-2xl hover:border-slate-600/50 transition-all duration-300 backdrop-blur-sm">
            <h3 className="text-slate-300 text-xs font-black uppercase mb-4 tracking-[0.15em]">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2.5 bg-slate-700/50 hover:bg-slate-700/70 text-slate-200 font-bold text-xs uppercase tracking-wider rounded-lg transition-all duration-200 active:scale-95">
                📸 Capture Frame
              </button>
              <button className="w-full px-4 py-2.5 bg-slate-700/50 hover:bg-slate-700/70 text-slate-200 font-bold text-xs uppercase tracking-wider rounded-lg transition-all duration-200 active:scale-95">
                📥 Export Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;