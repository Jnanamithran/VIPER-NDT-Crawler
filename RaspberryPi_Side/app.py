import cv2
from flask import Flask, render_template, Response, jsonify

app = Flask(__name__)
camera = cv2.VideoCapture(0) # Logitech USB Camera

def generate_frames():
    while True:
        success, frame = camera.read()
        if not success: break
        # Encode for low-latency Wi-Fi telemetry
        ret, buffer = cv2.imencode('.jpg', frame)
        yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')

@app.route('/')
def index(): return render_template('index.html')

@app.route('/video_feed')
def video_feed(): return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/check_sensor/<name>')
def check_sensor(name):
    # Error flag for sensors not yet physically present
    return jsonify({"status": "error", "message": f"ALERT: {name.upper()} sensor not detected!"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)