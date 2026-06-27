"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WEDDING_DATE } from "@/lib/config";

const WEDDING_ISO = "2026-12-10T09:00:00+05:30";
const WEDDING_DISPLAY = "December 10, 2026";

interface TimeLeft { days: number; hours: number; minutes: number; seconds: number; }

function getTimeLeft(): TimeLeft {
  const diff = new Date(WEDDING_ISO).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days:    Math.floor(diff / 86400000),
    hours:   Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000)  / 60000),
    seconds: Math.floor((diff % 60000)    / 1000),
  };
}

function pad(n: number) { return String(n).padStart(2, "0"); }

function Unit({ value, label }: { value: number; label: string }) {
  const display = pad(value);
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24">
        <motion.div
          className="absolute inset-0 rounded-xl"
          animate={{ boxShadow: ["0 0 8px rgba(249,115,22,0.2)", "0 0 22px rgba(249,115,22,0.5)", "0 0 8px rgba(249,115,22,0.2)"] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <div
          className="absolute inset-0 rounded-xl flex items-center justify-center overflow-hidden"
          style={{ background: "rgba(249,115,22,0.07)", border: "1px solid rgba(249,115,22,0.25)" }}
        >
          {/* AnimatePresence with key on display flips the digit — but we
              suppress hydration warning so the first server/client mismatch
              on seconds doesn't crash the tree. */}
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={display}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0,   opacity: 1 }}
              exit={{   y:  20, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="font-serif font-light text-orange-100 tabular-nums"
              style={{ fontSize: "clamp(1.4rem, 4vw, 2rem)" }}
              suppressHydrationWarning
            >
              {display}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
      <span className="font-sans-custom text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-orange-400/60">
        {label}
      </span>
    </div>
  );
}

function Sep() {
  return (
    <motion.span
      className="font-serif text-2xl text-orange-500/40 self-center mb-5 tabular-nums"
      animate={{ opacity: [1, 0.2, 1] }}
      transition={{ duration: 1, repeat: Infinity }}
    >:</motion.span>
  );
}

export default function CountdownTimer() {
  // Start null so SSR renders nothing — avoids server/client second mismatch.
  const [time, setTime] = useState<TimeLeft | null>(null);

  useEffect(() => {
    // Immediately populate on mount, then tick every second.
    setTime(getTimeLeft());
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const OG = "linear-gradient(135deg,#F97316,#FED7AA,#FB923C)";

  if (!time) {
    // Skeleton shown during SSR — same structure, no live values.
    return (
      <div className="text-center space-y-5 opacity-0 select-none" aria-hidden>
        <p className="font-sans-custom text-[10px] tracking-[0.45em] uppercase text-orange-400/60">
          Counting down to
        </p>
        <p className="font-script" style={{ fontSize: "clamp(2rem,6vw,3rem)", background: OG,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
          {WEDDING_DISPLAY}
        </p>
        <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6">
          {["Days","Hours","Mins","Secs"].map((l) => (
            <div key={l} className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl"
                style={{ background: "rgba(249,115,22,0.07)", border: "1px solid rgba(249,115,22,0.25)" }} />
              <span className="font-sans-custom text-[9px] tracking-[0.3em] uppercase text-orange-400/60">{l}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!time.days && !time.hours && !time.minutes && !time.seconds) {
    return (
      <p className="font-script text-5xl" style={{ background: OG,
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
        Today is the Day! 🎉
      </p>
    );
  }

  return (
    <div className="text-center space-y-5">
      <p className="font-sans-custom text-[10px] tracking-[0.45em] uppercase text-orange-400/60">
        Counting down to
      </p>
      <p className="font-script" style={{ fontSize: "clamp(2rem,6vw,3rem)", background: OG,
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
        {WEDDING_DISPLAY}
      </p>
      <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 flex-wrap">
        <Unit value={time.days}    label="Days"  />
        <Sep />
        <Unit value={time.hours}   label="Hours" />
        <Sep />
        <Unit value={time.minutes} label="Mins"  />
        <Sep />
        <Unit value={time.seconds} label="Secs"  />
      </div>
    </div>
  );
}
