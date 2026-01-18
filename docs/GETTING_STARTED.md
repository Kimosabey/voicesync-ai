# 🚀 Getting Started with VoiceSync AI

> **Prerequisites**
> *   **Docker Desktop** (for MinIO)
> *   **Python 3.10+**
> *   **Node.js v18+**
> *   **FFmpeg**: Must be installed and added to your System PATH.

## 1. Environment Setup

**Backend (`.env`)**
Create or verify `ai-engine/.env`:
```bash
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
CORS_ORIGIN=http://localhost:5173
```

**Frontend (`.env`)**
Create or verify `web-client/.env`:
```bash
VITE_API_URL=http://localhost:8000
```

---

## 2. Installation & Launch

### Step 1: detailed Infrastructure (MinIO)
Start the Object Storage container.
```bash
docker-compose up -d
# Check: Open http://localhost:9001 (User/Pass: minioadmin)
```

### Step 2: Backend (AI Engine)
**Note**: The first run will download the Whisper model (~1GB), so it may take a few minutes.
```bash
cd ai-engine
python -m venv .venv
# Windows:
.\.venv\Scripts\activate
# Mac/Linux:
# source .venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload
# Server running at: http://localhost:8000
```

### Step 3: Frontend (Web Client)
```bash
cd web-client
npm install
npm run dev
# UI running at: http://localhost:5173
```

---

## 3. Usage Guide (Verification)
1.  Open the Web Client.
2.  Drag & Drop a short audio file (e.g., `test.mp3`).
3.  **Observe**:
    *   **Upload Phase**: The progress bar fills (Direct-to-MinIO).
    *   **Processing Phase**: The backend loads the model (High CPU usage).
    *   **Result**: Text appears on the screen.

---

## 4. Running Tests

### Backend Tests
```bash
cd ai-engine
pytest
```

### Frontend Linting
```bash
cd web-client
npm run lint
```
