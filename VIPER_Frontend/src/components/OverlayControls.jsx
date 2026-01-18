import React, { useState, useEffect } from "react";
import { Brain, Flame, Wind, Power, PowerOff } from 'lucide-react';

const OverlayControls = ({ aiServer = "10.203.55.198", onStateChange }) => {
  const [overlay, setOverlay] = useState({
    ai: true,
    gas: false,
    thermal: false,
  });
  const [loading, setLoading] = useState({});
  const [error, setError] = useState("");

  const OVERLAY_API = `http://${aiServer}:5001/overlay`;

  // Fetch initial state
  useEffect(() => {
    fetchOverlayState();
  }, []);

  const fetchOverlayState = async () => {
    try {
      const res = await fetch(OVERLAY_API);
      if (res.ok) {
        const data = await res.json();
        setOverlay(data);
        onStateChange && onStateChange(data);
      }
    } catch (err) {
      console.error("Failed to fetch overlay state:", err);
    }
  };

  const toggleOverlay = async (name) => {
    setLoading(prev => ({ ...prev, [name]: true }));
    setError("");

    try {
      const action = overlay[name] ? "off" : "on";
      const res = await fetch(`${OVERLAY_API}/${name}/${action}`, {
        method: "POST"
      });

      if (!res.ok) throw new Error("Failed to toggle overlay");

      const newState = { ...overlay, [name]: !overlay[name] };
      setOverlay(newState);
      onStateChange && onStateChange(newState);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(prev => ({ ...prev, [name]: false }));
    }
  };

  const getColorClasses = (color) => {
    const colorMap = {
      blue: {
        bg: 'bg-gray-900 border-gray-800',
        border: 'border-gray-800',
        shadow: 'shadow-black',
        iconBg: 'bg-gray-800 border border-gray-700',
        text: 'text-gray-200',
        textActive: 'text-gray-300',
        indicator: 'bg-gray-400',
      },
      emerald: {
        bg: 'bg-gray-900 border-gray-800',
        border: 'border-gray-800',
        shadow: 'shadow-black',
        iconBg: 'bg-gray-800 border border-gray-700',
        text: 'text-gray-200',
        textActive: 'text-gray-300',
        indicator: 'bg-gray-400',
      },
      orange: {
        bg: 'bg-gray-900 border-gray-800',
        border: 'border-gray-800',
        shadow: 'shadow-black',
        iconBg: 'bg-gray-800 border border-gray-700',
        text: 'text-gray-200',
        textActive: 'text-gray-300',
        indicator: 'bg-gray-400',
      },
    };
    return colorMap[color] || colorMap.blue;
  };

  const controls = [
    {
      name: "ai",
      label: "AI Detection",
      icon: Brain,
      color: "blue",
      description: "Object detection & analysis"
    },
    {
      name: "gas",
      label: "Gas Sensor",
      icon: Wind,
      color: "blue",
      description: "Air quality monitoring"
    },
    {
      name: "thermal",
      label: "Thermal IR",
      icon: Flame,
      color: "blue",
      description: "Heat signature detection"
    }
  ];

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-4 bg-red-900/50 border border-red-500/30 text-red-300 rounded-lg text-sm font-medium backdrop-blur-sm">
          ⚠️ {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {controls.map((control) => {
          const Icon = control.icon;
          const isActive = overlay[control.name];
          const isLoading = loading[control.name];
          const colors = getColorClasses(control.color);
          
          return (
            <button
              key={control.name}
              onClick={() => toggleOverlay(control.name)}
              disabled={isLoading}
              className={`
                relative overflow-hidden p-6 rounded-xl border-2 transition-all duration-300
                ${isActive 
                  ? `${colors.bg} ${colors.border} shadow-lg ${colors.shadow}` 
                  : 'bg-gray-800/50 border-gray-700 hover:border-gray-600 hover:shadow-md backdrop-blur-sm'
                }
                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {/* Active Indicator */}
              {isActive && (
                <div className={`absolute top-3 right-3 w-3 h-3 rounded-full ${colors.indicator} animate-pulse`} />
              )}

              <div className="flex items-start gap-4">
                <div className={`
                  p-3 rounded-lg transition-colors
                  ${isActive ? `${colors.iconBg} text-white` : 'bg-gray-100 text-gray-600'}
                `}>
                  <Icon className="w-6 h-6" />
                </div>
                
                <div className="flex-1 text-left">
                  <h3 className={`font-bold text-lg mb-1 ${isActive ? colors.text : 'text-gray-300'}`}>
                    {control.label}
                  </h3>
                  <p className="text-xs text-gray-400 mb-3">
                    {control.description}
                  </p>
                  <div className="flex items-center gap-2">
                    {isActive ? (
                      <Power className={`w-4 h-4 ${colors.textActive}`} />
                    ) : (
                      <PowerOff className="w-4 h-4 text-gray-500" />
                    )}
                    <span className={`text-xs font-bold uppercase ${isActive ? colors.textActive : 'text-gray-500'}`}>
                      {isLoading ? 'Loading...' : isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default OverlayControls;
