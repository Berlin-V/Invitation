"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, MessageCircleHeart } from "lucide-react";

interface Msg {
  role: "user" | "assistant";
  text: string;
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", text: "Hi! I'm Cupid 💛 Ask me anything about Berlin & Jerlin Ashika's wedding — venue, schedule, couple info, or anything else!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const q = input.trim();
    if (!q || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: q }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q, history: messages }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", text: data.reply || "I'm not sure about that, but feel free to ask something else!" }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", text: "Sorry, I couldn't connect right now. Please try again!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-[#8B1A4A] to-[#C9A84C] shadow-lg flex items-center justify-center chatbot-bubble"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setOpen(!open)}
        aria-label="Open chat"
      >
        {open ? <X size={22} className="text-white" /> : <MessageCircleHeart size={22} className="text-white" />}
        {!open && (
          <motion.span
            className="absolute top-0 right-0 w-3 h-3 rounded-full bg-[#E8D5A3] border-2 border-[#1A0A0F]"
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        )}
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 right-6 z-50 w-[340px] max-h-[520px] flex flex-col glass-card shadow-2xl overflow-hidden"
            style={{ border: "1px solid rgba(201,168,76,0.3)" }}
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-[#C9A84C]/20 flex items-center gap-3"
              style={{ background: "linear-gradient(135deg, rgba(139,26,74,0.5), rgba(26,10,15,0.8))" }}>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#8B1A4A] flex items-center justify-center text-sm">
                💝
              </div>
              <div>
                <p className="font-serif text-sm text-[#E8D5A3]">Cupid</p>
                <p className="font-sans-custom text-[10px] text-[#C9A84C]/70 tracking-wider">Wedding Assistant</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ maxHeight: "360px" }}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 font-sans-custom text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[#8B1A4A]/60 text-[#FFF8F0] rounded-br-sm"
                        : "bg-[#C9A84C]/10 border border-[#C9A84C]/20 text-[#FFF8F0]/90 rounded-bl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-[#C9A84C]/10 border border-[#C9A84C]/20 rounded-2xl rounded-bl-sm px-4 py-2.5">
                    <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2 }} className="text-[#C9A84C] text-sm">
                      ✦ ✦ ✦
                    </motion.span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-3 py-3 border-t border-[#C9A84C]/15 flex gap-2">
              <input
                className="flex-1 bg-white/5 border border-[#C9A84C]/20 rounded-full px-4 py-2 font-sans-custom text-sm text-[#FFF8F0] placeholder-[#C9A84C]/40 outline-none focus:border-[#C9A84C]/50 transition-colors"
                placeholder="Ask about the wedding…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
              />
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                className="w-9 h-9 rounded-full bg-gradient-to-br from-[#8B1A4A] to-[#C9A84C] flex items-center justify-center disabled:opacity-40 transition-opacity"
              >
                <Send size={14} className="text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
