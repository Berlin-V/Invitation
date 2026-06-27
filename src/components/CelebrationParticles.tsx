"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
  type: "petal" | "star" | "ring";
}

const COLORS = ["#C9A84C", "#D4547A", "#8B1A4A", "#E8D5A3", "#F5C6D0", "#FFF8F0"];

export default function CelebrationParticles({ count = 18 }: { count?: number }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const types: Particle["type"][] = ["petal", "star", "ring"];
    setParticles(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 4 + Math.random() * 12,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        delay: Math.random() * 8,
        duration: 6 + Math.random() * 8,
        type: types[i % 3],
      }))
    );
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          animate={{
            y: [0, -30, 10, -20, 0],
            x: [0, 15, -10, 20, 0],
            rotate: [0, 180, 360],
            opacity: [0, 0.7, 0.5, 0.7, 0],
            scale: [0, 1, 0.8, 1, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {p.type === "petal" && (
            <div
              style={{
                width: p.size,
                height: p.size * 0.65,
                backgroundColor: p.color,
                borderRadius: "50% 0 50% 0",
                transform: "rotate(45deg)",
              }}
            />
          )}
          {p.type === "star" && (
            <svg width={p.size} height={p.size} viewBox="0 0 24 24">
              <path
                d="M12 2 L14 9 L21 9 L15.5 13.5 L17.5 20.5 L12 16 L6.5 20.5 L8.5 13.5 L3 9 L10 9 Z"
                fill={p.color}
                opacity="0.8"
              />
            </svg>
          )}
          {p.type === "ring" && (
            <div
              style={{
                width: p.size,
                height: p.size,
                borderRadius: "50%",
                border: `2px solid ${p.color}`,
                opacity: 0.6,
              }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}
