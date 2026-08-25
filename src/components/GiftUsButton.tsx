"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, X, ExternalLink } from "lucide-react";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;
const GIFT_URL = "https://giftus.io/events/berlin-jerlin-ashika-7tji";

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
            borderBottom: "1px solid rgba(201,165,109,0.2)",
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
              style={{ color: "#8A7C73" }}
            >
              <ExternalLink size={16} strokeWidth={1.5} />
            </a>
            <button
              onClick={onClose}
              aria-label="Close"
              style={{ background: "none", border: "none", cursor: "pointer", color: "#8A7C73" }}
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

interface GiftUsButtonProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function GiftUsButton({ className, style }: GiftUsButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
        className={className}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.65rem 1.5rem",
          background: "transparent",
          border: "1px solid rgba(201,165,109,0.55)",
          borderRadius: "999px",
          color: "#E8D5B0",
          fontFamily: "var(--font-cormorant), Georgia, serif",
          fontSize: "0.68rem",
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          cursor: "pointer",
          ...style,
        }}
      >
        <Gift size={13} strokeWidth={1.5} /> Gift Us
      </motion.button>

      <AnimatePresence>{open && <GiftModal onClose={() => setOpen(false)} />}</AnimatePresence>
    </>
  );
}
