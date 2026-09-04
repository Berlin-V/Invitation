"use client";

import { useEffect, useRef } from "react";
import { fitCanvasToViewport } from "@/lib/canvas";

interface Star {
  x: number;
  y: number;
  size: number;
  phase: number;
  speed: number;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

export default function ShootingStars() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let stars: Star[] = [];
    let shooting: ShootingStar[] = [];
    let rafId = 0;
    let spawnTimer: ReturnType<typeof setTimeout>;

    const resize = () => {
      fitCanvasToViewport(canvas);

      const count = Math.round((window.innerWidth * window.innerHeight) / 16000);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 1.4 + 0.5,
        phase: Math.random() * Math.PI * 2,
        speed: 0.6 + Math.random() * 0.8,
      }));
    };
    resize();
    window.addEventListener("resize", resize);

    const spawnShootingStar = () => {
      const fromLeft = Math.random() > 0.5;
      const startX = fromLeft ? -20 : window.innerWidth + 20;
      const startY = Math.random() * window.innerHeight * 0.5;
      const speed = 6 + Math.random() * 4;
      shooting.push({
        x: startX,
        y: startY,
        vx: fromLeft ? speed : -speed,
        vy: speed * 0.55,
        life: 1,
      });
      spawnTimer = setTimeout(spawnShootingStar, 4500 + Math.random() * 6000);
    };
    spawnTimer = setTimeout(spawnShootingStar, 2500);

    let t = 0;
    function draw() {
      t += 0.02;
      ctx!.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (const s of stars) {
        const twinkle = 0.35 + Math.sin(t * s.speed + s.phase) * 0.35;
        ctx!.globalAlpha = Math.max(0, twinkle);
        ctx!.fillStyle = "#D9B441";
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx!.fill();
      }

      shooting = shooting.filter((s) => s.life > 0);
      for (const s of shooting) {
        const tailX = s.x - s.vx * 5;
        const tailY = s.y - s.vy * 5;
        const gradient = ctx!.createLinearGradient(s.x, s.y, tailX, tailY);
        gradient.addColorStop(0, `rgba(242,220,160,${s.life})`);
        gradient.addColorStop(1, "rgba(217,180,65,0)");
        ctx!.strokeStyle = gradient;
        ctx!.lineWidth = 1.6;
        ctx!.lineCap = "round";
        ctx!.beginPath();
        ctx!.moveTo(s.x, s.y);
        ctx!.lineTo(tailX, tailY);
        ctx!.stroke();

        s.x += s.vx;
        s.y += s.vy;
        s.life -= 0.012;
      }

      ctx!.globalAlpha = 1;
      rafId = requestAnimationFrame(draw);
    }
    rafId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      clearTimeout(spawnTimer);
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
        zIndex: 30,
      }}
    />
  );
}
