"use client";

import { motion } from "framer-motion";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

interface Milestone {
  id: string;
  year: string;
  title: string;
  description: string;
  imageSeed: string;
  imageAspect: string; // "portrait" | "landscape"
}

const MILESTONES: Milestone[] = [
  {
    id: "first-meet",
    year: "2019",
    title: "First Meeting",
    description:
      "A chance encounter that would change everything. Under the soft glow of an autumn evening, two strangers exchanged a glance that sparked a lifetime.",
    imageSeed: "couple1",
    imageAspect: "portrait",
  },
  {
    id: "first-date",
    year: "2020",
    title: "First Date",
    description:
      "A quiet evening over candlelight, where conversations flowed like poetry and time stood perfectly still. Neither wanted the night to end.",
    imageSeed: "couple2",
    imageAspect: "landscape",
  },
  {
    id: "proposal",
    year: "2023",
    title: "The Proposal",
    description:
      "Beneath a thousand stars, with trembling hands and a heart full of certainty, the question was asked — and answered with tears of joy.",
    imageSeed: "couple3",
    imageAspect: "portrait",
  },
  {
    id: "engagement",
    year: "2024",
    title: "Engagement",
    description:
      "Surrounded by family, laughter, and the warmth of those who matter most. An evening of celebration, of promises sealed in gold.",
    imageSeed: "couple4",
    imageAspect: "landscape",
  },
  {
    id: "wedding",
    year: "2026",
    title: "Our Wedding",
    description:
      "And now — the chapter we have been writing together. Two souls becoming one, before God, family, and the world we share.",
    imageSeed: "couple5",
    imageAspect: "portrait",
  },
];

function TimelineImage({ milestone }: { milestone: Milestone }) {
  const isPortrait = milestone.imageAspect === "portrait";
  return (
    <div
      className="img-reveal"
      style={{
        width: "100%",
        aspectRatio: isPortrait ? "3/4" : "4/3",
        overflow: "hidden",
      }}
    >
      <motion.img
        src={`https://picsum.photos/seed/${milestone.imageSeed}/${isPortrait ? "600/800" : "800/600"}`}
        alt={milestone.title}
        loading="lazy"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
        initial={{ scale: 1.08 }}
        whileInView={{ scale: 1.0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 6, ease: "easeOut" }}
      />
    </div>
  );
}

function TimelineItem({
  milestone,
  index,
}: {
  milestone: Milestone;
  index: number;
}) {
  const isLeft = index % 2 === 0;

  return (
    <div className="relative flex items-start" style={{ marginBottom: "clamp(3rem, 8vw, 6rem)" }}>
      {/* Mobile layout — single column */}
      <div className="md:hidden w-full pl-8">
        {/* Mobile dot */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: "1.5rem",
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            border: "1px solid #C9A56D",
            background: "#FFFDF9",
          }}
        />
        <MilestoneContent milestone={milestone} delay={0} />
        <div style={{ marginTop: "1.25rem", maxWidth: "380px" }}>
          <TimelineImage milestone={milestone} />
        </div>
      </div>

      {/* Desktop layout — alternating */}
      <div
        className="hidden md:grid w-full"
        style={{
          gridTemplateColumns: "1fr 80px 1fr",
          alignItems: "center",
          gap: "0",
        }}
      >
        {/* Left slot */}
        <div style={{ paddingRight: "2.5rem", textAlign: isLeft ? "right" : "left" }}>
          {isLeft ? (
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              <MilestoneContent milestone={milestone} delay={0} alignRight />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
              style={{ maxWidth: "340px", marginLeft: "auto" }}
            >
              <TimelineImage milestone={milestone} />
            </motion.div>
          )}
        </div>

        {/* Center — dot */}
        <div className="flex flex-col items-center justify-center">
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              border: "1px solid #C9A56D",
              background: "#FFFDF9",
              boxShadow: "0 0 0 4px rgba(201,165,109,0.12)",
              flexShrink: 0,
            }}
          />
        </div>

        {/* Right slot */}
        <div style={{ paddingLeft: "2.5rem" }}>
          {!isLeft ? (
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              <MilestoneContent milestone={milestone} delay={0} />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
              style={{ maxWidth: "340px" }}
            >
              <TimelineImage milestone={milestone} />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

function MilestoneContent({
  milestone,
  alignRight,
}: {
  milestone: Milestone;
  delay?: number;
  alignRight?: boolean;
}) {
  return (
    <div style={{ textAlign: alignRight ? "right" : "left" }}>
      <p
        style={{
          fontFamily: "var(--font-cormorant), Georgia, serif",
          fontSize: "0.6rem",
          letterSpacing: "0.38em",
          color: "#C9A56D",
          textTransform: "uppercase",
          marginBottom: "0.6rem",
        }}
      >
        {milestone.year}
      </p>
      <h3
        style={{
          fontFamily: "var(--font-cormorant), Georgia, serif",
          fontSize: "clamp(1.4rem, 3.5vw, 2rem)",
          fontWeight: 400,
          color: "#4A403A",
          lineHeight: 1.2,
          marginBottom: "1rem",
        }}
      >
        {milestone.title}
      </h3>
      <div
        style={{
          height: "1px",
          width: "32px",
          background: "rgba(201,165,109,0.4)",
          marginBottom: "1rem",
          marginLeft: alignRight ? "auto" : "0",
        }}
      />
      <p
        style={{
          fontFamily: "var(--font-cormorant), Georgia, serif",
          fontSize: "clamp(0.95rem, 2vw, 1.05rem)",
          fontStyle: "italic",
          lineHeight: 1.7,
          color: "#8A7C73",
        }}
      >
        {milestone.description}
      </p>
    </div>
  );
}

export default function StorySection() {
  return (
    <section
      id="story"
      style={{
        backgroundColor: "#F8F4EF",
        padding: "clamp(4rem, 10vw, 8rem) clamp(1.25rem, 5vw, 3rem)",
      }}
    >
      {/* Section header */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.9, ease: EASE }}
        style={{ marginBottom: "clamp(3rem, 8vw, 6rem)" }}
      >
        <p
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "0.62rem",
            letterSpacing: "0.46em",
            color: "#C9A56D",
            textTransform: "uppercase",
            marginBottom: "1rem",
          }}
        >
          Our journey
        </p>
        <h2
          style={{
            fontFamily: "var(--font-allura), cursive",
            fontSize: "clamp(2.5rem, 7vw, 4.5rem)",
            color: "#4A403A",
            lineHeight: 1.1,
            marginBottom: "1.25rem",
          }}
        >
          Our Story
        </h2>
        <div className="divider-gold" style={{ maxWidth: "100px", margin: "0 auto" }} />
      </motion.div>

      {/* Timeline */}
      <div style={{ maxWidth: "1000px", margin: "0 auto", position: "relative" }}>
        {/* Vertical center line (desktop only) */}
        <div
          className="hidden md:block"
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "1px",
            background:
              "linear-gradient(to bottom, transparent, rgba(201,165,109,0.3) 10%, rgba(201,165,109,0.3) 90%, transparent)",
          }}
        />

        {/* Mobile left line */}
        <div
          className="block md:hidden"
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: "4px",
            width: "1px",
            background: "rgba(201,165,109,0.25)",
          }}
        />

        {MILESTONES.map((milestone, i) => (
          <TimelineItem key={milestone.id} milestone={milestone} index={i} />
        ))}
      </div>
    </section>
  );
}
