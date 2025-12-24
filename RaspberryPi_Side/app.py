import cv2
from flask import Flask, render_template, Response, jsonify

app = Flask(__name__)

# Initialize the Logitech USB Camera
# 0 is usually the default for USB webcams
camera = cv2.VideoCapture(0)

def generate_frames():
    while True:
        success, frame = camera.read() 
        if not success:
            break
        else:
            # Encode the frame in JPEG format
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            # Stream the frame
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/')
def index():
    # Renders the HTML dashboard
    return render_template('index.html')

@app.route('/video_feed')
def video_feed():
    # Route for the live camera stream
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/check_sensor/<sensor_name>')
def check_sensor(sensor_name):
    """
    Since only the camera is available, clicking other sensor 
    buttons will trigger this error flag.
    """
    return jsonify({
        "status": "error",
        "message": f"CRITICAL ERROR: {sensor_name.upper()} sensor not found!"
    })

if __name__ == '__main__':
    # '0.0.0.0' allows access from your laptop on the same Wi-Fi
    app.run(host='0.0.0.0', port=5000, threaded=True)