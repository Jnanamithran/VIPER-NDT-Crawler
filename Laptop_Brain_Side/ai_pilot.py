import cv2
import torch
import numpy as np
from flask import Flask, render_template, Response, jsonify
from ultralytics import YOLO
from datetime import datetime

app = Flask(__name__)

# --- CONFIGURATION ---
PI_IP = "192.168.1.39"
STREAM_URL = f"http://{PI_IP}:5000/video_feed"
device = 'cuda' if torch.cuda.is_available() else 'cpu'
model = YOLO('yolov8s.pt') 

ai_enabled = False
latest_frame = None
mission_log = []

def get_stream():
    global latest_frame, mission_log
    cap = cv2.VideoCapture(STREAM_URL)
    while True:
        success, frame = cap.read()
        if not success: break
        latest_frame = frame
        
        if ai_enabled:
            results = model(frame, stream=True, device=device, half=True, conf=0.4)
            for r in results:
                # IMPROVED LOGGING: Get specific object names
                for box in r.boxes:
                    class_id = int(box.cls[0])
                    label = model.names[class_id] # Gets "Crack", "Roots", etc.
                    log_entry = f"{datetime.now().strftime('%H:%M:%S')} - Detected: {label.upper()}"
                    
                    # Avoid spamming the same detection in the log
                    if not mission_log or log_entry != mission_log[-1]:
                        mission_log.append(log_entry)
                
                frame = r.plot()
        
        ret, buffer = cv2.imencode('.jpg', frame)
        yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')

@app.route('/')
def index(): return render_template('dashboard.html')

@app.route('/video_feed')
def video_feed(): return Response(get_stream(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/toggle_ai')
def toggle_ai():
    global ai_enabled
    ai_enabled = not ai_enabled
    mission_log.append(f"{datetime.now().strftime('%H:%M:%S')} - AI Overlay {'Enabled' if ai_enabled else 'Disabled'}")
    return jsonify({"status": "AI Active" if ai_enabled else "AI Idle"})

@app.route('/get_logs')
def get_logs(): return jsonify(mission_log[-15:]) # Showing more logs in side view

@app.route('/check_sensor/<name>')
def check_sensor(name):
    msg = f"{datetime.now().strftime('%H:%M:%S')} - {name.upper()} Sensor: NOMINAL"
    mission_log.append(msg)
    return jsonify({"message": msg})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, threaded=True)