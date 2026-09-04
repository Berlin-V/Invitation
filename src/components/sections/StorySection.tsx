"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pause, Play, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { EASE } from "@/constants/motion";
import { MEDIA } from "@/constants";

// ── Rolled scroll — the closed state that invites a tap ─────────────────────
function RolledScroll({ onOpen }: { onOpen: () => void }) {
  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: EASE }}
    >
      <motion.button
        onClick={onOpen}
        aria-label="Open the map to reveal our story"
        animate={{ y: [0, -14, 0], rotate: [0, -2, 2, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.94 }}
        style={{
          // The source art is 545x458; anything wider than ~272px CSS would
          // upscale it on a 2x display and lose the crisp edges.
          width: "min(70vw, 272px)",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          filter: "drop-shadow(0 18px 30px rgba(74,54,26,0.32))",
        }}
      >
        <Image
          src={MEDIA.storyScroll}
          alt="A rolled, sealed scroll"
          width={545}
          height={458}
          quality={90}
          sizes="272px"
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </motion.button>

      <p
        style={{
          marginTop: "1.25rem",
          fontFamily: "var(--font-cormorant), Georgia, serif",
          fontSize: "0.85rem",
          fontStyle: "italic",
          color: "#796D65",
        }}
      >
        Tap the seal to unroll our story
      </p>
    </motion.div>
  );
}

function VideoOverlay({ onClose }: { onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(true);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex: 250, background: "rgba(0,0,0,0.95)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.35, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
        style={{ position: "relative", width: "min(92vw, 620px)" }}
      >
        <button
          onClick={onClose}
          aria-label="Close video"
          style={{
            position: "absolute",
            top: "-2.75rem",
            right: 0,
            background: "rgba(255,255,255,0.1)",
            border: "none",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#FFF6E5",
            zIndex: 1,
          }}
        >
          <X size={18} strokeWidth={1.5} />
        </button>

        <div
          onClick={togglePlay}
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "16 / 9",
            borderRadius: "10px",
            overflow: "hidden",
            background: "#000",
            boxShadow: "0 30px 90px rgba(0,0,0,0.6)",
            cursor: "pointer",
          }}
        >
          <video
            ref={videoRef}
            src={MEDIA.storyVideo}
            autoPlay
            playsInline
            onEnded={() => setPlaying(false)}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />

          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{ pointerEvents: "none" }}
            animate={{ opacity: playing ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {playing ? (
                <Pause size={22} strokeWidth={1.5} style={{ color: "#FFF6E5" }} />
              ) : (
                <Play size={22} strokeWidth={1.5} style={{ color: "#FFF6E5", marginLeft: "3px" }} />
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function StorySection() {
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <section
      id="story"
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
          Our journey
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
          Our Story
        </h2>
        <div className="divider-gold" style={{ maxWidth: "100px", margin: "0 auto" }} />
      </motion.div>

      <RolledScroll onOpen={() => setVideoOpen(true)} />

      {/* Deep link to the full timeline page */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
        style={{ marginTop: "clamp(2.5rem, 6vw, 3.5rem)" }}
      >
        <Link
          href="/story"
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
          Read Our Timeline
        </Link>
      </motion.div>

      <AnimatePresence>
        {videoOpen && <VideoOverlay onClose={() => setVideoOpen(false)} />}
      </AnimatePresence>
    </section>
  );
}
