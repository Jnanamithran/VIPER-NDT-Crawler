import { useState, useEffect } from 'react';
import { useApi } from '../hooks/use-api';
import { Camera, Cpu, Crosshair, Thermometer, Wifi, ZapOff } from 'lucide-react';

const VideoFeed = () => {
  const { getFeedUrl, overlayState, setOverlay } = useApi();
  const [timestamp, setTimestamp] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimestamp(new Date().toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden border border-border">
      <img 
        src={getFeedUrl()} 
        alt="Video Feed" 
        className="w-full h-full object-cover"
        onLoad={() => setIsConnected(true)}
        onError={() => setIsConnected(false)}
      />

      {!isConnected && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center">
          <ZapOff className="w-16 h-16 text-destructive animate-pulse" />
          <p className="text-destructive mt-4">CONNECTION LOST</p>
          <p className="text-muted-foreground text-sm">Attempting to reconnect to AI server...</p>
        </div>
      )}
      
      {/* HUD Overlays */}
      {/* Top Left - Camera Info */}
      <div className="absolute top-4 left-4 flex items-center gap-3">
        <div className="flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded border border-primary/30">
          <Camera className="w-4 h-4 text-primary" />
          <span className="text-xs font-mono text-primary">HD 1080p</span>
        </div>
        <div 
          className={`flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded border ${overlayState.ai ? 'border-primary/30' : 'border-muted/30'} cursor-pointer`}
          onClick={() => setOverlay('ai', overlayState.ai ? 'off' : 'on')}
        >
          <Cpu className={`w-4 h-4 ${overlayState.ai ? 'text-primary' : 'text-muted-foreground'}`} />
          <span className={`text-xs font-mono ${overlayState.ai ? 'text-primary' : 'text-muted-foreground'}`}>AI {overlayState.ai ? 'ACTIVE' : 'INACTIVE'}</span>
        </div>
      </div>
      
      {/* Top Right - Timestamp */}
      <div className="absolute top-4 right-4 bg-black/60 px-3 py-1.5 rounded border border-border">
        <span className="text-xs font-mono text-muted-foreground">REC</span>
        <span className="text-xs font-mono text-destructive ml-2 animate-pulse">●</span>
        <span className="text-xs font-mono text-foreground ml-3">{timestamp}</span>
      </div>
      
      {/* Center crosshair */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Crosshair className="w-16 h-16 text-primary/40" strokeWidth={1} />
      </div>
      
      {/* Bottom Status Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/80 border-t border-border px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-success' : 'bg-destructive'} animate-pulse`} />
              <span className="text-xs font-mono text-muted-foreground">STREAM:</span>
              <span className={`text-xs font-mono ${isConnected ? 'text-primary' : 'text-destructive'}`}>{isConnected ? "ONLINE" : "OFFLINE"}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div 
              className={`flex items-center gap-2 cursor-pointer`}
              onClick={() => setOverlay('thermal', overlayState.thermal ? 'off' : 'on')}
            >
              <Thermometer className={`w-3 h-3 ${overlayState.thermal ? 'text-info' : 'text-muted-foreground'}`} />
              <span className={`text-xs font-mono ${overlayState.thermal ? 'text-info' : 'text-muted-foreground'}`}>IR OVERLAY</span>
            </div>
             <div 
              className={`flex items-center gap-2 cursor-pointer`}
              onClick={() => setOverlay('gas', overlayState.gas ? 'off' : 'on')}
            >
              <Thermometer className={`w-3 h-3 ${overlayState.gas ? 'text-warning' : 'text-muted-foreground'}`} />
              <span className={`text-xs font-mono ${overlayState.gas ? 'text-warning' : 'text-muted-foreground'}`}>GAS OVERLAY</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Corner brackets */}
      <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-primary/60" />
      <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-primary/60" />
      <div className="absolute bottom-12 left-2 w-8 h-8 border-b-2 border-l-2 border-primary/60" />
      <div className="absolute bottom-12 right-2 w-8 h-8 border-b-2 border-r-2 border-primary/60" />
    </div>
  );
};

export default VideoFeed;