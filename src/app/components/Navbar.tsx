"use client";
import { useState, useEffect, useRef } from "react";
import {
  Zap,
  Eye,
  Settings,
  User,
  Menu,
  Sparkles,
  CreditCard,
  History,
  Shield,
  LogOut,
  X,
  Palette,
  Sliders,
  Bell,
  Trash2,
  Download,
  Keyboard,
  Globe,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
  onClearHistory: () => void;
  messages: any[];
}

export default function Navbar({
  onToggleSidebar,
  sidebarOpen,
  onClearHistory,
  messages,
}: NavbarProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // Settings Local States
  const [theme, setTheme] = useState<"dark" | "light" | "system">("dark");
  const [model, setModel] = useState<"gemini-2.5-flash" | "gemini-1.5-pro">("gemini-2.5-flash");
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [showNotifications, setShowNotifications] = useState(true);

  const profileRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Close overlays on ESC keypress
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsProfileOpen(false);
        setIsSettingsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close profile on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Export current chat history log
  const handleExport = () => {
    if (messages.length === 0) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(messages, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "blackeye_chats.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <nav className="navbar" style={{ paddingLeft: 16, position: "sticky", top: 0, zIndex: 100 }}>
      {/* Left items */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {/* Hamburger Menu Trigger */}
        <button
          onClick={onToggleSidebar}
          className="icon-btn"
          style={{ display: "flex", width: 32, height: 32, borderRadius: 8 }}
          title="Toggle Sidebar"
        >
          <Menu style={{ width: 16, height: 16 }} />
        </button>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              background: "linear-gradient(135deg, #8b5cf6 0%, #4f46e5 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 20px rgba(139,92,246,0.5), 0 0 40px rgba(139,92,246,0.15)",
              flexShrink: 0,
            }}
          >
            <Eye style={{ width: 16, height: 16, color: "#fff" }} />
          </div>
          <div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: "-0.01em",
                color: "#f1f5f9",
                lineHeight: 1.2,
              }}
            >
              Black{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #a78bfa, #818cf8)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Eye
              </span>
            </div>
            <div
              style={{
                fontSize: 8.5,
                fontFamily: "var(--font-mono)",
                color: "rgba(165,180,252,0.6)",
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                lineHeight: 1.2,
              }}
            >
              COSMIC AI WORKSPACE
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, position: "relative" }}>
        {/* Settings button */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          className={`icon-btn ${isSettingsOpen ? "active" : ""}`}
          title="Settings Preferences"
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            border: isSettingsOpen ? "1px solid rgba(99,102,241,0.3)" : "1px solid transparent",
            background: isSettingsOpen ? "rgba(99,102,241,0.08)" : "transparent",
          }}
        >
          <Settings style={{ width: 14, height: 14 }} />
        </button>

        {/* Profile Button Wrapper */}
        <div ref={profileRef} style={{ position: "relative" }}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            title="Profile"
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: isProfileOpen ? "0 0 14px rgba(99,102,241,0.6)" : "none",
              transform: isProfileOpen ? "scale(1.05)" : "none",
              transition: "all 0.2s",
            }}
          >
            <User style={{ width: 14, height: 14, color: "#fff" }} />
          </button>

          {/* Profile Dropdown */}
          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 8 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: "absolute",
                  right: 0,
                  top: "40px",
                  width: 270,
                  background: "rgba(8,12,30,0.92)",
                  backdropFilter: "blur(24px)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 16,
                  boxShadow: "0 10px 40px rgba(0,0,0,0.65), 0 0 24px rgba(99,102,241,0.03)",
                  padding: "16px 14px",
                  zIndex: 150,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {/* Header Profile Details */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: 12 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 10,
                    background: "linear-gradient(135deg, #8b5cf6 0%, #4f46e5 100%)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <User style={{ width: 16, height: 16, color: "#fff" }} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: "#f8fafc" }}>Core Dev</div>
                    <div style={{ fontSize: 10, color: "rgba(165,180,252,0.6)", overflow: "hidden", textOverflow: "ellipsis" }}>developer@blackeye.ai</div>
                  </div>
                </div>

                {/* Account Details & Plan */}
                <div style={{
                  padding: "10px 12px", borderRadius: 10,
                  background: "rgba(99,102,241,0.06)",
                  border: "1px solid rgba(99,102,241,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Sparkles style={{ width: 12, height: 12, color: "#a5b4fc" }} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#a5b4fc" }}>Pro Enterprise</span>
                  </div>
                  <span style={{ fontSize: 8, padding: "2px 6px", borderRadius: 4, background: "rgba(99,102,241,0.3)", color: "#fff", fontWeight: 700, textTransform: "uppercase" }}>Active</span>
                </div>

                {/* Dropdown Items */}
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {[
                    { icon: CreditCard, label: "Billing & Invoices" },
                    { icon: History, label: "Saved Resolutions" },
                    { icon: Shield, label: "Workspace Security" },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.label}
                        onClick={() => setIsProfileOpen(false)}
                        style={{
                          width: "100%", padding: "8px 10px", borderRadius: 8,
                          background: "transparent", border: "none",
                          color: "#94a3b8", fontSize: 12, fontWeight: 500,
                          display: "flex", alignItems: "center", gap: 8,
                          textAlign: "left", cursor: "pointer", transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                          e.currentTarget.style.color = "#f1f5f9";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.color = "#94a3b8";
                        }}
                      >
                        <Icon style={{ width: 13, height: 13, color: "rgba(148,163,184,0.5)" }} />
                        {item.label}
                      </button>
                    );
                  })}
                </div>

                <div style={{ width: "100%", height: 1, background: "rgba(255,255,255,0.05)" }} />

                {/* Upgrade Button */}
                <button
                  style={{
                    width: "100%", padding: "9px 0", borderRadius: 10,
                    background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                    color: "#fff", fontSize: 12, fontWeight: 600,
                    border: "none", cursor: "pointer", textAlign: "center",
                    boxShadow: "0 4px 16px rgba(99,102,241,0.25)",
                  }}
                  onClick={() => setIsProfileOpen(false)}
                >
                  Upgrade Membership
                </button>

                {/* Logout */}
                <button
                  style={{
                    width: "100%", padding: "8px 10px", borderRadius: 8,
                    background: "transparent", border: "none",
                    color: "#f87171", fontSize: 12, fontWeight: 600,
                    display: "flex", alignItems: "center", gap: 8,
                    textAlign: "left", cursor: "pointer", transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(248,113,113,0.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                  onClick={() => setIsProfileOpen(false)}
                >
                  <LogOut style={{ width: 13, height: 13 }} />
                  Logout Session
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Settings Modal overlay */}
      <AnimatePresence>
        {isSettingsOpen && (
          <div style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSettingsOpen(false)}
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(3,5,15,0.72)",
                backdropFilter: "blur(12px)",
              }}
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              style={{
                width: "min(560px, calc(100% - 32px))",
                zIndex: 10,
                background: "linear-gradient(135deg, #090e24 0%, #060814 100%)",
                border: "1px solid rgba(99,102,241,0.25)",
                borderRadius: 24,
                boxShadow: "0 24px 80px rgba(0,0,0,0.8), 0 0 60px rgba(99,102,241,0.08)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Modal Header */}
              <div style={{
                padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#f8fafc" }}>Workspace Settings</div>
                  <div style={{ fontSize: 11, color: "rgba(148,163,184,0.5)", marginTop: 2 }}>Preferences and account credentials</div>
                </div>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="icon-btn"
                  style={{ width: 28, height: 28, borderRadius: 8 }}
                >
                  <X style={{ width: 14, height: 14 }} />
                </button>
              </div>

              {/* Modal Content Preferences scroll list */}
              <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20, maxHeight: 420, overflowY: "auto" }}>
                
                {/* Theme Selector */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(255,255,255,0.02)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Palette style={{ width: 14, height: 14, color: "#818cf8" }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>Visual Theme</div>
                      <div style={{ fontSize: 10.5, color: "rgba(148,163,184,0.5)" }}>Adjust platform look and feel</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 8, padding: 2, gap: 2 }}>
                    {(["dark", "light", "system"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTheme(t)}
                        style={{
                          padding: "4px 10px", fontSize: 11, fontWeight: 600, borderRadius: 6,
                          background: theme === t ? "rgba(99,102,241,0.15)" : "transparent",
                          border: "1px solid",
                          borderColor: theme === t ? "rgba(99,102,241,0.25)" : "transparent",
                          color: theme === t ? "#a5b4fc" : "#64748b",
                          cursor: "pointer", textTransform: "capitalize", transition: "all 0.15s",
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* AI Model Selector */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(255,255,255,0.02)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Sliders style={{ width: 14, height: 14, color: "#818cf8" }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>Default AI Model</div>
                      <div style={{ fontSize: 10.5, color: "rgba(148,163,184,0.5)" }}>Select active resolution engine</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 8, padding: 2, gap: 2 }}>
                    {[
                      { value: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
                      { value: "gemini-1.5-pro", label: "Gemini 1.5 Pro" },
                    ].map((m) => (
                      <button
                        key={m.value}
                        onClick={() => setModel(m.value as any)}
                        style={{
                          padding: "4px 10px", fontSize: 11, fontWeight: 600, borderRadius: 6,
                          background: model === m.value ? "rgba(99,102,241,0.15)" : "transparent",
                          border: "1px solid",
                          borderColor: model === m.value ? "rgba(99,102,241,0.25)" : "transparent",
                          color: model === m.value ? "#a5b4fc" : "#64748b",
                          cursor: "pointer", transition: "all 0.15s",
                        }}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Animation Preference */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(255,255,255,0.02)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Globe style={{ width: 14, height: 14, color: "#818cf8" }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>Apple Motion Physics</div>
                      <div style={{ fontSize: 10.5, color: "rgba(148,163,184,0.5)" }}>Toggle blur and mount animation curves</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setAnimationsEnabled(!animationsEnabled)}
                    style={{
                      width: 42, height: 22, borderRadius: 12,
                      background: animationsEnabled ? "#4f46e5" : "rgba(255,255,255,0.08)",
                      border: "none", cursor: "pointer", position: "relative",
                      padding: 2, display: "flex", alignItems: "center",
                      transition: "background 0.2s",
                    }}
                  >
                    <motion.div
                      layout
                      style={{
                        width: 18, height: 18, borderRadius: "50%",
                        background: "#fff", boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                      }}
                      animate={{ x: animationsEnabled ? 20 : 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>

                {/* Notifications */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(255,255,255,0.02)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Bell style={{ width: 14, height: 14, color: "#818cf8" }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>Sound & Notifications</div>
                      <div style={{ fontSize: 10.5, color: "rgba(148,163,184,0.5)" }}>Receive audio haptics upon AI resolution</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    style={{
                      width: 42, height: 22, borderRadius: 12,
                      background: showNotifications ? "#4f46e5" : "rgba(255,255,255,0.08)",
                      border: "none", cursor: "pointer", position: "relative",
                      padding: 2, display: "flex", alignItems: "center",
                      transition: "background 0.2s",
                    }}
                  >
                    <motion.div
                      layout
                      style={{
                        width: 18, height: 18, borderRadius: "50%",
                        background: "#fff", boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                      }}
                      animate={{ x: showNotifications ? 20 : 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>

                <div style={{ width: "100%", height: 1, background: "rgba(255,255,255,0.05)" }} />

                {/* Keyboard shortcuts preview */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: 6 }}>
                    <Keyboard style={{ width: 12, height: 12 }} />
                    Keyboard Shortcuts
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {[
                      { keys: ["Ctrl", "Enter"], desc: "Submit query to engine" },
                      { keys: ["Esc"], desc: "Close preference panels" },
                      { keys: ["Ctrl", "Shift", "P"], desc: "Toggle collapsible sidebar" },
                    ].map((shortcut) => (
                      <div key={shortcut.desc} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 12, color: "rgba(148,163,184,0.7)" }}>{shortcut.desc}</span>
                        <div style={{ display: "flex", gap: 4 }}>
                          {shortcut.keys.map((k) => (
                            <span key={k} style={{
                              fontSize: 10, padding: "2px 6px", borderRadius: 4,
                              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
                              color: "#94a3b8", fontFamily: "var(--font-mono)",
                            }}>{k}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ width: "100%", height: 1, background: "rgba(255,255,255,0.05)" }} />

                {/* Action Section: Export / Clear chats */}
                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    onClick={() => {
                      handleExport();
                      setIsSettingsOpen(false);
                    }}
                    disabled={messages.length === 0}
                    style={{
                      flex: 1, padding: "10px 14px", borderRadius: 10,
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      color: messages.length === 0 ? "#475569" : "#e2e8f0",
                      fontSize: 12.5, fontWeight: 600,
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      cursor: messages.length === 0 ? "not-allowed" : "pointer",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      if (messages.length > 0) {
                        e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (messages.length > 0) {
                        e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                      }
                    }}
                  >
                    <Download style={{ width: 14, height: 14 }} />
                    Export Chats
                  </button>

                  <button
                    onClick={() => {
                      onClearHistory();
                      setIsSettingsOpen(false);
                    }}
                    style={{
                      flex: 1, padding: "10px 14px", borderRadius: 10,
                      background: "rgba(248,113,113,0.05)",
                      border: "1px solid rgba(248,113,113,0.15)",
                      color: "#f87171", fontSize: 12.5, fontWeight: 600,
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      cursor: "pointer", transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(248,113,113,0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(248,113,113,0.05)";
                    }}
                  >
                    <Trash2 style={{ width: 14, height: 14 }} />
                    Clear Chat Logs
                  </button>
                </div>

              </div>

              {/* Modal Footer */}
              <div style={{
                padding: "16px 24px", borderTop: "1px solid rgba(255,255,255,0.05)",
                background: "rgba(5,8,22,0.3)", display: "flex", justifyContent: "flex-end",
              }}>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  style={{
                    padding: "8px 20px", borderRadius: 10,
                    background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                    color: "#fff", fontSize: 12, fontWeight: 600,
                    border: "none", cursor: "pointer", boxShadow: "0 4px 16px rgba(99,102,241,0.2)",
                  }}
                >
                  Save Settings
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
}
