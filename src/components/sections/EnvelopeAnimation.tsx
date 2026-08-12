"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface EnvelopeAnimationProps {
  onEnter: () => void;
}

type Phase = "sealed" | "opening" | "card";

export default function EnvelopeAnimation({ onEnter }: EnvelopeAnimationProps) {
  const [phase, setPhase] = useState<Phase>("sealed");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("opening"), 1000);
    const t2 = setTimeout(() => setPhase("card"), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[90] flex items-center justify-center"
      style={{ backgroundColor: "#0F0C09" }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.0, ease: "easeInOut" }}
    >
      {/* Ambient grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0.025, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }}
      />

      {/* Envelope — visible while phase is sealed or opening */}
      <AnimatePresence mode="wait">
        {(phase === "sealed" || phase === "opening") && (
          <motion.div
            key="envelope"
            initial={{ opacity: 0, y: 30, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92, y: -20 }}
            transition={{ duration: 1.0, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ perspective: "1000px" }}
          >
            {/* Envelope body */}
            <div
              style={{
                width: "clamp(280px, 80vw, 420px)",
                height: "clamp(180px, 50vw, 260px)",
                position: "relative",
                background: "#F2ECE4",
                border: "1px solid rgba(201,165,109,0.28)",
              }}
            >
              {/* Bottom V-fold lines (decorative) */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top right, rgba(201,165,109,0.06), transparent 50%), linear-gradient(to top left, rgba(201,165,109,0.06), transparent 50%)",
                  pointerEvents: "none",
                }}
              />

              {/* Flap */}
              <motion.div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "50%",
                  transformOrigin: "top center",
                  transformStyle: "preserve-3d",
                  zIndex: 10,
                }}
                animate={{ rotateX: phase === "opening" ? -175 : 0 }}
                transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {/* Flap front face */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                    background: "#E8E0D2",
                    borderTop: "1px solid rgba(201,165,109,0.28)",
                  }}
                />
                {/* Flap back face (shows when flipped) */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                    background: "#EDEAE2",
                    transform: "rotateX(180deg)",
                    backfaceVisibility: "hidden",
                  }}
                />
              </motion.div>

              {/* Wax seal */}
              <motion.div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 20,
                }}
                animate={{
                  scale: phase === "opening" ? 0 : 1,
                  opacity: phase === "opening" ? 0 : 1,
                }}
                initial={{ scale: 0, opacity: 0 }}
                transition={
                  phase === "sealed"
                    ? { duration: 0.6, delay: 0.3, ease: "easeOut" }
                    : { duration: 0.35, ease: "easeIn" }
                }
              >
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    background: "radial-gradient(circle at 35% 35%, #D4A96A, #A8854A)",
                    boxShadow: "0 2px 16px rgba(168,133,74,0.5), inset 0 1px 0 rgba(255,255,255,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-allura), cursive",
                      fontSize: "1.4rem",
                      color: "rgba(255,253,249,0.92)",
                      lineHeight: 1,
                    }}
                  >
                    B&J
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Invitation card — appears after envelope opens */}
        {phase === "card" && (
          <motion.div
            key="card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              width: "clamp(280px, 85vw, 400px)",
              background: "#FFFDF9",
              border: "1px solid rgba(201,165,109,0.28)",
              padding: "clamp(1.5rem, 6vw, 2.75rem) clamp(1.5rem, 6vw, 2.5rem)",
              textAlign: "center",
              boxShadow: "0 24px 80px rgba(0,0,0,0.35)",
            }}
          >
            {/* Top label */}
            <motion.p
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontSize: "0.6rem",
                letterSpacing: "0.42em",
                color: "#C9A56D",
                textTransform: "uppercase",
                marginBottom: "1.25rem",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              You are cordially invited
            </motion.p>

            <div className="divider-gold" style={{ marginBottom: "1.5rem" }} />

            {/* Couple names */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              <p
                style={{
                  fontFamily: "var(--font-allura), cursive",
                  fontSize: "clamp(2rem, 7vw, 3rem)",
                  color: "#4A403A",
                  lineHeight: 1.1,
                }}
              >
                Jerlin Ashika
              </p>
              <p
                style={{
                  fontFamily: "var(--font-cormorant), Georgia, serif",
                  fontSize: "0.75rem",
                  letterSpacing: "0.22em",
                  color: "#8A7C73",
                  fontStyle: "italic",
                  margin: "0.4rem 0",
                }}
              >
                &
              </p>
              <p
                style={{
                  fontFamily: "var(--font-allura), cursive",
                  fontSize: "clamp(2rem, 7vw, 3rem)",
                  color: "#4A403A",
                  lineHeight: 1.1,
                }}
              >
                Berlin
              </p>
            </motion.div>

            <div className="divider-thin" style={{ margin: "1.5rem 0" }} />

            {/* Date */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p
                style={{
                  fontFamily: "var(--font-cormorant), Georgia, serif",
                  fontSize: "0.78rem",
                  letterSpacing: "0.18em",
                  color: "#8A7C73",
                }}
              >
                December 10, 2026
              </p>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.7 }}
              style={{ marginTop: "2rem" }}
            >
              <EnterButton onClick={onEnter} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ambient date label at bottom */}
      <motion.p
        className="absolute"
        style={{
          bottom: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: "var(--font-cormorant), Georgia, serif",
          fontSize: "0.58rem",
          letterSpacing: "0.4em",
          color: "rgba(201,165,109,0.3)",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        December 10, 2026
      </motion.p>
    </motion.div>
  );
}

function EnterButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "none",
        border: "1px solid rgba(201,165,109,0.6)",
        color: "#C9A56D",
        fontFamily: "var(--font-cormorant), Georgia, serif",
        fontSize: "0.68rem",
        letterSpacing: "0.35em",
        textTransform: "uppercase",
        padding: "0.8rem 2.5rem",
        cursor: "pointer",
        transition: "background 0.3s ease, color 0.3s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "#C9A56D";
        (e.currentTarget as HTMLButtonElement).style.color = "#FFFDF9";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "none";
        (e.currentTarget as HTMLButtonElement).style.color = "#C9A56D";
      }}
    >
      Open Invitation
    </button>
  );
}
