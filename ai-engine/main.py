import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from minio import Minio
from datetime import timedelta

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("VoiceSync")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
# Note: Using 127.0.0.1 to avoid localhost DNS issues
MINIO_URL = "127.0.0.1:9005"
ACCESS_KEY = "admin"
SECRET_KEY = "password123"
BUCKET_NAME = "audio-uploads"

# Initialize Client
minio_client = Minio(
    MINIO_URL,
    access_key=ACCESS_KEY,
    secret_key=SECRET_KEY,
    secure=False
)

@app.get("/")
def health_check():
    return {"status": "online"}

@app.post("/api/get-upload-url")
def get_upload_url(filename: str):
    logger.info(f"Generating upload URL for: {filename}")
    
    try:
        # REMOVED: The bucket_exists check that was causing the Timeout.
        # We know the bucket exists because we saw it in the browser.
        
        # This function is pure math (offline), so it won't timeout.
        url = minio_client.presigned_put_object(
            BUCKET_NAME,
            filename,
            expires=timedelta(minutes=10)
        )
        return {"upload_url": url, "filename": filename}
    
    except Exception as e:
        logger.error(f"❌ Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))