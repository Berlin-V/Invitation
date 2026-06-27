"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";

// Inline SVG for Instagram (not in this lucide-react version)
function InstagramIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: "linear-gradient(160deg, #2A1A10 0%, #1A0E08 100%)" }}>
      {/* Large heading */}
      <div className="section-pad text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <p style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "0.7rem",
            letterSpacing: "0.45em", color: "rgba(201,165,109,0.6)", textTransform: "uppercase",
            marginBottom: "1rem" }}>
            With gratitude
          </p>

          <h2 style={{ fontFamily: "var(--font-allura), cursive",
            fontSize: "clamp(3rem, 10vw, 6rem)", color: "#FFFDF9", lineHeight: 1.1, marginBottom: "1.5rem" }}>
            Thank You
          </h2>

          <p style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "clamp(1rem,2.5vw,1.25rem)",
            fontStyle: "italic", color: "rgba(255,253,249,0.55)", maxWidth: "34rem", margin: "0 auto 2.5rem" }}>
            Your presence is the greatest gift of all. We cannot wait to celebrate with you on this most beautiful of days.
          </p>

          <div className="flex items-center justify-center gap-4 mb-3">
            <div style={{ width: 40, height: 1, background: "rgba(201,165,109,0.35)" }} />
            <Heart size={14} color="#C9A56D" fill="#C9A56D" strokeWidth={0} />
            <div style={{ width: 40, height: 1, background: "rgba(201,165,109,0.35)" }} />
          </div>

          {/* Names */}
          <p style={{ fontFamily: "var(--font-allura), cursive", fontSize: "clamp(2rem,6vw,3rem)",
            color: "rgba(201,165,109,0.85)" }}>
            Berlin & Jerlin Ashika
          </p>

          <p style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "0.72rem",
            letterSpacing: "0.28em", color: "rgba(255,253,249,0.3)", textTransform: "uppercase",
            marginTop: "0.5rem" }}>
            December 9 – 10, 2026  ·  Tamil Nadu, India
          </p>
        </motion.div>
      </div>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-6">
        <div style={{ height: 1, background: "rgba(201,165,109,0.12)" }} />
      </div>

      {/* Bottom bar */}
      <div className="max-w-5xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "0.75rem",
          letterSpacing: "0.18em", color: "rgba(255,253,249,0.25)", textTransform: "uppercase" }}>
          © {year} Berlin & Jerlin Ashika
        </p>

        {/* Social */}
        <div className="flex items-center gap-4">
          <motion.a
            href="#"
            aria-label="Instagram"
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ border: "1px solid rgba(201,165,109,0.2)" }}
            whileHover={{ scale: 1.1, borderColor: "rgba(201,165,109,0.6)" }}
          >
            <span style={{ color: "rgba(201,165,109,0.7)" }}><InstagramIcon size={14} /></span>
          </motion.a>
        </div>

        <p style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "0.75rem",
          letterSpacing: "0.18em", color: "rgba(255,253,249,0.2)", textTransform: "uppercase" }}>
          Made with love
        </p>
      </div>
    </footer>
  );
}
