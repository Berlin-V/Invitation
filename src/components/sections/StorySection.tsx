"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pause, Play, X } from "lucide-react";
import Image from "next/image";
import { EASE } from "@/constants/motion";
import { MEDIA } from "@/constants";

// ── Rolled scroll — the closed state that invites a tap ─────────────────────
function RolledScroll({ onOpen }: { onOpen: () => void }) {
  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, scale: 0.96 }}
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

/* The film unrolls where the scroll was: no portal, no fixed layer, no new
   container over the page. The section simply swaps one child for the other,
   so the reader never leaves the scroll position they tapped from. */
function UnrolledFilm({ onClose }: { onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(true);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  return (
    <motion.div
      // Height 0 -> auto is the unrolling itself: the panel grows downward out
      // of where the seal sat, rather than fading in on top of the page.
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{
        height: { duration: 0.7, ease: EASE },
        opacity: { duration: 0.4, ease: EASE },
      }}
      style={{ overflow: "hidden", width: "100%" }}
    >
      <div style={{ width: "min(92vw, 620px)", margin: "0 auto", paddingTop: "0.5rem" }}>
        <div className="flex justify-end" style={{ marginBottom: "0.6rem" }}>
          <button
            onClick={onClose}
            aria-label="Roll the scroll back up"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              background: "rgba(143,100,16,0.08)",
              border: "1px solid rgba(143,100,16,0.28)",
              borderRadius: "999px",
              padding: "0.35rem 0.85rem",
              cursor: "pointer",
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "0.8rem",
              letterSpacing: "0.08em",
              color: "#796D65",
            }}
          >
            <X size={14} strokeWidth={1.5} />
            Roll back up
          </button>
        </div>

        <div
          onClick={togglePlay}
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "16 / 9",
            borderRadius: "10px",
            overflow: "hidden",
            background: "#000",
            boxShadow: "0 24px 60px rgba(74,54,26,0.28)",
            cursor: "pointer",
          }}
        >
          <video
            ref={videoRef}
            src={MEDIA.storyVideo}
            autoPlay
            playsInline
            // The overlay play/pause is the only control, so none of the
            // native affordances should be reachable: no picture-in-picture
            // (neither a button nor the right-click menu item), no download,
            // no fullscreen, no casting.
            disablePictureInPicture
            controlsList="nodownload nofullscreen noremoteplayback"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)}
            onError={() => setPlaying(false)}
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
      </div>
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
            fontSize: "0.9rem",
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

      {/* `mode="wait"` lets the seal finish rolling away before the film
          unrolls, so the two never overlap in the same spot. */}
      <AnimatePresence mode="wait" initial={false}>
        {videoOpen ? (
          <UnrolledFilm key="film" onClose={() => setVideoOpen(false)} />
        ) : (
          <RolledScroll key="scroll" onOpen={() => setVideoOpen(true)} />
        )}
      </AnimatePresence>
    </section>
  );
}
