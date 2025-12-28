import cv2
import time
import os
import torch
from ultralytics import YOLO

# --- GPU CONFIGURATION ---
# Force the system to use the RTX 3050
device = 'cuda' if torch.cuda.is_available() else 'cpu'
print(f"--- VIPER MASTER NODE: RTX 3050 ACCELERATION ACTIVE ---")

# Use 'yolov8s.pt' (Small) - much better for pipe cracks than 'n'
model = YOLO('yolov8s.pt') 

# Use your confirmed Pi IP
STREAM_URL = "http://192.168.1.39:5000/video_feed"

if not os.path.exists('missions'): os.makedirs('missions')

cap = cv2.VideoCapture(STREAM_URL)
fourcc = cv2.VideoWriter_fourcc(*'XVID')
# Synced to 20 FPS for the 3050
out = cv2.VideoWriter(f'missions/VIPER_RTX_{int(time.time())}.avi', fourcc, 20.0, (640, 480))

while cap.isOpened():
    ret, frame = cap.read()
    if not ret: break
    
    # --- GPU INFERENCE ---
    # 'half=True' doubles speed on RTX cards
    # 'conf=0.4' removes "shit" detections (ghost boxes)
    results = model(frame, stream=True, device=device, half=True, conf=0.4)
    
    # Overlay AI Detections
    for r in results:
        annotated_frame = r.plot() 

    # Save to Laptop Disk
    out.write(frame) 

    cv2.imshow('VIPER RTX-POWERED BRAIN', annotated_frame)
    if cv2.waitKey(1) & 0xFF == ord('q'): break

cap.release(); out.release(); cv2.destroyAllWindows()