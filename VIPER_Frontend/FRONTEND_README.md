# VIPER NDT Crawler - Frontend Documentation

## 🎯 Overview

The VIPER NDT Crawler frontend is a comprehensive React-based web application for real-time surveillance monitoring, AI-powered object detection, and environmental sensor tracking.

## 🏗️ Architecture

### Component Structure

```
src/
├── components/           # Reusable UI components
│   ├── CameraFeed.jsx           # Live camera stream with connection status
│   ├── OverlayControls.jsx      # AI/Gas/Thermal sensor toggle controls
│   ├── DetectionDisplay.jsx     # Real-time detection visualization
│   ├── SensorPanel.jsx          # Environmental sensor dashboard
│   ├── ControllerCard.jsx       # Controller status card
│   ├── StatCard.jsx             # Reusable statistics card
│   ├── Layout.jsx               # Main application layout
│   ├── LoginForm.jsx            # Login form component
│   └── ProtectedRoute.jsx       # Route protection wrapper
│
├── pages/                # Page components
│   ├── Dashboard.jsx            # Main controller HUD
│   ├── Analytics.jsx            # Analytics and reporting
│   ├── Login.jsx                # Authentication page
│   ├── OwnerPortal.jsx          # Owner dashboard
│   └── manager/                 # Manager portal pages
│       ├── ManagerDashboard.jsx # Manager layout with sidebar
│       ├── Home.jsx             # Manager overview
│       ├── UserManagement.jsx   # Controller management
│       ├── Appointments.jsx     # Appointment scheduling
│       ├── Reports.jsx          # Report generation
│       └── Settings.jsx         # System settings
│
├── firebase.js           # Firebase configuration
├── App.jsx              # Main app router
└── main.jsx             # Application entry point
```

## 📱 Pages Overview

### 1. **Dashboard (Controller View)**
Main control interface for operators.

**Features:**
- Live camera feed with RTSP streaming
- AI overlay toggle (YOLOv8 object detection)
- Gas sensor monitoring
- Thermal IR overlay control
- Real-time detection display
- Environmental sensor panel
- System status indicators

**URL:** `/`

---

### 2. **Analytics Page**
Comprehensive analytics and reporting dashboard.

**Features:**
- Detection trend charts (Chart.js)
- Object type distribution (Doughnut chart)
- Weekly activity analysis (Bar chart)
- Key performance metrics
- Recent detection history table
- Time range filtering (24h, 7d, 30d)

**URL:** `/analytics`

---

### 3. **Login Page**
Firebase authentication for manager access.

**Features:**
- Email/password authentication
- Modern gradient design
- Error handling
- Test credentials display
- Animated background

**URL:** `/login`

**Test Credentials:**
- Email: `admin@viper.ai`
- Password: `password123`

---

### 4. **Manager Dashboard**
Administrative portal for managing controllers.

**Features:**
- Collapsible sidebar navigation
- Controller status overview
- Real-time statistics
- Multi-controller monitoring
- Sensor activity tracking
- Quick actions

**URL:** `/manager/home`

**Sub-pages:**
- `/manager/users` - Controller management
- `/manager/appointments` - Scheduling
- `/manager/reports` - Report generation
- `/manager/settings` - System configuration

---

## 🧩 Component Details

### CameraFeed Component
**Purpose:** Displays live RTSP stream from AI server

**Props:**
- `aiServer` (string): IP address of AI server
- `onDetection` (function): Callback for detection events

**Features:**
- Real-time frame polling (150ms interval)
- Connection status indicator
- Frame counter
- Auto-reconnection on errors

---

### OverlayControls Component
**Purpose:** Toggle AI, Gas, and Thermal overlays

**Props:**
- `aiServer` (string): AI server IP
- `onStateChange` (function): State change callback

**Features:**
- Three sensor toggles (AI, Gas, Thermal)
- Loading states
- Error handling
- Visual active indicators

**API Endpoints:**
- GET `/overlay` - Fetch current state
- POST `/overlay/{name}/{action}` - Toggle overlay

---

### DetectionDisplay Component
**Purpose:** Shows active detections and statistics

**Features:**
- Live detection list
- Confidence percentages
- Detection type icons
- Daily summary counters
- Color-coded status

---

### SensorPanel Component
**Purpose:** Environmental sensor monitoring

**Sensors:**
- Gas (PPM)
- Temperature (°C)
- Humidity (%)

