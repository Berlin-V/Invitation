"use client";

import { motion } from "framer-motion";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

const WOMEN_PALETTE = [
  { hex: "#FAC2BC", name: "Blush"      },
  { hex: "#FAA38B", name: "Peach"      },
  { hex: "#EE7863", name: "Coral"      },
  { hex: "#F58893", name: "Rose"       },
  { hex: "#F2772F", name: "Amber Rose" },
];

const MEN_PALETTE = [
  { hex: "#1A1A1A", name: "Black" },
];

function ColorSwatch({ hex, name, index }: { hex: string; name: string; index: number }) {
  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: EASE }}
    >
      <motion.div
        whileHover={{ scale: 1.08 }}
        transition={{ duration: 0.3, ease: EASE }}
        style={{
          width: "clamp(52px, 8vw, 68px)",
          height: "clamp(52px, 8vw, 68px)",
          borderRadius: "50%",
          background: hex,
          border: "1px solid rgba(74,64,58,0.12)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          marginBottom: "0.65rem",
        }}
        role="img"
        aria-label={`${name} — ${hex}`}
      />
      <p
        style={{
          fontFamily: "var(--font-cormorant), Georgia, serif",
          fontSize: "0.62rem",
          letterSpacing: "0.18em",
          color: "#8A7C73",
          textTransform: "uppercase",
        }}
      >
        {name}
      </p>
    </motion.div>
  );
}

function MenChip({ hex, name, index }: { hex: string; name: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: EASE }}
      className="flex items-center gap-3"
    >
      <div
        style={{
          width: "32px",
          height: "32px",
          background: hex,
          border: "1px solid rgba(74,64,58,0.15)",
          flexShrink: 0,
        }}
        role="img"
        aria-label={`${name} — ${hex}`}
      />
      <p
        style={{
          fontFamily: "var(--font-cormorant), Georgia, serif",
          fontSize: "0.9rem",
          letterSpacing: "0.14em",
          color: "#4A403A",
        }}
      >
        {name}
      </p>
    </motion.div>
  );
}

export default function DressCodeSection() {
  return (
    <section
      id="dresscode"
      style={{
        backgroundColor: "#F8F4EF",
        padding: "clamp(4rem, 10vw, 8rem) clamp(1.25rem, 5vw, 3rem)",
      }}
    >
      {/* Section header */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.9, ease: EASE }}
        style={{ marginBottom: "clamp(3rem, 8vw, 5rem)" }}
      >
        <p
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "0.62rem",
            letterSpacing: "0.46em",
            color: "#C9A56D",
            textTransform: "uppercase",
            marginBottom: "1rem",
          }}
        >
          Dress to celebrate
        </p>
        <h2
          style={{
            fontFamily: "var(--font-allura), cursive",
            fontSize: "clamp(2.5rem, 7vw, 4.5rem)",
            color: "#4A403A",
            lineHeight: 1.1,
            marginBottom: "1.25rem",
          }}
        >
          Dress Code
        </h2>
        <div className="divider-gold" style={{ maxWidth: "100px", margin: "0 auto" }} />
      </motion.div>

      {/* Two-column layout */}
      <div
        className="flex flex-col md:flex-row"
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          gap: "clamp(3rem, 8vw, 5rem)",
        }}
      >
        {/* Women */}
        <div style={{ flex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            style={{ marginBottom: "2rem" }}
          >
            <p
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontSize: "0.62rem",
                letterSpacing: "0.38em",
                color: "#C9A56D",
                textTransform: "uppercase",
                marginBottom: "0.5rem",
              }}
            >
              Ladies
            </p>
            <h3
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontSize: "clamp(1.4rem, 3vw, 1.8rem)",
                fontWeight: 400,
                color: "#4A403A",
                lineHeight: 1.2,
                marginBottom: "0.75rem",
              }}
            >
              Warm Floral Palette
            </h3>
            <p
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontSize: "0.92rem",
                fontStyle: "italic",
                lineHeight: 1.7,
                color: "#8A7C73",
              }}
            >
              Gowns, sarees, or lehengas in any of these warm shades. Feel free to
              mix and complement — all are equally welcome.
            </p>
          </motion.div>

          {/* Swatches */}
          <div
            className="flex flex-wrap"
            style={{ gap: "clamp(1rem, 3vw, 1.75rem)" }}
          >
            {WOMEN_PALETTE.map((color, i) => (
              <ColorSwatch key={color.hex} hex={color.hex} name={color.name} index={i} />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div
          className="hidden md:block"
          style={{
            width: "1px",
            background: "rgba(201,165,109,0.25)",
            alignSelf: "stretch",
          }}
        />
        <div className="divider-thin md:hidden" />

        {/* Men */}
        <div style={{ flex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
            style={{ marginBottom: "2rem" }}
          >
            <p
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontSize: "0.62rem",
                letterSpacing: "0.38em",
                color: "#C9A56D",
                textTransform: "uppercase",
                marginBottom: "0.5rem",
              }}
            >
              Gentlemen
            </p>
            <h3
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontSize: "clamp(1.4rem, 3vw, 1.8rem)",
                fontWeight: 400,
                color: "#4A403A",
                lineHeight: 1.2,
                marginBottom: "0.75rem",
              }}
            >
              Classic Black
            </h3>
            <p
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontSize: "0.92rem",
                fontStyle: "italic",
                lineHeight: 1.7,
                color: "#8A7C73",
              }}
            >
              Black suit or black pants — ties and pocket squares in any shade from the
              ladies&rsquo; palette for a beautifully coordinated look.
            </p>
          </motion.div>

          {/* Chips */}
          <div className="flex flex-col" style={{ gap: "1.1rem" }}>
            {MEN_PALETTE.map((color, i) => (
              <MenChip key={color.hex} hex={color.hex} name={color.name} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
