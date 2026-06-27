"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX, Music } from "lucide-react";

// Place your background music file in /public/music/background.mp3
// or update the MUSIC_URL below to a hosted URL.
const MUSIC_URL = "/music/background.mp3";

export default function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(MUSIC_URL);
    audio.loop = true;
    audio.volume = 0.35;
    audio.addEventListener("canplaythrough", () => setLoaded(true));
    audio.addEventListener("error", () => setLoaded(false));
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  const toggle = () => {
    if (!audioRef.current || !loaded) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setPlaying(!playing);
  };

  return (
    <motion.button
      onClick={toggle}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300"
      style={{
        background: "rgba(255,253,249,0.9)",
        border: "1px solid rgba(201,165,109,0.35)",
        backdropFilter: "blur(12px)",
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2 }}
      title={loaded ? (playing ? "Mute music" : "Play music") : "No audio file found"}
    >
      {!loaded ? (
        <Music size={16} color="#C9A56D" strokeWidth={1.5} />
      ) : playing ? (
        <Volume2 size={16} color="#C9A56D" strokeWidth={1.5} />
      ) : (
        <VolumeX size={16} color="#8A7C73" strokeWidth={1.5} />
      )}

      {/* Animated ring when playing */}
      {playing && (
        <motion.span
          className="absolute inset-0 rounded-full"
          style={{ border: "1px solid #C9A56D" }}
          animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
}
