const TelemetryItem = ({ label, value, unit = '', status = 'normal' }) => {
  const statusColors = {
    normal: 'text-foreground',
    warning: 'text-warning',
    danger: 'text-destructive',
    success: 'text-success',
  };
  
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className={`font-mono font-bold ${statusColors[status]}`}>
        {value}
        {unit && <span className="text-muted-foreground text-xs ml-1">{unit}</span>}
      </span>
    </div>
  );
};

export default TelemetryItem;