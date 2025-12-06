import axios from 'axios';

// Ensure this matches your Python Server URL
const API_URL = 'http://localhost:8000/api';

export const api = {
  // 1. Get the "Permission Slip" (Pre-signed URL) from Python
  getUploadUrl: async (filename: string) => {
    const res = await axios.post(`${API_URL}/get-upload-url`, null, {
      params: { filename }
    });
    return res.data; 
  },

  // 2. Upload file DIRECTLY to MinIO (Bypassing Python for speed)
  uploadToMinIO: async (url: string, file: File) => {
    await axios.put(url, file, {
      headers: { 'Content-Type': file.type }
    });
  },

  // 3. Tell Python to transcribe the file
  transcribe: async (filename: string) => {
    const res = await axios.post(`${API_URL}/transcribe`, null, {
      params: { filename }
    });
    return res.data; 
  }
};