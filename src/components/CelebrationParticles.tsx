"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Particle {
  id: number; x: number; y: number; size: number;
  color: string; delay: number; duration: number; type: "ember" | "star" | "ring";
}

const COLORS = ["#F97316", "#FB923C", "#FBBF24", "#FED7AA", "#FFF7ED", "#FDBA74"];

export default function CelebrationParticles({ count = 18 }: { count?: number }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const types: Particle["type"][] = ["ember", "star", "ring"];
    setParticles(Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 3 + Math.random() * 10,
      color: COLORS[i % COLORS.length],
      delay: Math.random() * 8,
      duration: 5 + Math.random() * 7,
      type: types[i % 3],
    })));
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          animate={{ y: [0, -25, 8, -18, 0], x: [0, 12, -8, 16, 0], rotate: [0, 180, 360], opacity: [0, 0.7, 0.5, 0.7, 0], scale: [0, 1, 0.8, 1, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          {p.type === "ember" && (
            <div style={{ width: p.size, height: p.size, borderRadius: "50%",
              background: `radial-gradient(circle, ${p.color}, transparent)`,
              boxShadow: `0 0 ${p.size}px ${p.color}` }} />
          )}
          {p.type === "star" && (
            <svg width={p.size} height={p.size} viewBox="0 0 24 24">
              <path d="M12 2L14 9L21 9L15.5 13.5L17.5 20.5L12 16L6.5 20.5L8.5 13.5L3 9L10 9Z"
                fill={p.color} opacity="0.85" />
            </svg>
          )}
          {p.type === "ring" && (
            <div style={{ width: p.size, height: p.size, borderRadius: "50%",
              border: `1.5px solid ${p.color}`, opacity: 0.6 }} />
          )}
        </motion.div>
      ))}
    </div>
  );
}
