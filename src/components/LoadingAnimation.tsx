"use client";

import { motion } from "framer-motion";

export default function LoadingAnimation() {
  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
      style={{ background: "#FFFDF9" }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {/* Names */}
      <motion.p
        className="font-names text-5xl md:text-6xl text-text mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        style={{ fontFamily: "var(--font-allura), cursive" }}
      >
        Berlin & Jerlin
      </motion.p>

      {/* Gold line loader */}
      <motion.div
        className="h-px w-0 bg-gold"
        animate={{ width: "120px" }}
        transition={{ duration: 1.8, ease: "easeInOut" }}
        style={{ background: "#C9A56D" }}
      />

      {/* Subtle label */}
      <motion.p
        className="font-heading text-muted text-xs tracking-editorial uppercase mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        style={{ fontFamily: "var(--font-cormorant), Georgia, serif", color: "#8A7C73", letterSpacing: "0.35em" }}
      >
        December 2026
      </motion.p>
    </motion.div>
  );
}
