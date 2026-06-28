"use client";

import { useEffect, useRef } from "react";

const COLORS = [
  "#C9A56D", "#E8D5B0", "#FAC2BC", "#F58893",
  "#EE7863", "#FFFDF9", "#F2772F", "#C9A56D",
];

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  color: string;
  life: number;
  decay: number;
  size: number;
  rotation: number;
  rotV: number;
  circle: boolean;
}

// Shared mutable state — lives outside React so it's never re-created
let particles: Particle[] = [];
let rafId = 0;

function addBurst(cx: number, cy: number) {
  const count = 22;
  for (let i = 0; i < count; i++) {
    particles.push({
      x: cx, y: cy,
      vx: (Math.random() - 0.5) * 10,
      vy: -(Math.random() * 7 + 3),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      life: 1,
      decay: 0.018 + Math.random() * 0.012,
      size: Math.random() * 5 + 2,
      rotation: Math.random() * 360,
      rotV: (Math.random() - 0.5) * 14,
      circle: Math.random() > 0.6,
    });
  }
}

function startLoop(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  cancelAnimationFrame(rafId);

  function loop() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    ctx!.clearRect(0, 0, w, h);

    particles = particles.filter((p) => p.life > 0);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.32;
      p.vx *= 0.99;
      p.life -= p.decay;
      p.rotation += p.rotV;

      if (p.life <= 0) continue;
      ctx!.save();
      ctx!.globalAlpha = Math.max(0, p.life);
      ctx!.translate(p.x, p.y);
      ctx!.rotate((p.rotation * Math.PI) / 180);
      ctx!.fillStyle = p.color;
      if (p.circle) {
        ctx!.beginPath();
        ctx!.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx!.fill();
      } else {
        ctx!.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5);
      }
      ctx!.restore();
    }

    if (particles.length > 0) rafId = requestAnimationFrame(loop);
  }

  rafId = requestAnimationFrame(loop);
}

export default function GlobalConfetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const DPR = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * DPR;
      canvas.height = window.innerHeight * DPR;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(DPR, DPR);
    };
    resize();
    window.addEventListener("resize", resize);

    const onClick = (e: MouseEvent) => {
      addBurst(e.clientX, e.clientY);
      startLoop(canvas);
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 99999,
      }}
    />
  );
}
