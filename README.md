# 🐍 V.I.P.E.R. (Visual Inspection & Pipe Exploration Rover)

A semi-autonomous crawler robot designed for Non-Destructive Testing (NDT) of underground pipelines using Computer Vision and IoT.

-----------------------------------------------------

## 🚧 Project Progress
**Current Phase: Phase 4 – Laptop "Brain" Integration (Complete)**

- [x] Phase 3: Raspberry Pi "Body" Setup (Headless VNC & Flask Streaming)
- [x] Phase 4: Laptop "Brain" Setup (RTX 3050 CUDA Integration & Unified Dashboard)
- [ ] Phase 5: Hardware Assembly (Motors & Sensors Integration) ⏳

-----------------------------------------------------

## 🧠 System Architecture

### 1. Raspberry Pi Side (Slave)
- **Streaming**: Captures raw feed from a USB camera and broadcasts it on port `5000`.
- **Telemetry**: Provides a `/telemetry` endpoint for hardware status.

### 2. AI Server (Processing Node)
- **AI Processing**: Consumes the video stream from the Raspberry Pi, runs a YOLOv8s object detection model on it.
- **Processed Stream**: Serves the video with AI overlays on port `5001`.

### 3. VIPER Frontend (Mission Control)
- **Dashboard**: A React-based single-page application that provides a unified view of the video feed, telemetry, and system status.
- **Real-time**: Fetches data from both the Raspberry Pi and the AI Server.

## 📂 Repository Structure

```
VIPER-NDT-Crawler/
   │
   ├── AI_Server/
   │   ├── main.py             # Flask server for AI processing
   │   └── missions/           # Directory for saved mission data
   │
   ├── RaspberryPi_Side/
   │   └── app.py              # Flask server for camera streaming and telemetry
   │
   ├── VIPER_Frontend/
   │   ├── src/                # React application source code
   │   │   ├── components/
   │   │   ├── pages/
   │   │   │   └── Dashboard.jsx # Main dashboard UI
   │   │   └── App.jsx
   │   └── package.json
   │
   └── Documentation/
       ├── abstract.md
       ├── budget_list.csv
       └── circuit_diagram.mmd
```

-----------------------------------------------------

## 🛠️ Hardware Requirements

| Component | Specification | Role | Status |
| --- | --- | --- | --- |
| **Core Controller** | Raspberry Pi 3B+ | System Central Hub | **In Hand** |
| **Optical Camera** | Logitech USB Desktop | HD Visual Feed | **In Hand** |
| **Thermal Array** | MLX90640 | Leak & Temp Detection | *Planned* |
| **Gas Sensor** | MQ-4 (Methane) | Hazardous Gas Monitoring | *Planned* |
| **Propulsion** | DC Gear Motors | Tracked Navigation | *Planned* |
| **Display** | Laptop (via VNC) | Headless Remote Control | **Configured** |

-----------------------------------------------------

## ⚡ Quick Start Guide

### 1. Raspberry Pi Setup
1.  Connect and power on the Raspberry Pi.
2.  Ensure Python, `opencv-python`, and `flask` are installed.
3.  Launch the server:
    ```bash
    cd RaspberryPi_Side
    python app.py
    ```

### 2. AI Server Setup
1.  Ensure you have a CUDA-capable GPU and have installed the necessary drivers.
2.  Install dependencies (a `requirements.txt` should be created):
    ```bash
    pip install flask flask_cors ultralytics opencv-python firebase-admin
    ```
3.  Launch the server:
    ```bash
    cd AI_Server
    python main.py
    ```

### 3. Frontend Setup
1.  Install Node.js and npm.
2.  Install dependencies:
    ```bash
    cd VIPER_Frontend
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Access the dashboard in your browser, usually at `http://localhost:5173`.

-----------------------------------------------------

## 📊 System Topology
`[Pi: Camera, Telemetry] -> [AI Server: YOLOv8] -> [Frontend: Dashboard]`

-----------------------------------------------------

## ⚠️ Known Issues
* **Low Voltage Alert**: A "Low Voltage" warning (lightning bolt) has been detected in VNC. Ensure a stable 5V 2.5A power supply to avoid CPU throttling during camera use.
* **Sensor Simulation**: Thermal and Gas sensors are not yet integrated. Data related to them is simulated.
* **Hardcoded IP**: The IP address for the Raspberry Pi is currently hardcoded in the frontend and AI server. This should be made configurable.
