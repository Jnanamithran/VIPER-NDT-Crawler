# Project V.I.P.E.R.
**(Versatile Inspection & Pipe Exploration Robot)**

## Abstract
The maintenance of critical subterranean infrastructure, such as sewage pipelines, HVAC ducts, and industrial conduits, presents significant challenges due to limited accessibility, hazardous environments, and the high cost of manual excavation. 

**V.I.P.E.R.** is a rugged, semi-autonomous Inspection Crawler Robot designed to automate the Non-Destructive Testing (NDT) of these confined spaces. The system utilizes a **Master-Slave IoT Architecture**:

1.  **The Body (Slave):** A Raspberry Pi 3B+ based rover equipped with a tracked propulsion system for navigating slippery or submerged terrain. It hosts a high-definition Logitech video feed and an array of environmental sensors (IR/PIR) for obstacle and bio-sign detection.
    
2.  **The Brain (Master):** A remote Control Station (Laptop) running advanced Computer Vision algorithms. By offloading processing to the remote station, the system utilizes **YOLO (You Only Look Once)** object detection models to automatically identify and classify structural defects—such as cracks, blockages, and corrosion—in real-time.

This "Edge-to-Cloud" approach minimizes the onboard power consumption while maximizing computational accuracy. Video feeds and sensor telemetry are transmitted via low-latency 5GHz Wi-Fi to a custom web-based "Cockpit" dashboard, allowing operators to assess structural integrity from a safe distance. This system provides a cost-effective, safer alternative to manual inspection methods while demonstrating the application of Modern IoT and AI in industrial maintenance.

## Key Technologies
* **Hardware:** Raspberry Pi 3B+, L298N Driver, Logitech C270, IR Sensors.
* **Software:** Python, Flask (Video Streaming), OpenCV, YOLOv8 (AI).
* **Network:** Low-Latency Wi-Fi Telemetry.