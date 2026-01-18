import React, { useState } from "react";
import CameraFeed from "../components/CameraFeed";
import OverlayControls from "../components/OverlayControls";
import DetectionDisplay from "../components/DetectionDisplay";
import SensorPanel from "../components/SensorPanel";
import { Activity, Camera, Brain, Wind, Flame } from 'lucide-react';

const PI_IP = "10.203.55.198";

const Dashboard = () => {
  const [overlayState, setOverlayState] = useState({
    ai: true,
    gas: false,
    thermal: false,
  });

  const handleOverlayChange = (newState) => {
    setOverlayState(newState);
  };

  return (
    <div className="space-y-6 min-h-screen bg-black p-4 text-gray-100">
      {/* Header */}
      <div className="bg-black border-b-4 border-gray-900 p-6 rounded-xl shadow-2xl border-gray-800">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-100 mb-2 flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl flex items-center justify-center shadow-lg">
                <Camera className="w-7 h-7 text-white" />
              </div>
              VIPER CONTROL HUD
            </h1>
            <p className="text-gray-400 text-sm font-medium">
              Real-time Surveillance & Monitoring System
            </p>
          </div>
          <div className="flex items-center gap-2 bg-green-900/50 border border-green-500/30 px-4 py-2 rounded-lg shadow-md">
            <Activity className="w-5 h-5 text-green-400 animate-pulse" />
            <span className="text-green-400 font-bold text-sm uppercase">SYSTEM ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Camera Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Camera Feed Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-200">
                <Camera className="w-5 h-5" />
                <h2 className="text-xl font-bold">Live Camera Feed</h2>
              </div>
            </div>
            <CameraFeed aiServer={PI_IP} />
          </div>

          {/* Overlay Controls */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-200">Sensor Overlay Controls</h2>
            <OverlayControls 
              aiServer={PI_IP} 
              onStateChange={handleOverlayChange}
            />
          </div>

          {/* Detection Display */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-200 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Detection Monitor
            </h2>
            <DetectionDisplay aiServer={PI_IP} />
          </div>
        </div>

        {/* Right Column - Sensors & Status */}
        <div className="space-y-6">
          {/* Sensor Panel */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-200">Environmental Sensors</h2>
            <SensorPanel aiServer={PI_IP} />
          </div>

          {/* Status Badges */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-200">System Status</h2>
            <div className="space-y-3">
              <div className={`p-4 rounded-xl border-2 transition-all ${
                overlayState.ai 
                  ? 'bg-gray-900 border-gray-800 shadow-md' 
                  : 'bg-black border-gray-900'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    overlayState.ai ? 'bg-gray-800 border border-gray-700' : 'bg-black border border-gray-900'
                  }`}>
                    <Brain className="w-5 h-5 text-gray-300" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${overlayState.ai ? 'bg-gray-400 animate-pulse' : 'bg-gray-700'}`} />
                      <span className={`font-bold text-sm ${overlayState.ai ? 'text-gray-200' : 'text-gray-500'}`}>
                        AI Detection
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {overlayState.ai ? 'Active - Object detection running' : 'Inactive'}
                    </p>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-xl border-2 transition-all ${
                overlayState.gas 
                  ? 'bg-gray-900 border-gray-800 shadow-md' 
                  : 'bg-black border-gray-900'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    overlayState.gas ? 'bg-gray-800 border border-gray-700' : 'bg-black border border-gray-900'
                  }`}>
                    <Wind className="w-5 h-5 text-gray-300" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${overlayState.gas ? 'bg-gray-400 animate-pulse' : 'bg-gray-700'}`} />
                      <span className={`font-bold text-sm ${overlayState.gas ? 'text-gray-200' : 'text-gray-500'}`}>
                        Gas Sensor
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {overlayState.gas ? 'Active - Air quality monitoring' : 'Inactive'}
                    </p>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-xl border-2 transition-all ${
                overlayState.thermal 
                  ? 'bg-gray-900 border-gray-800 shadow-md' 
                  : 'bg-black border-gray-900'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    overlayState.thermal ? 'bg-gray-800 border border-gray-700' : 'bg-black border border-gray-900'
                  }`}>
                    <Flame className="w-5 h-5 text-gray-300" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${overlayState.thermal ? 'bg-gray-400 animate-pulse' : 'bg-gray-700'}`} />
                      <span className={`font-bold text-sm ${overlayState.thermal ? 'text-gray-200' : 'text-gray-500'}`}>
                        Thermal IR
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {overlayState.thermal ? 'Active - Heat signature detection' : 'Inactive'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
