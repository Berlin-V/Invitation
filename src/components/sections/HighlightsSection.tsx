"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, ExternalLink } from "lucide-react";
import { EASE } from "@/constants/motion";
import {
  HIGHLIGHTS,
  driveFileUrl,
  drivePreviewUrl,
  driveThumbUrl,
} from "@/constants";

type Highlight = (typeof HIGHLIGHTS)[number];

interface PlayerProps {
  film: Highlight;
  onClose: () => void;
}

function Player({ film, onClose }: PlayerProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: "rgba(10,8,5,0.95)", backdropFilter: "blur(12px)", padding: "1.25rem" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute"
        style={{
          top: "1.5rem",
          right: "1.5rem",
          background: "rgba(255,253,249,0.08)",
          border: "1px solid rgba(240,188,63,0.2)",
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
        aria-label="Close player"
      >
        <X size={16} strokeWidth={1.5} />
      </button>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.3, ease: EASE }}
        style={{ width: "min(94vw, 960px)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "16 / 9",
            borderRadius: "14px",
            overflow: "hidden",
            background: "#000",
            boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
          }}
        >
          <iframe
            src={drivePreviewUrl(film.driveFileId)}
            title={film.title}
            allow="autoplay; fullscreen"
            allowFullScreen
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
          />
        </div>

        {/* Drive refuses to frame a file that isn't shared publicly, and the
            iframe gives us no way to detect that — so the direct link is
            always on offer rather than hidden behind an error state. */}
        <div className="flex items-center justify-between" style={{ marginTop: "0.9rem", gap: "1rem" }}>
          <p
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "0.7rem",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "rgba(240,188,63,0.75)",
            }}
          >
            {film.title}
          </p>
          <a
            href={driveFileUrl(film.driveFileId)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center"
            style={{
              gap: "0.45rem",
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "0.66rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(255,253,249,0.6)",
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            Open in Drive <ExternalLink size={12} strokeWidth={1.5} />
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

function FilmCard({ film, onPlay }: { film: Highlight; onPlay: () => void }) {
  const [thumbFailed, setThumbFailed] = useState(false);

  return (
    <motion.button
      onClick={onPlay}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: EASE }}
      className="group"
      style={{
        display: "block",
        width: "100%",
        textAlign: "left",
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
      }}
      aria-label={`Play ${film.title}`}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16 / 9",
          borderRadius: "16px",
          overflow: "hidden",
          border: "1px solid rgba(240,188,63,0.22)",
          background: "linear-gradient(135deg, #1C150E 0%, #0E0A06 100%)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
        }}
      >
        {!thumbFailed && (
          /* Drive's thumbnail endpoint, not next/image: it needs no
             remotePatterns entry and degrades to the gradient on failure. */
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={driveThumbUrl(film.driveFileId)}
            alt=""
            aria-hidden="true"
            loading="lazy"
            onError={() => setThumbFailed(true)}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.55,
            }}
          />
        )}

        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(10,8,5,0.1) 0%, rgba(10,8,5,0.55) 60%, rgba(10,8,5,0.9) 100%)",
          }}
        />

        <span
          aria-hidden="true"
          className="absolute"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "62px",
            height: "62px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(240,188,63,0.16)",
            border: "1px solid rgba(240,188,63,0.55)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            color: "#F9DE93",
          }}
        >
          {/* Nudged right so the triangle's visual centre sits on the circle's. */}
          <Play size={22} strokeWidth={1.25} fill="currentColor" style={{ marginLeft: "3px" }} />
        </span>
      </div>

      <h3
        style={{
          fontFamily: "var(--font-cormorant), Georgia, serif",
          fontSize: "1.05rem",
          letterSpacing: "0.06em",
          color: "#F9DE93",
          marginTop: "1.1rem",
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
    </motion.button>
  );
}

export default function HighlightsSection() {
  const [playing, setPlaying] = useState<Highlight | null>(null);
  const close = useCallback(() => setPlaying(null), []);

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
          // One film shouldn't stretch the full width of a desktop grid.
          maxWidth: HIGHLIGHTS.length === 1 ? "640px" : "1000px",
          margin: "0 auto",
          gridTemplateColumns: HIGHLIGHTS.length === 1 ? "1fr" : undefined,
        }}
      >
        {HIGHLIGHTS.map((film) => (
          <FilmCard key={film.id} film={film} onPlay={() => setPlaying(film)} />
        ))}
      </div>

      <AnimatePresence>
        {playing && <Player film={playing} onClose={close} />}
      </AnimatePresence>
    </section>
  );
}
