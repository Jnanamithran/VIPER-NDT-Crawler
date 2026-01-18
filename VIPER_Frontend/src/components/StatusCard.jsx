const StatusCard = ({ 
  title, 
  icon: Icon, 
  status = 'online', 
  children,
  className = '' 
}) => {
  const statusColors = {
    online: { dot: 'status-online', text: 'text-success' },
    warning: { dot: 'status-warning', text: 'text-warning' },
    danger: { dot: 'status-danger', text: 'text-destructive' },
    offline: { dot: 'bg-muted-foreground', text: 'text-muted-foreground' },
  };
  
  const statusConfig = statusColors[status] || statusColors.online;
  
  return (
    <div className={`glass-card p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon className="w-4 h-4 text-primary" />
            </div>
          )}
          <h3 className="font-display text-sm tracking-wider text-foreground uppercase">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className={`status-dot ${statusConfig.dot}`} />
          <span className={`text-xs uppercase tracking-wider ${statusConfig.text}`}>
            {status}
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
};

export default StatusCard;