import cv2
import torch
import numpy as np
import os
from flask import Flask, render_template, Response, jsonify
from ultralytics import YOLO
from datetime import datetime

app = Flask(__name__)

# --- CONFIGURATION ---
PI_IP = "10.112.192.170"
STREAM_URL = f"http://{PI_IP}:5000/video_feed"
MISSION_DIR = "missions"

# Ensure missions folder exists
if not os.path.exists(MISSION_DIR):
    os.makedirs(MISSION_DIR)

# RTX 3050 GPU Acceleration
device = 'cuda' if torch.cuda.is_available() else 'cpu'
model = YOLO('yolov8s.pt') 

# Global State
ai_enabled = False
mission_log = []
latest_frame = None  # Buffer for snapshots
video_writer = None  # Global video writer object

def get_stream():
    global ai_enabled, mission_log, latest_frame, video_writer
    cap = cv2.VideoCapture(STREAM_URL)
    
    # Define video recording filename
    session_time = datetime.now().strftime('%Y%m%d_%H%M%S')
    video_filename = os.path.join(MISSION_DIR, f"session_{session_time}.avi")
    fourcc = cv2.VideoWriter_fourcc(*'XVID')  # Codec for .avi
    
    while True:
        success, frame = cap.read()
        if not success:
            break
        
        # Process with AI if enabled
        if ai_enabled:
            results = model(frame, stream=True, device=device, half=(device == 'cuda'), conf=0.4)
            for r in results:
                # Log detections
                for box in r.boxes:
                    cls_name = model.names[int(box.cls[0])]
                    entry = f"{datetime.now().strftime('%H:%M:%S')} - DETECTED: {cls_name.upper()}"
                    if not mission_log or entry != mission_log[-1]:
                        mission_log.append(entry)
                frame = r.plot()  # Draw bounding boxes
        
        # 1. Update latest frame buffer for snapshots
        latest_frame = frame.copy()
        
        # 2. Handle Video Recording (Automatic)
        if video_writer is None:
            height, width, _ = frame.shape
            video_writer = cv2.VideoWriter(video_filename, fourcc, 20.0, (width, height))
        
        video_writer.write(frame)

        # 3. Stream to Flask
        ret, buffer = cv2.imencode('.jpg', frame)
        yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')

@app.route('/')
def index():
    return render_template('dashboard.html')

@app.route('/video_feed')
def video_feed():
    return Response(get_stream(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/save_snapshot')
def save_snapshot():
    global latest_frame
    if latest_frame is not None:
        filename = f"snap_{datetime.now().strftime('%H%M%S')}.jpg"
        filepath = os.path.join(MISSION_DIR, filename)
        cv2.imwrite(filepath, latest_frame)
        msg = f"SNAPSHOT SAVED: {filename}"
        mission_log.append(msg)
        return jsonify({"status": "Success", "file": filepath})
    return jsonify({"status": "Error", "message": "No frame available"})

@app.route('/toggle_ai')
def toggle_ai():
    global ai_enabled
    ai_enabled = not ai_enabled
    status_msg = f"AI Overlay {'ENABLED' if ai_enabled else 'DISABLED'}"
    mission_log.append(f"{datetime.now().strftime('%H:%M:%S')} - {status_msg}")
    return jsonify({"status": "AI Active" if ai_enabled else "AI Idle"})

@app.route('/get_logs')
def get_logs():
    return jsonify(mission_log[-15:])

@app.route('/check_sensor/<name>')
def check_sensor(name):
    msg = f"{datetime.now().strftime('%H:%M:%S')} - {name.upper()} CHECK: NOMINAL"
    mission_log.append(msg)
    return jsonify({"message": msg})

if __name__ == '__main__':
    try:
        app.run(host='0.0.0.0', port=5001, threaded=True)
    finally:
        # Release the video writer when the app stops
        if video_writer:
            video_writer.release()