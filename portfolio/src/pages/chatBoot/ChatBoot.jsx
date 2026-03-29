import { useState, useRef, useEffect } from "preact/hooks";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiRobot2Line,
  RiSendPlaneFill,
  RiCloseLine,
  RiUser3Line,
} from "react-icons/ri";
import { HiSparkles } from "react-icons/hi2";
import api from "../../services/api";

// Typewriter hook for AI responses
function useTypewriter(text, speed = 18) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    if (!text) return;
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return { displayed, done };
}

// Renders markdown-lite: bold, bullets
function MarkdownText({ text }) {
  const lines = text.split("\n");
  return (
    <span>
      {lines.map((line, i) => {
        // Bold: **text**
        const parts = line.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
          /^\*\*[^*]+\*\*$/.test(part) ? (
            <strong key={j} style={{ fontWeight: 700 }}>
              {part.slice(2, -2)}
            </strong>
          ) : (
            part
          ),
        );
        // Bullet
        const isBullet =
          line.trim().startsWith("*") || line.trim().startsWith("-");
        return (
          <span
            key={i}
            style={{ display: "block", paddingLeft: isBullet ? "0.5rem" : 0 }}
          >
            {isBullet && (
              <span style={{ color: "var(--accent)", marginRight: 4 }}>›</span>
            )}
            {parts}
            {i < lines.length - 1 && !isBullet && line !== "" && <br />}
          </span>
        );
      })}
    </span>
  );
}

// Animated AI message with typewriter
function AIMessage({ content, isLatest }) {
  const { displayed } = useTypewriter(isLatest ? content : null, 14);
  const shown = isLatest ? displayed : content;

  return (
    <div className="chat-bubble ai-bubble">
      <div className="bubble-icon">
        <RiRobot2Line size={13} />
      </div>
      <div className="bubble-text">
        <MarkdownText text={shown} />
      </div>
    </div>
  );
}

