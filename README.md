# VoiceSync AI
## Secure Offline Audio Transcription Platform

<div align="center">

![Status](https://img.shields.io/badge/Status-Production_Ready-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

**Tech Stack**

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![MinIO](https://img.shields.io/badge/MinIO-S3_Compatible-C72E49?style=for-the-badge&logo=minio&logoColor=white)

**Features**

![Whisper AI](https://img.shields.io/badge/AI-Whisper_Local-FF6B6B?style=flat-square)
![Privacy](https://img.shields.io/badge/Feature-100%25_Offline-4ECDC4?style=flat-square)
![Pre-signed URLs](https://img.shields.io/badge/Security-Pre--signed_URLs-95E1D3?style=flat-square)
![FFmpeg](https://img.shields.io/badge/Processing-FFmpeg-F38181?style=flat-square)

</div>

---

## Visual Overview

### Upload Interface

<p align="center">
  <img src="./docs/assets/upload.png" alt="VoiceSync Upload" width="800"/>
</p>

*Drag-and-drop audio upload with real-time processing status*

### Transcription Results

<p align="center">
  <img src="./docs/assets/result.png" alt="Transcription Results" width="750"/>
</p>

*Clean transcription output with metadata and download options*

---

## Overview

**VoiceSync AI** is a secure, offline audio transcription platform built with React, Python (FastAPI), MinIO, and OpenAI Whisper. Unlike typical AI apps that send data to the cloud, **VoiceSync runs entirely locally**.

### Key Differentiator

**100% Local Processing**: No audio data is sent to OpenAI, Google, or AWS. Everything stays on your machine.

### Features

- **Secure Upload**: Pre-signed URLs for direct client-to-storage upload (large files never touch the Python server)
- **Offline Privacy**: Whisper AI model runs locally on your CPU
- **Fast Processing**: Faster-Whisper optimization for CPU inference
- **Modern UI**: React + Vite + Tailwind CSS with drag-and-drop interface
- **S3-Compatible Storage**: MinIO for scalable object storage

---

## Architecture

```mermaid
graph LR
    User(User) -->|Drag & Drop| React[React Frontend]
    React -->|1. Request URL| Py[Python API]
    Py -->|2. Generate Pre-signed URL| MinIO[MinIO Storage]
    React -->|3. Direct Upload| MinIO
    React -->|4. Trigger AI| Py
    Py -->|5. Download Audio| MinIO
    Py -->|6. Run Whisper AI| Model[AI Model]
    Py -->|7. Return Text| React
```

---

## Tech Stack

- **Frontend**: React (Vite), TypeScript, Tailwind CSS, Axios
- **Backend**: Python 3.11, FastAPI, Uvicorn
- **AI Engine**: Faster-Whisper (OpenAI's model optimized for CPU)
- **Storage**: MinIO (Docker) - S3 Compatible Object Storage
- **Tools**: FFmpeg (Audio Processing)

---

## Installation & Setup

### 1. Prerequisites
- Docker Desktop (Running)
- Node.js v18+
- Python 3.10+
- **FFmpeg** (Required for Audio):
  - *Windows:* `winget install Gyan.FFmpeg`

### 2. Start Infrastructure
```bash
docker-compose up -d
# Runs MinIO on Port 9090 (API) and 9001 (Console)
```

### 3. Start Backend
```bash
cd ai-engine

# Create Virtual Environment
python -m venv .venv

# Activate (Windows)
.\.venv\Scripts\activate

# Install Dependencies
pip install -r requirements.txt

# Run Server
uvicorn main:app --reload
# Runs on http://localhost:8000
```

### 4. Start Frontend
```bash
cd web-client
npm install
npm run dev
# Runs on http://localhost:5173
```

---

## Usage Guide

1. Open **http://localhost:5173**
2. Drag and drop an MP3/WAV file
3. Watch the status change: `Uploading` → `AI Processing` → `Done`
4. Copy the transcribed text

---

## Security Features

### Pre-Signed URLs
The backend generates a temporary, secure link for uploads. Large files never touch the Python server directly - they go straight to MinIO storage.

### Offline Privacy
No audio data is sent to external services. The Whisper AI model runs locally on your machine, ensuring complete privacy.

---

## License

MIT License

---

**Built by**: [Harshan Aiyappa](https://github.com/Kimosabey)  
**Tech Stack**: React • Python • FastAPI • Whisper AI • MinIO  
**Focus**: Privacy • Offline Processing • Secure Transcription