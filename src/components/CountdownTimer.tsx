"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WEDDING_DATE } from "@/lib/config";

const WEDDING = new Date(WEDDING_DATE.iso);

function pad(n: number) { return String(n).padStart(2, "0"); }

interface TimeLeft { days: number; hours: number; minutes: number; seconds: number; }

function getTimeLeft(): TimeLeft {
  const diff = WEDDING.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

function Unit({ value, label }: { value: number; label: string }) {
  const display = pad(value);
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24">
        {/* glow ring */}
        <motion.div
          className="absolute inset-0 rounded-xl"
          animate={{ boxShadow: ["0 0 8px rgba(249,115,22,0.2)", "0 0 22px rgba(249,115,22,0.5)", "0 0 8px rgba(249,115,22,0.2)"] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <div
          className="absolute inset-0 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(249,115,22,0.07)", border: "1px solid rgba(249,115,22,0.25)" }}
        >
          <AnimatePresence mode="popLayout">
            <motion.span
              key={display}
              initial={{ y: -14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 14, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="font-serif font-light text-orange-100"
              style={{ fontSize: "clamp(1.4rem,4vw,2rem)" }}
            >
              {display}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
      <span className="font-sans-custom text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-orange-400/60">{label}</span>
    </div>
  );
}

export default function CountdownTimer() {
  const [time, setTime] = useState<TimeLeft>(getTimeLeft());

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!time.days && !time.hours && !time.minutes && !time.seconds) {
    return (
      <p className="font-script text-5xl text-orange-gradient" style={{
        background: "linear-gradient(135deg,#F97316,#FED7AA,#FB923C)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
      }}>Today is the Day!</p>
    );
  }

  return (
    <div className="text-center space-y-5">
      <p className="font-sans-custom text-[10px] tracking-[0.45em] uppercase text-orange-400/60">Counting down to</p>
      <p className="font-script" style={{
        fontSize: "clamp(2rem,6vw,3rem)",
        background: "linear-gradient(135deg,#F97316,#FED7AA,#FB923C)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
      }}>
        {WEDDING_DATE.display}
      </p>
      <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 flex-wrap">
        <Unit value={time.days} label="Days" />
        <Sep />
        <Unit value={time.hours} label="Hours" />
        <Sep />
        <Unit value={time.minutes} label="Mins" />
        <Sep />
        <Unit value={time.seconds} label="Secs" />
      </div>
    </div>
  );
}

function Sep() {
  return (
    <motion.span
      className="font-serif text-2xl text-orange-500/40 self-center mb-5"
      animate={{ opacity: [1, 0.2, 1] }}
      transition={{ duration: 1, repeat: Infinity }}
    >:</motion.span>
  );
}
