"use client";

import { useEffect, useRef } from "react";
import { CELEBRATION_COLORS } from "@/constants/palette";
import { fitCanvasToViewport } from "@/lib/canvas";

type Shape = "square" | "circle" | "streamer" | "star";

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  color: string;
  life: number;
  decay: number;
  size: number;
  rotation: number;
  rotV: number;
  shape: Shape;
  gravity: number;
  wobble: number;   // phase of the flutter, so streamers twist as they fall
  wobbleV: number;
}

/** The expanding ring of light a burst leaves behind. */
interface Ring { x: number; y: number; life: number; decay: number; }

// Shared mutable state — lives outside React so it's never re-created
let particles: Particle[] = [];
let rings: Ring[] = [];
let rafId = 0;

/* A burst can be fired from anywhere on the page, so the particle count is
   capped: without it, holding the mouse down and scribbling would queue
   thousands of them and drag the framerate down on a phone. */
const MAX_PARTICLES = 420;

const pick = () => CELEBRATION_COLORS[Math.floor(Math.random() * CELEBRATION_COLORS.length)];

function shapeFor(r: number): Shape {
  if (r < 0.34) return "streamer";
  if (r < 0.58) return "circle";
  if (r < 0.74) return "star";
  return "square";
}

function spawn(p: Particle) {
  particles.push(p);
  if (particles.length > MAX_PARTICLES) particles.splice(0, particles.length - MAX_PARTICLES);
}

/** The full pop: a wide radial spray plus a shockwave ring. */
function addBurst(cx: number, cy: number, power = 1) {
  const count = Math.round(46 * power);
  for (let i = 0; i < count; i++) {
    // Spread around a cone that favours upward, so it arcs like a popper.
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.45;
    const speed = (Math.random() * 9 + 4) * power;
    const shape = shapeFor(Math.random());
    spawn({
      x: cx, y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color: pick(),
      life: 1,
      // Streamers hang in the air; the heavier confetti clears quickly.
      decay: shape === "streamer" ? 0.007 + Math.random() * 0.006 : 0.014 + Math.random() * 0.012,
      size: shape === "streamer" ? Math.random() * 5 + 5 : Math.random() * 5 + 2.5,
      rotation: Math.random() * 360,
      rotV: (Math.random() - 0.5) * 18,
      shape,
      gravity: shape === "streamer" ? 0.11 : 0.3,
      wobble: Math.random() * Math.PI * 2,
      wobbleV: 0.12 + Math.random() * 0.14,
    });
  }
  rings.push({ x: cx, y: cy, life: 1, decay: 0.045 });
}

/** The lighter trickle that follows the cursor while the button is held. */
function addTrail(x: number, y: number, dx: number, dy: number) {
  const count = 2 + Math.floor(Math.random() * 3);
  for (let i = 0; i < count; i++) {
    const shape = shapeFor(Math.random());
    spawn({
      x: x + (Math.random() - 0.5) * 14,
      y: y + (Math.random() - 0.5) * 14,
      // Thrown along the drag, so a fast scribble sprays further than a slow one.
      vx: dx * 0.32 + (Math.random() - 0.5) * 4.5,
      vy: dy * 0.32 - Math.random() * 3.5,
      color: pick(),
      life: 1,
      decay: shape === "streamer" ? 0.009 + Math.random() * 0.007 : 0.018 + Math.random() * 0.014,
      size: shape === "streamer" ? Math.random() * 4 + 4 : Math.random() * 4 + 2,
      rotation: Math.random() * 360,
      rotV: (Math.random() - 0.5) * 16,
      shape,
      gravity: shape === "streamer" ? 0.1 : 0.26,
      wobble: Math.random() * Math.PI * 2,
      wobbleV: 0.12 + Math.random() * 0.14,
    });
  }
}

