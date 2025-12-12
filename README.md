# 🐍 V.I.P.E.R. (Visual Inspection & Pipe Exploration Rover)

A semi-autonomous crawler robot designed for Non-Destructive Testing (NDT) of underground pipelines using Computer Vision and IoT.

-----------------------------------------------------

## 🚧 Project Progress  
Current Phase: Phase 2 – Network Integration

- Phase 1: Concept & Architecture Design ✔️
- Phase 2: Hardware Procurement & Folder Structure ✔️
- Phase 3: Raspberry Pi “Slave” Setup (Streaming) ⏳
- Phase 4: Laptop “Master” Setup (YOLO Integration) ⏳
- Phase 5: Final Assembly & Field Testing ⏳

-----------------------------------------------------

## 🧠 System Architecture

### 1. The Body (Slave Node)
- Hardware: Raspberry Pi 3B+
- Role: Captures video, reads sensors, runs motors
- Tech: Flask (video streaming), RPi.GPIO (motors)

### 2. The Brain (Master Node)
- Hardware: Laptop (Ryzen 5 / 24GB RAM)
- Role: Runs AI detection, decides movement, sends commands
- Tech: OpenCV, YOLOv8, Python Requests

-----------------------------------------------------

## 📂 Repository Structure

VIPER_Project/
│
├── RaspberryPi_Side/
│   ├── app.py
│   ├── motor_driver.py
│   └── templates/
│
├── Laptop_Brain_Side/
│   ├── ai_pilot.py
│   ├── config.py
│   └── models/
│
└── Documentation/
    ├── circuit_diagram.mmd
    ├── budget_list.csv
    └── abstract.md

-----------------------------------------------------

## 🛠️ Hardware Requirements

Component | Specification | Role
--- | --- | ---
Raspberry Pi | Raspberry Pi 3B+ | Main controller
Camera | Logitech C270 | Live video feed
Sensors | IR Motion / PIR | Obstacle/bio detection
Motors | 12V DC Gear Motor (300RPM) | Movement
Driver | L298N | Motor control
Battery | 11.1V 3S LiPo | Power supply

-----------------------------------------------------

## ⚡ Quick Start Guide

### Raspberry Pi Side
1. Open the RaspberryPi_Side/ folder
2. Install dependencies:
   pip3 install -r requirements.txt
3. Start server:
   python3 app.py

### Laptop Side
1. Open Laptop_Brain_Side/
2. Install AI libraries:
   pip install -r requirements.txt
3. Update Pi IP in config.py
4. Run AI Pilot:
   python ai_pilot.py

-----------------------------------------------------

## 📊 Circuit Diagram (Simple View)

Battery → Switch → L298N Motor Driver  
Battery → Switch → Buck Converter → Raspberry Pi  
Raspberry Pi → USB Camera  
Raspberry Pi → IR Sensor  
Raspberry Pi → WiFi Stream → Laptop  

-----------------------------------------------------

## 📜 License

No license selected yet.
