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
import AIMessage from "./AIMessage";
import TypingDots from "./TypingDots";
import { toast } from "react-hot-toast";
import { MessageCircleQuestion } from "lucide-react";

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
      toast.error("Something went wrong please try again!");
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
                <MessageCircleQuestion size={22} />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </>
  );
}
