import React from 'react';
import { Camera, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';

const ControllerCard = ({ controller }) => {
  const getStatusColorClasses = (status) => {
    switch (status) {
      case 'online': return {
        gradient: 'from-green-500 to-green-600',
        indicator: 'bg-green-500',
        icon: 'text-green-500',
        badge: 'bg-green-100 text-green-700',
      };
      case 'offline': return {
        gradient: 'from-red-500 to-red-600',
        indicator: 'bg-red-500',
        icon: 'text-red-500',
        badge: 'bg-red-100 text-red-700',
      };
      case 'warning': return {
        gradient: 'from-yellow-500 to-yellow-600',
        indicator: 'bg-yellow-500',
        icon: 'text-yellow-500',
        badge: 'bg-yellow-100 text-yellow-700',
      };
      default: return {
        gradient: 'from-gray-500 to-gray-600',
        indicator: 'bg-gray-500',
        icon: 'text-gray-500',
        badge: 'bg-gray-100 text-gray-700',
      };
    }
  };

  const formatLastSeen = (date) => {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const statusColors = getStatusColorClasses(controller.status);

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6 hover:shadow-xl transition-all hover:-translate-y-1 duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 bg-gradient-to-br ${statusColors.gradient} rounded-lg flex items-center justify-center shadow-lg`}>
            <Camera className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">{controller.name}</h3>
            <p className="text-sm text-gray-500">{controller.location}</p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          {controller.status === 'online' ? (
            <div className={`w-3 h-3 ${statusColors.indicator} rounded-full animate-pulse`} />
          ) : (
            <XCircle className={`w-5 h-5 ${statusColors.icon}`} />
          )}
          <span className={`px-3 py-1 ${statusColors.badge} rounded-full text-xs font-bold uppercase`}>
            {controller.status}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">{controller.detections}</div>
          <div className="text-xs text-gray-600 uppercase font-semibold">Detections</div>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
          <div className="text-2xl font-bold text-orange-600">{controller.alerts}</div>
          <div className="text-xs text-gray-600 uppercase font-semibold">Alerts</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-center gap-1 text-sm text-gray-700">
            <Clock className="w-4 h-4" />
            <span className="font-bold">{formatLastSeen(controller.lastSeen)}</span>
          </div>
          <div className="text-xs text-gray-600 uppercase font-semibold">Last Seen</div>
        </div>
      </div>

      {/* Sensors Status */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-gray-600 uppercase tracking-wider font-bold">Sensors</p>
          <TrendingUp className="w-4 h-4 text-green-500" />
        </div>
        <div className="flex gap-2 flex-wrap">
          <span className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
            controller.sensors.ai
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-400'
          }`}>
            🧠 AI
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
            controller.sensors.gas
              ? 'bg-emerald-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-400'
          }`}>
            💨 Gas
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
            controller.sensors.thermal
              ? 'bg-orange-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-400'
          }`}>
            🔥 Thermal
          </span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-4 pt-4 border-t flex gap-2">
        <button className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors">
          View Details
        </button>
        <button className="flex-1 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white text-xs font-bold rounded-lg transition-colors">
          Configure
        </button>
      </div>
    </div>
  );
};

export default ControllerCard;
