"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getCountdown } from "@/utils";
import { EASE } from "@/constants/motion";
import { WEDDING_DATE } from "@/constants";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function CountdownSection() {
  const [time, setTime] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const tick = () => {
      const { days, hours, minutes, seconds } = getCountdown(WEDDING_DATE.iso);
      setTime({ days, hours, minutes, seconds });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const units: { label: string; value: number }[] = [
    { label: "Days",    value: time?.days    ?? 0 },
    { label: "Hours",   value: time?.hours   ?? 0 },
    { label: "Minutes", value: time?.minutes ?? 0 },
    { label: "Seconds", value: time?.seconds ?? 0 },
  ];

  return (
    <section
      id="countdown"
      style={{
        backgroundColor: "#FFFDF9",
        padding: "7rem 1.5rem",
        textAlign: "center",
      }}
    >
      {/* Section label */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8, ease: EASE }}
        style={{
          fontFamily: "var(--font-cormorant), Georgia, serif",
          fontSize: "0.62rem",
          letterSpacing: "0.46em",
          color: "#8F6410",
          textTransform: "uppercase",
          marginBottom: "1rem",
        }}
      >
        Counting down to our day
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
        className="divider-gold"
        style={{ maxWidth: "120px", margin: "0 auto 3.5rem" }}
      />

      {/* Countdown digits */}
      <motion.div
        className="flex items-start justify-center flex-wrap"
        style={{ gap: "clamp(1rem, 4vw, 3rem)" }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        {units.map((unit) => (
          <motion.div
            key={unit.label}
            className="flex flex-col items-center"
            variants={{
              hidden: { opacity: 0, y: 32 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
            }}
          >
            {/* Number */}
            <div
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontSize: "clamp(3rem, 8vw, 5.5rem)",
                fontWeight: 300,
                lineHeight: 1,
                color: "#4A403A",
                letterSpacing: "-0.02em",
                minWidth: "clamp(70px, 12vw, 110px)",
                textAlign: "center",
              }}
            >
              {time ? pad(unit.value) : "00"}
            </div>

            {/* Gold divider */}
            <div
              style={{
                height: "1px",
                width: "32px",
                background: "rgba(217,180,65,0.45)",
                margin: "0.75rem auto",
              }}
            />

            {/* Label */}
            <p
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontSize: "0.6rem",
                letterSpacing: "0.36em",
                color: "#796D65",
                textTransform: "uppercase",
              }}
            >
              {unit.label}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Decorative bottom text */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.5 }}
        style={{
          marginTop: "3.5rem",
          fontFamily: "var(--font-cormorant), Georgia, serif",
          fontSize: "clamp(1rem, 3vw, 1.3rem)",
          fontStyle: "italic",
          color: "#796D65",
          letterSpacing: "0.04em",
        }}
      >
        Until we say &ldquo;I do&rdquo;
      </motion.p>
    </section>
  );
}
