"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

interface Wish {
  id: string;
  name: string;
  relation: string;
  message: string;
  createdAt: string;
}

type LeafSide = "bride" | "groom" | "both";

function leafSideFor(relation: string): LeafSide {
  if (relation.startsWith("Groom's")) return "groom";
  if (relation.startsWith("Bride's")) return "bride";
  return "both";
}

// Leaf anchor positions (%) relative to the tree container
const LEAF_POSITIONS = [
  { x: 50, y: 9 },
  { x: 42, y: 15 }, { x: 58, y: 15 },
  { x: 35, y: 23 }, { x: 50, y: 21 }, { x: 65, y: 23 },
  { x: 27, y: 31 }, { x: 42, y: 29 }, { x: 58, y: 29 }, { x: 73, y: 31 },
  { x: 21, y: 40 }, { x: 35, y: 38 }, { x: 50, y: 36 }, { x: 65, y: 38 }, { x: 79, y: 40 },
  { x: 17, y: 50 }, { x: 30, y: 48 }, { x: 43, y: 46 }, { x: 57, y: 46 }, { x: 70, y: 48 }, { x: 83, y: 50 },
  { x: 24, y: 59 }, { x: 38, y: 57 }, { x: 50, y: 55 }, { x: 62, y: 57 }, { x: 76, y: 59 },
  { x: 32, y: 67 }, { x: 50, y: 65 }, { x: 68, y: 67 },
];

const BURST_COLORS = [
  "#C9A56D", "#E8D5B0", "#FAC2BC", "#F58893", "#EE7863", "#FFFDF9", "#F2772F", "#C9A56D",
];

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function burstConfetti(canvas: HTMLCanvasElement, cx: number, cy: number) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const DPR = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * DPR;
  canvas.height = window.innerHeight * DPR;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.scale(DPR, DPR);

  const particles = Array.from({ length: 60 }, (_, i) => ({
    x: cx,
    y: cy,
    vx: (Math.random() - 0.5) * 14,
    vy: -(Math.random() * 9 + 5),
    color: BURST_COLORS[i % BURST_COLORS.length],
    life: 1,
    decay: 0.014 + Math.random() * 0.01,
    size: Math.random() * 6 + 3,
    rotation: Math.random() * 360,
    rotV: (Math.random() - 0.5) * 15,
    circle: Math.random() > 0.55,
  }));

  let rafId: number;
  function draw() {
    ctx!.clearRect(0, 0, window.innerWidth, window.innerHeight);
    let alive = false;
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.38;
      p.vx *= 0.99;
      p.life -= p.decay;
      p.rotation += p.rotV;
      if (p.life <= 0) continue;
      alive = true;
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
    if (alive) rafId = requestAnimationFrame(draw);
    else ctx!.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }
  rafId = requestAnimationFrame(draw);
  return () => cancelAnimationFrame(rafId);
}

const LEAF_GRADIENTS: Record<LeafSide, [string, string]> = {
  bride: ["#A9E08F", "#6FA857"],
  groom: ["#3E6B39", "#183A1B"],
  both: ["#F5D76E", "#E08A32"],
};

// Leaf SVG — organic shape with midrib when active
function LeafIcon({ side, hovered }: { side: LeafSide | null; hovered: boolean }) {
  const active = side !== null;
  const gradientId = side ? `lg-${side}` : "lg-active";
  const [from, to] = side ? LEAF_GRADIENTS[side] : LEAF_GRADIENTS.both;

  return (
    <svg width="26" height="32" viewBox="0 0 26 32" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
      <motion.path
        d="M13 1 C20 1 25 7 25 15 C25 23 19 31 13 32 C7 31 1 23 1 15 C1 7 6 1 13 1 Z"
        fill={active ? `url(#${gradientId})` : "rgba(30,40,22,0.55)"}
        stroke={active ? "rgba(201,165,109,0.35)" : "rgba(30,40,22,0.3)"}
        strokeWidth="0.5"
        animate={{
          filter: hovered && active
            ? "drop-shadow(0 0 7px rgba(201,165,109,0.65))"
            : "none",
        }}
        transition={{ duration: 0.2 }}
      />
      {active && (
        <line x1="13" y1="3" x2="13" y2="30" stroke="rgba(201,165,109,0.22)" strokeWidth="0.6" />
      )}
    </svg>
  );
}

