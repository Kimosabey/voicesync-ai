import logging
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from minio import Minio
from datetime import timedelta
from faster_whisper import WhisperModel

# --- 1. CONFIGURATION ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("VoiceSync")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# MinIO Config
MINIO_URL = "127.0.0.1:9090"
ACCESS_KEY = "minioadmin"
SECRET_KEY = "minioadmin"
BUCKET_NAME = "audio-uploads"

minio_client = Minio(
    MINIO_URL,
    access_key=ACCESS_KEY,
    secret_key=SECRET_KEY,
    secure=False
)

# --- 2. LOAD AI MODEL ---
# "tiny" is fast and small (~75MB). "base" or "small" are smarter but slower.
logger.info("⏳ Loading AI Model... (This downloads once)")
# 'base' is smarter than 'tiny'
model = WhisperModel("base", device="cpu", compute_type="int8")
logger.info("✅ AI Model Ready!")

# --- 3. ENDPOINTS ---

@app.get("/")
def health_check():
    return {"status": "online", "ai": "ready"}

@app.post("/api/get-upload-url")
def get_upload_url(filename: str):
    """Generate Pre-signed URL"""
    try:
        if not minio_client.bucket_exists(BUCKET_NAME):
            minio_client.make_bucket(BUCKET_NAME)
            
        url = minio_client.presigned_put_object(
            BUCKET_NAME,
            filename,
            expires=timedelta(minutes=10)
        )
        return {"upload_url": url, "filename": filename}
    except Exception as e:
        logger.error(f"Storage Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/transcribe")
def transcribe_audio(filename: str):
    """Download file -> Transcribe -> Return Text"""
    logger.info(f"🎤 Transcribing: {filename}")
    local_filename = f"temp_{filename}"
    
    try:
        # A. Download from MinIO
        minio_client.fget_object(BUCKET_NAME, filename, local_filename)
        logger.info("✅ File downloaded locally")

        # B. Run AI
        segments, info = model.transcribe(local_filename, beam_size=5)
        
        # C. Combine Text
        full_text = " ".join([segment.text for segment in segments])
        logger.info(f"📝 Text: {full_text}")

        # D. Cleanup
        os.remove(local_filename)

        return {"filename": filename, "text": full_text.strip()}

    except Exception as e:
        logger.error(f"❌ AI Error: {e}")
        if os.path.exists(local_filename):
            os.remove(local_filename)
        raise HTTPException(status_code=500, detail=str(e))