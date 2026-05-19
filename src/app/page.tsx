"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Navbar from "./components/Navbar";
import Background from "./components/Background";
import WelcomeScreen from "./components/WelcomeScreen";
import InputDock from "./components/InputDock";
import Sidebar from "./components/Sidebar";
import Loader from "./components/Loader";
import {
  ChatMessage,
  ThinkingBubble,
  type Message,
} from "./components/ChatMessage";

const toB64 = (f: File): Promise<{ mimeType: string; data: string }> =>
  new Promise((res, rej) => {
    const r = new FileReader();
    r.readAsDataURL(f);
    r.onload = () => {
      const [m, d] = (r.result as string).split(",");
      res({ mimeType: m.split(":")[1].split(";")[0], data: d });
    };
    r.onerror = rej;
  });

let idCounter = 0;
const uid = () => `msg-${Date.now()}-${idCounter++}`;

export default function BlackEyeChat() {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [thinking, setThinking] = useState(false);
  const [suggestionPrompt, setSuggestionPrompt] = useState<string | undefined>();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [recentChats, setRecentChats] = useState<any[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | undefined>();
  const bottomRef = useRef<HTMLDivElement>(null);
  const chatAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // 3 seconds simulated system load
    return () => clearTimeout(timer);
  }, []);

  /* Auto-scroll */
  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, thinking]);

  /* Fetch history from SQLite */
  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch("/api/history");
      const data = await res.json();
      if (data.success && data.doubts) {
        setRecentChats(data.doubts);
      }
    } catch (err) {
      console.error("Failed to load conversation history:", err);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  /* Click recent chat handler */
  const handleSelectRecentChat = useCallback((chat: any) => {
    setActiveChatId(chat.id);

    const userMsg: Message = {
      id: chat.id + "-user",
      role: "user",
      content: chat.doubtText,
      attachments: [],
    };

    let aiContent = chat.responseText || "";
    if (chat.codeSnippet && !aiContent.includes("```")) {
      aiContent += `\n\n\`\`\`\n${chat.codeSnippet}\n\`\`\``;
    }
    if (chat.rootCause && chat.rootCause !== "Architectural Question" && !aiContent.includes("**Root cause:**")) {
      aiContent += `\n\n> **Root cause:** ${chat.rootCause}`;
    }
    if (chat.conceptLink && !aiContent.includes("**Reference:**")) {
      aiContent += `\n\n> **Reference:** ${chat.conceptLink}`;
    }

    const aiMsg: Message = {
      id: chat.id + "-ai",
      role: "assistant",
      content: aiContent,
    };

    setMessages([userMsg, aiMsg]);
  }, []);

  /* Send handler */
  const handleSend = useCallback(
    async (text: string, attachments: { file: File; preview?: string }[]) => {
      if (!text.trim() || thinking) return;

      /* Build user message */
      const userMsg: Message = {
        id: uid(),
        role: "user",
        content: text,
        attachments: attachments.map((a) => ({
          name: a.file.name,
          type: a.file.type,
          preview: a.preview,
        })),
      };
      setMessages((prev) => [...prev, userMsg]);
      setThinking(true);

      try {
        const encodedFiles = await Promise.all(attachments.map((a) => toB64(a.file)));
        const studentName = "User";

        const history = messages.map((m) => ({
          role: m.role === "user" ? "user" : "assistant",
          content: m.content,
        }));

        const res = await fetch("/api/resolve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentName,
            skillLevel: "Intermediate",
            doubtText: text,
            files: encodedFiles,
            history,
          }),
        });

        const json = await res.json();
        setThinking(false);

        if (json.success) {
          const ai = json.aiResponse;

          const fullContent = ai.responseText || "";

          const aiMsgId = uid();

          setMessages((prev) => [
            ...prev,
            { id: aiMsgId, role: "assistant", content: "", isStreaming: true },
          ]);

          let i = 0;
          const total = fullContent.length;
          const intervalMs = 12;
          const stream = setInterval(() => {
            const increment = total > 1500 ? 12 : total > 600 ? 6 : 3;
            i += increment;

            const chunk = fullContent.slice(0, i);
            setMessages((prev) =>
              prev.map((m) =>
                m.id === aiMsgId
                  ? { ...m, content: chunk, isStreaming: i < total }
                  : m
              )
            );
            if (i >= total) {
              clearInterval(stream);
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === aiMsgId
                    ? { ...m, content: fullContent, isStreaming: false }
                    : m
                )
              );
              fetchHistory(); // re-fetch history to load the new item!
            }
          }, intervalMs);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              id: uid(),
              role: "assistant",
              content:
                "Something went wrong processing your request. Please try again.",
            },
          ]);
        }
      } catch {
        setThinking(false);
        setMessages((prev) => [
          ...prev,
          {
            id: uid(),
            role: "assistant",
            content:
              "Failed to connect to the AI engine. Check your connection and try again.",
          },
        ]);
      }
    },
    [thinking, fetchHistory]
  );

  /* Edit prompt & regenerate AI response handler */
  const handleEditMessage = useCallback(
    async (messageId: string, newText: string) => {
      if (!newText.trim() || thinking) return;

      const msgIndex = messages.findIndex((m) => m.id === messageId);
      if (msgIndex === -1) return;

      const updatedUserMsg: Message = {
        ...messages[msgIndex],
        content: newText,
      };

      const truncatedMessages = [...messages.slice(0, msgIndex), updatedUserMsg];
      setMessages(truncatedMessages);
      setThinking(true);

      try {
        const history = messages.slice(0, msgIndex).map((m) => ({
          role: m.role === "user" ? "user" : "assistant",
          content: m.content,
        }));

        const res = await fetch("/api/resolve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentName: "User",
            skillLevel: "Intermediate",
            doubtText: newText,
            files: [],
            history,
          }),
        });

        const json = await res.json();
        setThinking(false);

        if (json.success) {
          const ai = json.aiResponse;

          const fullContent = ai.responseText || "";

          const aiMsgId = uid();

          setMessages((prev) => [
            ...prev,
            { id: aiMsgId, role: "assistant", content: "", isStreaming: true },
          ]);

          let i = 0;
          const total = fullContent.length;
          const intervalMs = 12;
          const stream = setInterval(() => {
            const increment = total > 1500 ? 12 : total > 600 ? 6 : 3;
            i += increment;

            const chunk = fullContent.slice(0, i);
            setMessages((prev) =>
              prev.map((m) =>
                m.id === aiMsgId
                  ? { ...m, content: chunk, isStreaming: i < total }
                  : m
              )
            );
            if (i >= total) {
              clearInterval(stream);
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === aiMsgId
                    ? { ...m, content: fullContent, isStreaming: false }
                    : m
                )
              );
              fetchHistory();
            }
          }, intervalMs);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              id: uid(),
              role: "assistant",
              content: "Something went wrong processing your request. Please try again.",
            },
          ]);
        }
      } catch {
        setThinking(false);
        setMessages((prev) => [
          ...prev,
          {
            id: uid(),
            role: "assistant",
            content: "Failed to connect to the AI engine. Check your connection and try again.",
          },
        ]);
      }
    },
    [messages, thinking, fetchHistory]
  );

  if (loading) {
    return <Loader />;
  }

  const hasMessages = messages.length > 0;

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        overflow: "hidden",
        background: "#050816",
        position: "relative",
      }}
    >
      <Background />

      {/* Left Sidebar */}
      <Sidebar
        onNewChat={() => {
          setMessages([]);
          setActiveChatId(undefined);
        }}
        recentChats={recentChats}
        onSelectRecentChat={handleSelectRecentChat}
        activeChatId={activeChatId}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* Right panel containing navbar, chat scroll, and input */}
      <div
        style={{
          flex: 1,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Navbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
          onClearHistory={() => {
            setMessages([]);
            setActiveChatId(undefined);
          }}
          messages={messages}
        />

        {/* Main scrollable chat area */}
        <div
          ref={chatAreaRef}
          style={{
            flex: 1,
            overflowY: "auto",
            paddingBottom: 180, // clear the input dock
            position: "relative",
            zIndex: 10,
          }}
        >
          {!hasMessages ? (
            <WelcomeScreen onSelect={(prompt) => setSuggestionPrompt(prompt)} />
          ) : (
            <div
              style={{
                width: "min(860px, calc(100% - 32px))",
                margin: "0 auto",
                padding: "32px 0",
                display: "flex",
                flexDirection: "column",
                gap: 24,
                boxSizing: "border-box",
              }}
            >
              {messages.map((msg) => (
                <ChatMessage 
                  key={msg.id} 
                  msg={msg} 
                  onEditMessage={msg.role === "user" ? handleEditMessage : undefined}
                />
              ))}
              {thinking && <ThinkingBubble />}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* Sticky input dock */}
        <InputDock
          onSend={handleSend}
          disabled={thinking}
          initialValue={suggestionPrompt}
          onInitialConsumed={() => setSuggestionPrompt(undefined)}
        />
      </div>
    </div>
  );
}
