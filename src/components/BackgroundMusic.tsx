"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const tryPlay = () => {
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

    return () => {
      window.removeEventListener("click", onFirstInteraction);
      window.removeEventListener("touchstart", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    // Called directly from a click handler, so this always satisfies the
    // browser's autoplay gesture requirement even if earlier attempts failed.
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  };

  return (
    <>
      <audio ref={audioRef} src="/music/wedding.mp3" loop preload="auto" playsInline />
      <motion.button
        onClick={toggle}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        aria-label={playing ? "Mute background music" : "Play background music"}
        aria-pressed={playing}
        style={{
          position: "fixed",
          top: "calc(env(safe-area-inset-top, 0px) + 0.85rem)",
          right: "calc(env(safe-area-inset-right, 0px) + 0.85rem)",
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
          color: "#E8D5B0",
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
