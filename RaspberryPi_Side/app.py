import cv2
import subprocess
import time
from flask import Flask, Response, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def get_camera():
    """Forces V4L2 backend for Linux USB stability"""
    cap = cv2.VideoCapture(0, cv2.CAP_V4L2)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1920)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 1080)
    return cap

camera = get_camera()

def get_pi_health():
    """Identifies hardware status for real-time monitoring"""
    try:
        temp = subprocess.check_output(["vcgencmd", "measure_temp"]).decode().replace("temp=","").strip()
        throttled = subprocess.check_output(["vcgencmd", "get_throttled"]).decode().strip()
        return {"temp": temp, "status": "STABLE" if "0x0" in throttled else "ALERT"}
    except:
        return {"temp": "N/A", "status": "OFFLINE"}

def generate_frames():
    global camera
    while True:
        success, frame = camera.read()
        if not success:
            camera.release()
            camera = get_camera()
            continue
        frame = cv2.flip(frame, 1) # Natural steering mirror
        ret, buffer = cv2.imencode('.jpg', frame, [int(cv2.IMWRITE_JPEG_QUALITY), 85])
        yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')

@app.route('/video_feed')
def video_feed(): return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/telemetry')
def telemetry(): return jsonify(get_pi_health())

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)