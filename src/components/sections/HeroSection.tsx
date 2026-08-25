"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import GiftUsButton from "@/components/GiftUsButton";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: EASE },
});

// Deterministic golden-angle spread — even-looking scatter without Math.random(),
// which would differ between server and client render and break hydration.
const STARS = Array.from({ length: 30 }, (_, i) => {
  const angle = i * 137.5;
  return {
    left: `${angle % 100}%`,
    top: `${(angle * 1.7) % 100}%`,
    size: 1 + (i % 3),
    duration: 3 + (i % 5),
    delay: (i % 7) * 0.3,
  };
});

export default function HeroSection() {
  const scrollDown = () => {
    const el = document.getElementById("countdown");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative flex justify-center overflow-hidden"
      style={{ minHeight: "100svh", alignItems: "flex-start", paddingTop: "clamp(5.5rem, 15vh, 9rem)" }}
    >
      {/* Background photo — full-bleed, cropped to fill */}
      <Image
        src="/images/berlinJerlin.jpeg"
        alt="Berlin & Jerlin Ashika"
        fill
        priority
        sizes="100vw"
        style={{ objectFit: "cover", objectPosition: "center top", zIndex: 0 }}
      />

      {/* Cinematic overlay — darker top and bottom, lighter middle */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 35%, rgba(0,0,0,0.2) 65%, rgba(0,0,0,0.65) 100%)",
          zIndex: 2,
        }}
      />

      {/* Side vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 100% at 50% 50%, transparent 50%, rgba(0,0,0,0.35) 100%)",
          zIndex: 2,
        }}
      />

      {/* Twinkling stars */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
        {STARS.map((s, i) => (
          <motion.span
            key={i}
            style={{
              position: "absolute",
              left: s.left,
              top: s.top,
              width: s.size,
              height: s.size,
              borderRadius: "50%",
              background: "#FFFDF9",
              boxShadow: "0 0 4px rgba(255,253,249,0.8)",
            }}
            animate={{ opacity: [0.15, 0.9, 0.15], y: [0, -8, 0] }}
            transition={{
              duration: s.duration,
              delay: s.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Hero content */}
      <div
        className="relative flex flex-col items-center text-center px-6"
        style={{ zIndex: 3, maxWidth: "700px", margin: "0 auto" }}
      >
        {/* Eyebrow label */}
        <motion.p
          {...fadeUp(0.4)}
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "0.62rem",
            letterSpacing: "0.48em",
            color: "rgba(201,165,109,0.85)",
            textTransform: "uppercase",
            marginBottom: "1.5rem",
          }}
        >
          Together Forever
        </motion.p>

        {/* Gold line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.55, ease: EASE }}
          style={{
            height: "1px",
            width: "60px",
            background: "rgba(201,165,109,0.6)",
            marginBottom: "2rem",
          }}
        />

        {/* Groom name */}
        <motion.h1
          {...fadeUp(0.65)}
          style={{
            fontFamily: "var(--font-allura), cursive",
            fontSize: "clamp(3.5rem, 10vw, 7rem)",
            color: "#FFFDF9",
            lineHeight: 1,
            marginBottom: "0.25rem",
          }}
        >
          Berlin
        </motion.h1>

        {/* Ampersand */}
        <motion.p
          {...fadeUp(0.8)}
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "clamp(0.85rem, 2.5vw, 1.1rem)",
            letterSpacing: "0.28em",
            color: "#C9A56D",
            fontStyle: "italic",
            margin: "0.6rem 0",
          }}
        >
          and
        </motion.p>

        {/* Bride name */}
        <motion.h2
          {...fadeUp(0.95)}
          style={{
            fontFamily: "var(--font-allura), cursive",
            fontSize: "clamp(3.5rem, 10vw, 7rem)",
            color: "#FFFDF9",
            lineHeight: 1,
            marginBottom: "2.5rem",
          }}
        >
          Jerlin Ashika
        </motion.h2>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.05, ease: EASE }}
          style={{
            height: "1px",
            width: "120px",
            background:
              "linear-gradient(90deg, transparent, rgba(201,165,109,0.5), transparent)",
            marginBottom: "2rem",
          }}
        />

        {/* Date */}
        <motion.p
          {...fadeUp(1.15)}
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "clamp(0.75rem, 2vw, 0.9rem)",
            letterSpacing: "0.3em",
            color: "rgba(255,253,249,0.75)",
            textTransform: "uppercase",
            marginBottom: "0.6rem",
          }}
        >
          December 10, 2026
        </motion.p>

        {/* Gift us */}
        <motion.div {...fadeUp(1.3)} style={{ marginTop: "1.75rem" }}>
          <GiftUsButton />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollDown}
        className="absolute flex flex-col items-center gap-2"
        style={{
          bottom: "2.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          background: "none",
          border: "none",
          cursor: "pointer",
          zIndex: 3,
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        aria-label="Scroll down"
      >
        <p
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "0.58rem",
            letterSpacing: "0.38em",
            color: "rgba(255,253,249,0.45)",
            textTransform: "uppercase",
          }}
        >
          Scroll
        </p>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown
            size={16}
            strokeWidth={1.5}
            style={{ color: "rgba(201,165,109,0.6)" }}
          />
        </motion.div>
      </motion.button>
    </section>
  );
}
