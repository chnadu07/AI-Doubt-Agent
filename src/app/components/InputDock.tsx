"use client";
import {
  useRef, useState, useEffect, useCallback, type KeyboardEvent, type ChangeEvent,
} from "react";
import {
  Paperclip, ImagePlus, Mic, SendHorizonal, X, ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Attachment {
  file: File;
  preview?: string;
}

interface Props {
  onSend: (text: string, attachments: Attachment[]) => void;
  disabled?: boolean;
  initialValue?: string;
  onInitialConsumed?: () => void;
}

const MODELS = ["Gemini 2.5 Flash", "Gemini 1.5 Pro", "Gemini 2.0 Flash"];

export default function InputDock({ onSend, disabled, initialValue, onInitialConsumed }: Props) {
  const [text, setText] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [model, setModel] = useState(MODELS[0]);
  const [showModel, setShowModel] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceState, setVoiceState] = useState<"idle" | "listening" | "stopping">("idle");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLInputElement>(null);
  const modelRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const speechBaseTextRef = useRef("");
  const silenceTimeoutRef = useRef<any>(null);
  const stoppingTimeoutRef = useRef<any>(null);

  /* Auto-fill from welcome screen suggestion */
  useEffect(() => {
    if (initialValue) {
      setText(initialValue);
      textareaRef.current?.focus();
      onInitialConsumed?.();
    }
  }, [initialValue]);

  /* Auto-resize textarea */
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  }, [text]);

  const resetSilenceTimer = useCallback(() => {
    if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
    if (stoppingTimeoutRef.current) clearTimeout(stoppingTimeoutRef.current);

    setVoiceState("listening");

    // After 1.5 seconds of silence, transition visually to "stopping"
    stoppingTimeoutRef.current = setTimeout(() => {
      setVoiceState("stopping");
    }, 1500);

    // After 2.5 seconds of silence, automatically stop recording!
    silenceTimeoutRef.current = setTimeout(() => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      setVoiceState("idle");
    }, 2500);
  }, []);

  /* Initialize SpeechRecognition API */
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = "en-US";

        rec.onresult = (event: any) => {
          resetSilenceTimer(); // Reset countdown timers on speech detection!

          let sessionFinalTranscript = "";
          let sessionInterimTranscript = "";

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const chunk = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              sessionFinalTranscript += chunk;
            } else {
              sessionInterimTranscript += chunk;
            }
          }

          const currentSpeech = (sessionFinalTranscript || sessionInterimTranscript).trim();
          if (currentSpeech) {
            setText(() => {
              const base = speechBaseTextRef.current.trim();
              
              // Smart punctuation formatting
              let cleanSpeech = currentSpeech;
              if (cleanSpeech.length > 0) {
                cleanSpeech = cleanSpeech.charAt(0).toUpperCase() + cleanSpeech.slice(1);
              }
              
              return base ? `${base} ${cleanSpeech}` : cleanSpeech;
            });
          }
        };

        rec.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          setIsListening(false);
          setVoiceState("idle");
        };

        rec.onend = () => {
          setIsListening(false);
          setVoiceState("idle");
          if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
          if (stoppingTimeoutRef.current) clearTimeout(stoppingTimeoutRef.current);
        };

        recognitionRef.current = rec;
      }
    }
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
      if (stoppingTimeoutRef.current) clearTimeout(stoppingTimeoutRef.current);
    };
  }, [resetSilenceTimer]);

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please use Google Chrome or Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setVoiceState("idle");
      if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
      if (stoppingTimeoutRef.current) clearTimeout(stoppingTimeoutRef.current);
    } else {
      try {
        // Freeze current textbox content as immutable base text
        speechBaseTextRef.current = text;
        
        recognitionRef.current.start();
        setIsListening(true);
        setVoiceState("listening");
        resetSilenceTimer();
      } catch (err) {
        console.error("Failed to start speech recognition:", err);
      }
    }
  }, [isListening, text, resetSilenceTimer]);

  /* Close model dropdown on click outside */
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modelRef.current && !modelRef.current.contains(e.target as Node)) {
        setShowModel(false);
      }
    };
    window.addEventListener("mousedown", handleOutsideClick);
    return () => window.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const addFiles = (files: File[]) => {
    const newA: Attachment[] = files.map((f) => ({
      file: f,
      preview: f.type.startsWith("image/") ? URL.createObjectURL(f) : undefined,
    }));
    setAttachments((p) => [...p, ...newA]);
  };

  const removeAttachment = (i: number) => {
    setAttachments((p) => {
      if (p[i].preview) URL.revokeObjectURL(p[i].preview!);
      return p.filter((_, j) => j !== i);
    });
  };

  const send = useCallback(() => {
    if (!text.trim() || disabled) return;
    onSend(text.trim(), attachments);
    setText("");
    setAttachments([]);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  }, [text, attachments, disabled, onSend]);

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const canSend = text.trim().length > 0 && !disabled;

  return (
    <div className="input-dock">
      <div className="input-inner">
        {/* Attachment chips */}
        {attachments.length > 0 && (
          <div style={{
            display: "flex", gap: 6, flexWrap: "wrap",
            padding: "10px 16px 0", borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}>
            {attachments.map((a, i) => (
              <div key={i} className="attach-chip">
                {a.preview
                  ? <img src={a.preview} alt="" style={{ width: 16, height: 16, borderRadius: 3, objectFit: "cover" }} />
                  : null}
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 90 }}>
                  {a.file.name}
                </span>
                <button
                  onClick={() => removeAttachment(i)}
                  style={{ background: "none", border: "none", cursor: "pointer",
                    color: "#64748b", display: "flex", padding: 0, marginLeft: 2 }}
                >
                  <X style={{ width: 11, height: 11 }} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          className="input-textarea"
          placeholder="Ask BlackEye anything..."
          value={text}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
          onKeyDown={onKey}
          disabled={disabled}
          rows={1}
        />

        {/* Bottom bar */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "6px 12px 10px", gap: 8,
        }}>
          {/* Left actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button className="icon-btn" title="Attach file" onClick={() => fileRef.current?.click()}>
              <Paperclip style={{ width: 14, height: 14 }} />
            </button>
            <button className="icon-btn" title="Upload image" onClick={() => imgRef.current?.click()}>
              <ImagePlus style={{ width: 14, height: 14 }} />
            </button>
            <motion.button
              className="icon-btn"
              title="Voice input"
              onClick={toggleListening}
              style={{
                background: isListening
                  ? voiceState === "stopping"
                    ? "rgba(139, 92, 246, 0.15)"
                    : "rgba(239, 68, 68, 0.15)"
                  : "transparent",
                border: isListening
                  ? voiceState === "stopping"
                    ? "1px solid rgba(139, 92, 246, 0.3)"
                    : "1px solid rgba(239, 68, 68, 0.3)"
                  : "1px solid transparent",
                color: isListening
                  ? voiceState === "stopping"
                    ? "#a5b4fc"
                    : "#ef4444"
                  : "#94a3b8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              animate={{
                scale: isListening ? [1, 1.08, 1] : 1,
                boxShadow: isListening
                  ? voiceState === "stopping"
                    ? "0 0 16px rgba(139,92,246,0.4)"
                    : "0 0 16px rgba(239,68,68,0.4)"
                  : "none",
              }}
              transition={isListening ? { repeat: Infinity, duration: 1.5 } : {}}
            >
              <Mic style={{ width: 14, height: 14 }} />
            </motion.button>

            <AnimatePresence>
              {isListening && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: voiceState === "stopping" ? 100 : 90 }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: "flex", alignItems: "center", gap: 3, marginLeft: 4, overflow: "hidden" }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      color: voiceState === "stopping" ? "#a5b4fc" : "#ef4444",
                      fontWeight: 700,
                      marginRight: 2,
                      whiteSpace: "nowrap",
                      transition: "color 0.3s",
                    }}
                  >
                    {voiceState === "stopping" ? "Stopping..." : "Listening"}
                  </span>
                  {[1, 2, 3, 4].map((bar) => (
                    <motion.div
                      key={bar}
                      style={{
                        width: 2,
                        height: 10,
                        borderRadius: 1,
                        background: voiceState === "stopping" ? "#a5b4fc" : "#ef4444",
                        transition: "background 0.3s",
                      }}
                      animate={{
                        height: voiceState === "stopping" ? [3, 6, 3] : [3, 12, 3],
                      }}
                      transition={{
                        duration: voiceState === "stopping" ? 1.0 : 0.6,
                        repeat: Infinity,
                        delay: bar * 0.12,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Model selector */}
            <div ref={modelRef} style={{ position: "relative" }}>
              <button
                className="model-selector"
                onClick={() => setShowModel((v) => !v)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "4px 10px",
                  borderRadius: 8,
                  fontSize: "11.5px",
                  fontWeight: 600,
                  transition: "all 0.2s",
                }}
              >
                <span style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
                  display: "inline-block", flexShrink: 0,
                }} />
                {model}
                <ChevronDown style={{ width: 11, height: 11, color: "rgba(255,255,255,0.4)" }} />
              </button>

              <AnimatePresence>
                {showModel && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      position: "absolute", bottom: "calc(100% + 8px)", left: 0,
                      background: "rgba(8,12,30,0.95)", border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 12, padding: "6px 0", minWidth: 170,
                      backdropFilter: "blur(24px)", zIndex: 200,
                      boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
                    }}
                  >
                    {MODELS.map((m) => (
                      <button
                        key={m}
                        onClick={() => { setModel(m); setShowModel(false); }}
                        style={{
                          width: "100%", background: m === model ? "rgba(99,102,241,0.12)" : "none",
                          border: "none", cursor: "pointer", padding: "8px 14px",
                          textAlign: "left", fontSize: 12.5,
                          color: m === model ? "#a5b4fc" : "#64748b",
                          transition: "all 0.15s", display: "flex", alignItems: "center", gap: 8,
                        }}
                        onMouseEnter={(e) => { if (m !== model) (e.currentTarget as HTMLButtonElement).style.color = "#f1f5f9"; }}
                        onMouseLeave={(e) => { if (m !== model) (e.currentTarget as HTMLButtonElement).style.color = "#64748b"; }}
                      >
                        <span style={{
                          width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
                          background: m === model ? "linear-gradient(135deg,#4f46e5,#7c3aed)" : "rgba(100,116,139,0.4)",
                        }} />
                        {m}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right: char count + send */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {text.length > 0 && (
              <span style={{
                fontSize: 11, fontFamily: "var(--font-mono)",
                color: text.length > 3000 ? "#f87171" : "rgba(100,116,139,0.6)",
              }}>
                {text.length}
              </span>
            )}
            <button
              className="send-btn"
              onClick={send}
              disabled={!canSend}
              title="Send (Enter)"
            >
              <SendHorizonal style={{ width: 16, height: 16, color: "#fff" }} />
            </button>
          </div>
        </div>
      </div>

      {/* Helper text */}
      <p style={{
        textAlign: "center", fontSize: 11, color: "rgba(100,116,139,0.5)",
        marginTop: 8, fontFamily: "var(--font-mono)",
      }}>
        Enter to send · Shift+Enter for newline · Supports files & images
      </p>

      {/* Hidden file inputs */}
      <input ref={fileRef} type="file" multiple style={{ display: "none" }}
        accept=".pdf,.txt,.md,.js,.ts,.py,.json,.csv"
        onChange={(e) => { if (e.target.files?.length) addFiles(Array.from(e.target.files)); e.target.value = ""; }} />
      <input ref={imgRef} type="file" multiple style={{ display: "none" }}
        accept="image/*"
        onChange={(e) => { if (e.target.files?.length) addFiles(Array.from(e.target.files)); e.target.value = ""; }} />
    </div>
  );
}
