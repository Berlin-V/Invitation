"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, MessageCircleHeart } from "lucide-react";

interface Msg { role: "user" | "assistant"; text: string; }

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", text: "Hi! I'm Cupid 🔥 Ask me anything about Berlin & Jerlin Ashika's wedding — venue, schedule, couple info, or anything else!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async () => {
    const q = input.trim();
    if (!q || loading) return;
    setInput("");
    setMessages((p) => [...p, { role: "user", text: q }]);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q, history: messages }),
      });
      const data = await res.json();
      setMessages((p) => [...p, { role: "assistant", text: data.reply || "I'm not sure about that!" }]);
    } catch {
      setMessages((p) => [...p, { role: "assistant", text: "Sorry, couldn't connect. Please try again!" }]);
    } finally { setLoading(false); }
  };

  return (
    <>
      <motion.button
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full flex items-center justify-center chatbot-bubble shadow-lg"
        style={{ background: "linear-gradient(135deg, #C2410C, #F97316)" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setOpen(!open)}
        aria-label="Open chat"
      >
        {open ? <X size={20} className="text-white" /> : <MessageCircleHeart size={20} className="text-white" />}
        {!open && (
          <motion.span
            className="absolute top-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-amber-300 border-2 border-[#080503]"
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.22 }}
            className="fixed bottom-24 right-4 z-50 flex flex-col shadow-2xl overflow-hidden"
            style={{
              width: "min(340px, calc(100vw - 2rem))",
              maxHeight: "520px",
              background: "rgba(18,9,6,0.96)",
              border: "1px solid rgba(249,115,22,0.25)",
              borderRadius: "16px",
            }}
          >
            {/* Header */}
            <div className="px-4 py-3 flex items-center gap-3"
              style={{ borderBottom: "1px solid rgba(249,115,22,0.15)", background: "rgba(194,65,12,0.25)" }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-base"
                style={{ background: "linear-gradient(135deg, #C2410C, #F97316)" }}>🔥</div>
              <div>
                <p className="font-serif text-sm text-orange-200">Cupid</p>
                <p className="font-sans-custom text-[9px] tracking-wider text-orange-400/60 uppercase">Wedding Assistant</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ maxHeight: "360px" }}>
              {messages.map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[82%] rounded-2xl px-4 py-2.5 font-sans-custom text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "text-white rounded-br-sm"
                      : "text-white/85 rounded-bl-sm"
                  }`}
                    style={msg.role === "user"
                      ? { background: "rgba(194,65,12,0.7)" }
                      : { background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.18)" }
                    }>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-sm px-4 py-2.5"
                    style={{ background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.18)" }}>
                    <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2 }}
                      className="text-orange-400 text-sm">✦ ✦ ✦</motion.span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-3 py-3 flex gap-2" style={{ borderTop: "1px solid rgba(249,115,22,0.12)" }}>
              <input
                className="flex-1 rounded-full px-4 py-2 font-sans-custom text-sm text-white outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(249,115,22,0.18)",
                }}
                placeholder="Ask about the wedding…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
              />
              <button onClick={send} disabled={loading || !input.trim()}
                className="w-9 h-9 rounded-full flex items-center justify-center disabled:opacity-40 flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #C2410C, #F97316)" }}>
                <Send size={14} className="text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
