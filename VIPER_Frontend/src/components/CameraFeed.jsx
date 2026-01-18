import React, { useEffect, useState, useRef } from "react";
import { Camera, Wifi, WifiOff } from 'lucide-react';

const CameraFeed = ({ aiServer = "10.203.55.198", onDetection }) => {
  const imgRef = useRef(null);
  const [error, setError] = useState("");
  const [frameCount, setFrameCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  const FRAME_URL = `http://${aiServer}:5001/frame`;

  useEffect(() => {
    const interval = setInterval(() => {
      if (imgRef.current) {
        imgRef.current.src = `${FRAME_URL}?t=${Date.now()}`;
        setFrameCount(c => c + 1);
        setLastUpdate(Date.now());
      }
    }, 150);

    return () => clearInterval(interval);
  }, [FRAME_URL]);

  useEffect(() => {
    const checkConnection = setInterval(() => {
      const timeSinceUpdate = Date.now() - lastUpdate;
      setIsConnected(timeSinceUpdate < 1000);
    }, 500);

    return () => clearInterval(checkConnection);
  }, [lastUpdate]);

  const handleImageLoad = () => {
    setError("");
    setIsConnected(true);
  };

  const handleImageError = () => {
    setError("Camera feed unavailable");
    setIsConnected(false);
  };

  return (
    <div className="relative">
      {/* Connection Status */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-2 rounded-lg">
        {isConnected ? (
          <>
            <Wifi className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-xs font-bold">LIVE</span>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4 text-red-400" />
            <span className="text-red-400 text-xs font-bold">OFFLINE</span>
          </>
        )}
      </div>

      {/* Frame Counter */}
      <div className="absolute bottom-4 right-4 z-10 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-lg">
        <span className="text-white text-xs font-mono">
          <Camera className="w-3 h-3 inline mr-1" />
          {frameCount} frames
        </span>
      </div>

      {/* Video Feed */}
      <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-gray-700 rounded-xl overflow-hidden shadow-2xl">
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/90 backdrop-blur-sm">
            <div className="text-center">
              <WifiOff className="w-12 h-12 text-red-400 mx-auto mb-3" />
              <p className="text-red-400 font-bold">{error}</p>
              <p className="text-gray-400 text-sm mt-2">Attempting to reconnect...</p>
            </div>
          </div>
        )}
        
        <img
          ref={imgRef}
          className="w-full h-full object-cover"
          alt="VIPER AI Feed"
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      </div>
    </div>
  );
};

export default CameraFeed;
