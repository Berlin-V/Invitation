"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const WEDDING = new Date("2026-12-10T09:00:00+05:30"); // IST

function pad(n: number) { return String(n).padStart(2, "0"); }

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(): TimeLeft {
  const now = new Date();
  const diff = WEDDING.getTime() - now.getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-20 h-20 md:w-24 md:h-24">
        {/* Pulsing ring */}
        <motion.div
          className="absolute inset-0 rounded-full border border-[#C9A84C]/30"
          animate={{ scale: [1, 1.15], opacity: [0.4, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
        />
        <div className="absolute inset-0 rounded-full border border-[#C9A84C]/50 glass-card flex items-center justify-center">
          <span className="font-serif text-3xl md:text-4xl text-[#E8D5A3] font-light">{pad(value)}</span>
        </div>
      </div>
      <span className="font-sans-custom text-[10px] tracking-[0.3em] uppercase text-[#C9A84C]/70">{label}</span>
    </div>
  );
}

export default function CountdownTimer() {
  const [time, setTime] = useState<TimeLeft>(getTimeLeft());

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  if (time.days === 0 && time.hours === 0 && time.minutes === 0 && time.seconds === 0) {
    return (
      <div className="text-center">
        <p className="font-script text-5xl text-gold-gradient">Today is the Day!</p>
      </div>
    );
  }

  return (
    <div className="text-center space-y-6">
      <p className="font-sans-custom text-[11px] tracking-[0.4em] uppercase text-[#C9A84C]/70">Counting down to</p>
      <p className="font-script text-4xl md:text-5xl text-gold-gradient">December 10, 2026</p>
      <div className="flex items-center justify-center gap-4 md:gap-8 flex-wrap">
        <Unit value={time.days} label="Days" />
        <Separator />
        <Unit value={time.hours} label="Hours" />
        <Separator />
        <Unit value={time.minutes} label="Minutes" />
        <Separator />
        <Unit value={time.seconds} label="Seconds" />
      </div>
    </div>
  );
}

function Separator() {
  return (
    <motion.span
      className="font-serif text-3xl text-[#C9A84C]/50 self-center mt-[-16px]"
      animate={{ opacity: [1, 0.2, 1] }}
      transition={{ duration: 1, repeat: Infinity }}
    >
      :
    </motion.span>
  );
}
