"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Heart } from "lucide-react";

interface Msg { role: "user" | "assistant"; text: string; }

const CUPID_GRADIENT = "linear-gradient(135deg, #C0392B, #E4572E, #F97316, #FBBF24)";

// Deterministic golden-angle spread — avoids Math.random(), which would differ
// between server and client render and break hydration.
const FLOAT_HEARTS = Array.from({ length: 10 }, (_, i) => {
  const angle = i * 137.5;
  return {
    left: `${angle % 100}%`,
    top: `${(angle * 1.8) % 100}%`,
    size: 8 + (i % 3) * 4,
    duration: 5 + (i % 4) * 1.5,
    delay: (i % 5) * 0.5,
    color: ["#F97316", "#FBBF24", "#EF4444"][i % 3],
  };
});

const THINKING_PHRASES = [
  "Let me read the story I wrote…",
  "Flipping through their love story…",
  "Digging through my cupid notes…",
  "Checking the timeline real quick…",
  "Dusting off my wings…",
  "Consulting my arrow for the right words…",
  "Peeking at the wedding scrapbook…",
  "Sorting through stolen glances and sweet nothings…",
  "Untangling my bowstring…",
  "Asking the stars for the details…",
  "Reliving the WhatsApp era for you…",
  "Polishing up a good love story…",
];

function ThinkingIndicator() {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPhraseIndex((i) => (i + 1) % THINKING_PHRASES.length);
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={phraseIndex}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.25 }}
        className="text-sm text-white/70 font-sans-custom italic"
      >
        {THINKING_PHRASES[phraseIndex]}
      </motion.span>
    </AnimatePresence>
  );
}

function FloatingHearts() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {FLOAT_HEARTS.map((h, i) => (
        <motion.span
          key={i}
          style={{ position: "absolute", left: h.left, top: h.top }}
          animate={{ y: [0, -14, 0], opacity: [0.06, 0.22, 0.06] }}
          transition={{ duration: h.duration, delay: h.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          <Heart size={h.size} fill={h.color} style={{ color: h.color }} />
        </motion.span>
      ))}
    </div>
  );
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", text: "Hi, I'm Berlin's and Ashi's Cupid 💘 Ask me about them or the events — I'll help you out with that!" },
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
        className="fixed bottom-5 right-5 z-50 w-16 h-16 rounded-full flex items-center justify-center chatbot-bubble"
        style={
          open
            ? { background: CUPID_GRADIENT, border: "2px solid rgba(255,255,255,0.25)", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }
            : { background: "transparent", border: "none" }
        }
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setOpen(!open)}
        aria-label="Open chat"
      >
        {open ? (
          <X size={22} className="text-white" />
        ) : (
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: [0, -8, 8, -6, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src="/images/cupid.png"
              alt="Cupid"
              fill
              sizes="64px"
              style={{ objectFit: "contain", filter: "drop-shadow(0 3px 10px rgba(0,0,0,0.45))" }}
            />
          </motion.div>
        )}
        {!open && (
          <motion.span
            className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 rounded-full border-2 border-[#080503]"
            style={{ background: "#EF4444" }}
            animate={{ scale: [1, 1.35, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <Heart size={8} fill="#FFFFFF" style={{ color: "#FFFFFF" }} />
          </motion.span>
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
              maxHeight: "540px",
              background: "rgba(18,9,6,0.96)",
              border: "1px solid rgba(249,115,22,0.25)",
              borderRadius: "20px",
            }}
          >
            {/* Header */}
            <div
              className="px-4 py-3 flex items-center gap-3 relative overflow-hidden"
              style={{ borderBottom: "1px solid rgba(249,115,22,0.2)", background: "rgba(194,65,12,0.28)" }}
            >
              <div className="absolute inset-0 pointer-events-none" style={{
                background: "radial-gradient(ellipse 60% 100% at 0% 50%, rgba(251,191,36,0.18), transparent 70%)",
              }} />
              <div className="w-12 h-12 flex-shrink-0 relative">
                <motion.div
                  className="absolute inset-0"
                  animate={{ rotate: [0, -8, 8, -6, 0] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Image
                    src="/images/cupid.png"
                    alt="Cupid"
                    fill
                    sizes="48px"
                    style={{ objectFit: "contain", filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.4))" }}
                  />
                </motion.div>
              </div>
              <div className="relative">
                <p className="font-serif text-sm text-orange-200 flex items-center gap-1.5">
                  Cupid <Heart size={11} fill="#F97316" style={{ color: "#F97316" }} />
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 relative" style={{ maxHeight: "380px" }}>
              <FloatingHearts />
              {messages.map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  className={`relative flex ${msg.role === "user" ? "justify-end" : "justify-start"}`} style={{ zIndex: 1 }}>
                  <div className={`max-w-[82%] rounded-2xl px-4 py-2.5 font-sans-custom text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "text-white rounded-br-sm"
                      : "text-white/85 rounded-bl-sm"
                  }`}
                    style={msg.role === "user"
                      ? { background: "linear-gradient(135deg, #C0392B, #F97316)" }
                      : { background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.18)" }
                    }>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="relative flex justify-start" style={{ zIndex: 1 }}>
                  <div className="rounded-2xl rounded-bl-sm px-4 py-2.5"
                    style={{ background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.18)" }}>
                    <ThinkingIndicator />
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
                style={{ background: CUPID_GRADIENT }}>
                <Send size={14} className="text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
