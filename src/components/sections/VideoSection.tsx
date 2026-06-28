"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause } from "lucide-react";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

export default function VideoSection() {
  const [playing, setPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) {
      video.pause();
      setPlaying(false);
    } else {
      video.play();
      setPlaying(true);
    }
  };

  return (
    <section
      id="video"
      style={{
        backgroundColor: "#0F0C09",
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
            color: "rgba(201,165,109,0.7)",
            textTransform: "uppercase",
            marginBottom: "1rem",
          }}
        >
          Our journey, filmed
        </p>
        <h2
          style={{
            fontFamily: "var(--font-allura), cursive",
            fontSize: "clamp(2.5rem, 7vw, 4.5rem)",
            color: "#E8D5B0",
            lineHeight: 1.1,
            marginBottom: "1.25rem",
          }}
        >
          Our Journey
        </h2>
        <div
          style={{
            height: "1px",
            maxWidth: "100px",
            margin: "0 auto",
            background:
              "linear-gradient(90deg, transparent, rgba(201,165,109,0.5), transparent)",
          }}
        />
      </motion.div>

      {/* Video player */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1.0, ease: EASE }}
        style={{ maxWidth: "900px", margin: "0 auto", position: "relative" }}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* Video container */}
        <div
          style={{
            borderRadius: "4px",
            overflow: "hidden",
            position: "relative",
            background: "#1A1510",
            aspectRatio: "16/9",
          }}
        >
          <video
            ref={videoRef}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            playsInline
            onEnded={() => setPlaying(false)}
          >
            <source src="/wedding-video.mov" type="video/quicktime" />
            <source src="/wedding-video.mp4" type="video/mp4" />
          </video>

          {/* Poster overlay — shown when not playing */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background: "rgba(15,12,9,0.45)",
              pointerEvents: playing && !showControls ? "none" : "auto",
            }}
            animate={{ opacity: playing && !showControls ? 0 : 1 }}
            transition={{ duration: 0.4 }}
          >
            {/* Glassmorphism play button */}
            <motion.button
              onClick={togglePlay}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
              style={{
                width: "clamp(64px, 10vw, 88px)",
                height: "clamp(64px, 10vw, 88px)",
                borderRadius: "50%",
                background: "rgba(255,253,249,0.12)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(201,165,109,0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 4px 32px rgba(0,0,0,0.35)",
              }}
              aria-label={playing ? "Pause video" : "Play video"}
            >
              {playing ? (
                <Pause size={24} strokeWidth={1.5} style={{ color: "#E8D5B0" }} />
              ) : (
                <Play
                  size={24}
                  strokeWidth={1.5}
                  style={{ color: "#E8D5B0", marginLeft: "3px" }}
                />
              )}
            </motion.button>
          </motion.div>

          {/* Controls overlay when playing and hovering */}
          {playing && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ opacity: showControls ? 1 : 0 }}
              transition={{ duration: 0.25 }}
              style={{ pointerEvents: showControls ? "auto" : "none" }}
            >
              <button
                onClick={togglePlay}
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: "rgba(15,12,9,0.55)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(201,165,109,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
                aria-label="Pause video"
              >
                <Pause size={20} strokeWidth={1.5} style={{ color: "#E8D5B0" }} />
              </button>
            </motion.div>
          )}
        </div>

        {/* Caption */}
        <p
          style={{
            marginTop: "1.5rem",
            textAlign: "center",
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "0.72rem",
            letterSpacing: "0.18em",
            color: "rgba(201,165,109,0.4)",
            textTransform: "uppercase",
          }}
        >
          A film of our story
        </p>
      </motion.div>
    </section>
  );
}
