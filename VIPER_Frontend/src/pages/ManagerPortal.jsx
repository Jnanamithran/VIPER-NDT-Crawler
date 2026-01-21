import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import {
  Home,
  Eye,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Activity,
  Wind,
  Thermometer
} from 'lucide-react';
import ManagerDetections from '../components/ManagerDetections';
import ManagerAnalytics from '../components/ManagerAnalytics';

const ManagerPortal = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeNav, setActiveNav] = useState('dashboard');

  // Redirect to login if user logs out
  useEffect(() => {
    if (!user) {
      navigate('/manager', { replace: true });
    }
  }, [user, navigate]);

  // If no user, don't render anything - let useEffect redirect
  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // useEffect will handle the redirect when user state updates
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'detections', label: 'Detections', icon: Eye },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-card border-r border-border transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-primary-foreground font-bold text-sm">V</span>
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="font-display font-bold text-sm">VIPER NDT</h1>
                <p className="text-xs text-muted-foreground">Manager Portal</p>
              </div>
            )}
          </div>
        </div>

        {/* User Info */}
        {sidebarOpen && (
          <div className="p-6 border-b border-border">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Logged in as</p>
            <p className="text-sm font-mono text-foreground truncate">{user.email}</p>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
                title={item.label}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-success rounded-full animate-pulse" />
            <span className="text-sm font-medium text-success">SYSTEM ACTIVE</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          {activeNav === 'dashboard' && (
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h1 className="font-display text-3xl font-bold tracking-wider mb-2">
                  VIPER CONTROL HUD
                </h1>
                <p className="text-muted-foreground">
                  Real-time Surveillance & Monitoring System
                </p>
              </div>

              {/* Main Grid */}
              <div className="grid grid-cols-3 gap-6">
                {/* Camera Feed Section */}
                <div className="col-span-2">
                  <div className="glass-card-glow p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Eye className="w-5 h-5 text-primary" />
                      <h2 className="font-display text-lg font-bold tracking-wider">Live Camera Feed</h2>
                    </div>
                    <div className="aspect-video bg-black/50 rounded-lg border border-border flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-12 h-12 mx-auto mb-3 opacity-50">
                          <Eye className="w-full h-full text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground mb-1">Camera Feed Unavailable</p>
                        <p className="text-xs text-muted-foreground">Connect backend to view stream</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                  {/* Environmental Sensors */}
                  <div className="glass-card p-4">
                    <h3 className="font-display text-sm font-bold tracking-wider mb-4">
                      Environmental Sensors
                    </h3>
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-muted/30 border border-border">
                        <div className="flex items-center gap-2 mb-2">
                          <Wind className="w-4 h-4 text-primary" />
                          <span className="text-xs text-muted-foreground uppercase">Gas Sensor</span>
                        </div>
                        <p className="text-lg font-mono text-foreground">— ppm</p>
                        <p className="text-xs text-muted-foreground">STATUS: —</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/30 border border-border">
                        <div className="flex items-center gap-2 mb-2">
                          <Thermometer className="w-4 h-4 text-primary" />
                          <span className="text-xs text-muted-foreground uppercase">Temperature</span>
                        </div>
                        <p className="text-lg font-mono text-foreground">— °C</p>
                        <p className="text-xs text-muted-foreground">STATUS: —</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/30 border border-border">
                        <div className="flex items-center gap-2 mb-2">
                          <Activity className="w-4 h-4 text-primary" />
                          <span className="text-xs text-muted-foreground uppercase">Humidity</span>
                        </div>
                        <p className="text-lg font-mono text-foreground">— %</p>
                        <p className="text-xs text-muted-foreground">STATUS: —</p>
                      </div>
                    </div>
                  </div>

                  {/* System Status */}
                  <div className="glass-card p-4">
                    <h3 className="font-display text-sm font-bold tracking-wider mb-4">
                      System Status
                    </h3>
                    <div className="space-y-2">
                      <div className="p-3 rounded-lg bg-muted/30 border border-border hover:border-primary/50 transition-colors">
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground uppercase">AI Detection</span>
                          <span className="ml-auto text-xs text-muted-foreground">—</span>
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/30 border border-border hover:border-primary/50 transition-colors">
                        <div className="flex items-center gap-2">
                          <Wind className="w-4 h-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground uppercase">Gas Sensor</span>
                          <span className="ml-auto text-xs text-muted-foreground">—</span>
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/30 border border-border hover:border-primary/50 transition-colors">
                        <div className="flex items-center gap-2">
                          <Thermometer className="w-4 h-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground uppercase">Thermal IR</span>
                          <span className="ml-auto text-xs text-muted-foreground">—</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sensor Overlay Controls */}
              <div>
                <h2 className="font-display text-lg font-bold tracking-wider mb-4">
                  Sensor Overlay Controls
                </h2>
                <div className="grid grid-cols-3 gap-6">
                  {[
                    {
                      icon: Activity,
                      label: 'AI Detection',
                      description: 'Object detection & analysis',
                    },
                    {
                      icon: Wind,
                      label: 'Gas Sensor',
                      description: 'Air quality monitoring',
                    },
                    {
                      icon: Thermometer,
                      label: 'Thermal IR',
                      description: 'Heat signature detection',
                    },
                  ].map((control, idx) => {
                    const Icon = control.icon;
                    return (
                      <div key={idx} className="glass-card p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="p-3 rounded-lg bg-muted/50 border border-border">
                            <Icon className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-display font-bold text-sm">{control.label}</h3>
                            <p className="text-xs text-muted-foreground">{control.description}</p>
                          </div>
                        </div>
                        <button className="w-full py-2 px-3 rounded-lg bg-muted/30 border border-border text-muted-foreground hover:bg-muted/50 transition-colors text-xs font-bold uppercase">
                          Inactive
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeNav === 'detections' && (
            <ManagerDetections />
          )}

          {activeNav === 'analytics' && (
            <ManagerAnalytics />
          )}

          {activeNav === 'settings' && (
            <div className="text-center py-12">
              <Settings className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
              <h2 className="text-xl font-display font-bold mb-2">Settings</h2>
              <p className="text-muted-foreground">System settings will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerPortal;
