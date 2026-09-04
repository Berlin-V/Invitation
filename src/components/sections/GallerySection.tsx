"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import NextImage from "next/image";
import Link from "next/link";
import { EASE } from "@/constants/motion";
import { ENGAGEMENT_PHOTOS } from "@/constants/gallery";
import type { GalleryPhoto } from "@/types";

const AUTO_ROTATE_MS = 4500;

interface LightboxProps {
  images: GalleryPhoto[];
  activeIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

function Lightbox({ images, activeIndex, onClose, onNext, onPrev }: LightboxProps) {
  const img = images[activeIndex];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onNext, onPrev]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: "rgba(15,12,9,0.95)", backdropFilter: "blur(12px)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute"
        style={{
          top: "1.5rem",
          right: "1.5rem",
          background: "rgba(255,253,249,0.08)",
          border: "1px solid rgba(217,180,65,0.2)",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "rgba(255,253,249,0.7)",
          zIndex: 201,
        }}
        aria-label="Close lightbox"
      >
        <X size={16} strokeWidth={1.5} />
      </button>

      {/* Prev */}
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute"
        style={{
          left: "1.5rem",
          top: "50%",
          transform: "translateY(-50%)",
          background: "rgba(255,253,249,0.08)",
          border: "1px solid rgba(217,180,65,0.2)",
          borderRadius: "50%",
          width: "44px",
          height: "44px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "rgba(255,253,249,0.7)",
          zIndex: 201,
        }}
        aria-label="Previous image"
      >
        <ChevronLeft size={18} strokeWidth={1.5} />
      </button>

      {/* Next */}
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute"
        style={{
          right: "1.5rem",
          top: "50%",
          transform: "translateY(-50%)",
          background: "rgba(255,253,249,0.08)",
          border: "1px solid rgba(217,180,65,0.2)",
          borderRadius: "50%",
          width: "44px",
          height: "44px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "rgba(255,253,249,0.7)",
          zIndex: 201,
        }}
        aria-label="Next image"
      >
        <ChevronRight size={18} strokeWidth={1.5} />
      </button>

      {/* Image */}
      <motion.div
        key={img.id}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="relative"
        style={{
          maxWidth: "min(90vw, 860px)",
          maxHeight: "85vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <NextImage
          src={img.src}
          alt={img.alt}
          width={img.w}
          height={img.h}
          quality={90}
          sizes="(max-width: 900px) 90vw, 860px"
          style={{
            maxWidth: "100%",
            maxHeight: "85vh",
            objectFit: "contain",
            display: "block",
            boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
            width: "auto",
            height: "auto",
          }}
        />
      </motion.div>

      {/* Counter */}
      <p
        className="absolute"
        style={{
          bottom: "1.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: "var(--font-cormorant), Georgia, serif",
          fontSize: "0.65rem",
          letterSpacing: "0.28em",
          color: "rgba(217,180,65,0.75)",
        }}
      >
        {activeIndex + 1} / {images.length}
      </p>
    </motion.div>
  );
}

const HEART_COLORS = ["#FAC2BC", "#F58893", "#F2DCA0", "#EE7863"];

// Deterministic golden-angle spread — an even-looking scatter without
// Math.random(), which React flags as impure during render and which would
// also differ between the server and client passes.
const BURST_HEARTS = Array.from({ length: 11 }, (_, i) => {
  const angle = i * 137.5;
  const spread = (angle % 100) / 100 - 0.5; // −0.5…0.5, evenly distributed
  return {
    id: i,
    x: spread * 160,
    drift: (((angle * 1.7) % 100) / 100 - 0.5) * 50,
    rise: 140 + ((angle * 2.3) % 90),
    delay: (i % 5) * 0.07,
    duration: 1.1 + (i % 4) * 0.18,
    size: 9 + (i % 5) * 2.6,
    color: HEART_COLORS[i % HEART_COLORS.length],
  };
});

function HeartBurst() {
  // Values are module-level constants; nothing to memoise.

  return (
    <div
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}
    >
      {BURST_HEARTS.map((h) => (
        <motion.span
          key={h.id}
          initial={{ opacity: 0, x: h.x, y: 30, scale: 0.3, rotate: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            x: h.x + h.drift,
            y: 30 - h.rise,
            scale: 1,
            rotate: h.drift > 0 ? 18 : -18,
          }}
          transition={{ duration: h.duration, delay: h.delay, ease: "easeOut" }}
          style={{
            position: "absolute",
            left: "50%",
            bottom: "12%",
            color: h.color,
            filter: "drop-shadow(0 2px 6px rgba(74,64,58,0.25))",
          }}
        >
          <Heart size={h.size} fill="currentColor" strokeWidth={0} />
        </motion.span>
      ))}
    </div>
  );
}

