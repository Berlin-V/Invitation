"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, FastForward, ExternalLink } from "lucide-react";
import { EASE } from "@/constants/motion";
import { HIGHLIGHTS, driveFileUrl } from "@/constants";
import { suspendBackgroundAudio } from "@/lib/background-audio";

type Highlight = (typeof HIGHLIGHTS)[number];

const SKIP_SECONDS = 10;

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function FilmPlayer({ film }: { film: Highlight }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const releaseAudio = useRef<(() => void) | null>(null);

  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  // The film holds the speakers only while it is actually playing, so pausing
  // hands the site music straight back.
  useEffect(() => {
    return () => {
      releaseAudio.current?.();
      releaseAudio.current = null;
    };
  }, []);

  const onPlay = useCallback(() => {
    setPlaying(true);
    releaseAudio.current ??= suspendBackgroundAudio();
  }, []);

  const onPause = useCallback(() => {
    setPlaying(false);
    releaseAudio.current?.();
    releaseAudio.current = null;
  }, []);

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
  };

  const seekTo = (value: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = value;
    setCurrent(value);
  };

  const progress = duration > 0 ? (current / duration) * 100 : 0;

  return (
    <div
      style={{
        borderRadius: "18px",
        overflow: "hidden",
        border: "1px solid rgba(240,188,63,0.22)",
        background: "rgba(8,6,4,0.6)",
        boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          // Matches the film exactly (720x404). The master was a 16:9 picture
          // padded into a square canvas; those baked-in black bars are cropped
          // out of the encode, so the frame must not re-introduce them.
          aspectRatio: "720 / 404",
          background: "#000",
        }}
      >
        <video
          ref={videoRef}
          src={film.src}
          poster={film.poster}
          playsInline
          preload="metadata"
          // Only the controls below exist: no native chrome, so no fullscreen,
          // no subtitle or quality menus, no picture-in-picture, no download.
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplayback"
          onPlay={onPlay}
          onPause={onPause}
          onEnded={onPause}
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
                "linear-gradient(180deg, rgba(10,8,5,0.15) 0%, rgba(10,8,5,0.5) 100%)",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: "68px",
                height: "68px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(240,188,63,0.18)",
                border: "1px solid rgba(240,188,63,0.6)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                color: "#F9DE93",
                boxShadow: "0 8px 30px rgba(0,0,0,0.45)",
              }}
            >
              {/* Nudged right so the triangle's visual centre sits on the circle's. */}
              <Play size={24} strokeWidth={1.25} fill="currentColor" style={{ marginLeft: "3px" }} />
            </span>
          </button>
        )}
      </div>

      {/* Control bar — play/pause, scrub, and a jump either way. That's the lot. */}
      <div
        className="flex items-center"
        style={{
          gap: "0.7rem",
          padding: "0.75rem 0.9rem",
          background: "rgba(10,8,5,0.85)",
          borderTop: "1px solid rgba(240,188,63,0.14)",
        }}
      >
        <button
          onClick={started ? toggle : start}
          aria-label={playing ? "Pause" : "Play"}
          style={{
            flexShrink: 0,
            width: "34px",
            height: "34px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(240,188,63,0.14)",
            border: "1px solid rgba(240,188,63,0.45)",
            color: "#F9DE93",
            cursor: "pointer",
            padding: 0,
          }}
        >
          {playing
            ? <Pause size={15} strokeWidth={1.5} fill="currentColor" />
            : <Play size={15} strokeWidth={1.5} fill="currentColor" style={{ marginLeft: "2px" }} />}
        </button>

        <button
          onClick={() => skip(-SKIP_SECONDS)}
          aria-label={`Back ${SKIP_SECONDS} seconds`}
          className="film-ctl"
        >
          <RotateCcw size={15} strokeWidth={1.5} />
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
          <FastForward size={15} strokeWidth={1.5} />
        </button>

        <span
          style={{
            flexShrink: 0,
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "0.7rem",
            letterSpacing: "0.06em",
            color: "rgba(255,253,249,0.6)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {formatTime(current)} / {formatTime(duration)}
        </span>
      </div>
    </div>
  );
}

function FilmCard({ film }: { film: Highlight }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: EASE }}
    >
      <FilmPlayer film={film} />

      <div className="flex items-end justify-between" style={{ gap: "1.25rem", marginTop: "1.1rem" }}>
        <div>
          <h3
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "1.05rem",
              letterSpacing: "0.06em",
              color: "#F9DE93",
            }}
          >
            {film.title}
          </h3>
          <p
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "0.88rem",
              lineHeight: 1.6,
              color: "rgba(255,253,249,0.6)",
              marginTop: "0.35rem",
            }}
          >
            {film.caption}
          </p>
        </div>

        <a
          href={driveFileUrl(film.driveFileId)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center"
          style={{
            gap: "0.45rem",
            flexShrink: 0,
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "0.62rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(255,253,249,0.5)",
            textDecoration: "none",
            whiteSpace: "nowrap",
            paddingBottom: "0.2rem",
          }}
        >
          Drive <ExternalLink size={12} strokeWidth={1.5} />
        </a>
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
        padding: "clamp(4rem, 10vw, 8rem) clamp(1.25rem, 5vw, 3rem)",
      }}
    >
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
        className="grid gap-10 sm:grid-cols-2"
        style={{
          maxWidth: HIGHLIGHTS.length === 1 ? "640px" : "1000px",
          margin: "0 auto",
          gridTemplateColumns: HIGHLIGHTS.length === 1 ? "1fr" : undefined,
        }}
      >
        {HIGHLIGHTS.map((film) => (
          <FilmCard key={film.id} film={film} />
        ))}
      </div>
    </section>
  );
}
