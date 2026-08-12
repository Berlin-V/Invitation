"use client";

import { useEffect, useRef } from "react";

const COLORS = ["#C9A56D", "#E8D5B0", "#FAC2BC", "#F58893", "#EE7863", "#FFFDF9", "#F2772F"];

interface TrailPoint { x: number; y: number; life: number; }
interface Sparkle { x: number; y: number; life: number; size: number; rot: number; color: string; }
interface Spark { x: number; y: number; vx: number; vy: number; life: number; color: string; }

// Shared mutable state — lives outside React so it's never re-created
let trail: TrailPoint[] = [];
let sparkles: Sparkle[] = [];
let sparks: Spark[] = [];
let rafId = 0;
let lastSparkleAt = 0;
let lastCrackerAt = 0;

function drawSparkle(ctx: CanvasRenderingContext2D, s: Sparkle) {
  ctx.save();
  ctx.globalAlpha = Math.max(0, s.life);
  ctx.translate(s.x, s.y);
  ctx.rotate(s.rot);
  ctx.fillStyle = s.color;
  ctx.beginPath();
  ctx.moveTo(0, -s.size);
  ctx.quadraticCurveTo(s.size * 0.15, -s.size * 0.15, s.size, 0);
  ctx.quadraticCurveTo(s.size * 0.15, s.size * 0.15, 0, s.size);
  ctx.quadraticCurveTo(-s.size * 0.15, s.size * 0.15, -s.size, 0);
  ctx.quadraticCurveTo(-s.size * 0.15, -s.size * 0.15, 0, -s.size);
  ctx.fill();
  ctx.restore();
}

function addCracker(cx: number, cy: number) {
  const count = 7;
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
    const speed = Math.random() * 3 + 2;
    sparks.push({
      x: cx, y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    });
  }
}

function startLoop(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  cancelAnimationFrame(rafId);

  function loop() {
    ctx!.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // Ribbon trail — tapering, fading stroke through recent points
    trail = trail.filter((p) => p.life > 0);
    if (trail.length > 1) {
      for (let i = 1; i < trail.length; i++) {
        const a = trail[i - 1];
        const b = trail[i];
        ctx!.strokeStyle = `rgba(201,165,109,${Math.max(0, b.life) * 0.5})`;
        ctx!.lineWidth = Math.max(0.5, b.life * 4);
        ctx!.lineCap = "round";
        ctx!.beginPath();
        ctx!.moveTo(a.x, a.y);
        ctx!.lineTo(b.x, b.y);
        ctx!.stroke();
      }
    }
    for (const p of trail) p.life -= 0.045;

    // Mini twinkling stars
    sparkles = sparkles.filter((s) => s.life > 0);
    for (const s of sparkles) {
      s.life -= 0.02;
      s.y -= 0.3;
      drawSparkle(ctx!, s);
    }

    // Cracker sparks — quick radial pop, no gravity
    sparks = sparks.filter((s) => s.life > 0);
    for (const s of sparks) {
      s.x += s.vx;
      s.y += s.vy;
      s.vx *= 0.94;
      s.vy *= 0.94;
      s.life -= 0.06;
      ctx!.save();
      ctx!.globalAlpha = Math.max(0, s.life);
      ctx!.strokeStyle = s.color;
      ctx!.lineWidth = 1.5;
      ctx!.lineCap = "round";
      ctx!.beginPath();
      ctx!.moveTo(s.x, s.y);
      ctx!.lineTo(s.x - s.vx * 1.6, s.y - s.vy * 1.6);
      ctx!.stroke();
      ctx!.restore();
    }

    if (trail.length > 0 || sparkles.length > 0 || sparks.length > 0) {
      rafId = requestAnimationFrame(loop);
    }
  }

  rafId = requestAnimationFrame(loop);
}

export default function CursorRibbon() {
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

    const onMove = (e: MouseEvent) => {
      trail.push({ x: e.clientX, y: e.clientY, life: 1 });
      if (trail.length > 16) trail.shift();

      const now = performance.now();
      if (now - lastSparkleAt > 90) {
        lastSparkleAt = now;
        sparkles.push({
          x: e.clientX + (Math.random() - 0.5) * 12,
          y: e.clientY + (Math.random() - 0.5) * 12,
          life: 1,
          size: Math.random() * 4 + 3,
          rot: Math.random() * Math.PI,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        });
      }
      if (now - lastCrackerAt > 450) {
        lastCrackerAt = now;
        addCracker(e.clientX, e.clientY);
      }

      startLoop(canvas);
    };
    document.addEventListener("mousemove", onMove);

    return () => {
      document.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafId);
      trail = []; sparkles = []; sparks = [];
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
        zIndex: 99998,
      }}
    />
  );
}
