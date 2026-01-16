import subprocess
import time
import threading
import logging
import sys
import os
from flask import Flask, jsonify
from flask_cors import CORS

# --------------------------------------------------
# Logging
# --------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s"
)
logger = logging.getLogger("VIPER")

# --------------------------------------------------
# Flask App
# --------------------------------------------------
app = Flask(__name__)
CORS(app)

MEDIAMTX_BIN = "./mediamtx"
MEDIAMTX_CFG = "./mediamtx.yml"
RTSP_URL = "rtsp://127.0.0.1:8554/viper"

ffmpeg_process = None
mediamtx_process = None

# --------------------------------------------------
# Process Helpers
# --------------------------------------------------
def kill_existing():
    logger.info("Stopping old MediaMTX / FFmpeg processes")

    if sys.platform.startswith("win"):
        subprocess.run(["taskkill", "/F", "/IM", "mediamtx.exe"], stderr=subprocess.DEVNULL)
        subprocess.run(["taskkill", "/F", "/IM", "ffmpeg.exe"], stderr=subprocess.DEVNULL)
    else:
        subprocess.run(["pkill", "-f", "mediamtx"], stderr=subprocess.DEVNULL)
        subprocess.run(["pkill", "-f", "ffmpeg"], stderr=subprocess.DEVNULL)

    time.sleep(2)

# --------------------------------------------------
# MediaMTX
# --------------------------------------------------
def start_mediamtx():
    global mediamtx_process

    logger.info("Starting MediaMTX RTSP server")

    cmd = [MEDIAMTX_BIN, MEDIAMTX_CFG]
    if sys.platform.startswith("win"):
        cmd = ["mediamtx.exe", "mediamtx.yml"]

    mediamtx_process = subprocess.Popen(
        cmd,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.STDOUT
    )

    time.sleep(3)
    logger.info("MediaMTX running on port 8554")

# --------------------------------------------------
# FFmpeg Camera Stream
# --------------------------------------------------
def start_ffmpeg():
    global ffmpeg_process

    logger.info("Starting FFmpeg camera stream")

    if sys.platform.startswith("win"):
        ffmpeg_cmd = [
            "ffmpeg",
            "-f", "dshow",
            "-rtbufsize", "100M",
            "-i", 'video=Integrated Camera',
            "-fflags", "nobuffer",
            "-flags", "low_delay",
            "-an",
            "-c:v", "libx264",
            "-preset", "ultrafast",
            "-tune", "zerolatency",
            "-pix_fmt", "yuv420p",
            "-profile:v", "baseline",
            "-level", "3.0",
            "-r", "30",
            "-f", "rtsp",
            RTSP_URL
        ]
    else:
        ffmpeg_cmd = [
            "ffmpeg",
            "-f", "v4l2",
            "-input_format", "yuyv422",
            "-video_size", "640x480",
            "-framerate", "30",
            "-use_wallclock_as_timestamps", "1",
            "-i", "/dev/video0",
            "-fflags", "nobuffer",
            "-flags", "low_delay",
            "-an",
            "-c:v", "libx264",
            "-preset", "ultrafast",
            "-tune", "zerolatency",
            "-pix_fmt", "yuv420p",
            "-profile:v", "baseline",
            "-level", "3.0",
            "-g", "30",
            "-f", "rtsp",
            RTSP_URL
        ]

    ffmpeg_process = subprocess.Popen(
        ffmpeg_cmd,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.STDOUT
    )

    logger.info("FFmpeg streaming to RTSP")

# --------------------------------------------------
# Supervisor Thread
# --------------------------------------------------
def rtsp_supervisor():
    while True:
        try:
            kill_existing()
            start_mediamtx()
            start_ffmpeg()

            # Monitor FFmpeg
            while True:
                if ffmpeg_process.poll() is not None:
                    logger.warning("FFmpeg crashed, restarting...")
                    break
                time.sleep(2)

        except Exception as e:
            logger.error(f"Supervisor error: {e}")
            time.sleep(5)

# --------------------------------------------------
# API Endpoints
# --------------------------------------------------
@app.route("/telemetry")
def telemetry():
    return jsonify({
        "status": "STABLE",
        "camera": "ACTIVE",
        "rtsp": "RUNNING",
        "stream": RTSP_URL
    })

@app.route("/status")
def status():
    return jsonify({
        "camera": "ACTIVE",
        "rtsp": "STREAMING"
    })

# --------------------------------------------------
# Main
# --------------------------------------------------
if __name__ == "__main__":
    threading.Thread(target=rtsp_supervisor, daemon=True).start()
    app.run(host="0.0.0.0", port=5000)
