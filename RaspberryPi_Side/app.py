# -*- coding: utf-8 -*-
import cv2
import subprocess
import time
from flask import Flask, Response, jsonify

app = Flask(__name__)

def get_camera():
    """Forces V4L2 backend to stop GStreamer errors"""
    # cv2.CAP_V4L2 is the identification key for stable Linux USB video
    cap = cv2.VideoCapture(0, cv2.CAP_V4L2) 
    if not cap.isOpened():
        return None
    # Optimize for USB bandwidth to prevent 'gst_sample' null errors
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
    cap.set(cv2.CAP_PROP_FOURCC, cv2.VideoWriter_fourcc(*'MJPG'))
    return cap

camera = get_camera()

def get_pi_diagnostics():
    """Identifies hardware status for real-time health monitoring"""
    try:
        throttled = subprocess.check_output(["vcgencmd", "get_throttled"]).decode().strip()
        temp = subprocess.check_output(["vcgencmd", "measure_temp"]).decode().replace("temp=","").strip()
        status = "HEALTHY" if "0x0" in throttled else "HARDWARE ALERT"
        return {"voltage": status, "temp": temp}
    except:
        return {"voltage": "OFFLINE", "temp": "N/A"}

def generate_frames():
    global camera
    while True:
        if camera is None or not camera.isOpened():
            camera = get_camera()
            time.sleep(2)
            continue
            
        success, frame = camera.read()
        if not success:
            camera.release()
            camera = None
            continue
        
        # Mirroring for natural pilot steering
        frame = cv2.flip(frame, 1) 
        ret, buffer = cv2.imencode('.jpg', frame, [int(cv2.IMWRITE_JPEG_QUALITY), 85])
        yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')

@app.route('/video_feed')
def video_feed(): return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/telemetry')
def telemetry(): return jsonify(get_pi_diagnostics())

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, threaded=True)