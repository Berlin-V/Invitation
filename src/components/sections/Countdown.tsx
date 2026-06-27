"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WEDDING = new Date("2026-12-09T09:00:00+05:30");

function pad(n: number) { return String(n).padStart(2, "0"); }

interface TimeLeft { days: number; hours: number; minutes: number; seconds: number; }

function getTimeLeft(): TimeLeft {
  const diff = WEDDING.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days:    Math.floor(diff / 86400000),
    hours:   Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

function Unit({ value, label }: { value: number; label: string }) {
  const d = pad(value);
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: "5.5rem", height: "6rem" }}>
        {/* Background card */}
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: "#F8F4EF",
            border: "1px solid rgba(201,165,109,0.2)",
          }}
        />
        {/* Number */}
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={d}
            initial={{ y: -18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 18, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center tabular-nums"
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "clamp(2rem, 5vw, 2.8rem)",
              fontWeight: 300,
              color: "#4A403A",
            }}
            suppressHydrationWarning
          >
            {d}
          </motion.span>
        </AnimatePresence>
      </div>
      <span style={{
        fontFamily: "var(--font-cormorant), Georgia, serif",
        fontSize: "0.72rem",
        letterSpacing: "0.32em",
        color: "#8A7C73",
        textTransform: "uppercase",
      }}>
        {label}
      </span>
    </div>
  );
}

function Sep() {
  return (
    <span
      className="self-center mb-8 select-none"
      style={{
        fontFamily: "var(--font-cormorant), Georgia, serif",
        fontSize: "1.5rem",
        color: "#C9A56D",
        opacity: 0.6,
        lineHeight: 1,
      }}
    >
      ·
    </span>
  );
}

export default function Countdown() {
  const [time, setTime] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setTime(getTimeLeft());
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!time) return (
    <section id="countdown" className="section-pad" style={{ background: "#FFFDF9" }}>
      <div className="max-w-3xl mx-auto flex justify-center gap-8 opacity-0 select-none">
        {["Days","Hours","Mins","Secs"].map((l) => (
          <div key={l} style={{ width: "5.5rem", height: "6rem" }} />
        ))}
      </div>
    </section>
  );

  return (
    <section id="countdown" className="section-pad" style={{ background: "#FFFDF9" }}>
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
        >
          <p style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "0.72rem",
            letterSpacing: "0.42em",
            color: "#C9A56D",
            textTransform: "uppercase",
            marginBottom: "1rem",
          }}>
            Counting Down To
          </p>

          <h2 style={{
            fontFamily: "var(--font-allura), cursive",
            fontSize: "clamp(2.2rem, 6vw, 3.2rem)",
            color: "#4A403A",
            marginBottom: "3rem",
            lineHeight: 1.2,
          }}>
            Our Wedding Day
          </h2>

          {/* Timer */}
          <div className="flex items-end justify-center gap-4 sm:gap-6 flex-wrap">
            <Unit value={time.days}    label="Days"    />
            <Sep />
            <Unit value={time.hours}   label="Hours"   />
            <Sep />
            <Unit value={time.minutes} label="Minutes" />
            <Sep />
            <Unit value={time.seconds} label="Seconds" />
          </div>

          <div className="divider-gold max-w-xs mx-auto mt-12" />
        </motion.div>
      </div>
    </section>
  );
}
