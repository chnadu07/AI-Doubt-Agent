"use client";
import { useState, useEffect } from "react";
import {
  MessageSquarePlus,
  Search,
  Cpu,
  FolderOpen,
  Bot,
  BarChart3,
  Settings,
  Menu,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  History,
  X,
  Plus,
  User,
  Zap,
  Eye,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
  onNewChat: () => void;
  recentChats: any[];
  onSelectRecentChat: (chat: any) => void;
  activeChatId?: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const NAV_ITEMS = [
  { icon: Cpu, label: "AI Workspace", active: true },
  { icon: Bot, label: "Agents" },
  { icon: BarChart3, label: "Analytics" },
];

const PROJECTS = [
  { name: "Alpha Resolve", color: "#6366f1" },
  { name: "Beta Core Engine", color: "#3b82f6" },
  { name: "BlackEye Core UI", color: "#8b5cf6" },
];

export default function Sidebar({
  onNewChat,
  recentChats = [],
  onSelectRecentChat,
  activeChatId,
  isOpen,
  setIsOpen,
}: SidebarProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeItem, setActiveItem] = useState("AI Workspace");

  // Track viewport sizes for responsiveness
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setIsOpen(false); // Start collapsed on tablet/mobile
      else setIsOpen(true); // Start open on desktop
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuVariants = {
    open: { width: 275, x: 0 },
    collapsed: { width: 0, x: -275 },
  };

  const desktopMenuVariants = {
    open: { width: 275 },
    collapsed: { width: 70 },
  };

  const contentVariants = {
    open: { opacity: 1, display: "flex" },
    collapsed: { opacity: 0, transitionEnd: { display: "none" } },
  };

  const itemClick = (item: string) => {
    setActiveItem(item);
  };

  const renderedContent = (
    <div style={{
      display: "flex", flexDirection: "column", height: "100%", width: 275,
      background: "linear-gradient(180deg, #050816 0%, #080c25 100%)",
      borderRight: "1px solid rgba(255,255,255,0.06)",
      position: "relative",
      boxSizing: "border-box",
    }}>
      {/* Grid Overlay inside sidebar */}
      <div className="bg-grid absolute inset-0 opacity-5 pointer-events-none" />

      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)",
        position: "relative", zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: "linear-gradient(135deg, #8b5cf6 0%, #4f46e5 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 16px rgba(139,92,246,0.5)",
          }}>
            <Eye style={{ width: 14, height: 14, color: "#fff" }} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: "-0.01em", color: "#f8fafc" }}>
              Black<span className="gradient-text" style={{ fontWeight: 800 }}>Eye</span>
            </div>
            <div style={{ fontSize: 7.5, fontFamily: "var(--font-mono)", color: "rgba(165,180,252,0.6)", textTransform: "uppercase", letterSpacing: "0.15em" }}>
              COSMIC AI ENGINE
            </div>
          </div>
        </div>

        {/* Desktop Collapse Trigger */}
        {!isMobile && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="icon-btn"
            style={{ width: 26, height: 26, borderRadius: 7 }}
            title="Collapse Sidebar"
          >
            <ChevronLeft style={{ width: 14, height: 14 }} />
          </button>
        )}

        {/* Mobile Close Trigger */}
        {isMobile && (
          <button
            onClick={() => setIsOpen(false)}
            className="icon-btn"
            style={{ width: 26, height: 26, borderRadius: 7 }}
          >
            <X style={{ width: 14, height: 14 }} />
          </button>
        )}
      </div>

      {/* Navigation Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 14px", display: "flex", flexDirection: "column", gap: 20 }}>
        
        {/* New Chat Button */}
        <motion.button
          whileHover={{ scale: 1.015, translateY: -1 }}
          whileTap={{ scale: 0.985 }}
          onClick={() => {
            onNewChat();
            if (isMobile) setIsOpen(false);
          }}
          style={{
            width: "100%", padding: "11px 16px", borderRadius: 12,
            background: "linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(124,58,237,0.06) 100%)",
            border: "1px solid rgba(99,102,241,0.3)",
            color: "#a5b4fc", fontSize: 13, fontWeight: 600,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            cursor: "pointer", boxShadow: "0 4px 20px rgba(99,102,241,0.05)",
          }}
        >
          <MessageSquarePlus style={{ width: 14, height: 14 }} />
          New Chat
        </motion.button>

        {/* Search Input */}
        <div style={{ position: "relative" }}>
          <Search style={{ width: 13, height: 13, color: "rgba(148,163,184,0.4)", position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
          <input
            type="text"
            placeholder="Search queries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%", background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10,
              padding: "8px 12px 8px 32px", fontSize: 12, color: "#f1f5f9",
              outline: "none", boxSizing: "border-box", transition: "all 0.2s",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "rgba(99,102,241,0.35)";
              e.target.style.boxShadow = "0 0 10px rgba(99,102,241,0.05)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "rgba(255,255,255,0.06)";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>

        {/* Core items */}
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeItem === item.label;
            return (
              <button
                key={item.label}
                onClick={() => menuClick(item.label)}
                style={{
                  width: "100%", padding: "9px 12px", borderRadius: 9,
                  background: active ? "rgba(99,102,241,0.08)" : "transparent",
                  border: "1px solid",
                  borderColor: active ? "rgba(99,102,241,0.25)" : "transparent",
                  color: active ? "#a5b4fc" : "#64748b",
                  fontSize: 12.5, fontWeight: active ? 600 : 500,
                  display: "flex", alignItems: "center", gap: 10,
                  cursor: "pointer", transition: "all 0.2s", textAlign: "left",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.025)";
                    e.currentTarget.style.color = "#94a3b8";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#64748b";
                  }
                }}
              >
                <Icon style={{ width: 14, height: 14, color: active ? "#818cf8" : "inherit" }} />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Recents Section */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "0 6px", fontSize: 10.5, fontFamily: "var(--font-mono)",
            color: "rgba(100,116,139,0.7)", letterSpacing: "0.08em",
            textTransform: "uppercase", fontWeight: 600,
          }}>
            <History style={{ width: 11, height: 11 }} />
            Recents
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {recentChats.length === 0 ? (
              <div style={{ padding: "8px 10px", fontSize: 11.5, color: "rgba(100,116,139,0.5)", fontStyle: "italic" }}>
                No recent queries
              </div>
            ) : (
              recentChats
                .filter((chat) =>
                  chat.doubtText.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .slice(0, 10)
                .map((chat) => {
                  const isActive = activeChatId === chat.id;
                  return (
                    <button
                      key={chat.id}
                      onClick={() => onSelectRecentChat(chat)}
                      style={{
                        width: "100%", padding: "8px 10px", borderRadius: 8,
                        background: isActive ? "rgba(99,102,241,0.08)" : "transparent",
                        border: "none",
                        color: isActive ? "#a5b4fc" : "#64748b",
                        fontSize: 12, fontWeight: isActive ? 600 : 500,
                        textAlign: "left", cursor: "pointer", transition: "all 0.2s",
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                          e.currentTarget.style.color = "#94a3b8";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.color = "#64748b";
                        }
                      }}
                    >
                      {chat.doubtText}
                    </button>
                  );
                })
            )}
          </div>
        </div>

        {/* Projects Section */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "0 6px", fontSize: 10.5, fontFamily: "var(--font-mono)",
            color: "rgba(100,116,139,0.7)", letterSpacing: "0.08em",
            textTransform: "uppercase", fontWeight: 600,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <FolderOpen style={{ width: 11, height: 11 }} />
              Projects
            </div>
            <button className="icon-btn" style={{ width: 18, height: 18, borderRadius: 5 }} title="New Project">
              <Plus style={{ width: 10, height: 10 }} />
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {PROJECTS.map((proj) => (
              <button
                key={proj.name}
                style={{
                  width: "100%", padding: "8px 10px", borderRadius: 8,
                  background: "transparent", border: "none",
                  color: "#64748b", fontSize: 12,
                  display: "flex", alignItems: "center", gap: 8,
                  textAlign: "left", cursor: "pointer", transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                  e.currentTarget.style.color = "#94a3b8";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#64748b";
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: proj.color }} />
                {proj.name}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* User Footer Profile */}
      <div style={{
        padding: "16px 14px", borderTop: "1px solid rgba(255,255,255,0.05)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(5,8,22,0.4)", backdropFilter: "blur(8px)",
        position: "relative", zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <User style={{ width: 14, height: 14, color: "#fff" }} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: "#f1f5f9", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              Core Dev
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 1 }}>
              <Sparkles style={{ width: 10, height: 10, color: "#a5b4fc" }} />
              <span style={{ fontSize: 9.5, color: "#a5b4fc", fontWeight: 600 }}>Pro Enterprise</span>
            </div>
          </div>
        </div>

        <button className="icon-btn" title="Settings" style={{ width: 28, height: 28, borderRadius: 7 }}>
          <Settings style={{ width: 13, height: 13 }} />
        </button>
      </div>
    </div>
  );

  const menuClick = (label: string) => {
    itemClick(label);
    if (isMobile) setIsOpen(false);
  };

  // ── Render drawer on mobile, static on desktop
  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              style={{
                position: "fixed", inset: 0, zIndex: 150,
                background: "rgba(3,5,15,0.7)", backdropFilter: "blur(8px)",
              }}
            />

            {/* Slide-out Drawer */}
            <motion.div
              variants={menuVariants}
              initial="collapsed"
              animate="open"
              exit="collapsed"
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              style={{
                position: "fixed", top: 0, bottom: 0, left: 0, zIndex: 200,
                display: "flex", flexDirection: "column", height: "100dvh",
              }}
            >
              {renderedContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  // Desktop sidebar (supports compact 70px or full 275px width dynamically)
  return (
    <motion.div
      variants={desktopMenuVariants}
      animate={isOpen ? "open" : "collapsed"}
      transition={{ type: "spring", damping: 24, stiffness: 200 }}
      style={{
        height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column",
        flexShrink: 0, background: "#050816",
      }}
    >
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="expanded"
            variants={contentVariants}
            initial="collapsed"
            animate="open"
            exit="collapsed"
            transition={{ duration: 0.2 }}
            style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column" }}
          >
            {renderedContent}
          </motion.div>
        ) : (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{
              width: 70, height: "100%", display: "flex", flexDirection: "column",
              alignItems: "center", padding: "16px 0", gap: 18,
              borderRight: "1px solid rgba(255,255,255,0.06)",
              background: "linear-gradient(180deg, #050816 0%, #080c25 100%)",
              position: "relative",
            }}
          >
            <div className="bg-grid absolute inset-0 opacity-5 pointer-events-none" />

            {/* Compact Logo */}
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: "linear-gradient(135deg, #8b5cf6 0%, #4f46e5 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 16px rgba(139,92,246,0.5)",
            }}>
              <Eye style={{ width: 14, height: 14, color: "#fff" }} />
            </div>

            {/* Divider */}
            <div style={{ width: "60%", height: 1, background: "rgba(255,255,255,0.05)" }} />

            {/* Expand button */}
            <button
              onClick={() => setIsOpen(true)}
              className="icon-btn"
              style={{ width: 28, height: 28, borderRadius: 8 }}
              title="Expand Sidebar"
            >
              <ChevronRight style={{ width: 14, height: 14 }} />
            </button>

            {/* Core compact icons */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1, justifyContent: "center" }}>
              <button className="icon-btn" title="New Chat" onClick={onNewChat} style={{ width: 34, height: 34, borderRadius: 9 }}>
                <MessageSquarePlus style={{ width: 16, height: 16 }} />
              </button>
              <button className="icon-btn" title="AI Workspace" onClick={() => itemClick("AI Workspace")} style={{ width: 34, height: 34, borderRadius: 9 }}>
                <Cpu style={{ width: 16, height: 16 }} />
              </button>
              <button className="icon-btn" title="Agents" onClick={() => itemClick("Agents")} style={{ width: 34, height: 34, borderRadius: 9 }}>
                <Bot style={{ width: 16, height: 16 }} />
              </button>
            </div>

            {/* Profile Avatar Compact */}
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
            }} title="Profile">
              <User style={{ width: 14, height: 14, color: "#fff" }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
