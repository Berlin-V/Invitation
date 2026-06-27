"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── floating ember particles ── */
function Embers() {
  const items = Array.from({ length: 22 }, (_, i) => ({
    id: i,
    x: 5 + (i * 4.2) % 90,
    size: 2 + (i % 4),
    delay: (i * 0.28) % 4,
    dur: 2.8 + (i % 5) * 0.6,
    drift: (i % 2 === 0 ? 1 : -1) * (8 + (i % 20)),
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {items.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            bottom: "-10px",
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, #FBBF24, #F97316)`,
            boxShadow: `0 0 ${p.size * 2}px #F97316`,
          }}
          animate={{
            y: [0, -(80 + p.size * 20)],
            x: [0, p.drift],
            opacity: [0.9, 0],
            scale: [1, 0.1],
          }}
          transition={{
            duration: p.dur,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

/* ── pulsing rings ── */
function Rings() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {[160, 220, 290, 370].map((r, i) => (
        <motion.div
          key={r}
          className="absolute rounded-full border border-orange-500/20"
          style={{ width: r, height: r }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.15, 0.35, 0.15] }}
          transition={{ duration: 3 + i * 0.6, delay: i * 0.4, repeat: Infinity }}
        />
      ))}
    </div>
  );
}

export default function IntroOverlay({ onEnter }: { onEnter: () => void }) {
  const [phase, setPhase] = useState<0 | 1 | 2>(0);

  /* auto-advance from phase 0 → 1 after circle draws */
  useEffect(() => {
    if (phase === 0) {
      const t = setTimeout(() => setPhase(1), 1800);
      return () => clearTimeout(t);
    }
  }, [phase]);

  return (
    <AnimatePresence>
      {phase !== 2 && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[100] intro-bg flex items-center justify-center overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <Embers />
          <Rings />

          {/* ── SVG ornate circle that draws itself ── */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg width="340" height="340" viewBox="0 0 340 340" className="opacity-70">
              {/* main circle */}
              <motion.circle
                cx="170" cy="170" r="160"
                fill="none"
                stroke="url(#ringGrad)"
                strokeWidth="1.2"
                strokeDasharray="1200"
                strokeDashoffset="1200"
                strokeLinecap="round"
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 1.6, ease: "easeInOut" }}
              />
              {/* inner circle */}
              <motion.circle
                cx="170" cy="170" r="148"
                fill="none"
                stroke="#F97316"
                strokeWidth="0.5"
                strokeDasharray="1200"
                strokeDashoffset="1200"
                opacity="0.3"
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 1.8, ease: "easeInOut", delay: 0.2 }}
              />
              {/* 8 compass diamonds */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
                const rad = (angle * Math.PI) / 180;
                const cx = 170 + 160 * Math.cos(rad);
                const cy = 170 + 160 * Math.sin(rad);
                return (
                  <motion.rect
                    key={angle}
                    x={cx - 4} y={cy - 4}
                    width="8" height="8"
                    fill="#F97316"
                    transform={`rotate(45 ${cx} ${cy})`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 0.8, scale: 1 }}
                    transition={{ delay: 1.4 + angle / 1000, duration: 0.4 }}
                  />
                );
              })}
              <defs>
                <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F97316" />
                  <stop offset="50%" stopColor="#FBBF24" />
                  <stop offset="100%" stopColor="#F97316" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* ── Content inside circle ── */}
          <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-xs">
            <AnimatePresence mode="wait">
              {phase === 0 && (
                <motion.div
                  key="phase0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-3"
                >
                  {/* Flame icon */}
                  <motion.div
                    className="text-5xl animate-glow"
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  >
                    🔥
                  </motion.div>
                  <p className="font-sans-custom text-[10px] tracking-[0.5em] uppercase text-orange-400/60">
                    Loading invitation
                  </p>
                </motion.div>
              )}

              {phase === 1 && (
                <motion.div
                  key="phase1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center gap-4"
                >
                  {/* Mono date tag */}
                  <motion.p
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="font-sans-custom text-[10px] tracking-[0.45em] uppercase text-orange-400/70"
                  >
                    December 10 · 2026
                  </motion.p>

                  {/* Divider line */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="w-20 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent"
                  />

                  {/* Names */}
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.7 }}
                    className="font-script leading-none"
                    style={{
                      fontSize: "clamp(2.6rem, 8vw, 3.8rem)",
                      background: "linear-gradient(135deg, #F97316, #FED7AA, #FB923C)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Berlin
                  </motion.h1>

                  <motion.span
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-orange-500 text-lg"
                  >
                    ❤
                  </motion.span>

                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.7 }}
                    className="font-script leading-none"
                    style={{
                      fontSize: "clamp(2.2rem, 7vw, 3.2rem)",
                      background: "linear-gradient(135deg, #F97316, #FED7AA, #FB923C)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Jerlin Ashika
                  </motion.h1>

                  {/* Divider line */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.9, duration: 0.5 }}
                    className="w-20 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent"
                  />

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1 }}
                    className="font-sans-custom text-[10px] tracking-widest uppercase text-orange-300/60"
                  >
                    Request the honour of your presence
                  </motion.p>

                  {/* Enter button */}
                  <motion.button
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => { setPhase(2); onEnter(); }}
                    className="mt-2 relative px-7 py-2.5 font-sans-custom text-[11px] tracking-[0.35em] uppercase overflow-hidden rounded group"
                    style={{
                      border: "1px solid rgba(249,115,22,0.5)",
                      color: "#FED7AA",
                    }}
                  >
                    <motion.span
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: "rgba(249,115,22,0.12)" }}
                    />
                    <motion.span
                      className="absolute bottom-0 left-0 right-0 h-px"
                      style={{ background: "linear-gradient(90deg, transparent, #F97316, transparent)" }}
                      animate={{ scaleX: [0.3, 1, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    Open Invitation
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
