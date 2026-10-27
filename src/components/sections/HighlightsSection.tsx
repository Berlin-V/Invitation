"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, FastForward } from "lucide-react";
import { EASE } from "@/constants/motion";
import { HIGHLIGHTS } from "@/constants";
import { suspendBackgroundAudio } from "@/lib/background-audio";

type Highlight = (typeof HIGHLIGHTS)[number];

const SKIP_SECONDS = 10;
// How long the chrome lingers after the last interaction while a film plays.
const CHROME_LINGER_MS = 2600;

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function FilmCard({ film }: { film: Highlight }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const releaseAudio = useRef<(() => void) | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [chromeShown, setChromeShown] = useState(true);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    return () => {
      releaseAudio.current?.();
      releaseAudio.current = null;
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  /** Show the chrome, and while a film is running schedule it back out. */
  const revealChrome = useCallback((autoHide: boolean) => {
    setChromeShown(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    if (autoHide) {
      hideTimer.current = setTimeout(() => setChromeShown(false), CHROME_LINGER_MS);
    }
  }, []);

  const onPlay = useCallback(() => {
    // One film at a time: starting this one stops any other that's running,
    // so a grid of them can never play over each other.
    document.querySelectorAll<HTMLVideoElement>("#highlights video").forEach((other) => {
      if (other !== videoRef.current && !other.paused) other.pause();
    });
    setPlaying(true);
    releaseAudio.current ??= suspendBackgroundAudio();
    revealChrome(true);
  }, [revealChrome]);

  const onPause = useCallback(() => {
    setPlaying(false);
    releaseAudio.current?.();
    releaseAudio.current = null;
    // Paused is a resting state — the controls stay up rather than vanishing.
    revealChrome(false);
  }, [revealChrome]);

  const start = () => {
    setStarted(true);
    // The click itself is the gesture, so this satisfies autoplay policy.
    videoRef.current?.play().catch(() => {});
  };

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  const skip = (delta: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.min(Math.max(0, v.currentTime + delta), v.duration || 0);
    revealChrome(playing);
  };

  const seekTo = (value: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = value;
    setCurrent(value);
    revealChrome(playing);
  };

  const progress = duration > 0 ? (current / duration) * 100 : 0;
  // Before the film starts the poster carries the big play button, so the bar
  // would only be clutter on top of it.
  const chromeVisible = started && chromeShown;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: EASE }}
      /* A 4:3 film spanning the whole section ran ~950px tall; capped here it
         stays a comfortable card with nothing cropped. With several films the
         grid cell is already narrower, so this only bites on its own. */
      style={{ width: "min(100%, 920px)", margin: "0 auto" }}
    >
      <div
        onPointerMove={() => revealChrome(playing)}
        onPointerLeave={() => playing && setChromeShown(false)}
        onFocusCapture={() => revealChrome(false)}
        style={{
          position: "relative",
          width: "100%",
          // Matches the encode exactly, so the frame never letterboxes it.
          aspectRatio: film.aspect,
          borderRadius: "18px",
          overflow: "hidden",
          background: "#000",
          boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
        }}
      >
        <video
          ref={videoRef}
          src={film.src}
          poster={film.poster}
          playsInline
          preload="metadata"
          // Only the overlay controls exist: no native chrome, so no
          // fullscreen, no subtitle or quality menus, no picture-in-picture.
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplayback"
          onPlay={onPlay}
          onPause={onPause}
          onEnded={onPause}
          // Without this a failed or stalled load would hold the claim on the
          // speakers forever, leaving the site silent with nothing playing.
          onError={onPause}
          onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onClick={started ? toggle : undefined}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            cursor: started ? "pointer" : "default",
          }}
        />

        {/* Title over the film rather than beneath it, on a scrim so it stays
            legible against whatever frame is behind it. */}
        <div
          aria-hidden={started && !chromeVisible}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            padding: "1.1rem 1.25rem 2.25rem",
            background: "linear-gradient(180deg, rgba(8,6,4,0.78) 0%, rgba(8,6,4,0) 100%)",
            pointerEvents: "none",
            opacity: started && !chromeVisible ? 0 : 1,
            transition: "opacity 0.35s ease",
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "clamp(1.05rem, 2.4vw, 1.4rem)",
              letterSpacing: "0.05em",
              color: "#F9DE93",
              textShadow: "0 1px 12px rgba(0,0,0,0.6)",
            }}
          >
            {film.title}
          </h3>
          <p
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "0.9rem",
              lineHeight: 1.5,
              color: "rgba(255,253,249,0.78)",
              textShadow: "0 1px 10px rgba(0,0,0,0.6)",
              marginTop: "0.2rem",
            }}
          >
            {film.caption}
          </p>
        </div>

        {!started && (
          <button
            onClick={start}
            aria-label={`Play ${film.title}`}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                "linear-gradient(180deg, rgba(10,8,5,0.1) 0%, rgba(10,8,5,0.45) 100%)",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(240,188,63,0.2)",
                border: "1px solid rgba(240,188,63,0.65)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                color: "#F9DE93",
                boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
              }}
            >
              {/* Nudged right so the triangle's visual centre sits on the circle's. */}
              <Play size={26} strokeWidth={1.25} fill="currentColor" style={{ marginLeft: "3px" }} />
            </span>
          </button>
        )}

        {/* Control bar, floating on the film itself. Play/pause, a jump either
            way, scrub and elapsed time — that's the lot. */}
        <div
          className="flex items-center"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            gap: "0.7rem",
            padding: "2.5rem 1rem 0.9rem",
            background: "linear-gradient(0deg, rgba(8,6,4,0.85) 0%, rgba(8,6,4,0) 100%)",
            opacity: chromeVisible ? 1 : 0,
            // Hidden chrome must not keep catching taps meant for the film.
            pointerEvents: chromeVisible ? "auto" : "none",
            transition: "opacity 0.35s ease",
          }}
        >
          <button
            onClick={toggle}
            aria-label={playing ? "Pause" : "Play"}
            style={{
              flexShrink: 0,
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(240,188,63,0.18)",
              border: "1px solid rgba(240,188,63,0.5)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              color: "#F9DE93",
              cursor: "pointer",
              padding: 0,
            }}
          >
            {playing
              ? <Pause size={16} strokeWidth={1.5} fill="currentColor" />
              : <Play size={16} strokeWidth={1.5} fill="currentColor" style={{ marginLeft: "2px" }} />}
          </button>

          <button
            onClick={() => skip(-SKIP_SECONDS)}
            aria-label={`Back ${SKIP_SECONDS} seconds`}
            className="film-ctl"
          >
            <RotateCcw size={16} strokeWidth={1.5} />
          </button>

          <input
            type="range"
            className="film-seek"
            min={0}
            max={duration || 0}
            step={0.1}
            value={current}
            onChange={(e) => seekTo(Number(e.target.value))}
            aria-label="Seek"
            style={{ ["--played" as string]: `${progress}%` }}
          />

          <button
            onClick={() => skip(SKIP_SECONDS)}
            aria-label={`Forward ${SKIP_SECONDS} seconds`}
            className="film-ctl"
          >
            <FastForward size={16} strokeWidth={1.5} />
          </button>

          <span
            style={{
              flexShrink: 0,
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "0.85rem",
              letterSpacing: "0.06em",
              color: "rgba(255,253,249,0.85)",
              fontVariantNumeric: "tabular-nums",
              textShadow: "0 1px 8px rgba(0,0,0,0.6)",
            }}
          >
            {formatTime(current)} / {formatTime(duration)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function HighlightsSection() {
  return (
    <section
      id="highlights"
      style={{
        // Steps down from the cream gallery above into the near-black wishes
        // section below, so neither boundary reads as a hard seam.
        background: "linear-gradient(180deg, #16100A 0%, #0A0705 100%)",
        padding: "clamp(2.5rem, 6vw, 4.5rem) clamp(0.75rem, 2.5vw, 2rem)",
      }}
    >
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.9, ease: EASE }}
        style={{ marginBottom: "clamp(1.5rem, 4vw, 2.5rem)" }}
      >
        <p
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "0.78rem",
            letterSpacing: "0.46em",
            color: "rgba(240,188,63,0.8)",
            textTransform: "uppercase",
            marginBottom: "1rem",
          }}
        >
          Relive the day
        </p>
        <h2
          style={{
            fontFamily: "var(--font-allura), cursive",
            fontSize: "clamp(2.5rem, 7vw, 4.5rem)",
            color: "#FFFDF9",
            lineHeight: 1.1,
            marginBottom: "1.25rem",
          }}
        >
          Highlights
        </h2>
        <div
          style={{
            maxWidth: "100px",
            height: "1px",
            margin: "0 auto",
            background: "linear-gradient(90deg, transparent, rgba(240,188,63,0.7), transparent)",
          }}
        />
      </motion.div>

      <div
        style={{
          display: "grid",
          gap: "clamp(1.75rem, 4vw, 2.75rem)",
          /* auto-fit means the row count follows the number of films on its
             own: one fills the width, two sit side by side, three go across,
             and more wrap — no breakpoint or count check to maintain as they
             are added. The min() keeps a single column on phones, where
             330px would otherwise overflow the viewport. */
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 330px), 1fr))",
          maxWidth: "1280px",
          margin: "0 auto",
          alignItems: "start",
        }}
      >
        {HIGHLIGHTS.map((film) => (
          <FilmCard key={film.id} film={film} />
        ))}
      </div>
    </section>
  );
}
