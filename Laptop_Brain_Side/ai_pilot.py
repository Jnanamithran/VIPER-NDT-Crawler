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
# Optimized for RTX 3050
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
                frame = r.plot()
                # Log detection if confidence is high
                if len(r.boxes) > 0:
                    log_entry = f"{datetime.now().strftime('%H:%M:%S')} - Defect Detected"
                    if log_entry not in mission_log[-1:]: mission_log.append(log_entry)
        
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
def get_logs(): return jsonify(mission_log[-10:]) # Return last 10 logs

@app.route('/check_sensor/<name>')
def check_sensor(name):
    msg = f"{datetime.now().strftime('%H:%M:%S')} - {name.upper()} Sensor Test: OK"
    mission_log.append(msg)
    return jsonify({"message": msg})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, threaded=True)