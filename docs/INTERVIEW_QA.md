# 🎤 Interview Cheat Sheet: VoiceSync AI

## 1. The Elevator Pitch (2 Minutes)

"VoiceSync AI is a secure, offline audio transcription platform designed for privacy-critical environments like legal or medical fields.

Unlike standard tools that send audio to the cloud, this runs **entirely on-premises**.
I architected a **Direct-to-Storage** workflow:
1.  **React Frontend** requests a secure Pre-Signed URL.
2.  **Uploads** go directly to a local MinIO (S3) instance, bypassing the backend bottleneck.
3.  **FastAPI Backend** then runs the **Whisper AI** model locally on the CPU to generate text.

This ensures **zero data leakage** and ability to handle large files without crashing the application server."

---

## 2. "Explain Like I'm 5" (The Secret Agent)

"Imagine you are a Secret Agent with a classified tape.
*   **The Bad Way**: Mailling the tape to a transcription service (The Cloud). They might lose it or leak it.
*   **My Way**: I built a robot that lives inside your safe.
    1.  You put the tape directly into the safe (MinIO).
    2.  The robot (AI) lives in the safe, listens to it, and writes the notes.
    3.  The tape never leaves your room. It is faster, safer, and free."

---

## 3. Tough Technical Questions

### Q: Why Pre-Signed URLs? Why not just stream to the server?
**A:** "Streaming large audio files (e.g., 1GB meetings) through the Python application block the event loop (essentially) and consumes massive RAM for buffering. By generating a Pre-Signed URL, I offload the I/O burden entirely to MinIO, which is optimized for streaming storage. The Application server remains lightweight and available to handle auth and business logic."

### Q: Why Faster-Whisper instead of standard OpenAI Whisper?
**A:** "Standard Whisper is implemented in PyTorch and can be slow on slightly older CPUs. **Faster-Whisper** uses `CTranslate2`, a C++ inference engine. It offers up to **4x speedup** and significantly lower memory usage through 8-bit quantization, which is critical when running local AI on consumer hardware."

### Q: How do you handle concurrency?
**A:** "FastAPI is asynchronous, handling the web requests concurrently. However, the AI inference is CPU-bound. In a production version, I would implement a **Job Queue (Celery/BullMQ)**. The API would accept the request, queue it, and a background worker would pick up the job GPU-by-GPU. Currently, for this demo, it processes sequentially or uses a mutex lock to prevent crashing the CPU."
