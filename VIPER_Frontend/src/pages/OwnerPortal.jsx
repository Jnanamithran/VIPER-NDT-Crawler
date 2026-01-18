import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { ref, onValue } from 'firebase/database';
import { auth, db } from '../firebase';
import CameraFeed from '../components/CameraFeed';
import DetectionDisplay from '../components/DetectionDisplay';
import SensorPanel from '../components/SensorPanel';
import OverlayControls from '../components/OverlayControls';
import {
  Home,
  Camera,
  Activity,
  AlertTriangle,
  Users,
  FileText,
  Settings,
  LogOut,
  Shield,
  Menu,
  X,
  Eye,
  BarChart3
} from 'lucide-react';

const PI_IP = "10.203.55.198";

const OwnerPortal = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [controllers, setControllers] = useState([]);
  const [overlayState, setOverlayState] = useState({
    ai: true,
    gas: false,
    thermal: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (!currentUser) {
        navigate('/login');
      }
    });

    if (user) {
      // Fetch controllers from Firebase
      const controllersRef = ref(db, 'controllers');
      const unsubscribeControllers = onValue(controllersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const controllersArray = Object.entries(data).map(([id, controller]) => ({
            id,
            ...controller,
            lastSeen: controller.lastSeen ? new Date(controller.lastSeen) : new Date()
          }));
          setControllers(controllersArray);
        } else {
          setControllers([]);
        }
      });

      return () => {
        unsubscribe();
        unsubscribeControllers();
      };
    }

    return () => unsubscribe();
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleOverlayChange = (newState) => {
    setOverlayState(newState);
  };

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'detections', icon: Eye, label: 'Detections' },
    { id: 'controllers', icon: Users, label: 'Controllers' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'reports', icon: FileText, label: 'Reports' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-800 border-t-gray-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 font-bold">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-black text-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-black border-r border-gray-900 text-white transition-all duration-300 flex flex-col shadow-2xl`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-900">
          <div className="flex items-center justify-between">
            {isSidebarOpen ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-lg font-black">VIPER NDT</h1>
                  <p className="text-xs text-gray-500">Owner Portal</p>
                </div>
              </div>
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-lg flex items-center justify-center mx-auto">
                <Shield className="w-6 h-6" />
              </div>
            )}
          </div>
        </div>

        {/* User Info */}
        {isSidebarOpen && (
          <div className="px-6 py-4 border-b border-gray-900">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Logged in as</p>
            <p className="text-sm font-bold text-gray-300 truncate">{user.email}</p>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 py-6 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 px-6 py-3 mb-1 w-full transition-all duration-200 ${
                  isActive
                    ? 'bg-gray-900 border-r-4 border-gray-700 text-white'
                    : 'text-gray-500 hover:bg-gray-900 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isSidebarOpen && (
                  <span className="font-semibold">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-gray-900">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span className="font-semibold">Logout</span>}
          </button>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3 top-6 w-6 h-6 bg-gray-900 border border-gray-800 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors"
        >
          {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-black">
        <div className="p-6">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="bg-black border-b-4 border-gray-900 p-6 rounded-xl border-gray-800">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h1 className="text-4xl font-black text-gray-100 mb-2 flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl flex items-center justify-center shadow-lg">
                        <Camera className="w-7 h-7 text-white" />
                      </div>
                      VIPER CONTROL HUD
                    </h1>
                    <p className="text-gray-500 text-sm font-medium">
                      Real-time Surveillance & Monitoring System
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 px-4 py-2 rounded-lg shadow-md">
                    <Activity className="w-5 h-5 text-gray-400 animate-pulse" />
                    <span className="text-gray-400 font-bold text-sm uppercase">SYSTEM ACTIVE</span>
                  </div>
                </div>
              </div>

              {/* Main Grid Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Camera Feed */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Camera Feed Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-200">
                        <Camera className="w-5 h-5" />
                        <h2 className="text-xl font-bold">Live Camera Feed</h2>
                      </div>
                    </div>
                    <CameraFeed aiServer={PI_IP} />
                  </div>

                  {/* Overlay Controls */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-200">Sensor Overlay Controls</h2>
                    <OverlayControls 
                      aiServer={PI_IP} 
                      onStateChange={handleOverlayChange}
                    />
                  </div>

                  {/* Detection Display */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-200 flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      Detection Monitor
                    </h2>
                    <DetectionDisplay aiServer={PI_IP} />
                  </div>
                </div>

                {/* Right Column - Sensors & Status */}
                <div className="space-y-6">
                  {/* Sensor Panel */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-200">Environmental Sensors</h2>
                    <SensorPanel aiServer={PI_IP} />
                  </div>

                  {/* System Status */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-200">System Status</h2>
                    <div className="space-y-3">
                      <div className={`p-4 rounded-xl border-2 transition-all ${
                        overlayState.ai 
                          ? 'bg-gray-900 border-gray-800 shadow-md' 
                          : 'bg-black border-gray-900'
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            overlayState.ai ? 'bg-gray-800 border border-gray-700' : 'bg-black border border-gray-900'
                          }`}>
                            <Activity className="w-5 h-5 text-gray-300" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${overlayState.ai ? 'bg-gray-400 animate-pulse' : 'bg-gray-700'}`} />
                              <span className={`font-bold text-sm ${overlayState.ai ? 'text-gray-200' : 'text-gray-500'}`}>
                                AI Detection
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {overlayState.ai ? 'Active' : 'Inactive'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className={`p-4 rounded-xl border-2 transition-all ${
                        overlayState.gas 
                          ? 'bg-gray-900 border-gray-800 shadow-md' 
                          : 'bg-black border-gray-900'
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            overlayState.gas ? 'bg-gray-800 border border-gray-700' : 'bg-black border border-gray-900'
                          }`}>
                            <Activity className="w-5 h-5 text-gray-300" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${overlayState.gas ? 'bg-gray-400 animate-pulse' : 'bg-gray-700'}`} />
                              <span className={`font-bold text-sm ${overlayState.gas ? 'text-gray-200' : 'text-gray-500'}`}>
                                Gas Sensor
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {overlayState.gas ? 'Active' : 'Inactive'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className={`p-4 rounded-xl border-2 transition-all ${
                        overlayState.thermal 
                          ? 'bg-gray-900 border-gray-800 shadow-md' 
                          : 'bg-black border-gray-900'
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            overlayState.thermal ? 'bg-gray-800 border border-gray-700' : 'bg-black border border-gray-900'
                          }`}>
                            <Activity className="w-5 h-5 text-gray-300" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${overlayState.thermal ? 'bg-gray-400 animate-pulse' : 'bg-gray-700'}`} />
                              <span className={`font-bold text-sm ${overlayState.thermal ? 'text-gray-200' : 'text-gray-500'}`}>
                                Thermal IR
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {overlayState.thermal ? 'Active' : 'Inactive'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Detections Tab - Focused view for owners */}
          {activeTab === 'detections' && (
            <div className="space-y-6">
              <div className="bg-black border-b-4 border-gray-900 p-6 rounded-xl border-gray-800">
                <h1 className="text-4xl font-black text-gray-100 mb-2 flex items-center gap-3">
                  <Eye className="w-10 h-10" />
                  Detection History
                </h1>
                <p className="text-gray-500 text-sm font-medium">
                  View all detected objects and anomalies
                </p>
              </div>
              <DetectionDisplay aiServer={PI_IP} />
            </div>
          )}

          {/* Controllers Tab */}
          {activeTab === 'controllers' && (
            <div className="space-y-6">
              <div className="bg-black border-b-4 border-gray-900 p-6 rounded-xl border-gray-800">
                <h1 className="text-4xl font-black text-gray-100 mb-2 flex items-center gap-3">
                  <Users className="w-10 h-10" />
                  Controllers
                </h1>
                <p className="text-gray-500 text-sm font-medium">
                  Monitor all VIPER controllers
                </p>
              </div>
              {controllers.length === 0 ? (
                <div className="bg-black border border-gray-900 rounded-xl p-12 text-center">
                  <Users className="w-16 h-16 text-gray-800 mx-auto mb-4" />
                  <p className="text-gray-500 font-bold">No controllers found</p>
                  <p className="text-gray-600 text-sm mt-2">Controllers will appear here when connected</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {controllers.map((controller) => (
                    <div key={controller.id} className="bg-black border border-gray-900 rounded-xl p-6 hover:border-gray-800 transition-colors">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            controller.status === 'online' ? 'bg-gray-900 border border-gray-800' : 'bg-black border border-gray-900'
                          }`}>
                            <Camera className="w-6 h-6 text-gray-300" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-200">{controller.name}</h3>
                            <p className="text-sm text-gray-500">{controller.location}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          controller.status === 'online' 
                            ? 'bg-gray-900 text-gray-300 border border-gray-800' 
                            : 'bg-black text-gray-600 border border-gray-900'
                        }`}>
                          {controller.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-gray-900 rounded-lg border border-gray-800">
                          <div className="text-2xl font-bold text-gray-200">{controller.detections || 0}</div>
                          <div className="text-xs text-gray-500 uppercase">Detections</div>
                        </div>
                        <div className="text-center p-3 bg-gray-900 rounded-lg border border-gray-800">
                          <div className="text-2xl font-bold text-gray-200">{controller.alerts || 0}</div>
                          <div className="text-xs text-gray-500 uppercase">Alerts</div>
                        </div>
                        <div className="text-center p-3 bg-gray-900 rounded-lg border border-gray-800">
                          <div className="text-xs text-gray-500 uppercase">Sensors</div>
                          <div className="flex gap-1 justify-center mt-1">
                            {controller.sensors?.ai && <span className="w-2 h-2 bg-gray-400 rounded-full"></span>}
                            {controller.sensors?.gas && <span className="w-2 h-2 bg-gray-400 rounded-full"></span>}
                            {controller.sensors?.thermal && <span className="w-2 h-2 bg-gray-400 rounded-full"></span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="bg-black border-b-4 border-gray-900 p-6 rounded-xl border-gray-800">
                <h1 className="text-4xl font-black text-gray-100 mb-2 flex items-center gap-3">
                  <BarChart3 className="w-10 h-10" />
                  Analytics
                </h1>
                <p className="text-gray-500 text-sm font-medium">
                  View detailed analytics and insights
                </p>
              </div>
              <div className="bg-black border border-gray-900 rounded-xl p-12 text-center">
                <BarChart3 className="w-16 h-16 text-gray-800 mx-auto mb-4" />
                <p className="text-gray-500 font-bold">Analytics Coming Soon</p>
                <p className="text-gray-600 text-sm mt-2">Detailed analytics will be available here</p>
              </div>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="bg-black border-b-4 border-gray-900 p-6 rounded-xl border-gray-800">
                <h1 className="text-4xl font-black text-gray-100 mb-2 flex items-center gap-3">
                  <FileText className="w-10 h-10" />
                  Reports
                </h1>
                <p className="text-gray-500 text-sm font-medium">
                  Generate and view inspection reports
                </p>
              </div>
              <div className="bg-black border border-gray-900 rounded-xl p-12 text-center">
                <FileText className="w-16 h-16 text-gray-800 mx-auto mb-4" />
                <p className="text-gray-500 font-bold">Reports Coming Soon</p>
                <p className="text-gray-600 text-sm mt-2">Report generation will be available here</p>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-black border-b-4 border-gray-900 p-6 rounded-xl border-gray-800">
                <h1 className="text-4xl font-black text-gray-100 mb-2 flex items-center gap-3">
                  <Settings className="w-10 h-10" />
                  Settings
                </h1>
                <p className="text-gray-500 text-sm font-medium">
                  Configure system settings
                </p>
              </div>
              <div className="bg-black border border-gray-900 rounded-xl p-12 text-center">
                <Settings className="w-16 h-16 text-gray-800 mx-auto mb-4" />
                <p className="text-gray-500 font-bold">Settings Coming Soon</p>
                <p className="text-gray-600 text-sm mt-2">Settings configuration will be available here</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default OwnerPortal;
