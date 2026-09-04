"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, X, ExternalLink, Heart } from "lucide-react";
import { EASE } from "@/constants/motion";
import { GIFT_URL } from "@/constants";

function GiftModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex: 200, background: "rgba(15,12,9,0.72)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.3, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(92vw, 480px)",
          height: "min(85vh, 720px)",
          background: "#FFFDF9",
          borderRadius: "16px",
          overflow: "hidden",
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between"
          style={{
            padding: "0.9rem 1.25rem",
            borderBottom: "1px solid rgba(217,180,65,0.2)",
            background: "#FFFDF9",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "0.75rem",
              letterSpacing: "0.2em",
              color: "#4A403A",
              textTransform: "uppercase",
            }}
          >
            Gift Us
          </p>
          <div className="flex items-center gap-3">
            <a
              href={GIFT_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open in a new tab"
              style={{ color: "#796D65" }}
            >
              <ExternalLink size={16} strokeWidth={1.5} />
            </a>
            <button
              onClick={onClose}
              aria-label="Close"
              style={{ background: "none", border: "none", cursor: "pointer", color: "#796D65" }}
            >
              <X size={18} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Embedded gift registry */}
        <iframe
          src={GIFT_URL}
          title="Gift Us"
          style={{ flex: 1, border: "none", width: "100%" }}
        />
      </motion.div>
    </motion.div>
  );
}

// A little burst of hearts right where the button was clicked — the
// "celebration" before the gift registry opens.
function ClickBurst() {
  const hearts = [
    { x: -34, y: -18, delay: 0 },
    { x: -8, y: -34, delay: 0.05 },
    { x: 18, y: -30, delay: 0.03 },
    { x: 36, y: -12, delay: 0.08 },
    { x: 0, y: -42, delay: 0.02 },
  ];
  return (
    <div
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "visible" }}
    >
      {hearts.map((h, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, x: 0, y: 0, scale: 0.4 }}
          animate={{ opacity: [0, 1, 0], x: h.x, y: h.y, scale: 1 }}
          transition={{ duration: 0.7, delay: h.delay, ease: "easeOut" }}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            color: i % 2 === 0 ? "#F58893" : "#F2DCA0",
          }}
        >
          <Heart size={14} fill="currentColor" strokeWidth={0} />
        </motion.span>
      ))}
    </div>
  );
}

interface GiftUsButtonProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function GiftUsButton({ className, style }: GiftUsButtonProps) {
  const [open, setOpen] = useState(false);
  const [bursting, setBursting] = useState(false);

  const handleClick = () => {
    setBursting(true);
    setOpen(true);
    setTimeout(() => setBursting(false), 750);
  };

  return (
    <div className="relative inline-block" style={style}>
      {/* Ambient pulse ring — draws the eye even before anyone hovers */}
      <motion.span
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ borderRadius: "999px", border: "1.5px solid rgba(217,180,65,0.6)" }}
        animate={{ scale: [1, 1.18, 1], opacity: [0.55, 0, 0.55] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
      />

      <motion.button
        onClick={handleClick}
        initial="rest"
        whileHover="hover"
        whileTap={{ scale: 0.95 }}
        variants={{
          rest: { scale: 1, color: "#F7D98F" },
          hover: { scale: 1.06, color: "#2A1F14" },
        }}
        transition={{ duration: 0.3, ease: EASE }}
        className={`gift-us-button relative ${className ?? ""}`}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.55rem",
          padding: "0.8rem 2rem",
          border: "1.5px solid rgba(233,197,131,0.75)",
          borderRadius: "999px",
          fontFamily: "var(--font-cormorant), Georgia, serif",
          fontSize: "0.78rem",
          fontWeight: 700,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          cursor: "pointer",
        }}
      >
        <Gift size={15} strokeWidth={2} /> Gift Us
        <AnimatePresence>{bursting && <ClickBurst />}</AnimatePresence>
      </motion.button>

      <AnimatePresence>{open && <GiftModal onClose={() => setOpen(false)} />}</AnimatePresence>
    </div>
  );
}
