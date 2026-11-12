"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, X, ExternalLink } from "lucide-react";
import { EASE } from "@/constants/motion";
import { GIFT_URL } from "@/constants";
import {
  ClickBurst,
  GOLD_PILL_STYLE,
  GOLD_PILL_TRANSITION,
  GOLD_PILL_VARIANTS,
  PulseRing,
} from "@/components/ui/GoldPill";

/**
 * Rendered through a portal to document.body. Several of the pages that host
 * this button sit inside an ancestor with its own z-index — a stacking context
 * that would trap the overlay beneath fixed chrome like the "Back to Home"
 * chip, however high its own z-index. Only ever mounted after a click, so
 * document.body is always there.
 */
function GiftModal({ onClose }: { onClose: () => void }) {
  return createPortal(
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
            borderBottom: "1px solid rgba(240,188,63,0.2)",
            background: "#FFFDF9",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "0.88rem",
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
    </motion.div>,
    document.body,
  );
}

interface GiftUsButtonProps {
  className?: string;
  style?: React.CSSProperties;
  /** Ambient ring around the pill. Off by default — Gift Us is never the
   *  loudest thing on a page now; Wish Us leads and this sits beside it. */
  pulse?: boolean;
}

export default function GiftUsButton({ className, style, pulse = false }: GiftUsButtonProps) {
  const [open, setOpen] = useState(false);
  const [bursting, setBursting] = useState(false);

  const handleClick = () => {
    setBursting(true);
    setOpen(true);
    setTimeout(() => setBursting(false), 750);
  };

  return (
    <div className="relative inline-block" style={style}>
      {pulse && <PulseRing />}

      <motion.button
        onClick={handleClick}
        initial="rest"
        whileHover="hover"
        whileTap={{ scale: 0.95 }}
        variants={GOLD_PILL_VARIANTS}
        transition={GOLD_PILL_TRANSITION}
        className={`gold-pill relative ${className ?? ""}`}
        style={GOLD_PILL_STYLE}
      >
        <Gift size={15} strokeWidth={2} /> Gift Us
        <AnimatePresence>{bursting && <ClickBurst />}</AnimatePresence>
      </motion.button>

      <AnimatePresence>{open && <GiftModal onClose={() => setOpen(false)} />}</AnimatePresence>
    </div>
  );
}
