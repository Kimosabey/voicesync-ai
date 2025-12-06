```markdown
# 🎙️ VoiceSync AI: The Master Manual

## 🎯 1. Project Objective & Purpose
**Why did we build this?**

### The Problem
Most AI apps (like ChatGPT or Otter.ai) send your voice to the "Cloud" (Internet).
*   **Privacy Risk:** If you are a doctor recording patient notes, or a lawyer recording confidential meetings, you cannot send that data to Google or OpenAI. It is illegal or unsafe.
*   **Cost:** Transcription APIs charge money per minute.

### The Solution (Our Objective)
To build a **Secure, Offline AI Pipeline**.
We created a system that runs the AI **entirely on your laptop**. No data leaves your computer. We also optimized it to handle large files efficiently using Object Storage.

### Real-World Use Case
*   **Legal/Medical:** Transcribing sensitive interviews securely.
*   **Journalism:** processing interviews in remote locations with no internet.
*   **Call Centers:** Analyzing thousands of recorded calls without paying Cloud fees.

---

## 🕵️ 2. The Story: Explain Like I'm 5 (The Secret Agent)
Imagine you are a **Secret Agent** with a classified tape recording.

1.  **The Agent (React Frontend):**
    This is you. You have the tape (Audio File). You want to put it in the safe, but the safe is locked.

2.  **The HQ (Python API):**
    You call HQ and say, "I need to drop off a tape." HQ validates your ID and gives you a **One-Time Passcode** (Pre-signed URL).
    *   *Note: You do NOT give the tape to HQ. That would be too slow.*

3.  **The Safe (MinIO Storage):**
    You take the tape and the Passcode directly to the Safe. The Safe checks the code and lets you drop the tape inside instantly.

4.  **The Brain (AI Engine):**
    Inside the Safe, there is a super-smart robot (Whisper AI). It wakes up, listens to the tape, writes down everything that was said, and hands you the paper (Transcription).

---

## 🛠️ 3. Complete Tech Stack Report

| Technology | Role | Why we used it? |
| :--- | :--- | :--- |
| **Python (FastAPI)** | **Orchestrator** | It acts as the "Traffic Controller". It generates security tokens and runs the AI model. |
| **MinIO (Docker)** | **Storage** | It is a local version of **AWS S3**. We use it because storing large audio files in a database makes the database slow. |
| **OpenAI Whisper** | **The Brain** | A powerful AI model that we run *locally* (using `faster-whisper`). It converts Audio → Text. |
| **React + Vite** | **The Interface** | A fast, modern UI that handles file uploads. It communicates directly with MinIO to speed up large uploads. |
| **FFmpeg** | **Audio Tool** | The hidden tool that converts MP3/WAV files into raw data the AI can understand. |

---

## 🔄 4. The Data Flow (Architecture)

This is the "Senior Engineer" part. We use a pattern called **Pre-Signed URLs**.

1.  **User** drops file in React UI.
2.  **React** asks Python: *"Can I upload `test.mp3`?"*
3.  **Python** asks MinIO: *"Generate a secure link for `test.mp3` valid for 10 minutes."*
4.  **MinIO** gives the link -> **Python** gives it to **React**.
5.  **React** uploads the file **DIRECTLY** to MinIO (Bypassing the Python server completely).
    *   *Benefit:* The Python server doesn't get clogged by large file uploads.
6.  **Python** downloads the file internally, runs AI, and returns text.

---

## 🗺️ 5. The Map (Ports & Addresses)

| Service | Address | Role |
| :--- | :--- | :--- |
| **Frontend** | `http://localhost:5173` | The React Website. |
| **Backend** | `http://localhost:8000` | The Python API (Docs at `/docs`). |
| **MinIO API** | `http://127.0.0.1:9090` | The port code uses to talk to storage. |
| **MinIO Console** | `http://localhost:9001` | The website where you can see your files. |

---

## 🚀 6. Setup Guide (How to Run)

### Step 1: Infrastructure (The Safe)
```bash
docker-compose up -d
# Checks: docker ps (Ensure Port 9090 is active)
```

### Step 2: Backend (The Brain)
```bash
cd ai-engine
.\venv\Scripts\activate
uvicorn main:app --reload
# Checks: Visit http://localhost:8000 in browser. Should see {"status":"online"}
```

### Step 3: Frontend (The Agent)
```bash
cd web-client
npm run dev
# Checks: Visit http://localhost:5173. Should see the Upload UI.
```

---

## 🩺 7. Troubleshooting (Health Checks)

*   **Error:** `ReadTimeoutError` / `Connection Refused` in Python.
    *   **Fix:** Ensure MinIO is running on Port **9090**. Check `docker ps`.
    *   **Fix:** Ensure `main.py` is using `127.0.0.1:9090`, not `localhost`.

*   **Error:** `RequestTimeTooSkewed`.
    *   **Fix:** Your Docker clock is wrong. Restart Docker: `docker-compose down` then `up -d`.

*   **Error:** "AI Returns Empty Text".
    *   **Fix:** Restart VS Code to load FFmpeg. Use a clear audio file (English).

---
*Project Architected by Harshan Aiyappa.*
```