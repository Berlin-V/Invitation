"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink } from "lucide-react";
import { DRIVE } from "@/lib/config";

// Placeholder photos — replace with real URLs when available
const PHOTOS = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  src: `https://picsum.photos/seed/wedding${i + 1}/${600 + (i % 3) * 100}/${700 + (i % 4) * 80}`,
  alt: `Berlin & Jerlin — Engagement ${i + 1}`,
}));

export default function Gallery() {
  const [active, setActive] = useState<typeof PHOTOS[0] | null>(null);

  return (
    <section id="gallery" className="section-pad" style={{ background: "#F8F4EF" }}>
      {/* Lightbox */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: "rgba(10,6,4,0.92)", backdropFilter: "blur(12px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <motion.div
              className="relative max-w-3xl w-full rounded-2xl overflow-hidden"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={active.src}
                alt={active.alt}
                width={900}
                height={1100}
                className="w-full h-auto object-cover"
                priority
              />
              <button
                onClick={() => setActive(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: "rgba(255,253,249,0.15)", backdropFilter: "blur(8px)" }}
              >
                <X size={16} color="#FFFDF9" strokeWidth={1.5} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto px-6">
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
            Captured Moments
          </p>
          <h2 style={{ fontFamily: "var(--font-allura), cursive", fontSize: "clamp(2.5rem,7vw,3.8rem)",
            color: "#4A403A" }}>
            Gallery
          </h2>
          <div className="divider-gold max-w-[80px] mx-auto mt-5 mb-8" />
          <a
            href={DRIVE.engagementAlbum}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2"
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "0.78rem",
              letterSpacing: "0.22em",
              color: "#C9A56D",
              textTransform: "uppercase",
              textDecoration: "none",
              borderBottom: "1px solid rgba(201,165,109,0.35)",
              paddingBottom: "2px",
            }}
          >
            View Full Album
            <ExternalLink size={11} strokeWidth={1.5} />
          </a>
        </motion.div>

        {/* Masonry grid */}
        <div className="columns-2 md:columns-3 gap-3 space-y-3">
          {PHOTOS.map((photo, i) => (
            <motion.div
              key={photo.id}
              className="break-inside-avoid cursor-pointer group img-reveal rounded-2xl overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: (i % 4) * 0.08 }}
              onClick={() => setActive(photo)}
            >
              <div className="relative overflow-hidden rounded-2xl">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={600}
                  height={700}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Hover overlay */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center"
                  style={{ background: "rgba(74,64,58,0.3)" }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(255,253,249,0.2)", backdropFilter: "blur(8px)" }}
                  >
                    <ExternalLink size={14} color="#FFFDF9" strokeWidth={1.5} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
