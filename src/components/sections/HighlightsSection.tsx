"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, ExternalLink, X } from "lucide-react";
import { EASE } from "@/constants/motion";
import {
  HIGHLIGHTS,
  driveFileUrl,
  drivePreviewUrl,
  driveThumbUrl,
} from "@/constants";
import { suspendBackgroundAudio } from "@/lib/background-audio";

type Highlight = (typeof HIGHLIGHTS)[number];

function FilmCard({ film }: { film: Highlight }) {
  const [playing, setPlaying] = useState(false);
  const [thumbFailed, setThumbFailed] = useState(false);

  // The film takes over the speakers while it's on screen, and hands them back
  // when it's closed or the visitor navigates away mid-play.
  useEffect(() => {
    if (!playing) return;
    return suspendBackgroundAudio();
  }, [playing]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: EASE }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16 / 9",
          borderRadius: "16px",
          overflow: "hidden",
          border: "1px solid rgba(240,188,63,0.22)",
          background: playing
            ? "#000"
            : "linear-gradient(135deg, #1C150E 0%, #0E0A06 100%)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
        }}
      >
        {playing ? (
          <>
            {/* Drive's own player, which carries the scrub bar, volume,
                playback speed and fullscreen — a cross-origin frame gives us
                no way to drive those ourselves. */}
            <iframe
              src={drivePreviewUrl(film.driveFileId)}
              title={film.title}
              allow="autoplay; fullscreen"
              allowFullScreen
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
            />
            {/* Without this the film can only be ended by reloading, and the
                site music would never be handed back. Sits clear of Drive's
                own top-right "open in new window" control. */}
            <button
              onClick={() => setPlaying(false)}
              aria-label={`Stop ${film.title}`}
              style={{
                position: "absolute",
                top: "0.5rem",
                left: "0.5rem",
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(10,8,5,0.6)",
                border: "1px solid rgba(240,188,63,0.4)",
                color: "#F9DE93",
                cursor: "pointer",
                padding: 0,
                zIndex: 2,
              }}
            >
              <X size={14} strokeWidth={1.5} />
            </button>
          </>
        ) : (
          <button
            onClick={() => setPlaying(true)}
            aria-label={`Play ${film.title}`}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
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

            <span
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
              style={{
                position: "absolute",
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
          </button>
        )}
      </div>

      <div
        className="flex items-end justify-between"
        style={{ gap: "1.25rem", marginTop: "1.1rem" }}
      >
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

        {/* Drive refuses to frame a file that isn't shared publicly, and the
            iframe gives the page no error to detect — so the direct link sits
            in the widget permanently rather than behind an error state. */}
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
            color: "rgba(255,253,249,0.55)",
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
          // One film shouldn't stretch the full width of a desktop grid.
          maxWidth: HIGHLIGHTS.length === 1 ? "720px" : "1000px",
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
