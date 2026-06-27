"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { VIDEO } from "@/lib/config";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show:   { opacity: 1, y: 0 },
};

export default function Hero() {
  const videoRef = useRef<HTMLIFrameElement>(null);

  const scrollDown = () => {
    document.getElementById("countdown")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Fallback warm gradient (shows while video loads) */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(160deg, #3D2B1F 0%, #2A1A10 40%, #1A0E08 100%)",
        }}
      />

      {/* Video background */}
      <iframe
        ref={videoRef}
        src={`${VIDEO.embedUrl}&mute=1`}
        className="absolute pointer-events-none"
        style={{
          top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: "max(100vw, calc(177.78vh))",
          height: "calc(max(100vh, calc(56.25vw)) + 200px)",
          border: "none",
        }}
        allow="autoplay; fullscreen; encrypted-media"
        title="Wedding video"
      />

      {/* Multi-layer cinematic overlay */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(to bottom, rgba(10,6,4,0.4) 0%, rgba(10,6,4,0.15) 45%, rgba(10,6,4,0.72) 100%)"
      }} />
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 50% 50%, transparent 20%, rgba(10,6,4,0.55) 100%)"
      }} />

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-6"
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.18 } } }}
      >
        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.8 }}
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "0.7rem",
            letterSpacing: "0.5em",
            color: "rgba(232,213,176,0.85)",
            textTransform: "uppercase",
            marginBottom: "1.5rem",
          }}
        >
          Together Forever
        </motion.p>

        <motion.h1
          variants={fadeUp}
          transition={{ duration: 1 }}
          style={{
            fontFamily: "var(--font-allura), cursive",
            fontSize: "clamp(3.5rem, 12vw, 7.5rem)",
            color: "#FFFDF9",
            lineHeight: 1.1,
            marginBottom: "0.3rem",
          }}
        >
          Berlin
        </motion.h1>

        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.7 }}
          className="flex items-center gap-4 my-1"
        >
          <div style={{ width: 40, height: 1, background: "rgba(201,165,109,0.6)" }} />
          <span style={{ color: "#C9A56D", fontSize: "1rem" }}>♦</span>
          <div style={{ width: 40, height: 1, background: "rgba(201,165,109,0.6)" }} />
        </motion.div>

        <motion.h1
          variants={fadeUp}
          transition={{ duration: 1 }}
          style={{
            fontFamily: "var(--font-allura), cursive",
            fontSize: "clamp(2.8rem, 10vw, 6rem)",
            color: "#FFFDF9",
            lineHeight: 1.1,
            marginBottom: "1.8rem",
          }}
        >
          Jerlin Ashika
        </motion.h1>

        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-3"
        >
          <div style={{ width: 24, height: 1, background: "rgba(201,165,109,0.5)" }} />
          <p style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "clamp(0.85rem, 2vw, 1.05rem)",
            letterSpacing: "0.22em",
            color: "rgba(232,213,176,0.85)",
            textTransform: "uppercase",
          }}>
            December 9 – 10, 2026
          </p>
          <div style={{ width: 24, height: 1, background: "rgba(201,165,109,0.5)" }} />
        </motion.div>

        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.8, delay: 0.1 }}
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "0.75rem",
            letterSpacing: "0.28em",
            color: "rgba(255,253,249,0.45)",
            textTransform: "uppercase",
            marginTop: "0.5rem",
          }}
        >
          Tamil Nadu, India
        </motion.p>
      </motion.div>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollDown}
        className="absolute bottom-8 left-1/2 flex flex-col items-center gap-2"
        style={{ transform: "translateX(-50%)", background: "none", border: "none", cursor: "pointer" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <span style={{
          fontFamily: "var(--font-cormorant), Georgia, serif",
          fontSize: "0.65rem",
          letterSpacing: "0.4em",
          color: "rgba(232,213,176,0.55)",
          textTransform: "uppercase",
        }}>
          Scroll to Begin
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        >
          <ChevronDown size={16} color="rgba(201,165,109,0.6)" strokeWidth={1.5} />
        </motion.div>
      </motion.button>
    </section>
  );
}
