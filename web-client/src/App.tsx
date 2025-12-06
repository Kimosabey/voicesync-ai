import React, { useState } from 'react';
import { api } from './lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UploadCloud, FileAudio, Loader2, CheckCircle2, 
  Mic, Sparkles, AlertCircle, PlayCircle 
} from 'lucide-react';
import { clsx } from 'clsx';

export default function App() {
  const [status, setStatus] = useState<'IDLE' | 'UPLOADING' | 'PROCESSING' | 'DONE'>('IDLE');
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    
    // Reset state
    setFileName(file.name);
    setText('');
    setError('');
    
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

    } catch (err: any) {
      console.error(err);
      setStatus('IDLE');
      setError("Connection Failed. Ensure Python Backend is running.");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        {/* Main Card */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
          
          {/* Header */}
          <div className="p-8 border-b border-white/5 bg-white/5">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-500 rounded-2xl shadow-lg shadow-indigo-500/20">
                <Mic className="text-white w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                  VoiceSync <span className="text-indigo-400">AI</span>
                </h1>
                <p className="text-slate-400 text-sm">Secure, Offline Neural Transcription</p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            
            {/* Upload Zone */}
            <div className="relative group">
              <input 
                type="file" 
                accept="audio/*"
                onChange={handleFile}
                disabled={status === 'UPLOADING' || status === 'PROCESSING'}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
              />
              
              <div className={clsx(
                "relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300 flex flex-col items-center justify-center text-center",
                status === 'IDLE' || status === 'DONE'
                  ? "border-slate-700 bg-slate-800/30 group-hover:border-indigo-500 group-hover:bg-slate-800/50"
                  : "border-indigo-500/50 bg-indigo-500/5"
              )}>
                <AnimatePresence mode="wait">
                  {status === 'IDLE' || status === 'DONE' ? (
                    <motion.div 
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <UploadCloud className="text-indigo-400 w-8 h-8" />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-slate-200">
                          Drop your audio file here
                        </p>
                        <p className="text-slate-500 text-sm mt-1">
                          Supports MP3, WAV • Up to 500MB
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="processing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6 w-full max-w-xs"
                    >
                      <div className="flex justify-center">
                        <div className="relative">
                          <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 animate-pulse"></div>
                          <Loader2 className="w-12 h-12 text-indigo-400 animate-spin relative z-10" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <StatusStep 
                          label="Uploading to Secure Vault" 
                          active={status === 'UPLOADING'} 
                          completed={status === 'PROCESSING'} 
                        />
                        <StatusStep 
                          label="Running AI Transcription" 
                          active={status === 'PROCESSING'} 
                          completed={false} 
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400 text-sm"
              >
                <AlertCircle size={18} />
                {error}
              </motion.div>
            )}

            {/* Result Area */}
            {status === 'DONE' && text && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 size={16} />
                    <span className="font-medium">Transcription Complete</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <FileAudio size={14} />
                    <span>{fileName}</span>
                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl opacity-20 blur transition duration-1000 group-hover:opacity-40"></div>
                  <div className="relative bg-slate-950 rounded-xl p-6 border border-slate-800/50 shadow-inner min-h-[100px] max-h-[300px] overflow-y-auto">
                    <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {text}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Sub-component for the loading steps
function StatusStep({ label, active, completed }: { label: string, active: boolean, completed: boolean }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <div className={clsx(
        "w-5 h-5 rounded-full flex items-center justify-center border transition-all duration-500",
        completed ? "bg-emerald-500 border-emerald-500" :
        active ? "border-indigo-500 border-t-transparent animate-spin" :
        "border-slate-700 bg-slate-800"
      )}>
        {completed && <CheckCircle2 size={12} className="text-white" />}
      </div>
      <span className={clsx(
        "transition-colors duration-300",
        completed ? "text-emerald-400" :
        active ? "text-indigo-400 font-medium" :
        "text-slate-600"
      )}>
        {label}
      </span>
    </div>
  );
}