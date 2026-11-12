"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { EASE } from "@/constants/motion";

/**
 * The gold outline pill shared by the site's two headline calls to action —
 * "Gift Us" and "Wish Us". Keeping the look in one place means the pair always
 * reads as a matched set wherever they appear together.
 */
export const GOLD_PILL_STYLE: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.55rem",
  padding: "0.8rem 2rem",
  border: "1.5px solid rgba(233,197,131,0.75)",
  borderRadius: "999px",
  fontFamily: "var(--font-cormorant), Georgia, serif",
  fontSize: "0.9rem",
  fontWeight: 700,
  letterSpacing: "0.3em",
  textTransform: "uppercase",
  textDecoration: "none",
  cursor: "pointer",
};

/** Rest/hover colour pair driven by framer-motion variants. */
export const GOLD_PILL_VARIANTS = {
  rest: { scale: 1, color: "#FBE49C" },
  hover: { scale: 1.06, color: "#2A1F14" },
};

export const GOLD_PILL_TRANSITION = { duration: 0.3, ease: EASE };

/** Ambient ring that draws the eye before anyone hovers. */
export function PulseRing() {
  return (
    <motion.span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{ borderRadius: "999px", border: "1.5px solid rgba(240,188,63,0.6)" }}
      animate={{ scale: [1, 1.18, 1], opacity: [0.55, 0, 0.55] }}
      transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
    />
  );
}

const BURST_HEARTS = [
  { x: -34, y: -18, delay: 0 },
  { x: -8, y: -34, delay: 0.05 },
  { x: 18, y: -30, delay: 0.03 },
  { x: 36, y: -12, delay: 0.08 },
  { x: 0, y: -42, delay: 0.02 },
];

/** A little burst of hearts right where the button was clicked. */
export function ClickBurst() {
  return (
    <div
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "visible" }}
    >
      {BURST_HEARTS.map((h, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, x: 0, y: 0, scale: 0.4 }}
          animate={{ opacity: [0, 1, 0], x: h.x, y: h.y, scale: 1 }}
          transition={{ duration: 0.7, delay: h.delay, ease: "easeOut" }}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            color: i % 2 === 0 ? "#F58893" : "#F9DE93",
          }}
        >
          <Heart size={14} fill="currentColor" strokeWidth={0} />
        </motion.span>
      ))}
    </div>
  );
}
