"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function FooterSection() {
  const [year, setYear] = useState(2026);
  useEffect(() => { setYear(new Date().getFullYear()); }, []);

  return (
    <footer
      style={{
        backgroundColor: "#0F0C09",
        padding: "5rem 1.5rem 3rem",
        textAlign: "center",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="flex flex-col items-center"
      >
        {/* Gold ornament line */}
        <div
          style={{
            width: "1px",
            height: "48px",
            background: "linear-gradient(to bottom, transparent, rgba(201,165,109,0.5))",
            marginBottom: "1.5rem",
          }}
        />

        {/* Couple names */}
        <p
          style={{
            fontFamily: "var(--font-allura), cursive",
            fontSize: "clamp(2.2rem, 6vw, 3.2rem)",
            color: "#C9A56D",
            lineHeight: 1.1,
            marginBottom: "0.5rem",
          }}
        >
          Berlin & Jerlin Ashika
        </p>

        {/* Gold divider */}
        <div
          style={{
            height: "1px",
            width: "60px",
            background: "rgba(201,165,109,0.35)",
            margin: "1.25rem auto",
          }}
        />

        {/* Date and venue */}
        <p
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "0.7rem",
            letterSpacing: "0.3em",
            color: "rgba(201,165,109,0.5)",
            textTransform: "uppercase",
            marginBottom: "0.4rem",
          }}
        >
          December 10, 2026
        </p>
        <p
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "0.68rem",
            letterSpacing: "0.2em",
            color: "rgba(201,165,109,0.35)",
            textTransform: "uppercase",
          }}
        >
          Tamil Nadu, India
        </p>

        {/* Bottom line */}
        <div
          style={{
            height: "1px",
            width: "40px",
            background: "rgba(201,165,109,0.18)",
            margin: "2.5rem auto 1.5rem",
          }}
        />

        {/* Copyright */}
        <p
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "0.6rem",
            letterSpacing: "0.18em",
            color: "rgba(201,165,109,0.25)",
          }}
        >
          © {year} Berlin & Jerlin Ashika. With love.
        </p>
      </motion.div>
    </footer>
  );
}