function drawStar(ctx: CanvasRenderingContext2D, r: number) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? r : r * 0.45;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const fn = i === 0 ? "moveTo" : "lineTo";
    ctx[fn](Math.cos(a) * rad, Math.sin(a) * rad);
  }
  ctx.closePath();
  ctx.fill();
}

function startLoop(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  cancelAnimationFrame(rafId);

  function loop() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    ctx!.clearRect(0, 0, w, h);

    // Shockwave rings, drawn under the confetti
    rings = rings.filter((r) => r.life > 0);
    for (const r of rings) {
      r.life -= r.decay;
      if (r.life <= 0) continue;
      ctx!.save();
      ctx!.globalAlpha = Math.max(0, r.life) * 0.5;
      ctx!.strokeStyle = "#F0BC3F";
      ctx!.lineWidth = Math.max(0.5, r.life * 3);
      ctx!.beginPath();
      ctx!.arc(r.x, r.y, (1 - r.life) * 85, 0, Math.PI * 2);
      ctx!.stroke();
      ctx!.restore();
    }

    particles = particles.filter((p) => p.life > 0);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.99;
      p.life -= p.decay;
      p.rotation += p.rotV;
      p.wobble += p.wobbleV;

      if (p.life <= 0) continue;
      ctx!.save();
      ctx!.globalAlpha = Math.max(0, p.life);
      ctx!.translate(p.x, p.y);
      ctx!.rotate((p.rotation * Math.PI) / 180);
      ctx!.fillStyle = p.color;

      switch (p.shape) {
        case "circle":
          ctx!.beginPath();
          ctx!.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx!.fill();
          break;
        case "star":
          drawStar(ctx!, p.size * 0.8);
          break;
        case "streamer":
          // Squashing the width by the wobble reads as a paper ribbon turning
          // edge-on and back as it falls.
          ctx!.scale(Math.cos(p.wobble), 1);
          ctx!.fillRect(-p.size / 2, -p.size * 1.6, p.size, p.size * 3.2);
          break;
        default:
          ctx!.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5);
      }
      ctx!.restore();
    }

    if (particles.length > 0 || rings.length > 0) rafId = requestAnimationFrame(loop);
  }

  rafId = requestAnimationFrame(loop);
}

export default function GlobalConfetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => fitCanvasToViewport(canvas);
    resize();
    window.addEventListener("resize", resize);

    let dragging = false;
    let dragMoved = false;
    let lastX = 0, lastY = 0;
    let lastEmit = 0;

    const onDown = (e: PointerEvent) => {
      dragging = true;
      dragMoved = false;
      lastX = e.clientX;
      lastY = e.clientY;
      addBurst(e.clientX, e.clientY, reduced ? 0.45 : 1);
      startLoop(canvas);
    };

    const onMove = (e: PointerEvent) => {
      if (!dragging || reduced) return;
      // A touch drag is how you scroll, so the trail is left to mouse and pen —
      // otherwise every scroll on a phone would spray confetti.
      if (e.pointerType === "touch") return;

      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      if (Math.hypot(dx, dy) > 3) dragMoved = true;

      const now = performance.now();
      if (now - lastEmit > 26) {
        lastEmit = now;
        addTrail(e.clientX, e.clientY, dx, dy);
        startLoop(canvas);
      }
      lastX = e.clientX;
      lastY = e.clientY;
    };

    const onUp = (e: PointerEvent) => {
      // Let go after a real drag and the trail finishes with a pop.
      if (dragging && dragMoved && !reduced) {
        addBurst(e.clientX, e.clientY, 0.7);
        startLoop(canvas);
      }
      dragging = false;
    };

    const onCancel = () => { dragging = false; };

    document.addEventListener("pointerdown", onDown);
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
    document.addEventListener("pointercancel", onCancel);

    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointercancel", onCancel);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafId);
      // These live outside the component, so leftovers would be drawn again on
      // the next mount. CursorRibbon already resets its arrays here.
      particles = [];
      rings = [];
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
