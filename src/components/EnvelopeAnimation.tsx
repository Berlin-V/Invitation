"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onOpen: () => void;
}

export default function EnvelopeAnimation({ onOpen }: Props) {
  const [phase, setPhase] = useState<"idle" | "opening" | "done">("idle");

  const handleClick = () => {
    if (phase !== "idle") return;
    setPhase("opening");
    setTimeout(() => {
      setPhase("done");
      onOpen();
    }, 1800);
  };

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          key="envelope-screen"
          className="fixed inset-0 z-[150] flex flex-col items-center justify-center"
          style={{ background: "#FFFDF9" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          {/* Ambient gold rings */}
          {[200, 300, 420].map((s, i) => (
            <motion.div
              key={s}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: s,
                height: s,
                border: "1px solid rgba(201,165,109,0.12)",
              }}
              animate={{ scale: [1, 1.04, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 4 + i * 0.8, repeat: Infinity }}
            />
          ))}

          {/* Label above */}
          <motion.p
            className="font-heading text-muted text-xs tracking-editorial uppercase mb-10 z-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif", color: "#8A7C73", letterSpacing: "0.35em" }}
          >
            You are cordially invited
          </motion.p>

          {/* ── Envelope ── */}
          <motion.div
            className="relative cursor-pointer z-10"
            style={{ width: 320, height: 220 }}
            onClick={handleClick}
            whileHover={phase === "idle" ? { y: -4 } : {}}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* Envelope body */}
            <div
              className="absolute inset-0 rounded-sm shadow-xl"
              style={{
                background: "#FFFDF9",
                border: "1px solid rgba(201,165,109,0.4)",
                boxShadow: "0 20px 60px rgba(201,165,109,0.15), 0 4px 20px rgba(74,64,58,0.08)",
              }}
            />

            {/* Bottom triangle (inside fold) */}
            <div
              className="absolute inset-x-0 bottom-0"
              style={{
                height: 0,
                borderLeft: "160px solid transparent",
                borderRight: "160px solid transparent",
                borderBottom: "120px solid #F8F4EF",
              }}
            />

            {/* Side triangles */}
            <div className="absolute inset-y-0 left-0" style={{ width: 0, height: 0,
              borderTop: "110px solid transparent",
              borderBottom: "110px solid transparent",
              borderLeft: "160px solid #F2ECE4",
            }} />
            <div className="absolute inset-y-0 right-0" style={{ width: 0, height: 0,
              borderTop: "110px solid transparent",
              borderBottom: "110px solid transparent",
              borderRight: "160px solid #F2ECE4",
            }} />

            {/* Flap — top triangle */}
            <motion.div
              className="absolute top-0 left-0 right-0 origin-top"
              style={{ height: 0 }}
              animate={phase === "opening" ? { rotateX: -165 } : { rotateX: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <div style={{
                width: 0, height: 0,
                borderLeft: "160px solid transparent",
                borderRight: "160px solid transparent",
                borderTop: "130px solid #F2ECE4",
                filter: "drop-shadow(0 2px 4px rgba(74,64,58,0.06))",
              }} />
            </motion.div>

            {/* Gold wax seal */}
            <motion.div
              className="absolute left-1/2 top-1/2 rounded-full flex items-center justify-center"
              style={{
                width: 44,
                height: 44,
                background: "linear-gradient(135deg, #E8D5B0, #C9A56D)",
                transform: "translate(-50%, -20%)",
                boxShadow: "0 2px 8px rgba(201,165,109,0.4)",
              }}
              animate={phase === "opening" ? { opacity: 0, scale: 0.8 } : {}}
              transition={{ duration: 0.3 }}
            >
              <span style={{
                fontFamily: "var(--font-allura), cursive",
                fontSize: 18,
                color: "#FFFDF9",
              }}>B</span>
            </motion.div>

            {/* Inner invitation card that rises */}
            <motion.div
              className="absolute left-4 right-4 rounded-sm flex flex-col items-center justify-center"
              style={{
                background: "#FFFDF9",
                border: "1px solid rgba(201,165,109,0.25)",
                bottom: 12,
                height: 160,
                transformOrigin: "bottom",
              }}
              initial={{ y: 0 }}
              animate={phase === "opening" ? { y: -100, opacity: [1, 1, 0] } : { y: 0 }}
              transition={{ duration: 0.9, delay: 0.5 }}
            >
              <p style={{ fontFamily: "var(--font-allura), cursive", fontSize: 22, color: "#C9A56D" }}>
                Berlin & Jerlin
              </p>
              <div className="divider-gold my-2" style={{ width: 60 }} />
              <p style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: 11,
                color: "#8A7C73", letterSpacing: "0.25em" }}>
                DECEMBER 9–10, 2026
              </p>
            </motion.div>
          </motion.div>

          {/* CTA */}
          <AnimatePresence>
            {phase === "idle" && (
              <motion.button
                onClick={handleClick}
                className="mt-10 z-10 font-heading text-xs tracking-editorial uppercase"
                style={{
                  fontFamily: "var(--font-cormorant), Georgia, serif",
                  color: "#C9A56D",
                  background: "none",
                  border: "none",
                  letterSpacing: "0.35em",
                  cursor: "pointer",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Open Invitation
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
