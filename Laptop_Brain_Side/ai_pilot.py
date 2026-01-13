import cv2
import torch
import requests
import os
import numpy as np
from flask import Flask, render_template, Response, jsonify
from ultralytics import YOLO
from datetime import datetime

base_dir = os.path.dirname(os.path.abspath(__file__))
app = Flask(__name__, template_folder=os.path.join(base_dir, 'templates'))

PI_IP = "10.203.55.170" 
STREAM_URL = f"http://{PI_IP}:5000/video_feed"
TELEMETRY_URL = f"http://{PI_IP}:5000/telemetry"
MISSION_DIR = os.path.join(base_dir, "missions")
if not os.path.exists(MISSION_DIR): os.makedirs(MISSION_DIR)

# AI Module Identification on RTX 3050
device = 'cuda' if torch.cuda.is_available() else 'cpu'
model = YOLO(os.path.join(base_dir, 'models', 'yolov8s.pt')) 

ai_enabled = False
mission_log = ["SYSTEM INITIALIZED"]
video_writer = None

def get_live_metrics():
    """Identifies results by scanning the missions directory"""
    snaps = [f for f in os.listdir(MISSION_DIR) if f.startswith('AI_')]
    count = len(snaps)
    # Integrity drops 5% per anomaly found in current scan
    health = max(0, 100 - (count * 5))
    return count, f"{health}%"

def get_stream():
    global ai_enabled, mission_log, video_writer
    cap = cv2.VideoCapture(STREAM_URL)
    
    # Continuous Background Recording (Starts on Run)
    fourcc = cv2.VideoWriter_fourcc(*'XVID')
    v_path = os.path.join(MISSION_DIR, f"MISSION_{datetime.now().strftime('%H%M%S')}.avi")
    video_writer = cv2.VideoWriter(v_path, fourcc, 20.0, (640, 480))

    while True:
        success, frame = cap.read()
        if not success:
            cap.release(); cv2.waitKey(2000); cap = cv2.VideoCapture(STREAM_URL)
            continue
        
        clean_frame = frame.copy()
        if ai_enabled:
            results = model(frame, stream=True, device=device, conf=0.45)
            for r in results:
                for box in r.boxes:
                    cls = model.names[int(box.cls[0])]
                    conf = float(box.conf[0])
                    if conf > 0.50:
                        ts = datetime.now().strftime('%H%M%S_%f')
                        # IDENTIFIED RESULT: Raw and AI dual-save with overlays
                        cv2.imwrite(os.path.join(MISSION_DIR, f"RAW_{ts}.jpg"), clean_frame)
                        cv2.imwrite(os.path.join(MISSION_DIR, f"AI_{ts}.jpg"), r.plot())
                        mission_log.append(f"IDENTIFIED: {cls.upper()}")
                frame = r.plot()

        video_writer.write(frame)
        ret, buffer = cv2.imencode('.jpg', frame)
        yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')

@app.route('/')
def dashboard(): return render_template('dashboard.html')

@app.route('/video_feed')
def video_feed(): return Response(get_stream(), mimetype='multipart/x-mixed-replace; boundary=frame')

# FIXED ROUTE: Matches your browser's expectation
@app.route('/admin_portal')
def admin_portal():
    """Live Management Web App for structural health monitoring"""
    defects, health = get_live_metrics()
    live_data = {"date": "TODAY", "defects": defects, "health": health}
    baseline = {"date": "2025-10-15", "defects": 2, "health": "90%"}
    return render_template('admin.html', live=live_data, base=baseline)

@app.route('/get_logs')
def get_logs():
    try: diag = requests.get(TELEMETRY_URL, timeout=0.8).json()
    except: diag = {"voltage": "OFFLINE", "temp": "N/A"}
    return jsonify({"logs": mission_log[-12:], "health": diag})

@app.route('/toggle_ai')
def toggle_ai():
    global ai_enabled
    ai_enabled = not ai_enabled
    return jsonify({"status": "AI Active" if ai_enabled else "AI Idle"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, threaded=True)