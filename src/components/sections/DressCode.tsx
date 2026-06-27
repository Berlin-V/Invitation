"use client";

import { motion } from "framer-motion";

const LADIES_SWATCHES = [
  { hex: "#FAC2BC", name: "Blush" },
  { hex: "#FAA38B", name: "Peach" },
  { hex: "#EE7863", name: "Coral" },
  { hex: "#F58893", name: "Rose" },
  { hex: "#F2772F", name: "Amber" },
];

const GENTS_OPTIONS = [
  { color: "#E8DCC8", label: "Beige" },
  { color: "#F0EAD6", label: "Cream" },
  { color: "#F5F0E8", label: "White" },
  { color: "#C2B280", label: "Khaki" },
];

export default function DressCode() {
  return (
    <section id="dressCode" className="section-pad" style={{ background: "#F8F4EF" }}>
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
        >
          <p style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "0.72rem",
            letterSpacing: "0.42em", color: "#C9A56D", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            What to Wear
          </p>
          <h2 style={{ fontFamily: "var(--font-allura), cursive", fontSize: "clamp(2.5rem,7vw,3.8rem)",
            color: "#4A403A" }}>
            Dress Code
          </h2>
          <div className="divider-gold max-w-[80px] mx-auto mt-5" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* ── Ladies ── */}
          <motion.div
            className="rounded-3xl p-8"
            style={{
              background: "#FFFDF9",
              border: "1px solid rgba(201,165,109,0.18)",
              boxShadow: "0 4px 24px rgba(74,64,58,0.04)",
            }}
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "0.7rem",
              letterSpacing: "0.32em", color: "#C9A56D", textTransform: "uppercase", marginBottom: "0.5rem" }}>
              Ladies
            </p>
            <h3 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "1.7rem",
              fontWeight: 400, color: "#4A403A", marginBottom: "1.5rem", lineHeight: 1.2 }}>
              Soft Romantic<br />
              <span style={{ fontStyle: "italic", color: "#8A7C73", fontSize: "1.2rem" }}>Palette</span>
            </h3>

            {/* Color swatches */}
            <div className="flex gap-4 flex-wrap mb-5">
              {LADIES_SWATCHES.map((s, i) => (
                <motion.div
                  key={s.hex}
                  className="flex flex-col items-center gap-2"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <motion.div
                    className="rounded-full"
                    style={{
                      width: 48,
                      height: 48,
                      background: s.hex,
                      boxShadow: `0 4px 16px ${s.hex}60`,
                    }}
                    whileHover={{ scale: 1.15, y: -3 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  />
                  <span style={{ fontFamily: "var(--font-cormorant), Georgia, serif",
                    fontSize: "0.65rem", letterSpacing: "0.2em", color: "#8A7C73", textTransform: "uppercase" }}>
                    {s.name}
                  </span>
                </motion.div>
              ))}
            </div>

            <p style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "0.9rem",
              fontStyle: "italic", color: "#8A7C73", lineHeight: 1.7 }}>
              Gowns, sarees, or lehengas in any of these warm hues.
            </p>
          </motion.div>

          {/* ── Gents ── */}
          <motion.div
            className="rounded-3xl p-8"
            style={{
              background: "#FFFDF9",
              border: "1px solid rgba(201,165,109,0.18)",
              boxShadow: "0 4px 24px rgba(74,64,58,0.04)",
            }}
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <p style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "0.7rem",
              letterSpacing: "0.32em", color: "#C9A56D", textTransform: "uppercase", marginBottom: "0.5rem" }}>
              Gentlemen
            </p>
            <h3 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "1.7rem",
              fontWeight: 400, color: "#4A403A", marginBottom: "1.5rem", lineHeight: 1.2 }}>
              Refined Neutral<br />
              <span style={{ fontStyle: "italic", color: "#8A7C73", fontSize: "1.2rem" }}>Tones</span>
            </h3>

            {/* Neutral swatches */}
            <div className="flex gap-3 flex-wrap mb-5">
              {GENTS_OPTIONS.map((g, i) => (
                <motion.div
                  key={g.label}
                  className="flex flex-col items-center gap-2"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <motion.div
                    className="rounded-full"
                    style={{
                      width: 48,
                      height: 48,
                      background: g.color,
                      border: "1px solid rgba(201,165,109,0.3)",
                      boxShadow: "0 2px 8px rgba(74,64,58,0.1)",
                    }}
                    whileHover={{ scale: 1.15, y: -3 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  />
                  <span style={{ fontFamily: "var(--font-cormorant), Georgia, serif",
                    fontSize: "0.65rem", letterSpacing: "0.2em", color: "#8A7C73", textTransform: "uppercase" }}>
                    {g.label}
                  </span>
                </motion.div>
              ))}
            </div>

            <p style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "0.9rem",
              fontStyle: "italic", color: "#8A7C73", lineHeight: 1.7 }}>
              Suits or sherwanis in beige, cream, white, or khaki.
            </p>
          </motion.div>
        </div>

        {/* Bride & Groom note */}
        <motion.div
          className="mt-8 text-center p-6 rounded-3xl"
          style={{ background: "rgba(201,165,109,0.06)", border: "1px solid rgba(201,165,109,0.2)" }}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex items-center justify-center gap-10 flex-wrap">
            {[
              { who: "Bride", color: "#F9F9F9", stroke: "rgba(201,165,109,0.4)", label: "White" },
              { who: "Groom", color: "#E8DCC8", stroke: "rgba(201,165,109,0.4)", label: "Beige" },
            ].map((b) => (
              <div key={b.who} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full"
                  style={{ background: b.color, border: `1.5px solid ${b.stroke}`, boxShadow: "0 2px 8px rgba(74,64,58,0.08)" }} />
                <div>
                  <p style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "0.65rem",
                    letterSpacing: "0.28em", color: "#C9A56D", textTransform: "uppercase" }}>{b.who}</p>
                  <p style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "1.05rem",
                    color: "#4A403A" }}>{b.label}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