**Features:**
- Real-time data updates
- Status indicators
- Gradient backgrounds
- Animated pulse effects

---

## 🔥 Firebase Integration

### Configuration
File: `src/firebase.js`

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyA3qMpasv0qmPXwGPDCYWzR_avvwyr79nc",
  authDomain: "viper-ndt.firebaseapp.com",
  databaseURL: "https://viper-ndt-default-rtdb.firebaseio.com",
  projectId: "viper-ndt",
  storageBucket: "viper-ndt.firebasestorage.app",
};
```

### Features Used
- **Authentication:** Email/password login
- **Realtime Database:** Controller data storage
- **Security Rules:** Role-based access control

### Data Structure
```json
{
  "controllers": {
    "ctrl_001": {
      "name": "Controller Alpha",
      "location": "Building A",
      "status": "online",
      "detections": 45,
      "sensors": {
        "ai": true,
        "gas": true,
        "thermal": false
      }
    }
  }
}
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- AI Server running on port 5001
- Raspberry Pi streaming RTSP

### Installation

```bash
cd VIPER_Frontend
npm install
```

### Development

```bash
npm run dev
```

Access at: `http://localhost:5173`

### Build for Production

```bash
npm run build
```

---

## 🔌 API Integration

### AI Server Endpoints

**Base URL:** `http://{PI_IP}:5001`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/frame` | GET | MJPEG video stream |
| `/overlay` | GET | Get overlay states |
| `/overlay/{name}/{action}` | POST | Toggle overlay |
| `/ai_feed` | GET | AI-processed feed |

**Example:**
```javascript
// Toggle AI overlay
await fetch('http://10.203.55.198:5001/overlay/ai/on', {
  method: 'POST'
});
```

---

## 🎨 Styling

### Technology
- **Tailwind CSS** for utility-first styling
- **Custom gradients** for modern aesthetics
- **Lucide React** for icons

### Color Scheme
- Primary: Blue (#3B82F6)
- Secondary: Purple (#9333EA)
- Success: Green (#22C55E)
- Warning: Orange (#F97316)
- Danger: Red (#EF4444)

---

## 📊 Charts & Analytics

### Libraries
- **Chart.js** - Core charting library
- **react-chartjs-2** - React wrapper

### Chart Types
1. **Line Chart** - Detection trends
2. **Doughnut Chart** - Object distribution
3. **Bar Chart** - Weekly activity

---

## 🔐 Authentication Flow

1. User visits `/login`
2. Enters credentials
3. Firebase authenticates
4. Redirects to `/manager/home`
5. Protected routes check auth state
6. Logout clears session

---

## 📱 Responsive Design

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Features
- Collapsible sidebar on mobile
- Responsive grid layouts
- Touch-friendly controls
- Adaptive navigation

---

## 🐛 Debugging

### Common Issues

**Camera Not Loading:**
- Check AI server is running: `http://{PI_IP}:5001/frame`
- Verify RTSP stream from Raspberry Pi
- Check network connectivity

**Login Failing:**
- Verify Firebase credentials in `firebase.js`
- Check test credentials: `admin@viper.ai` / `password123`
- Enable Email/Password auth in Firebase Console

**Overlay Not Toggling:**
- Confirm AI server overlay endpoints are responding
- Check browser console for API errors
- Verify POST requests are reaching server

---

## 🔧 Configuration

### Change AI Server IP

Update in `Dashboard.jsx`:
```javascript
const PI_IP = "10.203.55.198"; // Change to your IP
```

### Adjust Polling Rate

Update in `CameraFeed.jsx`:
```javascript
setInterval(() => {
  // ...
}, 150); // Change interval (ms)
```

---

## 🎯 Future Enhancements

- [ ] WebSocket for real-time updates
- [ ] Historical video playback
- [ ] Advanced analytics with ML insights
- [ ] Multi-camera support
- [ ] Mobile app (React Native)
- [ ] Push notifications for alerts
- [ ] Export reports to PDF
- [ ] Role-based permissions
- [ ] Audit logging
- [ ] System health monitoring

---

## 📄 License

© 2025 VIPER NDT. All rights reserved.

---

## 👥 Support

For issues or questions:
- Check documentation
- Review API endpoints
- Verify Firebase configuration
- Test with different browsers

---

**Built with ❤️ using React, Firebase, and Tailwind CSS**
