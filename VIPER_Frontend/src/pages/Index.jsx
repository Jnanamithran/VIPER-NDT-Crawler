import {
  Brain,
  Thermometer,
  Battery,
  Wifi,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Radio
} from 'lucide-react';
import Navbar from '../components/Navbar';
import VideoFeed from '../components/VideoFeed';
import GasGauge from '../components/GasGauge';
import StatusCard from '../components/StatusCard';
import TelemetryItem from '../components/TelemetryItem';
import { useApi } from '../hooks/use-api';

const Index = () => {
  const { overlayState } = useApi();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 px-6 pb-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-12 bg-primary rounded-full" />
            <div>
              <h1 className="font-display text-2xl font-bold tracking-wider">
                VIPER CONTROL HUD
              </h1>
              <p className="text-muted-foreground text-sm">
                Real-time Surveillance Feed | Mission ID: VPR-2026-0117
              </p>
            </div>
          </div>
        </div>
        
        {/* Main Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Video Feed - Left Side */}
          <div className="col-span-9">
            <div className="aspect-video">
              <VideoFeed />
            </div>
            
            {/* Status Cards Below Video */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              {/* AI Detection Status */}
              <StatusCard 
                title="AI Detection" 
                icon={Brain} 
                status={overlayState.ai ? 'online' : 'offline'}
              >
                <TelemetryItem label="Active Model" value="YOLOv8-NDT" />
                <p className="text-xs text-muted-foreground mt-3">No detection data available.</p>
              </StatusCard>
              
              {/* Thermal IR Status */}
              <StatusCard 
                title="Thermal IR" 
                icon={Thermometer} 
                status={overlayState.thermal ? 'online' : 'offline'}
              >
                <TelemetryItem label="Sensor" value="MLX90640" />
                 <p className="text-xs text-muted-foreground mt-3">No thermal data available.</p>
              </StatusCard>
              
              {/* System Status */}
              <StatusCard 
                title="System Status" 
                icon={Zap} 
                status="online"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Battery className="w-4 h-4 text-success" />
                      <span className="text-xs text-muted-foreground">BATTERY</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full w-3/4 bg-success rounded-full" />
                      </div>
                      <span className="text-xs font-bold text-success">78%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wifi className="w-4 h-4 text-success" />
                      <span className="text-xs text-muted-foreground">SIGNAL</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full w-[92%] bg-success rounded-full" />
                      </div>
                      <span className="text-xs font-bold text-success">-42dBm</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Radio className="w-4 h-4 text-primary" />
                      <span className="text-xs text-muted-foreground">FLASK API</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                      <span className="text-xs font-bold text-success">CONNECTED</span>
                    </div>
                  </div>
                </div>
              </StatusCard>
            </div>
          </div>
          
          {/* Right Sidebar - Gas Gauges */}
          <div className="col-span-3 space-y-4">
            <div className="glass-card-glow p-4">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-primary" />
                <h3 className="font-display text-sm tracking-wider">GAS SENSORS</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <GasGauge value={0} max={100} label="CH4" unit="ppm" />
                <GasGauge value={0} max={100} label="CO" unit="ppm" />
              </div>
            </div>
            
            {/* Environmental Telemetry */}
            <div className="glass-card p-4">
              <h3 className="font-display text-sm tracking-wider mb-4">ENVIRONMENT</h3>
              <div className="space-y-3">
                <TelemetryItem label="Ambient Temp" value="--.-" unit="°C" />
                <TelemetryItem label="Humidity" value="--" unit="%" />
                <TelemetryItem label="Pressure" value="----" unit="hPa" />
                <TelemetryItem label="Depth" value="--.-" unit="m" />
              </div>
            </div>
            
            {/* Robot Telemetry */}
            <div className="glass-card p-4">
              <h3 className="font-display text-sm tracking-wider mb-4">ROBOT STATUS</h3>
              <div className="space-y-3">
                <TelemetryItem label="Speed" value="-.-" unit="m/s" />
                <TelemetryItem label="Distance" value="--.-" unit="m" />
                <TelemetryItem label="Runtime" value="--:--:--" />
                <TelemetryItem label="CPU Temp" value="--" unit="°C" status="success" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;