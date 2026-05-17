"use client";
import { StreamingText } from "./MarkdownRenderer";
import { Copy, Check, ThumbsUp, ThumbsDown, Zap, Eye, Pencil } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
  attachments?: { name: string; type: string; preview?: string }[];
}

/* ── Thinking indicator ───────────────────── */
export function ThinkingBubble() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{ display: "flex", width: "100%", padding: "8px 0" }}
    >
      <div className="msg-ai" style={{ padding: "20px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 22, height: 22, borderRadius: 6,
            background: "linear-gradient(135deg, #8b5cf6, #4f46e5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 12px rgba(139,92,246,0.45)",
          }}>
            <Eye style={{ width: 10, height: 10, color: "#fff" }} />
          </div>
          <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "#a5b4fc", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 600 }}>
            BlackEye is resolving
          </span>
          <div style={{ display: "flex", gap: 4, marginLeft: 4 }}>
            <span className="thinking-dot" />
            <span className="thinking-dot" />
            <span className="thinking-dot" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Skeleton shimmer ─────────────────────── */
export function SkeletonMessage() {
  return (
    <div style={{ display: "flex", width: "100%", padding: "8px 0" }}>
      <div className="msg-ai" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div className="skeleton" style={{ height: 16, width: "85%" }} />
        <div className="skeleton" style={{ height: 16, width: "65%" }} />
        <div className="skeleton" style={{ height: 16, width: "75%" }} />
      </div>
    </div>
  );
}

