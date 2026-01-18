import { AlertTriangle, Flame } from 'lucide-react';

const GasGauge = ({ value = 0, max = 100, label = "CH4", unit = "ppm" }) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  // Determine status based on value
  const getStatus = () => {
    if (percentage >= 80) return { color: 'bg-destructive', label: 'CRITICAL', glow: 'shadow-[0_0_15px_hsl(0,72%,51%)]' };
    if (percentage >= 50) return { color: 'bg-warning', label: 'WARNING', glow: 'shadow-[0_0_15px_hsl(38,92%,50%)]' };
    return { color: 'bg-success', label: 'NORMAL', glow: '' };
  };
  
  const status = getStatus();
  
  return (
    <div className="glass-card p-4 flex flex-col items-center min-w-[100px]">
      {/* Label */}
      <div className="flex items-center gap-2 mb-3">
        <Flame className="w-4 h-4 text-primary" />
        <span className="telemetry-label">{label}</span>
      </div>
      
      {/* Vertical Gauge */}
      <div className="relative w-8 h-40 bg-muted rounded-full overflow-hidden border border-border">
        {/* Warning zones */}
        <div className="absolute top-0 left-0 right-0 h-[20%] bg-destructive/20" />
        <div className="absolute top-[20%] left-0 right-0 h-[30%] bg-warning/20" />
        <div className="absolute top-[50%] left-0 right-0 h-[50%] bg-success/20" />
        
        {/* Fill */}
        <div 
          className={`absolute bottom-0 left-0 right-0 transition-all duration-500 ${status.color} ${status.glow}`}
          style={{ height: `${percentage}%` }}
        />
        
        {/* Tick marks */}
        {[0, 25, 50, 75, 100].map((tick) => (
          <div 
            key={tick}
            className="absolute left-0 right-0 h-px bg-border"
            style={{ bottom: `${tick}%` }}
          />
        ))}
      </div>
      
      {/* Value */}
      <div className="mt-3 text-center">
        <span className="telemetry-value text-lg">{value}</span>
        <span className="text-muted-foreground text-xs ml-1">{unit}</span>
      </div>
      
      {/* Status */}
      <div className={`mt-2 flex items-center gap-1 text-xs ${
        percentage >= 80 ? 'text-destructive' : 
        percentage >= 50 ? 'text-warning' : 'text-success'
      }`}>
        {percentage >= 50 && <AlertTriangle className="w-3 h-3" />}
        <span className="font-bold">{status.label}</span>
      </div>
    </div>
  );
};

export default GasGauge;