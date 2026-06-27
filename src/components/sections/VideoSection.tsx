"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause } from "lucide-react";
import { VIDEO } from "@/lib/config";

export default function VideoSection() {
  const [playing, setPlaying] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // For Drive embeds we can't programmatically control play/pause via postMessage
  // reliably, so we show the iframe on play click and hide the poster.
  const handlePlay = () => setPlaying(true);

  return (
    <section
      id="film"
      className="section-pad"
      style={{ background: "linear-gradient(160deg, #2A1A10 0%, #1A0E08 100%)" }}
    >
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
        >
          <p style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "0.7rem",
            letterSpacing: "0.45em", color: "rgba(201,165,109,0.7)", textTransform: "uppercase", marginBottom: "0.8rem" }}>
            Pre-Wedding Film
          </p>
          <h2 style={{ fontFamily: "var(--font-allura), cursive", fontSize: "clamp(2.5rem,7vw,4rem)",
            color: "#FFFDF9", lineHeight: 1.15 }}>
            Our Journey
          </h2>
          <p style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "1rem",
            fontStyle: "italic", color: "rgba(255,253,249,0.55)", marginTop: "0.8rem" }}>
            Every love story is beautiful, but ours is our favourite.
          </p>
        </motion.div>

        {/* Video player */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative rounded-3xl overflow-hidden"
          style={{
            aspectRatio: "16/9",
            boxShadow: "0 40px 100px rgba(0,0,0,0.5)",
            border: "1px solid rgba(201,165,109,0.15)",
          }}
        >
          {!playing ? (
            /* Poster / play button */
            <>
              {/* Dark gradient poster */}
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(135deg, #3D2B1F 0%, #1A0E08 100%)" }}
              />
              {/* Decorative center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p style={{ fontFamily: "var(--font-allura), cursive", fontSize: "clamp(2rem,6vw,3.5rem)",
                  color: "rgba(255,253,249,0.25)" }}>
                  Berlin & Jerlin
                </p>
              </div>

              {/* Play button */}
              <motion.button
                onClick={handlePlay}
                className="absolute inset-0 flex items-center justify-center group"
                whileHover="hover"
              >
                {/* Ripple rings */}
                {[80, 110, 145].map((s, i) => (
                  <motion.div
                    key={s}
                    className="absolute rounded-full"
                    style={{ width: s, height: s, border: "1px solid rgba(201,165,109,0.3)" }}
                    animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 3 + i * 0.6, repeat: Infinity, delay: i * 0.4 }}
                  />
                ))}

                {/* Play circle */}
                <motion.div
                  className="relative flex items-center justify-center rounded-full z-10"
                  style={{
                    width: 72,
                    height: 72,
                    background: "rgba(255,253,249,0.12)",
                    border: "1px solid rgba(255,253,249,0.35)",
                    backdropFilter: "blur(10px)",
                  }}
                  variants={{ hover: { scale: 1.1, background: "rgba(201,165,109,0.25)" } }}
                  transition={{ duration: 0.3 }}
                >
                  <Play size={22} color="#FFFDF9" fill="#FFFDF9" strokeWidth={0} style={{ marginLeft: 3 }} />
                </motion.div>
              </motion.button>
            </>
          ) : (
            <iframe
              ref={iframeRef}
              src={`${VIDEO.embedUrl}&mute=0`}
              className="absolute inset-0 w-full h-full"
              allow="autoplay; fullscreen; encrypted-media"
              title="Pre-wedding film"
              style={{ border: "none" }}
            />
          )}
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "0.72rem",
            letterSpacing: "0.28em", color: "rgba(201,165,109,0.5)", textTransform: "uppercase" }}
        >
          A film of our story
        </motion.p>
      </div>
    </section>
  );
}
