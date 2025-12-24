import cv2
import time
import os
from ultralytics import YOLO

# Use your confirmed Pi IP
STREAM_URL = "http://192.168.1.39:5000/video_feed"
model = YOLO('yolov8n.pt') # AI Object Detection Model

if not os.path.exists('missions'): os.makedirs('missions')

cap = cv2.VideoCapture(STREAM_URL)
# Video Recorder Setup
fourcc = cv2.VideoWriter_fourcc(*'XVID')
out = cv2.VideoWriter(f'missions/VIPER_{int(time.time())}.avi', fourcc, 20.0, (640, 480))

print("--- VIPER MASTER NODE: RECORDING & AI ACTIVE ---")

while cap.isOpened():
    ret, frame = cap.read()
    if not ret: break
    
    out.write(frame) # Auto-save to Laptop Disk
    results = model(frame, stream=True)
    
    # Overlay AI Detections
    for r in results:
        annotated_frame = r.plot() 

    cv2.imshow('VIPER AI BRAIN VIEW', annotated_frame)
    if cv2.waitKey(1) & 0xFF == ord('q'): break

cap.release(); out.release(); cv2.destroyAllWindows()