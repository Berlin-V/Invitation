"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Heart, MapPinned, X, LucideIcon } from "lucide-react";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

type Media =
  | { kind: "illustration"; src: string; alt: string }
  | { kind: "photo"; src: string; alt: string }
  | { kind: "icon"; icon: LucideIcon };

interface Milestone {
  id: string;
  year: string;
  title: string;
  description: string;
  media: Media;
  x: number; // % position on the map
  y: number; // % position on the map
}

const MILESTONES: Milestone[] = [
  {
    id: "beginning",
    year: "Grade 3",
    title: "Where It Began",
    description:
      "Two kids joined the same 3rd grade class at Bethlehem Metric Hr. Sec. School, Karungal — and even sat their entrance exam in the very same hall, with no idea what was already being written for them.",
    media: { kind: "illustration", src: "/images/story/entrance_exam.png", alt: "Berlin and Jerlin Ashika as children, sitting their entrance exam" },
    x: 16,
    y: 7,
  },
  {
    id: "classmates",
    year: "Grade 7",
    title: "Classmates",
    description:
      "By 7th grade, they had become classmates properly — sharing classrooms and school days, still years away from knowing what was quietly taking shape between them.",
    media: { kind: "illustration", src: "/images/story/7th_grade.png", alt: "Berlin and Jerlin Ashika as classmates in 7th grade" },
    x: 62,
    y: 17,
  },
  {
    id: "first-words",
    year: "Grade 12",
    title: "The First Real Conversation",
    description:
      "It wasn't until 12th grade that they actually spoke for the first time — in the physics lab, during a public lab exam. A simple beginning, in the most unexpected place.",
    media: { kind: "illustration", src: "/images/story/lab.png", alt: "Berlin and Jerlin Ashika's first conversation in the 12th grade lab" },
    x: 22,
    y: 30,
  },
  {
    id: "whatsapp",
    year: "May 4th",
    title: "Hello, WhatsApp",
    description:
      "Their first real conversation happened over WhatsApp. What began as messages soon turned into deep, late-night calls — both of them quietly falling, neither saying it out loud yet.",
    media: { kind: "icon", icon: MessageCircle },
    x: 72,
    y: 41,
  },
  {
    id: "confession",
    year: "June 18th",
    title: "She Said It First",
    description:
      "Jerlin Ashika was the braver one — the first to confess her love to Berlin. From that day, what had been unspoken became real.",
    media: { kind: "icon", icon: Heart },
    x: 27,
    y: 53,
  },
  {
    id: "long-distance",
    year: "3 Years",
    title: "A Long-Distance Love",
    description:
      "Three years of long-distance love followed — no in-person meetings, just calls and messages carrying them through fights, misunderstandings, and everything in between: strangers → schoolmates → classmates → friends → crush → lovers → fiancés.",
    media: { kind: "icon", icon: MapPinned },
    x: 68,
    y: 64,
  },
  {
    id: "engagement",
    year: "Apr 4, 2026",
    title: "Engaged, on Easter Sunday",
    description: "On Easter Sunday, their long-distance love became a promise for forever.",
    media: { kind: "photo", src: "/images/proposeBJ.jpeg", alt: "Berlin proposing to Jerlin Ashika" },
    x: 24,
    y: 77,
  },
  {
    id: "wedding",
    year: "Dec 10, 2026",
    title: "Forever Begins",
    description: "And now, a new role and a new beginning await — Berlin and Jerlin Ashika are getting married.",
    media: { kind: "photo", src: "/images/stageClose.jpeg", alt: "Berlin & Jerlin Ashika on stage" },
    x: 58,
    y: 91,
  },
];

// A hand-drawn-feeling trail through every waypoint. Coordinates are plain
// percentages (0–100) and the <svg> below stretches non-uniformly to match
// the map's actual aspect ratio, so this stays in sync with MILESTONES x/y.
const TRAIL_PATH =
  "M16,7 C36,10 46,13 62,17 C46,21 30,25 22,30 C42,34 62,37 72,41 C54,45 36,48 27,53 C42,57 58,60 68,64 C50,69 34,72 24,77 C36,82 46,86 58,91";

function MarkerBadge({ milestone }: { milestone: Milestone }) {
  const { media } = milestone;
  if (media.kind === "icon") {
    const Icon = media.icon;
    return <Icon size={20} strokeWidth={1.6} color="#FFFDF9" />;
  }
  return (
    <img
      src={media.src}
      alt=""
      style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
    />
  );
}