export default function GallerySection() {
  const [index, setIndex] = useState(0);
  const [burstId, setBurstId] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const advance = useCallback((dir: 1 | -1) => {
    setIndex((i) => (i + dir + ENGAGEMENT_PHOTOS.length) % ENGAGEMENT_PHOTOS.length);
    setBurstId((b) => b + 1);
  }, []);

  const goTo = useCallback((i: number) => {
    setIndex(i);
    setBurstId((b) => b + 1);
  }, []);

  useEffect(() => {
    if (lightboxOpen) return;
    const timer = setInterval(() => advance(1), AUTO_ROTATE_MS);
    return () => clearInterval(timer);
  }, [advance, lightboxOpen]);

  const img = ENGAGEMENT_PHOTOS[index];

  return (
    <section
      id="gallery"
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
        style={{ marginBottom: "clamp(2.5rem, 6vw, 4rem)" }}
      >
        <p
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "0.62rem",
            letterSpacing: "0.46em",
            color: "#8F6410",
            textTransform: "uppercase",
            marginBottom: "1rem",
          }}
        >
          Captured moments
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
          Our Gallery
        </h2>
        <div className="divider-gold" style={{ maxWidth: "100px", margin: "0 auto" }} />
      </motion.div>

      {/* Single-photo rotator */}
      <div style={{ maxWidth: "clamp(280px, 70vw, 400px)", margin: "0 auto" }}>
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "3 / 4",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 24px 60px rgba(74,64,58,0.22)",
            cursor: "pointer",
          }}
          onClick={() => setLightboxOpen(true)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.7, ease: EASE }}
              style={{ position: "absolute", inset: 0 }}
            >
              <NextImage
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 480px) 90vw, 400px"
                quality={90}
                style={{ objectFit: "cover" }}
                preload={index === 0}
              />
            </motion.div>
          </AnimatePresence>

          <HeartBurst key={burstId} />

          {/* Prev */}
          <button
            onClick={(e) => { e.stopPropagation(); advance(-1); }}
            className="absolute"
            style={{
              left: "0.75rem",
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(255,253,249,0.16)",
              border: "1px solid rgba(255,253,249,0.4)",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#FFFDF9",
              backdropFilter: "blur(4px)",
              zIndex: 5,
            }}
            aria-label="Previous photo"
          >
            <ChevronLeft size={16} strokeWidth={1.5} />
          </button>

          {/* Next */}
          <button
            onClick={(e) => { e.stopPropagation(); advance(1); }}
            className="absolute"
            style={{
              right: "0.75rem",
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(255,253,249,0.16)",
              border: "1px solid rgba(255,253,249,0.4)",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#FFFDF9",
              backdropFilter: "blur(4px)",
              zIndex: 5,
            }}
            aria-label="Next photo"
          >
            <ChevronRight size={16} strokeWidth={1.5} />
          </button>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center" style={{ gap: "0.5rem", marginTop: "1.25rem" }}>
          {ENGAGEMENT_PHOTOS.map((im, i) => (
            <button
              key={im.id}
              onClick={() => goTo(i)}
              aria-label={`Go to photo ${i + 1}`}
              style={{
                width: i === index ? "22px" : "8px",
                height: "8px",
                borderRadius: "999px",
                background: i === index ? "#D9B441" : "rgba(217,180,65,0.3)",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>
      </div>

      {/* Deep link — the album page carries the other albums and the Drive link */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
        style={{ marginTop: "clamp(2.5rem, 6vw, 3.5rem)" }}
      >
        <Link
          href="/gallery"
          style={{
            display: "inline-block",
            color: "#B08A2E",
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "0.66rem",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            padding: "0.75rem 2.25rem",
            textDecoration: "none",
            border: "1px solid rgba(217,180,65,0.45)",
          }}
        >
          View All Albums
        </Link>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <Lightbox
            images={ENGAGEMENT_PHOTOS}
            activeIndex={index}
            onClose={() => setLightboxOpen(false)}
            onNext={() => advance(1)}
            onPrev={() => advance(-1)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
