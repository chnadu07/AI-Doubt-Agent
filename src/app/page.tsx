"use client";

import { useState, useRef } from "react";
import { Loader2, Send, CheckCircle, AlertTriangle, Upload, X, File as FileIcon, Image as ImageIcon } from "lucide-react";

export default function StudentPortal() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  
  // File upload states
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(Array.from(e.target.files));
    }
  };

  const addFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(f => 
      f.type.startsWith('image/') || 
      f.type === 'application/pdf' ||
      f.name.endsWith('.txt') ||
      f.name.endsWith('.docx')
    );
    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (indexToRemove: number) => {
    setFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const fileToBase64 = (file: File): Promise<{ mimeType: string, data: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // The result looks like "data:image/png;base64,iVBORw0KGgo..."
        const [meta, base64Data] = result.split(',');
        const mimeType = meta.split(':')[1].split(';')[0];
        resolve({ mimeType, data: base64Data });
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    const formData = new FormData(e.currentTarget);
    
    try {
      // Convert all files to base64
      const fileData = await Promise.all(files.map(f => fileToBase64(f)));

      const data = {
        studentName: formData.get("studentName"),
        skillLevel: formData.get("skillLevel"),
        doubtText: formData.get("doubtText"),
        files: fileData
      };

      const res = await fetch("/api/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        setResponse(json.aiResponse);
      } else {
        alert("Something went wrong!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit doubt.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative z-10 px-6 py-12 md:px-12 max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
      {/* Left Column: Form */}
      <div className="flex-1">
        <div className="mb-8">
          <div className="font-mono text-[11px] text-[#a78bfa] tracking-widest uppercase mb-4 flex items-center gap-2">
            <span className="w-6 h-[1px] bg-[#a78bfa] opacity-50 block"></span>
            Doubt Portal
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 text-[#e8e6f0]">
            Ask Your Doubt
          </h1>
          <p className="text-[#9d9ab0] font-light text-sm">
            Get instant AI resolution tailored to your skill level.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#111118] border border-[rgba(130,110,255,0.18)] p-6 rounded-xl shadow-[0_0_40px_rgba(124,92,252,0.05)]">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-mono text-[10px] text-[#5f5c70] uppercase tracking-widest mb-1">Name</label>
              <input required name="studentName" type="text" placeholder="Your first name" className="w-full bg-[#0a0a0f] border border-[rgba(130,110,255,0.18)] rounded-lg px-4 py-2 text-sm text-[#e8e6f0] focus:outline-none focus:border-[#a78bfa] transition-colors" />
            </div>
            <div>
              <label className="block font-mono text-[10px] text-[#5f5c70] uppercase tracking-widest mb-1">Skill Level</label>
              <select name="skillLevel" className="w-full bg-[#0a0a0f] border border-[rgba(130,110,255,0.18)] rounded-lg px-4 py-2 text-sm text-[#e8e6f0] focus:outline-none focus:border-[#a78bfa] transition-colors">
                <option value="Beginner">Beginner (Week 1-4)</option>
                <option value="Intermediate">Intermediate (Week 5-8)</option>
                <option value="Advanced">Advanced (Week 9-12)</option>
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block font-mono text-[10px] text-[#5f5c70] uppercase tracking-widest mb-1">Describe your doubt</label>
            <textarea required name="doubtText" rows={5} className="w-full bg-[#0a0a0f] border border-[rgba(130,110,255,0.18)] rounded-lg px-4 py-3 text-sm text-[#e8e6f0] focus:outline-none focus:border-[#a78bfa] transition-colors mb-4"></textarea>

            {/* Drag and Drop File Area */}
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-2 
                ${isDragging ? 'border-[#a78bfa] bg-[rgba(167,139,250,0.05)] shadow-[0_0_20px_rgba(167,139,250,0.15)]' : 'border-[rgba(130,110,255,0.18)] hover:border-[#a78bfa] hover:bg-[rgba(167,139,250,0.02)]'}`}
            >
              <Upload className={`w-8 h-8 transition-colors duration-300 ${isDragging ? 'text-[#a78bfa]' : 'text-[#5f5c70]'}`} />
              <p className="text-sm text-[#9d9ab0] font-medium mt-1">
                Drag & Drop files or click to upload
              </p>
              <p className="text-[10px] text-[#5f5c70] font-mono">
                Supported: JPG, PNG, WEBP, PDF, TXT
              </p>
              <input 
                type="file" 
                multiple
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/jpeg, image/png, image/webp, application/pdf, text/plain"
              />
            </div>

            {/* File Previews */}
            {files.length > 0 && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {files.map((file, index) => {
                  const isImage = file.type.startsWith('image/');
                  return (
                    <div key={index} className="flex items-center gap-3 bg-[#0a0a0f] border border-[rgba(130,110,255,0.18)] p-2.5 rounded-lg group hover:border-[rgba(130,110,255,0.3)] transition-colors relative overflow-hidden">
                      <div className="w-10 h-10 rounded bg-[#111118] border border-[rgba(130,110,255,0.1)] flex items-center justify-center overflow-hidden shrink-0">
                        {isImage ? (
                          <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                        ) : (
                          <FileIcon className="w-5 h-5 text-[#a78bfa]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-[#e8e6f0] truncate font-medium">{file.name}</p>
                        <p className="text-[10px] text-[#5f5c70] font-mono mt-0.5">{formatFileSize(file.size)}</p>
                      </div>
                      <button 
                        type="button" 
                        onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                        className="p-1.5 rounded-md hover:bg-[rgba(248,113,113,0.1)] text-[#5f5c70] hover:text-[#f87171] transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <button disabled={loading} type="submit" className="w-full bg-gradient-to-r from-[#7c5cfc] to-[#a78bfa] hover:opacity-90 disabled:opacity-50 transition-opacity text-white font-semibold text-sm py-3 rounded-lg flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(124,92,252,0.3)] hover:shadow-[0_0_30px_rgba(124,92,252,0.5)]">
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
            {loading ? "Generating Resolution & Analyzing Files..." : "Submit Doubt"}
          </button>
        </form>
      </div>

      {/* Right Column: AI Response */}
      <div className="flex-1">
        <div className="bg-[#18181f] border border-[rgba(130,110,255,0.32)] rounded-xl h-full shadow-[0_0_80px_rgba(124,92,252,0.12)] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(130,110,255,0.18)] bg-[#1e1e28]">
            <span className="font-mono text-[11px] text-[#a78bfa] tracking-widest uppercase">DISHA AI Output</span>
            {response && (
              <span className={`flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded-full ${response.escalation_flag ? "bg-[rgba(248,113,113,0.15)] text-[#f87171]" : "bg-[rgba(52,211,153,0.15)] text-[#34d399]"}`}>
                {response.escalation_flag ? <AlertTriangle size={12}/> : <CheckCircle size={12}/>}
                {response.escalation_flag ? "ESCALATED" : "RESOLVED"}
              </span>
            )}
          </div>
          <div className="p-6 flex-1 overflow-y-auto">
            {!response && !loading && (
              <div className="h-full flex items-center justify-center text-center text-[#5f5c70] font-mono text-sm">
                Submit a doubt or upload a screenshot to see<br/>the AI resolution here.
              </div>
            )}
            
            {loading && (
              <div className="h-full flex flex-col items-center justify-center text-center text-[#7c5cfc]">
                <Loader2 className="animate-spin mb-4" size={32} />
                <p className="font-mono text-xs tracking-widest uppercase">Analyzing codebase & files...</p>
                {files.length > 0 && <p className="text-[10px] text-[#a78bfa] mt-2 font-mono">Running Vision AI on attachments...</p>}
              </div>
            )}

            {response && !loading && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-[#111118] border-l-4 border-[#34d399] p-4 rounded-r-lg">
                  <p className="text-[#b8f5d0] text-sm whitespace-pre-wrap leading-relaxed">
                    {response.response_text}
                  </p>
                </div>

                {response.code_snippet && (
                  <div>
                    <span className="font-mono text-[10px] text-[#5f5c70] uppercase tracking-widest mb-2 block">Code Snippet</span>
                    <pre className="bg-[#0a0a0f] border border-[rgba(130,110,255,0.18)] p-4 rounded-lg overflow-x-auto">
                      <code className="text-xs text-[#a78bfa] font-mono">{response.code_snippet}</code>
                    </pre>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#111118] border border-[rgba(130,110,255,0.18)] p-4 rounded-lg">
                    <span className="font-mono text-[10px] text-[#5f5c70] uppercase tracking-widest block mb-1">Root Cause</span>
                    <span className="text-sm text-[#e8e6f0]">{response.root_cause}</span>
                  </div>
                  <div className="bg-[#111118] border border-[rgba(130,110,255,0.18)] p-4 rounded-lg">
                    <span className="font-mono text-[10px] text-[#5f5c70] uppercase tracking-widest block mb-1">Concept Link</span>
                    <span className="text-sm text-[#a78bfa]">{response.concept_link || "N/A"}</span>
                  </div>
                </div>

                {response.escalation_flag && response.escalation_reason && (
                  <div className="bg-[rgba(248,113,113,0.1)] border border-[rgba(248,113,113,0.3)] p-4 rounded-lg text-center">
                    <AlertTriangle className="text-[#f87171] mx-auto mb-2" size={20} />
                    <p className="text-[#f87171] text-xs font-semibold uppercase tracking-widest mb-1">Mentor Tagged</p>
                    <p className="text-sm text-red-200">{response.escalation_reason}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
