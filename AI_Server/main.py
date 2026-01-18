import os
import json
import cv2
import time
import threading
import logging
import torch
from datetime import datetime
from flask import Flask, Response, jsonify
from flask_cors import CORS
from ultralytics import YOLO

# ================= LOGGING =================
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("VIPER")

# ================= FLASK =================
app = Flask(__name__)
CORS(app)

# ================= OVERLAY STATE =================
overlay_state = {
    "ai": True,
    "gas": False,
    "thermal": False
}

# ================= PATHS =================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MISSION_DIR = os.path.join(BASE_DIR, "missions")
os.makedirs(MISSION_DIR, exist_ok=True)

def new_mission_folder():
    name = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    path = os.path.join(MISSION_DIR, name)
    os.makedirs(os.path.join(path, "images"), exist_ok=True)
    os.makedirs(os.path.join(path, "videos"), exist_ok=True)
    return path

MISSION_PATH = new_mission_folder()
IMG_DIR = os.path.join(MISSION_PATH, "images")
VID_DIR = os.path.join(MISSION_PATH, "videos")

# ================= DATABASE (HISTORY) =================
HISTORY_FILE = os.path.join(BASE_DIR, "history.json")

def load_history():
    if os.path.exists(HISTORY_FILE):
        try:
            with open(HISTORY_FILE, "r") as f:
                return json.load(f)
        except:
            return []
    return []

def save_detection_event(entry):
    history = load_history()
    history.append(entry)
    with open(HISTORY_FILE, "w") as f:
        json.dump(history, f, indent=2)

# ================= YOLO =================
MODEL_PATH = "./yolov8s.pt"
device = "cuda" if torch.cuda.is_available() else "cpu"
logger.info(f"Using device: {device}")

model = YOLO(MODEL_PATH).to(device)

# ================= RTSP BRIDGE =================
class RTSPBridge:
    def __init__(self, url):
        self.url = url
        self.cap = None
        self.frame = None
        self.lock = threading.Lock()
        threading.Thread(target=self._reader, daemon=True).start()

    def _reader(self):
        while True:
            if self.cap is None or not self.cap.isOpened():
                logger.info("Connecting RTSP...")
                self.cap = cv2.VideoCapture(self.url, cv2.CAP_FFMPEG)
                time.sleep(2)
                continue

            ret, frame = self.cap.read()
            if not ret:
                logger.warning("RTSP lost. Reconnecting...")
                self.cap.release()
                self.cap = None
                time.sleep(2)
                continue

            with self.lock:
                self.frame = frame

stream = RTSPBridge("rtsp://10.203.55.170:8554/viper")

# ================= SENSOR STUBS =================
def read_gas_sensor():
    return 230

def read_thermal_sensor():
    return True

# ================= VIDEO WRITER =================
video_writer = None
fourcc = cv2.VideoWriter_fourcc(*"XVID")

# ================= VIDEO PIPELINE =================
def generate_feed():
    global video_writer

    snapshot_cooldown = 0

    while True:
        with stream.lock:
            frame = stream.frame

        if frame is None:
            time.sleep(0.03)
            continue

        h, w, _ = frame.shape

        # Init recorder
        if video_writer is None:
            video_path = os.path.join(VID_DIR, "mission_audit.avi")
            video_writer = cv2.VideoWriter(video_path, fourcc, 20, (w, h))

        detected = False
        label = "Unknown"
        confidence = 0.0

        # ---------- AI OVERLAY ----------
        if overlay_state["ai"]:
            results = model(frame, conf=0.4, verbose=False)
            frame = results[0].plot()
            if len(results[0].boxes) > 0:
                detected = True
                # Extract detection details
                box = results[0].boxes[0]
                label = model.names[int(box.cls)]
                confidence = float(box.conf)

        # ---------- GAS OVERLAY ----------
        if overlay_state["gas"]:
            gas = read_gas_sensor()
            cv2.putText(frame, f"GAS: {gas} ppm", (20, 40),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 255), 2)

        # ---------- THERMAL OVERLAY ----------
        if overlay_state["thermal"]:
            cv2.putText(frame, "THERMAL ACTIVE", (20, 80),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)

        # ---------- AUTO SNAPSHOT ----------
        if detected and snapshot_cooldown == 0:
            img_name = datetime.now().strftime("%H-%M-%S") + ".jpg"
            cv2.imwrite(os.path.join(IMG_DIR, img_name), frame)
            
            # Save to DB
            save_detection_event({
                "time": datetime.now().strftime("%H:%M"),
                "date": datetime.now().strftime("%Y-%m-%d"),
                "label": label,
                "confidence": confidence,
                "image": img_name
            })
            snapshot_cooldown = 30

        snapshot_cooldown = max(0, snapshot_cooldown - 1)

        # ---------- RECORD ----------
        video_writer.write(frame)

        # ---------- STREAM ----------
        ret, jpg = cv2.imencode(".jpg", frame, [cv2.IMWRITE_JPEG_QUALITY, 80])
        if not ret:
            continue

        yield (
            b"--frame\r\n"
            b"Content-Type: image/jpeg\r\n\r\n" +
            jpg.tobytes() +
            b"\r\n"
        )

# ================= ROUTES =================
@app.route("/ai_feed")
@app.route("/frame")   # ✅ FIXED
def frame_feed():
    return Response(
        generate_feed(),
        mimetype="multipart/x-mixed-replace; boundary=frame"
    )

@app.route("/overlay", methods=["GET"])
def get_overlay():
    return jsonify(overlay_state)

@app.route("/overlay/<name>/<action>", methods=["POST"])
def set_overlay(name, action):
    if name not in overlay_state:
        return jsonify({"error": "Invalid overlay"}), 400

    overlay_state[name] = action == "on"
    logger.info(f"{name.upper()} overlay -> {overlay_state[name]}")
    return jsonify(overlay_state)

@app.route("/api/history", methods=["GET"])
def get_history():
    """Endpoint for Frontend Analytics to fetch old info"""
    return jsonify(load_history())

# ================= START =================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, threaded=True)