interface LeafProps {
  wish: Wish | null;
  pos: { x: number; y: number };
  idx: number;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

function Leaf({ wish, pos, idx, canvasRef }: LeafProps) {
  const [hovered, setHovered] = useState(false);
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (dismissTimer.current) clearTimeout(dismissTimer.current);
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (!wish || !canvasRef.current) return;
      burstConfetti(canvasRef.current, e.clientX, e.clientY);

      // Hover doesn't exist on touch — a tap opens the tooltip directly and
      // auto-dismisses it after a few seconds instead of waiting for a hover-end.
      setHovered(true);
      if (dismissTimer.current) clearTimeout(dismissTimer.current);
      dismissTimer.current = setTimeout(() => setHovered(false), 3200);
    },
    [wish, canvasRef]
  );

  return (
    <div
      style={{
        position: "absolute",
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        transform: "translate(-50%, -50%)",
        zIndex: 2,
      }}
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, delay: idx * 0.035, ease: EASE }}
        animate={{ scale: hovered && !!wish ? 1.22 : 1 }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        onClick={handleClick}
        style={{
          position: "relative",
          cursor: wish ? "pointer" : "default",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LeafIcon side={wish ? leafSideFor(wish.relation) : null} hovered={hovered} />

        {/* Tooltip */}
        <AnimatePresence>
          {hovered && wish && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.9 }}
              transition={{ duration: 0.18 }}
              style={{
                position: "absolute",
                bottom: "calc(100% + 10px)",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 20,
                width: "210px",
                background: "rgba(10,8,5,0.97)",
                border: "1px solid rgba(201,165,109,0.28)",
                padding: "0.9rem 1.05rem",
                pointerEvents: "none",
                boxShadow: "0 12px 40px rgba(0,0,0,0.6)",
              }}
            >
              {/* Arrow */}
              <div
                style={{
                  position: "absolute",
                  bottom: -5,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 0,
                  height: 0,
                  borderLeft: "5px solid transparent",
                  borderRight: "5px solid transparent",
                  borderTop: "5px solid rgba(201,165,109,0.28)",
                }}
              />
              <p
                style={{
                  fontFamily: "var(--font-allura), cursive",
                  fontSize: "1.1rem",
                  color: "#C9A56D",
                  lineHeight: 1.15,
                  marginBottom: "0.25rem",
                }}
              >
                {wish.name}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-cormorant), Georgia, serif",
                  fontSize: "0.58rem",
                  letterSpacing: "0.22em",
                  color: "rgba(201,165,109,0.45)",
                  textTransform: "uppercase",
                  marginBottom: "0.55rem",
                }}
              >
                {timeAgo(wish.createdAt)}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-cormorant), Georgia, serif",
                  fontSize: "0.82rem",
                  fontStyle: "italic",
                  lineHeight: 1.55,
                  color: "rgba(255,253,249,0.65)",
                }}
              >
                {wish.message.length > 90
                  ? wish.message.slice(0, 90) + "…"
                  : wish.message}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default function WishesTreeSection() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    fetch("/api/wishes")
      .then((r) => r.json())
      .then((d: { wishes?: Wish[] }) => setWishes(d.wishes ?? []))
      .catch(() => {});
  }, []);

  return (
    <section
      id="wishes"
      style={{
        backgroundColor: "#0A0705",
        padding: "clamp(4rem, 10vw, 8rem) clamp(1.25rem, 5vw, 3rem)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Confetti canvas — fixed, full viewport */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          pointerEvents: "none",
          zIndex: 9999,
        }}
      />

      {/* Section header */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.9, ease: EASE }}
        style={{ marginBottom: "clamp(3rem, 8vw, 5rem)" }}
      >
        <p
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "0.62rem",
            letterSpacing: "0.46em",
            color: "rgba(201,165,109,0.55)",
            textTransform: "uppercase",
            marginBottom: "1rem",
          }}
        >
          {wishes.length > 0 ? `${wishes.length} heartfelt wishes` : "Leave your blessing"}
        </p>
        <h2
          style={{
            fontFamily: "var(--font-allura), cursive",
            fontSize: "clamp(2.5rem, 7vw, 4.5rem)",
            color: "#C9A56D",
            lineHeight: 1.1,
            marginBottom: "1.25rem",
          }}
        >
          Wishes Tree
        </h2>
        <div
          style={{
            height: "1px",
            width: "80px",
            background: "linear-gradient(90deg, transparent, rgba(201,165,109,0.45), transparent)",
            margin: "0 auto 1.25rem",
          }}
        />
        <p
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "0.85rem",
            fontStyle: "italic",
            color: "rgba(255,253,249,0.35)",
            letterSpacing: "0.04em",
          }}
        >
          Hover a leaf to read a wish. Click to celebrate.
        </p>
      </motion.div>

      {/* Tree container */}
      <div
        style={{
          position: "relative",
          maxWidth: "600px",
          margin: "0 auto",
          aspectRatio: "600 / 560",
        }}
      >
        {/* Trunk + branches SVG */}
        <svg
          viewBox="0 0 600 560"
          fill="none"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          aria-hidden="true"
        >
          {/* Trunk */}
          <path d="M300 560 C298 490 294 430 300 380" stroke="#4A2E08" strokeWidth="20" strokeLinecap="round" />

          {/* Lower branches */}
          <path d="M300 410 C272 392 222 374 170 364" stroke="#4A2E08" strokeWidth="13" strokeLinecap="round" />
          <path d="M300 410 C328 392 378 374 430 364" stroke="#4A2E08" strokeWidth="13" strokeLinecap="round" />

          {/* Mid branches */}
          <path d="M300 385 C272 355 232 322 185 300" stroke="#5C3A0A" strokeWidth="10" strokeLinecap="round" />
          <path d="M300 385 C328 355 368 322 415 300" stroke="#5C3A0A" strokeWidth="10" strokeLinecap="round" />
          <path d="M300 375 C300 335 300 295 300 255" stroke="#5C3A0A" strokeWidth="9" strokeLinecap="round" />

          {/* Upper branches */}
          <path d="M300 295 C276 265 248 234 212 213" stroke="#6B4714" strokeWidth="7" strokeLinecap="round" />
          <path d="M300 295 C324 265 352 234 388 213" stroke="#6B4714" strokeWidth="7" strokeLinecap="round" />
          <path d="M300 260 C285 228 266 196 242 178" stroke="#6B4714" strokeWidth="6" strokeLinecap="round" />
          <path d="M300 260 C315 228 334 196 358 178" stroke="#6B4714" strokeWidth="6" strokeLinecap="round" />
          <path d="M300 250 C300 210 300 172 300 142" stroke="#6B4714" strokeWidth="6" strokeLinecap="round" />

          {/* Tip branches */}
          <path d="M300 195 C286 168 270 148 254 132" stroke="#7A5218" strokeWidth="4" strokeLinecap="round" />
          <path d="M300 195 C314 168 330 148 346 132" stroke="#7A5218" strokeWidth="4" strokeLinecap="round" />

          {/* Ambient ground line */}
          <ellipse cx="300" cy="555" rx="70" ry="8" fill="rgba(74,46,8,0.25)" />
        </svg>

        {/* Leaves */}
        {LEAF_POSITIONS.map((pos, i) => (
          <Leaf
            key={i}
            wish={wishes[i] ?? null}
            pos={pos}
            idx={i}
            canvasRef={canvasRef}
          />
        ))}
      </div>

      {/* Leave a wish CTA */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
        style={{ marginTop: "clamp(3rem, 8vw, 5rem)" }}
      >
        <a
          href="/wishes"
          style={{
            display: "inline-block",
            background: "none",
            color: "#C9A56D",
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "0.7rem",
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            padding: "0.8rem 2.5rem",
            textDecoration: "none",
            border: "1px solid rgba(201,165,109,0.4)",
            transition: "background 0.3s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background =
              "rgba(201,165,109,0.1)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = "none";
          }}
        >
          Leave Your Wish
        </a>
      </motion.div>
    </section>
  );
}
