"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Laptop } from "lucide-react";
import { EASE } from "@/constants/motion";
import { COUPLE, MEDIA, WEDDING_DATE } from "@/constants";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{ backgroundColor: "#0F0C09" }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9, ease: "easeInOut" }}
    >
      {/* Monogram, date and line */}
      <motion.div
        className="flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: EASE }}
      >
        <motion.img
          src={MEDIA.logo}
          alt={`${COUPLE.groom} & ${COUPLE.bride}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: 1,
            scale: 1,
            filter: [
              "drop-shadow(0 4px 14px rgba(217,180,65,0.25))",
              "drop-shadow(0 4px 22px rgba(217,180,65,0.5))",
              "drop-shadow(0 4px 14px rgba(217,180,65,0.25))",
            ],
          }}
          transition={{
            opacity: { duration: 1.0, ease: "easeOut" },
            scale: { duration: 1.0, ease: EASE },
            filter: { duration: 2.6, delay: 1.0, repeat: Infinity, ease: "easeInOut" },
          }}
          style={{ width: "clamp(160px, 40vw, 240px)", height: "auto" }}
        />

        <motion.div
          style={{ height: "1px", background: "rgba(217,180,65,0.4)", marginTop: "1.5rem" }}
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 80, opacity: 1 }}
          transition={{ duration: 1.0, delay: 0.6, ease: "easeOut" }}
        />

        {/* Wedding date — sits directly under the mark */}
        <motion.p
          style={{
            marginTop: "1.35rem",
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "clamp(0.82rem, 3vw, 1rem)",
            letterSpacing: "0.3em",
            color: "#F2DCA0",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.85, ease: EASE }}
        >
          {WEDDING_DATE.display}
        </motion.p>

        {/* Extra room on laptop/desktop screens — a short line so the intro
            doesn't feel sparse once there's more space around it. */}
        <motion.p
          className="hidden md:block"
          style={{
            marginTop: "1.6rem",
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "0.95rem",
            fontStyle: "italic",
            color: "rgba(242,220,160,0.7)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.0, delay: 1.4 }}
        >
          A little love story, unfolding just for you
        </motion.p>
      </motion.div>

      {/* Bottom stack: progress bar, plus a small-screen viewing note beneath it */}
      <div
        className="absolute flex flex-col items-center"
        style={{
          left: "50%",
          transform: "translateX(-50%)",
          bottom: "calc(env(safe-area-inset-bottom, 0px) + 1.5rem)",
          gap: "1.35rem",
          width: "100%",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
        }}
      >
        {/* Status label sits with its own progress line at the foot of the
            screen, so the mark and the date carry the centre on their own. */}
        <motion.div
          className="flex flex-col items-center"
          style={{ gap: "0.7rem" }}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
        >
          <p
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "0.6rem",
              letterSpacing: "0.5em",
              color: "rgba(217,180,65,0.75)",
              textTransform: "uppercase",
              textAlign: "center",
            }}
          >
            Preparing your invitation
          </p>

          <div style={{ width: "120px", height: "1px", background: "rgba(217,180,65,0.14)" }}>
            <motion.div
              style={{ height: "100%", background: "#D9B441" }}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.4, delay: 0.3, ease: "easeInOut" }}
            />
          </div>
        </motion.div>

        {/* Phone-only: the site leans on hover states, the 3D card and a wide
            hero crop, so it genuinely reads better on a larger screen. */}
        <motion.p
          className="md:hidden flex items-center justify-center gap-2 text-center"
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "0.68rem",
            letterSpacing: "0.12em",
            lineHeight: 1.5,
            color: "rgba(242,220,160,0.7)",
            maxWidth: "22rem",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.0, delay: 1.6 }}
        >
          <Laptop size={13} strokeWidth={1.5} style={{ flexShrink: 0, opacity: 0.8 }} />
          For the best experience, open this on a laptop
        </motion.p>
      </div>
    </motion.div>
  );
}
