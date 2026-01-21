import { useState, useEffect } from 'react';
import { AlertCircle, Clock, Search } from 'lucide-react';
import { fetchDetectionHistory } from '../services/api';

const ManagerDetections = () => {
  const [detections, setDetections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        const history = await fetchDetectionHistory();
        
        if (history && history.length > 0) {
          const formattedDetections = history.map((item, index) => ({
            id: index + 1,
            type: item.label || 'Unknown',
            timestamp: item.time || '00:00:00',
            date: item.date || '',
            severity: item.confidence > 85 ? 'high' : item.confidence > 70 ? 'medium' : 'low',
            confidence: Math.round(item.confidence),
            image: item.image,
          })).reverse();
          
          setDetections(formattedDetections);
          
          if (history.length > 0) {
            setLastUpdated(history[history.length - 1].time || 'Unknown');
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading detection history:', error);
        setLoading(false);
      }
    };
    
    loadHistory();
    const interval = setInterval(loadHistory, 10000);
    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-destructive bg-destructive/10 border-destructive/30';
      case 'medium': return 'text-warning bg-warning/10 border-warning/30';
      case 'low': return 'text-success bg-success/10 border-success/30';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  const filteredDetections = detections.filter(detection => {
    const matchesSearch = detection.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || detection.severity === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold tracking-wider mb-2">
          Detection History
        </h1>
        <p className="text-muted-foreground">
          View all detected defects and anomalies
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by defect type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
        
        <div className="flex gap-2">
          {['all', 'high', 'medium', 'low'].map((severity) => (
            <button
              key={severity}
              onClick={() => setFilter(severity)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                filter === severity
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted'
              }`}
            >
              {severity === 'all' ? 'All' : severity}
            </button>
          ))}
        </div>
      </div>

      {/* Detections Table */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-primary" />
            <h3 className="font-display text-sm tracking-wider uppercase">
              Recent Detections ({filteredDetections.length})
            </h3>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="text-xs">{loading ? 'Loading...' : `Last updated: ${lastUpdated || 'Unknown'}`}</span>
          </div>
        </div>

        {filteredDetections.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
            <p className="text-muted-foreground">
              {searchTerm || filter !== 'all' ? 'No detections match your filters' : 'No detections recorded yet'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-xs font-display uppercase tracking-wider text-muted-foreground">ID</th>
                  <th className="text-left py-3 px-4 text-xs font-display uppercase tracking-wider text-muted-foreground">Defect Type</th>
                  <th className="text-left py-3 px-4 text-xs font-display uppercase tracking-wider text-muted-foreground">Date</th>
                  <th className="text-left py-3 px-4 text-xs font-display uppercase tracking-wider text-muted-foreground">Time</th>
                  <th className="text-left py-3 px-4 text-xs font-display uppercase tracking-wider text-muted-foreground">Severity</th>
                  <th className="text-left py-3 px-4 text-xs font-display uppercase tracking-wider text-muted-foreground">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {filteredDetections.map((detection) => (
                  <tr key={detection.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-mono text-sm text-muted-foreground">#{detection.id.toString().padStart(4, '0')}</td>
                    <td className="py-3 px-4"><span className="font-mono text-sm text-foreground">{detection.type}</span></td>
                    <td className="py-3 px-4 font-mono text-sm text-muted-foreground">{detection.date}</td>
                    <td className="py-3 px-4 font-mono text-sm text-muted-foreground">{detection.timestamp}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase border ${getSeverityColor(detection.severity)}`}>
                        {detection.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${detection.confidence}%` }} />
                        </div>
                        <span className="font-mono text-sm text-primary">{detection.confidence}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerDetections;
