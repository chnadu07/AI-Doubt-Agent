"use client";
import { Zap, Cpu, Globe, Code2, BookOpen, FlaskConical, Eye } from "lucide-react";
import { motion } from "framer-motion";

const SUGGESTIONS = [
  { icon: Code2,        label: "Debug my code",       prompt: "Help me debug this code and explain what's going wrong:" },
  { icon: Globe,        label: "Explain a concept",   prompt: "Explain this concept clearly with examples:" },
  { icon: FlaskConical, label: "Science & Math",    prompt: "Walk me through this step by step:" },
  { icon: BookOpen,     label: "Summarize content",   prompt: "Summarize the key points of this:" },
  { icon: Cpu,          label: "System design",       prompt: "Help me design a scalable system for:" },
  { icon: Zap,          label: "Quick answer",        prompt: "Give me a direct, concise answer to:" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function WelcomeScreen({ onSelect }: { onSelect: (prompt: string) => void }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100%",
        padding: "32px 24px 200px",
        textAlign: "center",
      }}
    >
      {/* Glow logo */}
      <motion.div
        variants={itemVariants}
        style={{
          width: 68,
          height: 68,
          borderRadius: 20,
          marginBottom: 28,
          background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 40px rgba(99,102,241,0.5), 0 0 80px rgba(99,102,241,0.15)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: -8,
            borderRadius: 28,
            background: "radial-gradient(circle, rgba(139,92,246,0.3), transparent 70%)",
            filter: "blur(8px)",
          }}
        />
        <Eye style={{ width: 28, height: 28, color: "#fff", position: "relative" }} />
      </motion.div>

      <motion.h1
        variants={itemVariants}
        style={{
          fontSize: "clamp(26px, 4vw, 38px)",
          fontWeight: 800,
          letterSpacing: "-0.025em",
          lineHeight: 1.15,
          marginBottom: 12,
        }}
      >
        <span style={{ color: "#f1f5f9" }}>How can </span>
        <span className="gradient-text">BlackEye</span>
        <br />
        <span style={{ color: "#f1f5f9" }}>help you today?</span>
      </motion.h1>

      <motion.p
        variants={itemVariants}
        style={{
          fontSize: 15,
          color: "#64748b",
          lineHeight: 1.65,
          maxWidth: 480,
          marginBottom: 44,
        }}
      >
        Ask anything — code, science, math, news, design, or general knowledge.
        <br />
        Powered by Gemini 2.5 Flash for instant, expert-level answers.
      </motion.p>

      {/* Suggestion cards */}
      <motion.div
        variants={itemVariants}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 10,
          width: "100%",
          maxWidth: 680,
        }}
      >
        {SUGGESTIONS.map(({ icon: Icon, label, prompt }) => (
          <motion.button
            key={label}
            whileHover={{ scale: 1.025, translateY: -2 }}
            whileTap={{ scale: 0.98 }}
            className="welcome-card"
            onClick={() => onSelect(prompt)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "none",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
              width: "100%",
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 9,
                flexShrink: 0,
                background: "rgba(99,102,241,0.12)",
                border: "1px solid rgba(99,102,241,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon style={{ width: 15, height: 15, color: "#818cf8" }} />
            </div>
            <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500 }}>{label}</span>
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
}
