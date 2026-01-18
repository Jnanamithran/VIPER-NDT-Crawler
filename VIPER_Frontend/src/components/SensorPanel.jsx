import React, { useState, useEffect } from "react";
import { Droplets, Thermometer, Wind } from 'lucide-react';

const SensorPanel = ({ aiServer = "10.203.55.198" }) => {
  const [sensors, setSensors] = useState({
    gas: { value: 0, unit: 'ppm', status: 'normal' },
    thermal: { value: 0, unit: '°C', status: 'normal' },
    humidity: { value: 0, unit: '%', status: 'normal' }
  });

  useEffect(() => {
    // Real sensor data will come from API
    // Initialize with zero values - data will be populated from API
    setSensors({
      gas: { value: 0, unit: 'ppm', status: 'normal' },
      thermal: { value: 0, unit: '°C', status: 'normal' },
      humidity: { value: 0, unit: '%', status: 'normal' }
    });
    
    // TODO: Connect to real API endpoint for sensor data
    // const interval = setInterval(async () => {
    //   const response = await fetch(`${aiServer}/api/sensors`);
    //   const data = await response.json();
    //   setSensors(data);
    // }, 2000);
    // return () => clearInterval(interval);
  }, []);

  const getSensorColorClass = (status) => {
    switch (status) {
      case 'danger': return 'bg-red-400';
      case 'warning': return 'bg-yellow-400';
      default: return 'bg-green-400';
    }
  };

  const sensorConfig = [
    {
      key: 'gas',
      label: 'Gas Sensor',
      icon: Wind,
      gradient: 'from-black to-gray-900'
    },
    {
      key: 'thermal',
      label: 'Temperature',
      icon: Thermometer,
      gradient: 'from-black to-gray-900'
    },
    {
      key: 'humidity',
      label: 'Humidity',
      icon: Droplets,
      gradient: 'from-black to-gray-900'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {sensorConfig.map((config) => {
        const sensor = sensors[config.key];
        const Icon = config.icon;
        const statusColorClass = getSensorColorClass(sensor.status);

        return (
          <div
            key={config.key}
            className={`relative overflow-hidden bg-gradient-to-br ${config.gradient} text-white rounded-xl shadow-lg p-6`}
          >
            {/* Status Indicator */}
            <div className={`absolute top-4 right-4 w-3 h-3 rounded-full ${statusColorClass} animate-pulse`} />

            {/* Icon */}
            <div className="mb-4">
              <Icon className="w-10 h-10 opacity-80" />
            </div>

            {/* Label */}
            <div className="text-sm opacity-80 uppercase tracking-wider mb-2">
              {config.label}
            </div>

            {/* Value */}
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">
                {sensor.value}
              </span>
              <span className="text-xl opacity-80">
                {sensor.unit}
              </span>
            </div>

            {/* Status */}
            <div className="mt-3 text-xs uppercase tracking-wider opacity-80">
              Status: {sensor.status}
            </div>

            {/* Decorative Background */}
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white opacity-10 rounded-full" />
          </div>
        );
      })}
    </div>
  );
};

export default SensorPanel;
