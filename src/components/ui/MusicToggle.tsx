"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

interface MusicToggleProps {
  scrolled: boolean;
}

export default function MusicToggle({ scrolled }: MusicToggleProps) {
  const [playing, setPlaying] = useState(false);
  const [available, setAvailable] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio("/audio/background.mp3");
    audio.loop = true;
    audio.volume = 0.35;

    audio.addEventListener("canplaythrough", () => setAvailable(true), { once: true });
    audio.addEventListener("error", () => setAvailable(false), { once: true });

    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  // Don't render if no audio file is available
  if (!available) return null;

  const iconColor = scrolled ? "#8A7C73" : "rgba(255,253,249,0.65)";

  return (
    <motion.button
      onClick={toggle}
      whileTap={{ scale: 0.92 }}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        color: iconColor,
        transition: "color 0.3s ease",
      }}
      aria-label={playing ? "Mute music" : "Play music"}
    >
      {playing ? (
        <Volume2 size={16} strokeWidth={1.5} />
      ) : (
        <VolumeX size={16} strokeWidth={1.5} />
      )}

      {/* Animated bars when playing */}
      {playing && (
        <div className="flex items-end gap-[2px]" style={{ height: "12px" }}>
          {[1, 2, 3].map((i) => (
            <motion.span
              key={i}
              style={{
                display: "block",
                width: "2px",
                background: "#C9A56D",
                borderRadius: "1px",
              }}
              animate={{ height: ["4px", "10px", "4px"] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}
    </motion.button>
  );
}
