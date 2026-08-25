"use client";

import { useEffect, useRef } from "react";

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const tryPlay = () => {
      audio.play().catch(() => {
        // Autoplay blocked until the visitor interacts with the page.
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
      if (document.hidden) {
        audio.pause();
      } else {
        tryPlay();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("click", onFirstInteraction);
      window.removeEventListener("touchstart", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return <audio ref={audioRef} src="/music/wedding.mp3" loop preload="auto" />;
}
