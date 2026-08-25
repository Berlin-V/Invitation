"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { COUPLE, WEDDING_DATE, EVENTS } from "@/constants";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

// ── Card dimensions ────────────────────────────────────────────────────────
const CARD_W = 340;
const CARD_H = 570;

// ── Back face: all wedding details ─────────────────────────────────────────
function CardBack() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "#FFFDF9",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        transform: "rotateY(180deg)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Gold top bar */}
      <div
        style={{
          height: "3px",
          background: "linear-gradient(90deg, transparent, #C9A56D, transparent)",
          flexShrink: 0,
        }}
      />

      {/* Scrollable content */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "clamp(1.25rem, 4vw, 1.75rem) clamp(1.25rem, 4vw, 2rem)",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(201,165,109,0.4) transparent",
        }}
      >
        {/* Eyebrow */}
        <p
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "0.56rem",
            letterSpacing: "0.42em",
            color: "#C9A56D",
            textTransform: "uppercase",
            textAlign: "center",
            marginBottom: "0.75rem",
          }}
        >
          You are cordially invited
        </p>

        {/* Couple names */}
        <p
          style={{
            fontFamily: "var(--font-allura), cursive",
            fontSize: "clamp(1.6rem, 5vw, 2.2rem)",
            color: "#4A403A",
            textAlign: "center",
            lineHeight: 1.1,
            marginBottom: "0.2rem",
          }}
        >
          {COUPLE.groom}
        </p>
        <p
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "0.65rem",
            letterSpacing: "0.24em",
            color: "#C9A56D",
            textAlign: "center",
            fontStyle: "italic",
            marginBottom: "0.2rem",
          }}
        >
          &amp;
        </p>
        <p
          style={{
            fontFamily: "var(--font-allura), cursive",
            fontSize: "clamp(1.6rem, 5vw, 2.2rem)",
            color: "#4A403A",
            textAlign: "center",
            lineHeight: 1.1,
            marginBottom: "1rem",
          }}
        >
          {COUPLE.bride}
        </p>

        {/* Gold divider */}
        <div
          style={{
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(201,165,109,0.6), transparent)",
            margin: "0 auto 1rem",
          }}
        />

        {/* Date */}
        <p
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "0.75rem",
            letterSpacing: "0.16em",
            color: "#4A403A",
            textAlign: "center",
            marginBottom: "1.25rem",
          }}
        >
          {WEDDING_DATE.display}
        </p>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            width: "32px",
            background: "rgba(201,165,109,0.4)",
            margin: "0 auto 1.25rem",
          }}
        />

        {/* Morning events */}
        <p
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "0.56rem",
            letterSpacing: "0.38em",
            color: "#C9A56D",
            textTransform: "uppercase",
            textAlign: "center",
            marginBottom: "0.6rem",
          }}
        >
          {EVENTS.brideSide.label} · {EVENTS.brideSide.timeRange}
        </p>

        {EVENTS.brideSide.items.map((item) => (
          <div
            key={item.title}
            style={{ textAlign: "center", marginBottom: "0.45rem" }}
          >
            <span style={{ fontSize: "0.85rem" }}>{item.icon}</span>{" "}
            <span
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontSize: "0.8rem",
                color: "#4A403A",
              }}
            >
              {item.time} — {item.title}
            </span>
          </div>
        ))}

        {/* Divider between sides */}
        <div
          style={{
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(201,165,109,0.3), transparent)",
            margin: "1rem auto",
          }}
        />

        {/* Evening events */}
        <p
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "0.56rem",
            letterSpacing: "0.38em",
            color: "#C9A56D",
            textTransform: "uppercase",
            textAlign: "center",
            marginBottom: "0.6rem",
          }}
        >
          {EVENTS.groomSide.label} · {EVENTS.groomSide.timeRange}
        </p>

        {EVENTS.groomSide.items.map((item) => (
          <div
            key={item.title}
            style={{ textAlign: "center", marginBottom: "0.45rem" }}
          >
            <span style={{ fontSize: "0.85rem" }}>{item.icon}</span>{" "}
            <span
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontSize: "0.8rem",
                color: "#4A403A",
              }}
            >
              {item.time} — {item.title}
            </span>
          </div>
        ))}

        {/* Bottom ornament */}
        <div
          style={{
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(201,165,109,0.4), transparent)",
            margin: "1.25rem auto 1rem",
          }}
        />

        <p
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "0.75rem",
            fontStyle: "italic",
            color: "#8A7C73",
            textAlign: "center",
            lineHeight: 1.65,
            marginBottom: "0.5rem",
          }}
        >
          Two hearts. One story. One beautiful beginning.
        </p>

        <p
          style={{
            fontFamily: "var(--font-allura), cursive",
            fontSize: "1.1rem",
            color: "#C9A56D",
            textAlign: "center",
          }}
        >
          {COUPLE.groom} & {COUPLE.bride}
        </p>
      </div>

      {/* Gold bottom bar */}
      <div
        style={{
          height: "3px",
          background: "linear-gradient(90deg, transparent, #C9A56D, transparent)",
          flexShrink: 0,
        }}
      />
    </div>
  );
}

