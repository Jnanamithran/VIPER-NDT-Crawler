import React, { useState, useEffect } from "react";
import { AlertTriangle, Package, User, Car, Dog, Briefcase, ShoppingBag, Clock } from 'lucide-react';

const DetectionDisplay = ({ aiServer = "10.203.55.198" }) => {
  const [detections, setDetections] = useState([]);
  const [stats, setStats] = useState({
    people: 0,
    vehicles: 0,
    packages: 0,
    alerts: 0
  });

  // Real data will come from API/WebSocket
  useEffect(() => {
    // Initialize with empty state - data will be populated from API
    setDetections([]);
    setStats({
      people: 0,
      vehicles: 0,
      packages: 0,
      alerts: 0
    });
    
    // TODO: Connect to real API endpoint
    // fetch(`${aiServer}/api/detections`)...
  }, []);

  const getIconForType = (type) => {
    const icons = {
      person: User,
      car: Car,
      package: Package,
      dog: Dog,
      briefcase: Briefcase,
      bag: ShoppingBag,
    };
    return icons[type] || Package;
  };

  const getColorClasses = (type) => {
    // Pure black/gray theme for all detection types
    const colorMap = {
      person: {
        bg: 'bg-gray-900',
        border: 'border-gray-800',
        iconBg: 'bg-gray-800 border border-gray-700',
        text: 'text-gray-200',
        textSecondary: 'text-gray-400',
      },
      car: {
        bg: 'bg-gray-900',
        border: 'border-gray-800',
        iconBg: 'bg-gray-800 border border-gray-700',
        text: 'text-gray-200',
        textSecondary: 'text-gray-400',
      },
      package: {
        bg: 'bg-gray-900',
        border: 'border-gray-800',
        iconBg: 'bg-gray-800 border border-gray-700',
        text: 'text-gray-200',
        textSecondary: 'text-gray-400',
      },
      dog: {
        bg: 'bg-gray-900',
        border: 'border-gray-800',
        iconBg: 'bg-gray-800 border border-gray-700',
        text: 'text-gray-200',
        textSecondary: 'text-gray-400',
      },
      briefcase: {
        bg: 'bg-gray-900',
        border: 'border-gray-800',
        iconBg: 'bg-gray-800 border border-gray-700',
        text: 'text-gray-200',
        textSecondary: 'text-gray-400',
      },
      bag: {
        bg: 'bg-gray-900',
        border: 'border-gray-800',
        iconBg: 'bg-gray-800 border border-gray-700',
        text: 'text-gray-200',
        textSecondary: 'text-gray-400',
      },
    };
    return colorMap[type] || {
      bg: 'bg-black',
      border: 'border-gray-900',
      iconBg: 'bg-gray-900 border border-gray-800',
      text: 'text-gray-300',
      textSecondary: 'text-gray-500',
    };
  };

  return (
    <div className="space-y-6">
      {/* Active Detections */}
      <div className="bg-black border-2 border-gray-900 rounded-xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-200 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-gray-400" />
            Active Detections
          </h2>
          <span className="bg-gray-900 border border-gray-800 text-gray-300 px-3 py-1 rounded-full text-xs font-bold">
            {detections.length} ACTIVE
          </span>
        </div>

        <div className="space-y-3">
          {detections.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No objects detected</p>
              <p className="text-sm">Monitoring active...</p>
            </div>
          ) : (
            detections.map((detection) => {
              const Icon = getIconForType(detection.type);
              const colors = getColorClasses(detection.type);
              
              return (
                <div
                  key={detection.id}
                  className={`flex items-center justify-between p-4 ${colors.bg} border ${colors.border} rounded-lg hover:shadow-lg transition-shadow backdrop-blur-sm`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 ${colors.iconBg} text-white rounded-lg shadow-md`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-200 capitalize">
                        {detection.type}
                      </h3>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" />
                        Detected {new Date(detection.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${colors.text}`}>
                      {(detection.confidence * 100).toFixed(0)}%
                    </div>
                    <div className="text-xs text-gray-400">confidence</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Detection Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-black to-gray-900 border border-gray-800 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <User className="w-8 h-8 mb-2 opacity-80" />
          <div className="text-3xl font-bold">{stats.people}</div>
          <div className="text-xs opacity-80 uppercase tracking-wider">People Today</div>
        </div>
        
        <div className="bg-gradient-to-br from-black to-gray-900 border border-gray-800 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <Car className="w-8 h-8 mb-2 opacity-80" />
          <div className="text-3xl font-bold">{stats.vehicles}</div>
          <div className="text-xs opacity-80 uppercase tracking-wider">Vehicles Today</div>
        </div>
        
        <div className="bg-gradient-to-br from-black to-gray-900 border border-gray-800 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <Package className="w-8 h-8 mb-2 opacity-80" />
          <div className="text-3xl font-bold">{stats.packages}</div>
          <div className="text-xs opacity-80 uppercase tracking-wider">Packages Today</div>
        </div>
        
        <div className="bg-gradient-to-br from-black to-gray-900 border border-gray-800 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <AlertTriangle className="w-8 h-8 mb-2 opacity-80" />
          <div className="text-3xl font-bold">{stats.alerts}</div>
          <div className="text-xs opacity-80 uppercase tracking-wider">Alerts Today</div>
        </div>
      </div>
    </div>
  );
};

export default DetectionDisplay;
