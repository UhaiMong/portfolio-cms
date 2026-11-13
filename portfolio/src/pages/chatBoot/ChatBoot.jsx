import { useState, useRef, useEffect } from "preact/hooks";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  RiRobot2Line,
  RiSendPlaneFill,
  RiCloseLine,
  RiUser3Line,
} from "react-icons/ri";
import api from "../../services/api";
import AIMessage from "./AIMessage";
import TypingDots from "./TypingDots";
import { toast } from "react-hot-toast";
import { MessageCircleQuestion } from "lucide-react";

const WELCOME =
  "Hi — ask me about skills, experience, or projects. I only know what's in this portfolio.";

const SUGGESTIONS = [
  "What tech stack do you use?",
  "Show me a featured project",
  "Are you available for work?",
];

const STORAGE_KEY = "portfolio-chat-messages";

const loadMessages = () => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : null;
  } catch {
    return null;
  }
};

export default function ChatBot() {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(
    () => loadMessages() || [{ role: "assistant", content: WELCOME }],
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pulse, setPulse] = useState(true);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) setPulse(false);
  }, [open]);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      /* ignore */
    }
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [messages, loading, reduceMotion]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 200);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const getHistory = () =>
    messages
      .filter((m) => m.content !== WELCOME)
      .map((m) => ({ role: m.role, content: m.content }));

  const sendText = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    setLoading(true);

    try {
      const { data } = await api.post("/chatboot/chat", {
        message: trimmed,
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
          content: "Something went wrong. Please try again.",
        },
      ]);
      toast.error("Chat request failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendText(input);
    }
  };

  const showSuggestions =
    messages.length <= 1 ||
    (messages.length === 2 && messages[0].content === WELCOME);

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className="chatbot-window"
            role="dialog"
            aria-label="Portfolio assistant"
            aria-modal="false"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.88, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, scale: 0.88, y: 20 }}
            transition={{ type: "spring", damping: 22, stiffness: 280 }}
          >
            <div className="gradient-bar" />
            <div className="chat-header">
              <div className="header-avatar">
                <RiRobot2Line size={18} />
              </div>
              <div className="header-info">
                <div className="header-name">Portfolio Assistant</div>
                <div className="header-status">
                  <span className="status-dot" />
                  Online
                </div>
              </div>
              <button
                type="button"
                className="close-btn"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
              >
                <RiCloseLine size={16} />
              </button>
            </div>

            <div className="chat-messages" aria-live="polite">
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
              {showSuggestions && !loading && (
                <div className="flex flex-wrap gap-2 px-1 pt-1">
                  {SUGGESTIONS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      className="suggestion-chip"
                      onClick={() => sendText(q)}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
              <div ref={bottomRef} />
            </div>

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
                  type="button"
                  className="send-btn"
                  onClick={() => sendText(input)}
                  disabled={!input.trim() || loading}
                  aria-label="Send message"
                >
                  <RiSendPlaneFill size={16} />
                </button>
              </div>
              <div className="chat-footer-hint">
                Enter to send · Esc to close
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="chatbot-fab">
        <motion.button
          type="button"
          className="fab-btn"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close chatbot" : "Open chatbot"}
          aria-expanded={open}
          whileTap={{ scale: 0.92 }}
        >
          {pulse && !open && !reduceMotion && <span className="pulse-ring" />}
          <AnimatePresence mode="wait">
            {open ? (
              <motion.span key="close" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <RiCloseLine size={22} />
              </motion.span>
            ) : (
              <motion.span key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <MessageCircleQuestion size={22} />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </>
  );
}
