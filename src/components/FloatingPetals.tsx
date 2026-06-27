"use client";

import { useEffect, useRef } from "react";

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  color: string;
  rx: number;
  ry: number;
}

const COLORS = ["#FAC2BC", "#FAA38B", "#F8EDE3", "#EDD5C2", "#F5D5D0"];

function createPetal(canvasWidth: number): Petal {
  return {
    x: Math.random() * canvasWidth,
    y: -20,
    size: 8 + Math.random() * 10,
    speedY: 0.6 + Math.random() * 1.0,
    speedX: (Math.random() - 0.5) * 0.6,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 1.5,
    opacity: 0.5 + Math.random() * 0.4,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    rx: 0.4 + Math.random() * 0.3,
    ry: 0.5 + Math.random() * 0.3,
  };
}

export default function FloatingPetals() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const petalsRef = useRef<Petal[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Seed initial petals
    for (let i = 0; i < 18; i++) {
      const p = createPetal(canvas.width);
      p.y = Math.random() * canvas.height; // start scattered
      petalsRef.current.push(p);
    }

    let spawnTimer = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      spawnTimer++;
      if (spawnTimer > 60 && petalsRef.current.length < 30) {
        petalsRef.current.push(createPetal(canvas.width));
        spawnTimer = 0;
      }

      petalsRef.current = petalsRef.current.filter((p) => p.y < canvas.height + 40);

      for (const p of petalsRef.current) {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.y * 0.02) * 0.3;
        p.rotation += p.rotationSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * p.rx, p.size * p.ry, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
      style={{ mixBlendMode: "multiply" }}
    />
  );
}
