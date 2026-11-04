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

/** A firecracker ember: a bright streak that flickers and can crackle again. */
interface Spark {
  x: number; y: number;
  vx: number; vy: number;
  life: number;
  decay: number;
  color: string;
  /** Sub-pops left in this ember — the crackle of a real cracker. */
  crackles: number;
}

/** The expanding ring of light a burst leaves behind. */
interface Ring { x: number; y: number; life: number; decay: number; }

// Shared mutable state — lives outside React so it's never re-created
let particles: Particle[] = [];
let sparks: Spark[] = [];
let rings: Ring[] = [];
let rafId = 0;

/* Caps the whole system. The previous limit was high enough that a scribble
   could keep hundreds of particles alive at once, which is what made the
   effect feel like soup rather than a pop. */
const MAX_PARTICLES = 220;
const MAX_SPARKS = 180;

const SPARK_COLORS = ["#FFFDF9", "#F9DE93", "#F0BC3F", "#FFE9B0"];

const pick = () => CELEBRATION_COLORS[Math.floor(Math.random() * CELEBRATION_COLORS.length)];
const pickSpark = () => SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)];

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

function spawnSpark(s: Spark) {
  sparks.push(s);
  if (sparks.length > MAX_SPARKS) sparks.splice(0, sparks.length - MAX_SPARKS);
}

/** Paper confetti: a tight upward cone that clears quickly. */
function addConfetti(cx: number, cy: number, power = 1) {
  const count = Math.round(26 * power);
  for (let i = 0; i < count; i++) {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.1;
    const speed = (Math.random() * 7 + 5) * power;
    const shape = shapeFor(Math.random());
    spawn({
      x: cx, y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color: pick(),
      life: 1,
      // Shorter than before on purpose: the pop should read as an event, not
      // a drift. Streamers still hang a little longer than the heavier bits.
      decay: shape === "streamer" ? 0.012 + Math.random() * 0.008 : 0.022 + Math.random() * 0.014,
      size: shape === "streamer" ? Math.random() * 4 + 4 : Math.random() * 4 + 2.5,
      rotation: Math.random() * 360,
      rotV: (Math.random() - 0.5) * 16,
      shape,
      gravity: shape === "streamer" ? 0.13 : 0.34,
      wobble: Math.random() * Math.PI * 2,
      wobbleV: 0.12 + Math.random() * 0.14,
    });
  }
}

/** Firecracker: fast radial embers that flicker and crackle a second time. */
function addCrackers(cx: number, cy: number, power = 1) {
  const count = Math.round(18 * power);
  for (let i = 0; i < count; i++) {
    // Fully radial, unlike the confetti cone — a cracker throws every way.
    const angle = Math.random() * Math.PI * 2;
    const speed = (Math.random() * 8 + 6) * power;
    spawnSpark({
      x: cx, y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      decay: 0.03 + Math.random() * 0.025,
      color: pickSpark(),
      crackles: Math.random() < 0.45 ? 1 : 0,
    });
  }
  rings.push({ x: cx, y: cy, life: 1, decay: 0.055 });
}

/** The full pop: paper and crackers together. */
function addBurst(cx: number, cy: number, power = 1) {
  addConfetti(cx, cy, power);
  addCrackers(cx, cy, power);
}

