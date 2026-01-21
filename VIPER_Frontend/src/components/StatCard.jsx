import React from 'react';

const StatCard = ({ icon: Icon, value, label, gradient, trend }) => {
  return (
    <div className={`bg-gradient-to-br ${gradient} text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 duration-200`}>
      {/* Icon */}
      <div className="mb-3">
        <Icon className="w-8 h-8 opacity-80" />
      </div>

      {/* Value */}
      <div className="text-3xl font-bold mb-1">{value}</div>

      {/* Label */}
      <div className="text-sm opacity-80 uppercase tracking-wider mb-2">
        {label}
      </div>

      {/* Trend (Optional) */}
      {trend && (
        <div className="flex items-center gap-2 text-xs opacity-90">
          {trend.icon && <trend.icon className="w-4 h-4" />}
          <span>{trend.text}</span>
        </div>
      )}

      {/* Decorative Background Element */}
      <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white opacity-10 rounded-full pointer-events-none" />
    </div>
  );
};

export default StatCard;
