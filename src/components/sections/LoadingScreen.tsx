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
        <p
          style={{
            fontFamily: "var(--font-allura), cursive",
            fontSize: "clamp(3rem, 10vw, 4.5rem)",
            color: "#C9A56D",
            lineHeight: 1,
          }}
        >
          B & J
        </p>

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
