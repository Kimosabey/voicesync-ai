# VoiceSync AI

![Thumbnail](docs/assets/thumbnail.png)

## Secure Offline Audio Transcription Platform

<div align="center">

![Status](https://img.shields.io/badge/Status-Production_Ready-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![AI](https://img.shields.io/badge/AI-Whisper_Local-FF6B6B?style=for-the-badge&logo=openai&logoColor=white)

</div>

**VoiceSync AI** is a privacy-first transcription tool that runs **100% Offline**. It uses OpenAI's Whisper model (via `faster-whisper`) locally on your device to convert speech to text, ensuring no audio data ever leaves your secure environment. Ideal for legal, medical, or confidential workflows.

---

## 🚀 Quick Start

Run the entire stack in 3 steps:

```bash
# 1. Start Storage (MinIO)
docker-compose up -d

# 2. Start Backend (Python/FastAPI)
cd ai-engine && pip install -r requirements.txt && uvicorn main:app --reload

# 3. Start Frontend (React)
cd web-client && npm install && npm run dev
```

> **Detailed Setup**: See [GETTING_STARTED.md](./docs/GETTING_STARTED.md) for full environment config.

---

## 📸 Demo & Usage

### 1. Upload Interface
![Upload](docs/assets/upload.png)
*Secure Drag-and-Drop using Direct-to-S3 Pre-signed URLs*

### 2. Transcription Results
![Result](docs/assets/result.png)
*Accurate, timestamped text output running locally.*

> **Deep Dive**: See [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for the System Design.

---

## ✨ Key Features

*   **🔒 100% Offline**: Runs entirely on localhost. No data sent to Cloud.
*   **⚡ High Performance**: Uses **CTranslate2** (Faster-Whisper) for 4x faster CPU inference.
*   **📂 Direct-to-Storage**: Bypasses backend limits using **Pre-Signed URLs** for massive file support.
*   **🛡️ Enterprise Ready**: S3-compatible storage layer (MinIO) for scalability.

---

## 🏗️ Architecture

![Architecture](docs/assets/architecture.png)

### The "Sidecar" Upload Pattern
1.  Frontend requests permission (Token).
2.  Backend grants **Pre-Signed URL**.
3.  Frontend uploads **Heavy Audio** directly to Storage.
4.  Backend accesses Storage **internally** to process AI.

---

## 📚 Documentation

| Document | Description |
| :--- | :--- |
| [**System Architecture**](./docs/ARCHITECTURE.md) | Diagrams, Privacy Design, and Tech Choices. |
| [**Getting Started**](./docs/GETTING_STARTED.md) | Full installation and troubleshooting guide. |
| [**Failure Scenarios**](./docs/FAILURE_SCENARIOS.md) | How we handle crashes and offline modes. |
| [**Interview Q&A**](./docs/INTERVIEW_QA.md) | "Why Pre-Signed URLs?" and other senior questions. |

---

## 🔧 Tech Stack

| Domain | Technology | Use Case |
| :--- | :--- | :--- |
| **Frontend** | **React (Vite)** | Fast, modern SPA for file management. |
| **Backend** | **Python (FastAPI)** | Async orchestration and security. |
| **AI Engine** | **Faster-Whisper** | Optimized local inference. |
| **Storage** | **MinIO** | S3-Compatible Object Store. |

---

## 👤 Author

**Harshan Aiyappa**  
Senior Full-Stack Hybrid Engineer  
[GitHub Profile](https://github.com/Kimosabey)

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