function MemoryCard({ milestone, onClose }: { milestone: Milestone; onClose: () => void }) {
  const { media } = milestone;
  const isFramed = media.kind !== "icon";

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex: 200, background: "rgba(15,12,9,0.78)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 8 }}
        transition={{ duration: 0.32, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(92vw, 420px)",
          maxHeight: "86vh",
          overflowY: "auto",
          background: "#FFFDF9",
          borderRadius: "18px",
          padding: "1.5rem",
          boxShadow: "0 30px 90px rgba(0,0,0,0.5)",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: "0.9rem",
            right: "0.9rem",
            background: "rgba(74,64,58,0.08)",
            border: "none",
            borderRadius: "50%",
            width: "30px",
            height: "30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#8A7C73",
          }}
        >
          <X size={15} strokeWidth={1.5} />
        </button>

        {isFramed && (
          <div
            style={{
              width: "100%",
              aspectRatio: media.kind === "illustration" ? "4/3" : "3/4",
              borderRadius: "12px",
              overflow: "hidden",
              marginBottom: "1.1rem",
              background:
                media.kind === "illustration"
                  ? "linear-gradient(145deg, #14100c, #2a1f14)"
                  : undefined,
              display: media.kind === "illustration" ? "flex" : undefined,
              alignItems: media.kind === "illustration" ? "center" : undefined,
              justifyContent: media.kind === "illustration" ? "center" : undefined,
              padding: media.kind === "illustration" ? "0.5rem" : undefined,
            }}
          >
            <img
              src={media.src}
              alt={media.alt}
              style={{
                width: "100%",
                height: "100%",
                objectFit: media.kind === "illustration" ? "contain" : "cover",
                display: "block",
              }}
            />
          </div>
        )}

        <p
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "0.62rem",
            letterSpacing: "0.32em",
            color: "#C9A56D",
            textTransform: "uppercase",
            marginBottom: "0.5rem",
          }}
        >
          {milestone.year}
        </p>
        <h3
          style={{
            fontFamily: "var(--font-allura), cursive",
            fontSize: "2rem",
            color: "#4A403A",
            lineHeight: 1.1,
            marginBottom: "0.85rem",
          }}
        >
          {milestone.title}
        </h3>
        <p
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "1rem",
            fontStyle: "italic",
            lineHeight: 1.7,
            color: "#6B5D53",
          }}
        >
          {milestone.description}
        </p>
      </motion.div>
    </motion.div>
  );
}

function Waypoint({
  milestone,
  index,
  onOpen,
}: {
  milestone: Milestone;
  index: number;
  onOpen: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const isLast = index === MILESTONES.length - 1;

  return (
    <div
      style={{
        position: "absolute",
        left: `${milestone.x}%`,
        top: `${milestone.y}%`,
        transform: "translate(-50%, -50%)",
        zIndex: 3,
      }}
    >
      {isLast && (
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{ borderRadius: "50%", border: "1.5px dashed rgba(201,165,109,0.7)" }}
          animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0, 0.7] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
        />
      )}

      <motion.button
        onClick={onOpen}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.06, ease: EASE }}
        animate={{ scale: hovered ? 1.15 : 1 }}
        aria-label={`Reveal: ${milestone.title}`}
        style={{
          position: "relative",
          width: isLast ? "58px" : "48px",
          height: isLast ? "58px" : "48px",
          borderRadius: "50%",
          overflow: "hidden",
          background: isLast
            ? "linear-gradient(145deg, #C9A56D, #8B5E2E)"
            : "linear-gradient(145deg, #3A2C1E, #1C140D)",
          border: `2px solid ${isLast ? "#FFFDF9" : "rgba(255,253,249,0.55)"}`,
          boxShadow: "0 6px 18px rgba(43,31,18,0.35)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
        }}
      >
        <MarkerBadge milestone={milestone} />
      </motion.button>

      {/* Year only — the story stays hidden until tapped */}
      <p
        style={{
          position: "absolute",
          top: "100%",
          left: "50%",
          transform: "translateX(-50%)",
          marginTop: "0.4rem",
          whiteSpace: "nowrap",
          fontFamily: "var(--font-cormorant), Georgia, serif",
          fontSize: "0.62rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#6B5D53",
        }}
      >
        {milestone.year}
      </p>
    </div>
  );
}

export default function StorySection() {
  const [openId, setOpenId] = useState<string | null>(null);
  const openMilestone = MILESTONES.find((m) => m.id === openId) ?? null;

  return (
    <section
      id="story"
      style={{
        backgroundColor: "#EFE6D3",
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
        style={{ marginBottom: "clamp(2rem, 5vw, 3rem)" }}
      >
        <p
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "0.62rem",
            letterSpacing: "0.46em",
            color: "#8B5E2E",
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
        <div className="divider-gold" style={{ maxWidth: "100px", margin: "0 auto 1rem" }} />
        <p
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "0.85rem",
            fontStyle: "italic",
            color: "rgba(74,64,58,0.55)",
          }}
        >
          Tap a marker to uncover the memory.
        </p>
      </motion.div>

      {/* Treasure map */}
      <div
        style={{
          position: "relative",
          maxWidth: "620px",
          margin: "0 auto",
          aspectRatio: "620 / 780",
          borderRadius: "20px",
          overflow: "hidden",
          border: "1px solid rgba(139,94,46,0.3)",
          boxShadow: "0 20px 60px rgba(74,54,26,0.18), inset 0 0 60px rgba(139,94,46,0.1)",
          background:
            "radial-gradient(ellipse at 30% 20%, rgba(255,250,235,0.9), rgba(232,214,172,0.75) 55%, rgba(210,186,138,0.85) 100%)",
        }}
      >
        {/* Subtle parchment grain */}
        <svg aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.5, mixBlendMode: "multiply" }}>
          <filter id="story-map-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#story-map-grain)" opacity="0.05" />
        </svg>

        {/* Trail */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          aria-hidden="true"
        >
          <path
            d={TRAIL_PATH}
            fill="none"
            stroke="rgba(139,94,46,0.55)"
            strokeWidth="0.6"
            strokeDasharray="0.3 2.4"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {MILESTONES.map((milestone, i) => (
          <Waypoint
            key={milestone.id}
            milestone={milestone}
            index={i}
            onOpen={() => setOpenId(milestone.id)}
          />
        ))}
      </div>

      <AnimatePresence>
        {openMilestone && (
          <MemoryCard milestone={openMilestone} onClose={() => setOpenId(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
