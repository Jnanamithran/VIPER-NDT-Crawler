# 🐍 V.I.P.E.R. (Visual Inspection & Pipe Exploration Rover)

[cite_start]A semi-autonomous crawler robot designed for Non-Destructive Testing (NDT) of underground pipelines using Computer Vision and IoT. [cite: 1, 22]

-----------------------------------------------------

## 🚧 Project Progress  
[cite_start]**Current Phase: Phase 3 – Hardware & Software Integration** [cite: 92]

- [x] [cite_start]Phase 1: Concept & Architecture Design [cite: 90]
- [x] [cite_start]Phase 2: Design & Development (Folder Structure & UI) [cite: 103, 104]
- [x] Phase 3: Raspberry Pi "Body" Setup (Headless VNC & Flask Streaming) 
- [ ] Phase 4: Laptop "Brain" Setup (YOLOv8 AI Integration) ⏳
- [ ] Phase 5: Hardware Assembly (Motors & Sensors Integration) ⏳
- [ ] [cite_start]Phase 6: Field Testing & Deployment [cite: 100, 105]

-----------------------------------------------------

## 🧠 System Architecture

### 1. The Body (Slave Node - Raspberry Pi 3B+)
- [cite_start]**Role**: Captures HD optical feed, hosts real-time telemetry dashboard, and manages hardware interrupts. [cite: 56, 128]
- [cite_start]**Tech**: Flask (MJPEG Streaming), OpenCV (Frame Processing). [cite: 64, 67]
- **Status**: Streaming active via `app.py`.

### 2. The Brain (Master Node - Laptop)
- [cite_start]**Role**: Pulls video stream from Pi, runs heavy ML models (crack/blockage detection), and sends navigation commands. [cite: 47, 138]
- [cite_start]**Tech**: Python Requests, OpenCV, YOLOv8 (Future). [cite: 60, 65]

-----------------------------------------------------

## 📂 Repository Structure

```
VIPER_Project/
   │
   ├── RaspberryPi_Side/
   │  ├── app.py # Flask server & MJPEG Streamer
   │  ├── motor_driver.py # GPIO Logic for L298N (Placeholder) 
   │  └── templates/
   │     └── index.html # Mission Control UI (HTML5/CSS3)
   │  
   ├── Laptop_Brain_Side/ 
   │  ├── ai_pilot.py # AI client for stream analysis 
   │  ├── config.py # Network settings (Pi IP: 192.168.1.39) 
   │  └── models/ # YOLOv8 weight files 
   │  
   |── Documentation/ 
         ├── VIPER_Abstract.pdf # Project Documentation 
         ├── circuit_diagram.mmd 
         └── budget_list.csv
```

-----------------------------------------------------

## 🛠️ Hardware Requirements

| Component | Specification | Role | Status |
| --- | --- | --- | --- |
| **Core Controller** | Raspberry Pi 3B+ | System Central Hub [cite: 77] | **In Hand** |
| **Optical Camera** | Logitech USB Desktop | HD Visual Feed [cite: 79] | **In Hand** |
| **Thermal Array** | MLX90640 | Leak & Temp Detection [cite: 82] | *Planned* |
| **Gas Sensor** | MQ-4 (Methane) | Hazardous Gas Monitoring [cite: 84] | *Planned* |
| **Propulsion** | DC Gear Motors | Tracked Navigation [cite: 86] | *Planned* |
| **Display** | Laptop (via VNC) | Headless Remote Control [cite: 74] | **Configured** |

-----------------------------------------------------

## ⚡ Quick Start Guide

### 1. Raspberry Pi Setup (The Body)
1. **Connect**: Power on Pi and access via **RealVNC Viewer** (IP: `192.168.1.39`).
2. **Environment**: Ensure `opencv-python` and `flask` are installed.
3. **Launch Server**:
   ```bash
   cd ~/VIPER_Project/RaspberryPi_Side
   python3 app.py
   ```

### 2. Laptop Setup (The Brain)
**View Dashboard**: Open browser to http://192.168.1.39:5000.
**Run AI Client:**
```bash 
   python Laptop_Brain_Side/ai_pilot.py
```

-----------------------------------------------------

## 📊 System Topology
[cite_start]USB Camera [cite: 79] [cite_start]→ Raspberry Pi [cite: 77] [cite_start]→ Flask MJPEG Stream [cite: 67] [cite_start]→ Wi-Fi Telemetry [cite: 28, 53] [cite_start]→ Laptop Brain (Dashboard/AI) [cite: 129][cite_end]

-----------------------------------------------------

## ⚠️ Known Issues
* **Low Voltage Alert**: A "Low Voltage" warning (lightning bolt) has been detected in VNC. Ensure a stable 5V 2.5A power supply to avoid CPU throttling during camera use.
* [cite_start]**Sensor Simulation**: Thermal and Gas buttons currently trigger "Sensor Not Found" error flags until physical hardware integration of the MLX90640 and MQ-4 sensors in Phase 5[cite: 82, 84, 93].[cite_end]