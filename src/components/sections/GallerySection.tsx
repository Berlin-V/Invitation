"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import NextImage from "next/image";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

interface GalleryImage {
  id: string;
  src: string;
  w: number;
  h: number;
  alt: string;
}

const IMAGES: GalleryImage[] = [
  { id: "propose", src: "/images/proposeBJ.jpeg",   w: 4082, h: 5429, alt: "Berlin proposing to Jerlin Ashika" },
  { id: "ring",    src: "/images/ringMoment.jpeg",  w: 3592, h: 5392, alt: "The ring exchange moment" },
  { id: "stage",   src: "/images/stageClose.jpeg",  w: 4082, h: 6123, alt: "Berlin & Jerlin Ashika on stage" },
  { id: "evening", src: "/images/berlinAshi.jpeg",  w: 1080, h: 1546, alt: "Berlin & Jerlin Ashika, an evening together" },
];

interface LightboxProps {
  images: GalleryImage[];
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
          border: "1px solid rgba(201,165,109,0.2)",
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
          border: "1px solid rgba(201,165,109,0.2)",
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
          border: "1px solid rgba(201,165,109,0.2)",
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
          color: "rgba(201,165,109,0.5)",
        }}
      >
        {activeIndex + 1} / {images.length}
      </p>
    </motion.div>
  );
}

export default function GallerySection() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const nextImage = useCallback(() =>
    setLightboxIndex((i) => (i === null ? 0 : (i + 1) % IMAGES.length)), []);
  const prevImage = useCallback(() =>
    setLightboxIndex((i) => (i === null ? 0 : (i - 1 + IMAGES.length) % IMAGES.length)), []);

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
            color: "#C9A56D",
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

      {/* Masonry grid */}
      <div
        style={{
          maxWidth: "1160px",
          margin: "0 auto",
          columns: "3 240px",
          columnGap: "clamp(0.5rem, 1.5vw, 1rem)",
        }}
      >
        {IMAGES.map((img, i) => (
          <motion.div
            key={img.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: EASE }}
            style={{
              breakInside: "avoid",
              marginBottom: "clamp(0.5rem, 1.5vw, 1rem)",
              overflow: "hidden",
              position: "relative",
              cursor: "pointer",
              display: "block",
            }}
            onClick={() => openLightbox(i)}
            whileHover="hovered"
          >
            <motion.img
              src={img.src}
              alt={img.alt}
              loading="lazy"
              style={{ width: "100%", height: "auto", display: "block" }}
              variants={{
                hovered: { scale: 1.04 },
              }}
              transition={{ duration: 0.5, ease: EASE }}
            />

            {/* Hover overlay */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: "rgba(74,64,58,0.35)" }}
              initial={{ opacity: 0 }}
              variants={{ hovered: { opacity: 1 } }}
              transition={{ duration: 0.3 }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  border: "1px solid rgba(201,165,109,0.6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    color: "#E8D5B0",
                    fontSize: "0.65rem",
                    letterSpacing: "0.08em",
                  }}
                >
                  VIEW
                </span>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={IMAGES}
            activeIndex={lightboxIndex}
            onClose={closeLightbox}
            onNext={nextImage}
            onPrev={prevImage}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
