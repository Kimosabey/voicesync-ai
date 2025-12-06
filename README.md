```markdown
# 🎙️ VoiceSync AI

> **A Secure, Offline Audio Transcription Platform.**
> *Built with React, Python (FastAPI), MinIO, and OpenAI Whisper.*

## 🏗️ Architecture

Unlike typical AI apps that send data to the cloud, **VoiceSync runs entirely locally**.

`[React UI] ⚡(Direct Upload) → [MinIO Storage] ⚡(Event) → [Python AI Worker] → [Client]`

1.  **Frontend (React + Vite):** Requests a pre-signed URL from the backend.
2.  **Direct Upload:** The browser uploads the audio directly to **MinIO** (S3), bypassing the API server for speed.
3.  **AI Engine (Python):** Downloads the file, processes it using **Faster-Whisper** (optimized for CPU), and returns text.

## 🛠️ Tech Stack

*   **Frontend:** React, TypeScript, Tailwind CSS, Axios.
*   **Backend:** Python 3.11, FastAPI, Uvicorn.
*   **AI Model:** Faster-Whisper (OpenAI's model optimized for local inference).
*   **Storage:** MinIO (Docker) - S3 Compatible Object Storage.

## 🚀 How to Run

### 1. Start Infrastructure (MinIO)
```bash
docker-compose up -d
# Runs MinIO on Port 9090 (API) and 9001 (Console)
```

### 2. Start Backend (AI Engine)
```bash
cd ai-engine
.\venv\Scripts\activate
uvicorn main:app --reload
# Runs on localhost:8000
```

### 3. Start Frontend (Web Client)
```bash
cd web-client
npm run dev
# Runs on localhost:5173
```

## 🧪 Key Features
*   ✅ **Zero Data Leakage:** No audio leaves your machine.
*   ✅ **High Performance:** Uses Pre-signed URLs for direct S3 uploads.
*   ✅ **Cost Efficient:** Runs on standard CPUs (no GPU required).

---
*Engineered by Harshan Aiyappa.*
```