import cv2
import requests
import numpy as np

# Change this to your Raspberry Pi's actual IP address
PI_IP = "192.168.1.XX" 
STREAM_URL = f"http://{PI_IP}:5000/video_feed"

print("Connecting to VIPER Body...")
cap = cv2.VideoCapture(STREAM_URL)

while True:
    ret, frame = cap.read()
    if not ret:
        print("Waiting for camera feed...")
        break

    # Add a text overlay to show it's being processed on the laptop
    cv2.putText(frame, "BRAIN PROCESSING: ACTIVE", (10, 30), 
                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
    
    cv2.imshow('VIPER Laptop Brain View', frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()