import os, cv2, sqlite3, firebase_admin
from flask import Flask, Response, jsonify
from flask_cors import CORS
from ultralytics import YOLO
from datetime import datetime
from firebase_admin import credentials, db

app = Flask(__name__)
CORS(app)

# --- CONFIGURATION ---
PI_IP = "10.203.55.170" 
MODEL_PATH = "./yolov8s.pt"

# --- FIREBASE SETUP ---
try:
    cred = credentials.Certificate("serviceAccountKey.json")
    firebase_admin.initialize_app(cred, {'databaseURL': 'https://viper-ndt-default-rtdb.firebaseio.com'})
except Exception as e:
    print(f"Cloud Logic Identification Error: {e}")

# --- NESTED FOLDER INITIALIZATION ---
session_id = datetime.now().strftime('%Y-%m-%d_%H-%M')
BASE_DIR = os.path.join("missions", session_id)
IMG_DIR = os.path.join(BASE_DIR, "images")
VID_DIR = os.path.join(BASE_DIR, "videos")

for folder in [IMG_DIR, VID_DIR]:
    os.makedirs(folder, exist_ok=True)

# Identify Video Recording Pipeline
video_out = cv2.VideoWriter(os.path.join(VID_DIR, "mission_audit.avi"), 
                            cv2.VideoWriter_fourcc(*'XVID'), 20.0, (640, 480))

def init_db():
    conn = sqlite3.connect('viper_audit.db')
    conn.execute('CREATE TABLE IF NOT EXISTS logs (ts TEXT, cls TEXT, img TEXT, session TEXT)')
    conn.close()

init_db()
model = YOLO(MODEL_PATH)
frame_count = 0

def process_stream():
    global frame_count
    cap = cv2.VideoCapture(f"http://{PI_IP}:5000/video_feed")
    cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)

    while True:
        success, frame = cap.read()
        if not success: break
        
        # Ensure frame is exactly 640x480 for the VideoWriter
        frame = cv2.resize(frame, (640, 480))
        frame_count += 1
        
        # LAG FIX: Only identify defects every 3rd frame
        if frame_count % 3 == 0:
            results = model(frame, stream=True, conf=0.5, verbose=False)
            for r in results:
                frame = r.plot()
                if len(r.boxes) > 0:
                    for box in r.boxes:
                        cls = model.names[int(box.cls[0])]
                        ts = datetime.now().strftime('%H:%M:%S')
                        img_name = f"DET_{datetime.now().strftime('%H%M%S')}.jpg"
                        
                        # Store image in the specific /images sub-folder
                        cv2.imwrite(os.path.join(IMG_DIR, img_name), frame)
                        
                        with sqlite3.connect('viper_audit.db') as conn:
                            conn.execute('INSERT INTO logs VALUES (?, ?, ?, ?)', 
                                         (ts, cls, img_name, session_id))
                        
                        try:
                            db.reference(f'missions/{session_id}').push({
                                'time': ts, 'type': cls, 'status': 'CRITICAL'
                            })
                        except: pass
        
        # Write every frame to the /videos sub-folder
        video_out.write(frame)
        
        ret, buffer = cv2.imencode('.jpg', frame, [int(cv2.IMWRITE_JPEG_QUALITY), 70])
        yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')

@app.route('/ai_feed')
def ai_feed(): return Response(process_stream(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/api/history')
def get_history():
    with sqlite3.connect('viper_audit.db') as conn:
        cursor = conn.execute('SELECT * FROM logs ORDER BY ts DESC LIMIT 15')
        return jsonify([{"time": r[0], "type": r[1], "img": r[2]} for r in cursor.fetchall()])

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, threaded=True)