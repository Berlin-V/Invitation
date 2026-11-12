"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Pause, Play, X } from "lucide-react";
import Image from "next/image";
import { EASE } from "@/constants/motion";
import { MEDIA, STORY_PIN } from "@/constants";
import { useFilmPlayback } from "@/hooks";

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


/* Once the code is given it stays given for the visit, so rolling the scroll
   back up and opening it again doesn't ask a second time. sessionStorage
   rather than state because the subpages unmount this whole section. */
const UNLOCK_KEY = "wed_story_unlocked";

function readUnlocked() {
  try {
    return sessionStorage.getItem(UNLOCK_KEY) === "1";
  } catch {
    return false; // Private mode, blocked storage — just ask again.
  }
}

/* The seal asks for the code before the film exists. The <video> is not
   mounted until this clears, so the film isn't even fetched before then. */
function SealLock({ onUnlock, onClose }: { onUnlock: () => void; onClose: () => void }) {
  const [code, setCode] = useState("");
  const [wrong, setWrong] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = (value: string) => {
    if (value === STORY_PIN) {
      try {
        sessionStorage.setItem(UNLOCK_KEY, "1");
      } catch {
        // Not being able to remember it is survivable; opening it is not.
      }
      onUnlock();
      return;
    }
    setWrong(true);
    setCode("");
    inputRef.current?.focus();
  };

  const onChange = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, STORY_PIN.length);
    setCode(digits);
    if (wrong) setWrong(false);
    // Four digits is the whole code, so there is nothing to press afterwards.
    if (digits.length === STORY_PIN.length) submit(digits);
  };

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ height: { duration: 0.5, ease: EASE }, opacity: { duration: 0.35, ease: EASE } }}
      style={{ overflow: "hidden", width: "100%" }}
    >
      <div className="flex flex-col items-center" style={{ paddingTop: "0.5rem" }}>
        <motion.div
          animate={wrong ? { x: [0, -9, 9, -6, 6, 0] } : { x: 0 }}
          transition={{ duration: 0.45 }}
          className="flex flex-col items-center"
          style={{
            width: "min(100%, 360px)",
            background: "#FFFDF9",
            border: "1px solid rgba(240,188,63,0.3)",
            borderRadius: "14px",
            padding: "1.75rem 1.5rem",
            boxShadow: "0 18px 44px rgba(74,54,26,0.12)",
          }}
        >
          <Lock size={18} strokeWidth={1.5} style={{ color: "#8F6410" }} />

          <p
            style={{
              marginTop: "0.85rem",
              textAlign: "center",
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "0.95rem",
              fontStyle: "italic",
              lineHeight: 1.6,
              color: "#796D65",
            }}
          >
            Our story is sealed.
            <br />
            Enter the code to unroll it.
          </p>

          <label htmlFor="story-code" className="sr-only">
            Four-digit code to unroll the story
          </label>
          <input
            ref={inputRef}
            id="story-code"
            value={code}
            onChange={(e) => onChange(e.target.value)}
            // A numeric keypad on phones, without the spinner a number input
            // would bring, and no autofill offering a one-time code.
            inputMode="numeric"
            autoComplete="off"
            type="password"
            maxLength={STORY_PIN.length}
            aria-invalid={wrong}
            aria-describedby={wrong ? "story-code-error" : undefined}
            style={{
              marginTop: "1.1rem",
              width: "9rem",
              textAlign: "center",
              background: "#F8F4EF",
              border: `1px solid ${wrong ? "rgba(185,76,56,0.6)" : "rgba(143,100,16,0.3)"}`,
              borderRadius: "999px",
              padding: "0.7rem 1rem",
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "1.35rem",
              letterSpacing: "0.55em",
              textIndent: "0.55em",
              color: "#4A403A",
              outline: "none",
            }}
          />

          <p
            id="story-code-error"
            role="status"
            aria-live="polite"
            style={{
              marginTop: "0.7rem",
              minHeight: "1.1rem",
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "0.82rem",
              letterSpacing: "0.06em",
              color: wrong ? "#B94C38" : "transparent",
            }}
          >
            {wrong ? "That isn't the code — try again." : "\u00A0"}
          </p>

          <button onClick={onClose} className="story-film-close" style={{ marginTop: "0.5rem" }}>
            <X size={14} strokeWidth={1.5} />
            Never mind
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* The film unrolls where the scroll was: no portal, no fixed layer, no new
   container over the page. The section simply swaps one child for the other,
   so the reader never leaves the scroll position they tapped from. */
function UnrolledFilm({ onClose }: { onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(true);
  const { claimPlayback, releaseAudio } = useFilmPlayback(videoRef);

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
      className="story-film-panel"
      style={{ overflow: "hidden" }}
    >
      <div className="story-film-inner">
        <div className="story-film-bar">
          <button onClick={onClose} aria-label="Roll the scroll back up" className="story-film-close">
            <X size={14} strokeWidth={1.5} />
            Roll back up
          </button>
        </div>

        <div
          onClick={togglePlay}
          className="story-film-frame"
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "16 / 9",
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
            onPlay={() => {
              setPlaying(true);
              // Stops any highlights film still running, and silences the
              // site music for as long as this one plays.
              claimPlayback();
            }}
            onPause={() => {
              setPlaying(false);
              releaseAudio();
            }}
            onEnded={() => {
              setPlaying(false);
              releaseAudio();
            }}
            onError={() => {
              setPlaying(false);
              releaseAudio();
            }}
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
  // Read after mount, never during render: the server has no sessionStorage,
  // so reading it inline would be a hydration mismatch waiting to happen.
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    // Client-only read of sessionStorage; must run post-hydration so the
    // server and client first paint agree.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (readUnlocked()) setUnlocked(true);
  }, []);

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

      {/* `mode="wait"` lets each panel finish leaving before the next
          arrives, so the seal, the lock and the film never overlap. */}
      <AnimatePresence mode="wait" initial={false}>
        {!videoOpen ? (
          <RolledScroll key="scroll" onOpen={() => setVideoOpen(true)} />
        ) : unlocked ? (
          <UnrolledFilm key="film" onClose={() => setVideoOpen(false)} />
        ) : (
          <SealLock
            key="lock"
            onUnlock={() => setUnlocked(true)}
            onClose={() => setVideoOpen(false)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