/* ── Single chat message ──────────────────── */
export function ChatMessage({
  msg,
  onEditMessage,
}: {
  msg: Message;
  onEditMessage?: (id: string, newText: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState<boolean | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(msg.content);
  const [isHovered, setIsHovered] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (editText.trim() && onEditMessage) {
        onEditMessage(msg.id, editText);
        setIsEditing(false);
      }
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setEditText(msg.content);
    }
  };

  if (msg.role === "user") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12, filter: "blur(3px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        style={{ display: "flex", width: "100%", padding: "6px 0" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div 
          className="msg-user"
          style={{
            border: isEditing ? "1px solid rgba(139, 92, 246, 0.3)" : undefined,
            boxShadow: isEditing ? "0 0 20px rgba(139, 92, 246, 0.1)" : undefined,
          }}
        >
          {/* Sleek User Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, borderBottom: "1px solid rgba(99,102,241,0.15)", paddingBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 16, height: 16, borderRadius: 5,
                background: "rgba(99,102,241,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#818cf8" }} />
              </div>
              <span style={{ fontSize: 10.5, fontFamily: "var(--font-mono)", color: "#a5b4fc", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 600 }}>
                USER PROMPT
              </span>
            </div>

            {onEditMessage && !isEditing && isHovered && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setIsEditing(true)}
                style={{
                  background: "rgba(99,102,241,0.06)",
                  border: "1px solid rgba(99,102,241,0.2)",
                  borderRadius: 6,
                  padding: "4px 8px",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  cursor: "pointer",
                  color: "#a5b4fc",
                  fontSize: 10,
                  fontFamily: "var(--font-mono)",
                  fontWeight: 600,
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(99,102,241,0.15)";
                  e.currentTarget.style.borderColor = "rgba(99,102,241,0.4)";
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(99,102,241,0.06)";
                  e.currentTarget.style.borderColor = "rgba(99,102,241,0.2)";
                  e.currentTarget.style.color = "#a5b4fc";
                }}
              >
                <Pencil style={{ width: 10, height: 10 }} />
                EDIT
              </motion.button>
            )}
          </div>
          
          {isEditing ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                style={{
                  width: "100%",
                  minHeight: 90,
                  background: "rgba(5, 8, 22, 0.4)",
                  border: "1px solid rgba(139, 92, 246, 0.3)",
                  boxShadow: "0 0 15px rgba(139, 92, 246, 0.08)",
                  borderRadius: 12,
                  padding: 14,
                  color: "#f8fafc",
                  fontFamily: "inherit",
                  fontSize: "14.5px",
                  lineHeight: 1.7,
                  outline: "none",
                  resize: "vertical",
                  transition: "border-color 0.15s",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.6)";
                  e.currentTarget.style.boxShadow = "0 0 18px rgba(139, 92, 246, 0.18)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.3)";
                  e.currentTarget.style.boxShadow = "0 0 15px rgba(139, 92, 246, 0.08)";
                }}
              />
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditText(msg.content);
                  }}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 8,
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    color: "#94a3b8",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.color = "#f1f5f9";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                    e.currentTarget.style.color = "#94a3b8";
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (editText.trim() && onEditMessage) {
                      onEditMessage(msg.id, editText);
                      setIsEditing(false);
                    }
                  }}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 8,
                    background: "linear-gradient(135deg, #8b5cf6, #4f46e5)",
                    border: "none",
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: "0 0 12px rgba(139,92,246,0.35)",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 0 16px rgba(139,92,246,0.55)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 0 12px rgba(139,92,246,0.35)";
                  }}
                >
                  Save & Submit
                </button>
              </div>
            </div>
          ) : (
            <p style={{ fontSize: 14.5, lineHeight: 1.7, color: "#e2e8f0" }}>{msg.content}</p>
          )}

          {/* Attachment previews */}
          {msg.attachments && msg.attachments.length > 0 && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14, paddingTop: 12, borderTop: "1px solid rgba(99,102,241,0.12)" }}>
              {msg.attachments.map((a, i) =>
                a.preview ? (
                  <img key={i} src={a.preview} alt={a.name}
                    style={{ width: 90, height: 90, borderRadius: 10, objectFit: "cover",
                      border: "1px solid rgba(99,102,241,0.3)" }} />
                ) : (
                  <div key={i} className="attach-chip" style={{ background: "rgba(99,102,241,0.08)" }}>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.name}</span>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, filter: "blur(3px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      style={{ display: "flex", width: "100%", padding: "6px 0" }}
    >
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 10 }}>
        <div className="msg-ai">
          {/* Sleek Assistant Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <div style={{
                width: 22, height: 22, borderRadius: 6,
                background: "linear-gradient(135deg, #8b5cf6, #4f46e5)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 12px rgba(139,92,246,0.45)",
              }}>
                <Eye style={{ width: 10, height: 10, color: "#fff" }} />
              </div>
              <span style={{ fontSize: 10.5, fontFamily: "var(--font-mono)", color: "#a5b4fc", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 600 }}>
                BLACKEYE
              </span>
            </div>
            
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span className="status-dot" style={{ width: 5, height: 5 }} />
              <span style={{ fontSize: 9.5, fontFamily: "var(--font-mono)", color: "rgba(52,211,153,0.7)", letterSpacing: "0.08em", fontWeight: 600 }}>
                RESOLVED
              </span>
            </div>
          </div>

          <StreamingText text={msg.content} isStreaming={!!msg.isStreaming} />
        </div>

        {/* Action bar */}
        {!msg.isStreaming && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, paddingLeft: 12 }}>
            <button className="copy-btn" onClick={copy}>
              {copied
                ? <><Check style={{ width: 11, height: 11 }} />Copied</>
                : <><Copy style={{ width: 11, height: 11 }} />Copy</>}
            </button>
            <button
              className="copy-btn"
              onClick={() => setLiked(true)}
              style={{ color: liked === true ? "#34d399" : undefined,
                borderColor: liked === true ? "rgba(52,211,153,0.3)" : undefined }}
            >
              <ThumbsUp style={{ width: 11, height: 11 }} />
            </button>
            <button
              className="copy-btn"
              onClick={() => setLiked(false)}
              style={{ color: liked === false ? "#f87171" : undefined,
                borderColor: liked === false ? "rgba(248,113,113,0.3)" : undefined }}
            >
              <ThumbsDown style={{ width: 11, height: 11 }} />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
