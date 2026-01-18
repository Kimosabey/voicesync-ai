# 🛡️ Failure Scenarios & Resilience

> "Privacy is hard, offline is harder."

This document outlines how VoiceSync AI handles system failures, particularly regarding local resource constraints and storage issues.

## 1. System Failure Matrix

| Component | Failure Mode | Impact | Recovery Strategy |
| :--- | :--- | :--- | :--- |
| **FastAPI Backend** | Crash / Out of Memory | **Critical**. Processing stops. | **Manual/Auto Restart**. Since this is a local tool, the user usually just restarts the script. In prod, `supervisord` would handle this. |
| **MinIO** | Container Down | **Critical**. Cannot upload or fetch audio. | **Health Check**. Frontend displays "Storage Offline" if it cannot reach the pre-signed URL domain. |
| **FFmpeg** | Missing / Corrupt | **Major**. Audio conversion fails. | **Validation**. Backend checks for FFmpeg binary on startup and warns the user explicitly. |
| **Whisper Model** | Download Fail / Corrupt | **Major**. Inference crashes. | **Cache Integrity**. The system verifies model hash on load and re-downloads if corrupt. |

---

## 2. Resource Constraints (The "Local" Problem)

### Scenario A: Large File Upload (1GB+)
*   **Risk**: Browser memory crash or Server timeout.
*   ** Mitigation**: **Direct-to-S3 Pattern**. The browser streams the file directly to MinIO. The Python server (RAM) is never touched by the file data, so it cannot crash due to upload size.

### Scenario B: CPU Saturation
*   **Risk**: Whisper uses 100% CPU, freezing the computer.
*   **Mitigation**: **Quantization**. We use `int8` quantization by default, reducing memory bandwidth and CPU load by ~50% compared to `float32`.

### Scenario C: Network Cut (Offline Mode)
*   **Trigger**: User disconnects from WiFi.
*   **Result**:
    1.  **Frontend**: Loads fine (Localhost).
    2.  **Upload**: Works fine (MinIO is Localhost).
    3.  **Inference**: Works fine (Model is cached locally).
*   **Verdict**: **True Offline Capability**. The system relies on ZERO external APIs after initial setup.

---

## 3. Storage Cleanup
Since we store large WAV files, disk space can fill up.
*   **Policy**: A Bucket Lifecycle Policy (MinIO) can be configured to auto-delete files older than 24 hours. (Currently manual).