// Typing indicator
function TypingDots() {
  return (
    <div className="chat-bubble ai-bubble typing-indicator">
      <div className="bubble-icon">
        <RiRobot2Line size={13} />
      </div>
      <div className="dots">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

const WELCOME =
  "Hi! I'm an AI assistant for this portfolio. Ask me anything about skills, experience, or projects! ✨";

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: WELCOME },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pulse, setPulse] = useState(true);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Stop pulse after first open
  useEffect(() => {
    if (open) setPulse(false);
  }, [open]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  const getHistory = () =>
    messages
      .filter((m) => m.content !== WELCOME)
      .map((m) => ({ role: m.role, content: m.content }));

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const { data } = await api.post("/chatboot/chat", {
        message: text,
        history: getHistory(),
      });

      const reply =
        data?.data?.reply || "Sorry, I couldn't generate a response.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Oops! Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --bg-chat: #0d0f14;
          --bg-header: #111318;
          --bg-input: #1a1d24;
          --bg-user: #5b4cff;
          --bg-ai: #1e2130;
          --border: rgba(255,255,255,0.07);
          --accent: #7c6dff;
          --accent2: #00e5cc;
          --text-main: #e8eaf0;
          --text-muted: #6b7280;
          --glow: rgba(92, 76, 255, 0.35);
          --radius: 18px;
          --shadow: 0 24px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.05);
        }

        .chatbot-fab {
          position: fixed;
          bottom: 88px;
          right: 24px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0;
          font-family: 'DM Sans', sans-serif;
        }

        .chatbot-window {
          position: fixed;
          bottom: 152px;
          right: 24px;
          width: 370px;
          height: 520px;
          z-index: 9998;
          display: flex;
          flex-direction: column;
          background: var(--bg-chat);
          border-radius: var(--radius);
          box-shadow: var(--shadow);
          border: 1px solid var(--border);
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
        }

        @media (max-width: 480px) {
          .chatbot-window {
            width: calc(100vw - 24px);
            right: 12px;
            bottom: 140px;
            height: 70vh;
          }
          .chatbot-fab { right: 12px; }
        }

        /* Toggle button */
        .fab-btn {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #5b4cff 0%, #7c6dff 100%);
          box-shadow: 0 8px 32px var(--glow), 0 0 0 1px rgba(255,255,255,0.1);
          color: white;
          position: relative;
          outline: none;
        }

        .fab-btn::before {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: 50%;
          background: conic-gradient(from 0deg, #5b4cff, #00e5cc, #5b4cff);
          z-index: -1;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .fab-btn:hover::before { opacity: 1; }

        .pulse-ring {
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          border: 2px solid var(--accent);
          animation: pulse-fab 2s ease-out infinite;
          pointer-events: none;
        }
        @keyframes pulse-fab {
          0% { opacity: 0.8; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.6); }
        }

        /* Chat header */
        .chat-header {
          padding: 16px 18px;
          background: var(--bg-header);
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }

        .header-avatar {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #5b4cff, #00e5cc);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
          font-size: 16px;
        }

        .header-info { flex: 1; }
        .header-name {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 14px;
          color: var(--text-main);
          letter-spacing: 0.01em;
        }
        .header-status {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          color: var(--accent2);
          margin-top: 1px;
          font-weight: 400;
        }
        .status-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--accent2);
          animation: blink 2s ease-in-out infinite;
        }
        @keyframes blink {
          0%,100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .close-btn {
          width: 30px; height: 30px;
          border-radius: 8px;
          border: 1px solid var(--border);
          background: transparent;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .close-btn:hover { background: rgba(255,255,255,0.06); color: var(--text-main); }

        /* Messages */
        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.1) transparent;
        }
        .chat-messages::-webkit-scrollbar { width: 4px; }
        .chat-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

        .chat-bubble {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          max-width: 88%;
          animation: bubbleIn 0.25s ease;
        }
        @keyframes bubbleIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .ai-bubble { align-self: flex-start; }
        .user-bubble { align-self: flex-end; flex-direction: row-reverse; }

        .bubble-icon {
          width: 24px; height: 24px;
          border-radius: 7px;
          background: linear-gradient(135deg, #5b4cff, #00e5cc);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .user-bubble .bubble-icon {
          background: rgba(255,255,255,0.12);
        }

        .bubble-text {
          padding: 10px 13px;
          border-radius: 14px;
          font-size: 13.5px;
          line-height: 1.6;
          color: var(--text-main);
          font-weight: 300;
        }
        .ai-bubble .bubble-text {
          background: var(--bg-ai);
          border-radius: 4px 14px 14px 14px;
          border: 1px solid var(--border);
        }
        .user-bubble .bubble-text {
          background: var(--bg-user);
          border-radius: 14px 4px 14px 14px;
          color: #fff;
          font-weight: 400;
        }

        /* Typing dots */
        .typing-indicator { align-items: center; }
        .dots {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 10px 14px;
          background: var(--bg-ai);
          border-radius: 4px 14px 14px 14px;
          border: 1px solid var(--border);
        }
        .dots span {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: var(--accent);
          animation: dot-bounce 1.2s ease-in-out infinite;
        }
        .dots span:nth-child(2) { animation-delay: 0.2s; }
        .dots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes dot-bounce {
          0%,60%,100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-6px); opacity: 1; }
        }

        /* Input area */
        .chat-input-area {
          padding: 12px 14px;
          border-top: 1px solid var(--border);
          background: var(--bg-header);
          display: flex;
          align-items: flex-end;
          gap: 10px;
          flex-shrink: 0;
        }

        .chat-textarea {
          flex: 1;
          background: var(--bg-input);
          border: 1px solid var(--border);
          border-radius: 12px;
          color: var(--text-main);
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          font-weight: 300;
          padding: 10px 13px;
          resize: none;
          min-height: 40px;
          max-height: 100px;
          outline: none;
          line-height: 1.5;
          transition: border-color 0.2s;
        }
        .chat-textarea::placeholder { color: var(--text-muted); }
        .chat-textarea:focus { border-color: var(--accent); }

        .send-btn {
          width: 40px; height: 40px;
          border-radius: 11px;
          border: none;
          background: linear-gradient(135deg, #5b4cff, #7c6dff);
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.2s;
          box-shadow: 0 4px 12px var(--glow);
        }
        .send-btn:hover:not(:disabled) { transform: scale(1.06); box-shadow: 0 6px 20px var(--glow); }
        .send-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

        .chat-footer-hint {
          text-align: center;
          font-size: 10px;
          color: var(--text-muted);
          padding: 6px 0 4px;
          letter-spacing: 0.03em;
        }

        /* Gradient top bar */
        .gradient-bar {
          height: 3px;
          background: linear-gradient(90deg, #5b4cff, #00e5cc, #5b4cff);
          background-size: 200% 100%;
          animation: gradient-shift 3s linear infinite;
          flex-shrink: 0;
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 0%; }
          100% { background-position: 200% 0%; }
        }
      `}</style>

      {/* Floating Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="chatbot-window"
            initial={{ opacity: 0, scale: 0.88, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 20 }}
            transition={{ type: "spring", damping: 22, stiffness: 280 }}
          >
            <div className="gradient-bar" />

            {/* Header */}
            <div className="chat-header">
              <div className="header-avatar">
                <RiRobot2Line size={18} />
              </div>
              <div className="header-info">
                <div className="header-name">Portfolio Assistant</div>
                <div className="header-status">
                  <span className="status-dot" />
                  Powered by Gemini 2.5 Flash
                </div>
              </div>
              <button
                className="close-btn"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
              >
                <RiCloseLine size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="chat-messages">
              {messages.map((msg, i) => {
                const isLatest =
                  msg.role === "assistant" &&
                  i === messages.length - 1 &&
                  !loading;
                return msg.role === "assistant" ? (
                  <AIMessage
                    key={i}
                    content={msg.content}
                    isLatest={isLatest}
                  />
                ) : (
                  <div key={i} className="chat-bubble user-bubble">
                    <div className="bubble-icon">
                      <RiUser3Line size={13} />
                    </div>
                    <div className="bubble-text">{msg.content}</div>
                  </div>
                );
              })}
              {loading && <TypingDots />}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div>
              <div className="chat-input-area">
                <textarea
                  ref={inputRef}
                  className="chat-textarea"
                  placeholder="Ask about skills, experience, projects…"
                  value={input}
                  onInput={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  rows={1}
                  disabled={loading}
                />
                <button
                  className="send-btn"
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                  aria-label="Send message"
                >
                  <RiSendPlaneFill size={16} />
                </button>
              </div>
              <div className="chat-footer-hint">
                Press Enter to send · Shift+Enter for newline
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB Button */}
      <div className="chatbot-fab">
        <motion.button
          className="fab-btn"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle chatbot"
          whileTap={{ scale: 0.92 }}
          animate={open ? { rotate: 0 } : { rotate: [0, -8, 8, -4, 0] }}
          transition={
            open ? {} : { duration: 0.5, repeat: Infinity, repeatDelay: 4 }
          }
        >
          {pulse && !open && <span className="pulse-ring" />}
          <AnimatePresence mode="wait">
            {open ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <RiCloseLine size={22} />
              </motion.span>
            ) : (
              <motion.span
                key="chat"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <HiSparkles size={22} />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </>
  );
}