/** The lighter trickle that follows the cursor while the button is held. */
function addTrail(x: number, y: number, dx: number, dy: number) {
  const shape = shapeFor(Math.random());
  spawn({
    x: x + (Math.random() - 0.5) * 12,
    y: y + (Math.random() - 0.5) * 12,
    // Thrown along the drag, so a fast scribble sprays further than a slow one.
    vx: dx * 0.28 + (Math.random() - 0.5) * 3.5,
    vy: dy * 0.28 - Math.random() * 2.5,
    color: pick(),
    life: 1,
    decay: shape === "streamer" ? 0.016 + Math.random() * 0.008 : 0.026 + Math.random() * 0.014,
    size: shape === "streamer" ? Math.random() * 3 + 3 : Math.random() * 3 + 2,
    rotation: Math.random() * 360,
    rotV: (Math.random() - 0.5) * 14,
    shape,
    gravity: shape === "streamer" ? 0.12 : 0.3,
    wobble: Math.random() * Math.PI * 2,
    wobbleV: 0.12 + Math.random() * 0.14,
  });
  // One ember per step keeps the drag sparkling without it turning to soup.
  if (Math.random() < 0.5) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 4 + 2;
    spawnSpark({
      x, y,
      vx: Math.cos(angle) * speed + dx * 0.15,
      vy: Math.sin(angle) * speed + dy * 0.15,
      life: 1,
      decay: 0.05 + Math.random() * 0.03,
      color: pickSpark(),
      crackles: 0,
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

    // Shockwave rings, drawn under everything else
    rings = rings.filter((r) => r.life > 0);
    for (const r of rings) {
      r.life -= r.decay;
      if (r.life <= 0) continue;
      ctx!.save();
      ctx!.globalAlpha = Math.max(0, r.life) * 0.4;
      ctx!.strokeStyle = "#F9DE93";
      ctx!.lineWidth = Math.max(0.5, r.life * 2.5);
      ctx!.beginPath();
      ctx!.arc(r.x, r.y, (1 - r.life) * 70, 0, Math.PI * 2);
      ctx!.stroke();
      ctx!.restore();
    }

    // Cracker embers — bright, additive, and flickering
    sparks = sparks.filter((s) => s.life > 0);
    ctx!.save();
    ctx!.globalCompositeOperation = "lighter";
    ctx!.lineCap = "round";
    for (const s of sparks) {
      s.x += s.vx;
      s.y += s.vy;
      // Heavy air drag is what makes a cracker read as a sharp crack rather
      // than a firework: the embers shoot out, then stall almost at once.
      s.vx *= 0.9;
      s.vy *= 0.9;
      s.vy += 0.12;
      s.life -= s.decay;

      // Crackle: a stalled ember pops once more into a few tiny embers.
      if (s.crackles > 0 && s.life < 0.55) {
        s.crackles -= 1;
        for (let i = 0; i < 3; i++) {
          const a = Math.random() * Math.PI * 2;
          const sp = Math.random() * 3 + 1.5;
          spawnSpark({
            x: s.x, y: s.y,
            vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
            life: s.life * 0.8,
            decay: 0.06 + Math.random() * 0.04,
            color: pickSpark(),
            crackles: 0,
          });
        }
      }

      if (s.life <= 0) continue;
      // Alpha jitter reads as the ember guttering.
      const flicker = 0.65 + Math.random() * 0.35;
      ctx!.globalAlpha = Math.max(0, s.life) * flicker;
      ctx!.strokeStyle = s.color;
      ctx!.lineWidth = Math.max(0.6, s.life * 2);
      ctx!.beginPath();
      ctx!.moveTo(s.x, s.y);
      ctx!.lineTo(s.x - s.vx * 1.8, s.y - s.vy * 1.8);
      ctx!.stroke();
    }
    ctx!.restore();

    particles = particles.filter((p) => p.life > 0);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      // Drag on both axes, so paper slows as it tumbles instead of sliding.
      p.vx *= 0.985;
      p.vy *= 0.995;
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

    if (particles.length > 0 || sparks.length > 0 || rings.length > 0) {
      rafId = requestAnimationFrame(loop);
    }
  }

  rafId = requestAnimationFrame(loop);
}

/* Taps on something the visitor is actually trying to use shouldn't detonate.
   Firing on every pointerdown was the main reason the effect felt clumsy:
   opening the menu or pressing play buried the control in paper. */
const INTERACTIVE = "a, button, input, textarea, select, label, summary, iframe, [role='button']";

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
    let lastBurst = 0;

    const onDown = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (target?.closest?.(INTERACTIVE)) return;

      // Rapid taps used to stack burst on burst; one pop per 180ms reads as
      // deliberate instead of frantic.
      const now = performance.now();
      if (now - lastBurst < 180) return;
      lastBurst = now;

      dragging = true;
      dragMoved = false;
      lastX = e.clientX;
      lastY = e.clientY;
      addBurst(e.clientX, e.clientY, reduced ? 0.4 : 1);
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
      if (now - lastEmit > 32) {
        lastEmit = now;
        addTrail(e.clientX, e.clientY, dx, dy);
        startLoop(canvas);
      }
      lastX = e.clientX;
      lastY = e.clientY;
    };

    const onUp = (e: PointerEvent) => {
      // Let go after a real drag and the trail finishes with a crackle.
      if (dragging && dragMoved && !reduced) {
        addCrackers(e.clientX, e.clientY, 0.6);
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
      sparks = [];
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
