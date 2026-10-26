"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { MEDIA } from "@/constants";
import {
  isBackgroundAudioSuspended,
  onBackgroundAudioSuspendedChange,
} from "@/lib/background-audio";

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  // Whether the music was audible when something else claimed the speakers,
  // so a visitor who had deliberately muted it doesn't get it back afterwards.
  const resumeAfterSuspend = useRef(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const tryPlay = () => {
      // A highlights film is playing — the site music stays out of its way.
      if (isBackgroundAudioSuspended()) return;
      audio.play().catch(() => {
        // Autoplay blocked until the visitor interacts with the page —
        // the toggle button below always works since it's a direct click.
      });
    };
    tryPlay();

    const onFirstInteraction = () => {
      tryPlay();
      window.removeEventListener("click", onFirstInteraction);
      window.removeEventListener("touchstart", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
    };
    window.addEventListener("click", onFirstInteraction);
    window.addEventListener("touchstart", onFirstInteraction);
    window.addEventListener("keydown", onFirstInteraction);

    const onVisibilityChange = () => {
      if (document.hidden) audio.pause();
      else tryPlay();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    // Keep the button's icon in sync with what the audio element is actually
    // doing, rather than tracking play/pause with separate local state.
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    const unsubscribe = onBackgroundAudioSuspendedChange((isSuspended) => {
      if (isSuspended) {
        resumeAfterSuspend.current = !audio.paused;
        audio.pause();
      } else if (resumeAfterSuspend.current) {
        resumeAfterSuspend.current = false;
        tryPlay();
      }
    });

    return () => {
      window.removeEventListener("click", onFirstInteraction);
      window.removeEventListener("touchstart", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      unsubscribe();
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    // A film has the speakers. Starting the music here would play it over the
    // film, so the toggle instead records whether the visitor wants it back
    // once the film ends — otherwise an explicit mute mid-film would be undone.
    if (isBackgroundAudioSuspended()) {
      resumeAfterSuspend.current = !resumeAfterSuspend.current;
      return;
    }

    // Called directly from a click handler, so this always satisfies the
    // browser's autoplay gesture requirement even if earlier attempts failed.
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  };

  return (
    <>
      <audio ref={audioRef} src={MEDIA.music} loop preload="auto" playsInline />
      <motion.button
        onClick={toggle}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        aria-label={playing ? "Mute background music" : "Play background music"}
        aria-pressed={playing}
        style={{
          position: "fixed",
          top: "calc(env(safe-area-inset-top, 0px) + 0.85rem)",
          // The mobile nav pill now owns the top-right corner, so the toggle
          // steps aside for it; on desktop the pill is centred and the corner
          // is free again. See --music-right-offset in globals.css.
          right: "calc(env(safe-area-inset-right, 0px) + var(--music-right-offset))",
          zIndex: 60,
          width: "2.5rem",
          height: "2.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "999px",
          background: "rgba(20,16,12,0.45)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          border: "1px solid rgba(255,253,249,0.15)",
          color: "#F9DE93",
          cursor: "pointer",
        }}
      >
        {playing ? (
          <Volume2 size={16} strokeWidth={1.5} />
        ) : (
          <VolumeX size={16} strokeWidth={1.5} />
        )}
      </motion.button>
    </>
  );
}
