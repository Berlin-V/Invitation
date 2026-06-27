"use client";

import { motion } from "framer-motion";

const MILESTONES = [
  {
    year: "2018",
    title: "First Meeting",
    subtitle: "Where it all began",
    body: "A chance encounter that neither of us could have anticipated. The moment we met, something quietly shifted.",
    icon: "✦",
  },
  {
    year: "2019",
    title: "Friendship",
    subtitle: "Growing closer",
    body: "Laughter, late-night conversations, and the slow realization that friendship had quietly become something deeper.",
    icon: "◆",
  },
  {
    year: "2022",
    title: "Together",
    subtitle: "The beginning",
    body: "We chose each other — not by accident, but with intention. Every day since has felt like a gift.",
    icon: "♥",
  },
  {
    year: "2024",
    title: "The Proposal",
    subtitle: "He asked, she said yes",
    body: "Under a sky full of quiet stars, with a ring and a trembling voice — one question that changed everything.",
    icon: "◇",
  },
  {
    year: "2025",
    title: "Engagement",
    subtitle: "Forever engaged",
    body: "Surrounded by those who love us most, we celebrated the beginning of our forever — laughing, dancing, glowing.",
    icon: "❋",
  },
  {
    year: "2026",
    title: "Wedding",
    subtitle: "December 9–10",
    body: "Now we stand at the threshold of the rest of our lives, and we couldn't be more ready.",
    icon: "◈",
  },
];

export default function Story() {
  return (
    <section id="story" className="section-pad" style={{ background: "#F8F4EF" }}>
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
        >
          <p style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "0.72rem",
            letterSpacing: "0.42em", color: "#C9A56D", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            Our Journey
          </p>
          <h2 style={{ fontFamily: "var(--font-allura), cursive", fontSize: "clamp(2.5rem,7vw,3.8rem)",
            color: "#4A403A" }}>
            Our Story
          </h2>
          <div className="divider-gold max-w-[80px] mx-auto mt-5" />
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Center line */}
          <div
            className="absolute left-1/2 top-0 bottom-0 hidden md:block"
            style={{ width: 1, background: "linear-gradient(to bottom, transparent, #C9A56D55, #C9A56D55, transparent)", transform: "translateX(-50%)" }}
          />

          <div className="flex flex-col gap-10">
            {MILESTONES.map((m, i) => {
              const isLeft = i % 2 === 0;
              return (
                <motion.div
                  key={m.year}
                  className="relative flex items-center"
                  initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  {/* Left side (even) */}
                  <div className={`flex-1 ${isLeft ? "md:pr-12 text-right" : "md:invisible"}`}>
                    {isLeft && (
                      <TimelineCard m={m} align="right" />
                    )}
                  </div>

                  {/* Center dot */}
                  <div
                    className="hidden md:flex items-center justify-center shrink-0"
                    style={{ width: 40, height: 40, zIndex: 2 }}
                  >
                    <div style={{
                      width: 10, height: 10,
                      borderRadius: "50%",
                      background: "#C9A56D",
                      boxShadow: "0 0 0 4px #F8F4EF, 0 0 0 5px rgba(201,165,109,0.3)",
                    }} />
                  </div>

                  {/* Right side (odd) */}
                  <div className={`flex-1 ${!isLeft ? "md:pl-12 text-left" : "md:invisible"}`}>
                    {!isLeft && (
                      <TimelineCard m={m} align="left" />
                    )}
                  </div>

                  {/* Mobile: full width */}
                  <div className="md:hidden absolute inset-0 flex items-center">
                    <div className="w-full pl-6 border-l-2" style={{ borderColor: "rgba(201,165,109,0.3)" }}>
                      <TimelineCard m={m} align="left" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineCard({ m, align }: { m: typeof MILESTONES[0]; align: "left" | "right" }) {
  return (
    <div
      className="inline-block max-w-xs p-6 rounded-2xl"
      style={{
        background: "#FFFDF9",
        border: "1px solid rgba(201,165,109,0.18)",
        boxShadow: "0 4px 24px rgba(74,64,58,0.06)",
        textAlign: align === "right" ? "right" : "left",
      }}
    >
      <div className="flex items-center gap-2 mb-2" style={{ justifyContent: align === "right" ? "flex-end" : "flex-start" }}>
        <span style={{ color: "#C9A56D", fontSize: "0.7rem" }}>{m.icon}</span>
        <span style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "0.7rem",
          letterSpacing: "0.3em", color: "#C9A56D", textTransform: "uppercase" }}>
          {m.year}
        </span>
      </div>
      <h3 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "1.35rem",
        fontWeight: 500, color: "#4A403A", marginBottom: "0.2rem" }}>
        {m.title}
      </h3>
      <p style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "0.82rem",
        fontStyle: "italic", color: "#C9A56D", marginBottom: "0.75rem" }}>
        {m.subtitle}
      </p>
      <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.82rem",
        lineHeight: 1.7, color: "#8A7C73" }}>
        {m.body}
      </p>
    </div>
  );
}