// ── Main 3D card ───────────────────────────────────────────────────────────
export default function CoupleCard3D() {
  const [flipped, setFlipped] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);

  // Raw rotation motion value, spring-smoothed for display
  const rawRotation = useMotionValue(0);
  const rotation = useSpring(rawRotation, { stiffness: 80, damping: 18 });
  const rotateY = useTransform(rotation, (r) => `${r}deg`);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      setIsDragging(false);
      dragStartX.current = e.clientX;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    []
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const dx = e.clientX - dragStartX.current;
      if (Math.abs(dx) > 4 && !isDragging) setIsDragging(true);
      if (!isDragging && Math.abs(dx) <= 4) return;
      const base = flipped ? 180 : 0;
      rawRotation.set(base + dx * 0.55);
    },
    [isDragging, flipped, rawRotation]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      const dx = e.clientX - dragStartX.current;
      if (!isDragging) {
        // Pure click — toggle
        const next = !flipped;
        rawRotation.set(next ? 180 : 0);
        setFlipped(next);
      } else {
        // Drag ended — snap
        const cur = rawRotation.get();
        const mod = ((cur % 360) + 360) % 360;
        const target = mod < 90 || mod > 270 ? 0 : 180;
        rawRotation.set(target);
        setFlipped(target === 180);
      }
      setIsDragging(false);
      void dx;
    },
    [isDragging, flipped, rawRotation]
  );

  return (
    <section
      id="couple"
      style={{
        backgroundColor: "#0A0705",
        padding: "clamp(4rem, 10vw, 8rem) clamp(1.25rem, 5vw, 3rem)",
        overflow: "hidden",
      }}
    >
      {/* Section header */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.9, ease: EASE }}
        style={{ marginBottom: "clamp(2.5rem, 6vw, 4rem)" }}
      >
        <p
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "0.62rem",
            letterSpacing: "0.46em",
            color: "rgba(201,165,109,0.55)",
            textTransform: "uppercase",
            marginBottom: "1rem",
          }}
        >
          Meet the couple
        </p>
        <h2
          style={{
            fontFamily: "var(--font-allura), cursive",
            fontSize: "clamp(2.5rem, 7vw, 4.5rem)",
            color: "#C9A56D",
            lineHeight: 1.1,
            marginBottom: "1.25rem",
          }}
        >
          Berlin & Jerlin Ashika
        </h2>
        <div
          style={{
            height: "1px",
            width: "80px",
            background: "linear-gradient(90deg, transparent, rgba(201,165,109,0.45), transparent)",
            margin: "0 auto",
          }}
        />
      </motion.div>

      {/* 3D card stage */}
      <motion.div
        className="flex flex-col items-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 1.0, delay: 0.2, ease: EASE }}
      >
        {/* Perspective container */}
        <div
          style={{
            perspective: "1200px",
            perspectiveOrigin: "50% 50%",
            cursor: isDragging ? "grabbing" : "grab",
          }}
        >
          {/* Rotating card */}
          <motion.div
            style={{
              width: `min(${CARD_W}px, 88vw)`,
              height: `clamp(${CARD_H * 0.8}px, 80vw * 1.68, ${CARD_H}px)`,
              position: "relative",
              transformStyle: "preserve-3d",
              rotateY,
              boxShadow: "0 24px 80px rgba(0,0,0,0.7)",
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            whileHover={{ scale: 1.015 }}
            transition={{ scale: { duration: 0.3 } }}
          >
            {/* ── FRONT FACE ── */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                overflow: "hidden",
                border: "1px solid rgba(201,165,109,0.3)",
              }}
            >
              <Image
                src="/images/berlinJerlin.jpeg"
                alt="Berlin & Jerlin Ashika"
                fill
                sizes={`${CARD_W}px`}
                style={{ objectFit: "cover", objectPosition: "center top" }}
                priority
              />

              {/* Subtle gradient overlay on photo */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to bottom, transparent 55%, rgba(15,12,9,0.55) 100%)",
                }}
              />

              {/* Name tag at bottom */}
              <div
                style={{
                  position: "absolute",
                  bottom: "1.25rem",
                  left: "1.25rem",
                  right: "1.25rem",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-allura), cursive",
                    fontSize: "1.4rem",
                    color: "#FFFDF9",
                    lineHeight: 1.15,
                  }}
                >
                  {COUPLE.groom} & {COUPLE.bride}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-cormorant), Georgia, serif",
                    fontSize: "0.6rem",
                    letterSpacing: "0.28em",
                    color: "rgba(232,213,176,0.75)",
                    textTransform: "uppercase",
                    marginTop: "0.2rem",
                  }}
                >
                  {WEDDING_DATE.displayShort}
                </p>
              </div>
            </div>

            {/* ── BACK FACE ── */}
            <CardBack />
          </motion.div>
        </div>

        {/* Flip hint */}
        <motion.div
          className="flex items-center gap-3 mt-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          animate={{ opacity: flipped ? 0.4 : 0.75 }}
        >
          <motion.span
            animate={{ x: [-4, 4, -4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "0.62rem",
              letterSpacing: "0.3em",
              color: "rgba(201,165,109,0.65)",
              textTransform: "uppercase",
            }}
          >
            ← Drag or click to flip →
          </motion.span>
        </motion.div>
      </motion.div>
    </section>
  );
}
