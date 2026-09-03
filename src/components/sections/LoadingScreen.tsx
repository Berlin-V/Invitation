"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

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
      {/* Monogram and line */}
      <motion.div
        className="flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <motion.img
          src="/images/logo.svg"
          alt="Berlin & Jerlin Ashika"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: 1,
            scale: 1,
            filter: [
              "drop-shadow(0 4px 14px rgba(201,165,109,0.25))",
              "drop-shadow(0 4px 22px rgba(201,165,109,0.5))",
              "drop-shadow(0 4px 14px rgba(201,165,109,0.25))",
            ],
          }}
          transition={{
            opacity: { duration: 1.0, ease: "easeOut" },
            scale: { duration: 1.0, ease: [0.25, 0.46, 0.45, 0.94] },
            filter: { duration: 2.6, delay: 1.0, repeat: Infinity, ease: "easeInOut" },
          }}
          style={{ width: "clamp(160px, 40vw, 240px)", height: "auto" }}
        />

        <motion.div
          style={{ height: "1px", background: "rgba(201,165,109,0.4)", marginTop: "1.5rem" }}
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 80, opacity: 1 }}
          transition={{ duration: 1.0, delay: 0.6, ease: "easeOut" }}
        />

        <motion.p
          style={{
            marginTop: "1.25rem",
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "0.6rem",
            letterSpacing: "0.5em",
            color: "rgba(201,165,109,0.4)",
            textTransform: "uppercase",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.0, delay: 1.0 }}
        >
          Preparing your invitation
        </motion.p>

        {/* Extra room on laptop/desktop screens — a short line so the intro
            doesn't feel sparse once there's more space around it. */}
        <motion.p
          className="hidden md:block"
          style={{
            marginTop: "0.85rem",
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "0.95rem",
            fontStyle: "italic",
            color: "rgba(232,213,176,0.55)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.0, delay: 1.3 }}
        >
          A little love story, unfolding just for you
        </motion.p>
      </motion.div>

      {/* Progress bar */}
      <motion.div
        className="absolute"
        style={{ bottom: "2.5rem", left: "50%", transform: "translateX(-50%)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div
          style={{ width: "100px", height: "1px", background: "rgba(201,165,109,0.1)" }}
        >
          <motion.div
            style={{ height: "100%", background: "#C9A56D" }}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.4, delay: 0.3, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
