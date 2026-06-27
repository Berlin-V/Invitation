"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Petal {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  color: string;
}

function Petals() {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    const colors = ["#C9A84C", "#D4547A", "#8B1A4A", "#E8D5A3", "#F0A0B0"];
    const p = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 4,
      duration: 5 + Math.random() * 5,
      size: 8 + Math.random() * 14,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setPetals(p);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {petals.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full opacity-60"
          style={{
            left: `${p.x}%`,
            top: "-20px",
            width: p.size,
            height: p.size * 0.6,
            backgroundColor: p.color,
            borderRadius: "50% 0 50% 0",
          }}
          animate={{
            y: ["0vh", "110vh"],
            rotate: [0, 720],
            x: [0, Math.random() > 0.5 ? 80 : -80],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

export default function IntroOverlay({ onEnter }: { onEnter: () => void }) {
  const [phase, setPhase] = useState<"envelope" | "card" | "done">("envelope");

  const handleEnvelopeClick = () => setPhase("card");

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          className="fixed inset-0 z-[100] invitation-bg flex items-center justify-center overflow-hidden"
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          <Petals />

          {/* Radial glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
              style={{ background: "radial-gradient(ellipse, rgba(201,168,76,0.08) 0%, transparent 70%)" }} />
          </div>

          {/* Sparkle stars */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-[#E8D5A3]"
              style={{
                left: `${10 + (i * 7) % 80}%`,
                top: `${15 + (i * 11) % 70}%`,
              }}
              animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
              transition={{ duration: 2 + (i % 3), delay: i * 0.3, repeat: Infinity }}
            />
          ))}

          <AnimatePresence mode="wait">
            {phase === "envelope" && (
              <motion.div
                key="envelope"
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -40 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col items-center gap-8 cursor-pointer select-none"
                onClick={handleEnvelopeClick}
              >
                {/* Envelope SVG */}
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="relative"
                >
                  <svg width="280" height="200" viewBox="0 0 280 200" fill="none">
                    {/* Envelope body */}
                    <rect x="10" y="60" width="260" height="130" rx="8" fill="rgba(255,248,240,0.06)" stroke="#C9A84C" strokeWidth="1.5"/>
                    {/* Envelope flap */}
                    <motion.path
                      d="M10 68 L140 130 L270 68"
                      fill="rgba(139,26,74,0.3)"
                      stroke="#C9A84C"
                      strokeWidth="1.5"
                      animate={{ d: ["M10 68 L140 130 L270 68", "M10 68 L140 20 L270 68"] }}
                      transition={{ duration: 1.2, delay: 0.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                    />
                    {/* Wax seal */}
                    <circle cx="140" cy="130" r="24" fill="#8B1A4A" stroke="#C9A84C" strokeWidth="1.5"/>
                    <text x="140" y="135" textAnchor="middle" fill="#E8D5A3" fontSize="14" fontFamily="Great Vibes, cursive">B♡J</text>
                    {/* Bottom corners */}
                    <line x1="10" y1="190" x2="140" y2="125" stroke="#C9A84C" strokeWidth="1" opacity="0.5"/>
                    <line x1="270" y1="190" x2="140" y2="125" stroke="#C9A84C" strokeWidth="1" opacity="0.5"/>
                  </svg>
                </motion.div>

                <div className="text-center space-y-2">
                  <p className="font-script text-5xl text-gold-gradient">You&apos;re Invited</p>
                  <p className="font-sans-custom text-xs tracking-[0.4em] text-[#C9A84C]/70 uppercase">Tap to open</p>
                </div>

                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="text-[#C9A84C]/50"
                >
                  ↓
                </motion.div>
              </motion.div>
            )}

            {phase === "card" && (
              <motion.div
                key="card"
                initial={{ opacity: 0, scale: 0.8, rotateX: 30 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                className="glass-card p-10 max-w-sm w-full mx-6 text-center space-y-6 relative overflow-hidden"
              >
                {/* Corner ornaments */}
                {["top-3 left-3", "top-3 right-3 rotate-90", "bottom-3 right-3 rotate-180", "bottom-3 left-3 -rotate-90"].map((pos) => (
                  <div key={pos} className={`absolute ${pos} w-6 h-6 opacity-60`}>
                    <svg viewBox="0 0 24 24" fill="none"><path d="M2 2 L12 2 L2 12" stroke="#C9A84C" strokeWidth="1.5"/><circle cx="12" cy="2" r="2" fill="#C9A84C"/></svg>
                  </div>
                ))}

                <div className="space-y-1">
                  <p className="font-sans-custom text-[10px] tracking-[0.4em] text-[#C9A84C] uppercase">Together with their families</p>
                  <div className="divider-gold my-3"/>
                </div>

                <div>
                  <p className="font-script text-6xl text-gold-gradient leading-tight">Berlin</p>
                  <p className="font-sans-custom text-[11px] tracking-widest text-[#FFF8F0]/50 my-2">&amp;</p>
                  <p className="font-script text-6xl text-gold-gradient leading-tight">Jerlin Ashika</p>
                </div>

                <div className="divider-gold"/>

                <div className="space-y-1">
                  <p className="font-sans-custom text-xs tracking-widest text-[#FFF8F0]/70 uppercase">Request the honour of your presence</p>
                  <p className="font-sans-custom text-xs tracking-widest text-[#FFF8F0]/70 uppercase">at their wedding</p>
                </div>

                <div className="space-y-1">
                  <p className="font-sans-custom text-sm tracking-widest text-[#C9A84C]">December 10, 2026</p>
                  <p className="font-sans-custom text-xs text-[#FFF8F0]/50">Beginning at Nine in the Morning</p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => { setPhase("done"); onEnter(); }}
                  className="w-full py-3 border border-[#C9A84C]/60 font-sans-custom text-xs tracking-[0.3em] uppercase text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-colors duration-300 rounded"
                >
                  Enter Celebration
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
