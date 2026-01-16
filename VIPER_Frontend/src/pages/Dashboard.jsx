import React, { useEffect, useState, useRef } from "react";

const PI_IP = "10.203.55.198";
const FRAME_URL = `http://${PI_IP}:5001/frame`;
const OVERLAY_API = `http://${PI_IP}:5001/overlay`;

const Dashboard = () => {
  const imgRef = useRef(null);
  const [error, setError] = useState("");
  const [frameCount, setFrameCount] = useState(0);

  const [overlay, setOverlay] = useState({
    ai: true,
    gas: false,
    thermal: false,
  });

  // ---- FRAME POLLING ----
  useEffect(() => {
    const interval = setInterval(() => {
      if (imgRef.current) {
        imgRef.current.src = `${FRAME_URL}?t=${Date.now()}`;
        setFrameCount(c => c + 1);
      }
    }, 150); // stable polling

    return () => clearInterval(interval);
  }, []);

  // ---- OVERLAY TOGGLE ----
  const toggleOverlay = async (name) => {
    try {
      const action = overlay[name] ? "off" : "on";
      const res = await fetch(`${OVERLAY_API}/${name}/${action}`, {
        method: "POST"
      });
      if (!res.ok) throw new Error("Overlay failed");
      setOverlay({ ...overlay, [name]: !overlay[name] });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-8 p-8 bg-slate-950 min-h-screen text-white">

      <div className="border-l-4 border-orange-600 pl-6">
        <h1 className="text-4xl font-black">VIPER CONTROL HUD</h1>
        <p className="text-slate-400 text-sm">Real-time Surveillance Feed</p>
        <p className="text-slate-500 text-xs">Frames: {frameCount}</p>
      </div>

      {error && (
        <div className="p-4 bg-orange-600/10 border border-orange-600/50 rounded">
          ⚠ {error}
        </div>
      )}

      {/* VIDEO */}
      <div className="relative aspect-video bg-black border border-slate-800 rounded-lg overflow-hidden">
        <img
          ref={imgRef}
          className="w-full h-full object-cover"
          alt="AI Feed"
          onError={() => setError("Camera feed unavailable")}
        />

        <div className="absolute top-4 left-4 flex gap-2">
          {overlay.ai && <span className="badge">AI</span>}
          {overlay.gas && <span className="badge">GAS</span>}
          {overlay.thermal && <span className="badge">THERMAL</span>}
        </div>
      </div>

      {/* CONTROLS */}
      <div className="grid grid-cols-3 gap-4">
        <button onClick={() => toggleOverlay("ai")} className="btn">🧠 AI Overlay</button>
        <button onClick={() => toggleOverlay("gas")} className="btn">🧪 Gas Sensor</button>
        <button onClick={() => toggleOverlay("thermal")} className="btn">🔥 Thermal IR</button>
      </div>

    </div>
  );
};

export default Dashboard;
