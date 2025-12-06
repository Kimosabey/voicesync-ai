import React, { useState } from 'react';
import { api } from './lib/api';
import { UploadCloud, FileAudio, Loader2, CheckCircle2, Mic } from 'lucide-react';

export default function App() {
  const [status, setStatus] = useState<'IDLE' | 'UPLOADING' | 'PROCESSING' | 'DONE'>('IDLE');
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('');

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    setFileName(file.name);
    
    try {
      // 1. Get URL
      setStatus('UPLOADING');
      const { upload_url } = await api.getUploadUrl(file.name);

      // 2. Upload to MinIO
      await api.uploadToMinIO(upload_url, file);

      // 3. Transcribe
      setStatus('PROCESSING');
      const result = await api.transcribe(file.name);
      
      setText(result.text);
      setStatus('DONE');

    } catch (err) {
      console.error(err);
      setStatus('IDLE');
      alert("Something went wrong. Is the Backend running?");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl w-full max-w-lg relative overflow-hidden">
        
        {/* Background Glow Effect */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-indigo-500/10 p-3 rounded-2xl border border-indigo-500/20">
            <Mic className="text-indigo-400" size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">VoiceSync AI</h1>
            <p className="text-slate-400 text-sm">Secure Offline Transcription</p>
          </div>
        </div>

        {/* Upload Box */}
        <div className="relative group cursor-pointer">
          <input 
            type="file" 
            accept="audio/*"
            onChange={handleFile}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            disabled={status !== 'IDLE' && status !== 'DONE'}
          />
          
          <div className={`
            border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300
            ${status === 'IDLE' || status === 'DONE' 
              ? 'border-slate-700 bg-slate-800/30 hover:border-indigo-500 hover:bg-slate-800/80' 
              : 'border-indigo-500/50 bg-indigo-500/10 cursor-wait'}
          `}>
            {status === 'IDLE' || status === 'DONE' ? (
              <>
                <div className="bg-slate-800 p-4 rounded-full w-fit mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <UploadCloud className="text-indigo-400" size={32} />
                </div>
                <p className="text-slate-200 font-medium text-lg">Click to Upload Audio</p>
                <p className="text-slate-500 text-sm mt-2">Supports MP3, WAV</p>
              </>
            ) : (
              <div className="flex flex-col items-center py-2">
                <Loader2 className="animate-spin text-indigo-400 mb-6" size={48} />
                <p className="text-indigo-300 font-medium text-lg animate-pulse">
                  {status === 'UPLOADING' ? 'Uploading to Secure Vault...' : 'AI is Listening...'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Result Area */}
        {status === 'DONE' && (
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="text-emerald-400" size={20} />
              <h3 className="text-emerald-100 font-medium text-sm uppercase tracking-wider">Transcription Complete</h3>
            </div>
            <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 text-slate-300 leading-relaxed shadow-inner">
              {text || <span className="italic text-slate-600">No speech detected.</span>}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}