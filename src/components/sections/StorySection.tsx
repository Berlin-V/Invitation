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
  x: number;
  y: number;
  rotate: number;
}

const MILESTONES: Milestone[] = [
  {
    id: "beginning",
    year: "Grade 3",
    title: "Where It Began",
    description:
      "Two kids joined the same 3rd grade class at Bethlehem Metric Hr. Sec. School, Karungal — and even sat their entrance exam in the very same hall, with no idea what was already being written for them.",
    media: { kind: "illustration", src: "/images/story/entrance_exam.png", alt: "Berlin and Jerlin Ashika as children, sitting their entrance exam" },
    x: 13,
    y: 13,
    rotate: -6,
  },
  {
    id: "classmates",
    year: "Grade 7",
    title: "Classmates",
    description:
      "By 7th grade, they had become classmates properly — sharing classrooms and school days, still years away from knowing what was quietly taking shape between them.",
    media: { kind: "illustration", src: "/images/story/7th_grade.png", alt: "Berlin and Jerlin Ashika as classmates in 7th grade" },
    x: 72,
    y: 8,
    rotate: 5,
  },
  {
    id: "first-words",
    year: "Grade 12",
    title: "The First Real Conversation",
    description:
      "It wasn't until 12th grade that they actually spoke for the first time — in the physics lab, during a public lab exam. A simple beginning, in the most unexpected place.",
    media: { kind: "illustration", src: "/images/story/lab.png", alt: "Berlin and Jerlin Ashika's first conversation in the 12th grade lab" },
    x: 40,
    y: 24,
    rotate: -4,
  },
  {
    id: "whatsapp",
    year: "May 4th",
    title: "Hello, WhatsApp",
    description:
      "Their first real conversation happened over WhatsApp. What began as messages soon turned into deep, late-night calls — both of them quietly falling, neither saying it out loud yet.",
    media: { kind: "icon", icon: MessageCircle },
    x: 87,
    y: 29,
    rotate: 4,
  },
  {
    id: "confession",
    year: "June 18th",
    title: "She Said It First",
    description:
      "Jerlin Ashika was the braver one — the first to confess her love to Berlin. From that day, what had been unspoken became real.",
    media: { kind: "icon", icon: Heart },
    x: 15,
    y: 44,
    rotate: -3,
  },
  {
    id: "long-distance",
    year: "3 Years",
    title: "A Long-Distance Love",
    description:
      "Three years of long-distance love followed — no in-person meetings, just calls and messages carrying them through fights, misunderstandings, and everything in between: strangers → schoolmates → classmates → friends → crush → lovers → fiancés.",
    media: { kind: "icon", icon: MapPinned },
    x: 60,
    y: 48,
    rotate: 5,
  },
  {
    id: "engagement",
    year: "Apr 4, 2026",
    title: "Engaged, on Easter Sunday",
    description: "On Easter Sunday, their long-distance love became a promise for forever.",
    media: { kind: "photo", src: "/images/proposeBJ.jpeg", alt: "Berlin proposing to Jerlin Ashika" },
    x: 82,
    y: 63,
    rotate: -5,
  },
  {
    id: "wedding",
    year: "Dec 10, 2026",
    title: "Forever Begins",
    description: "And now, a new role and a new beginning await — Berlin and Jerlin Ashika are getting married.",
    media: { kind: "photo", src: "/images/stageClose.jpeg", alt: "Berlin & Jerlin Ashika on stage" },
    x: 33,
    y: 82,
    rotate: 3,
  },
];

// A winding dotted route through every waypoint, in the same 0–100 percent
// coordinate space as MILESTONES x/y (the <svg> stretches to match).
const TRAIL_PATH =
  "M13,13 C45,4 58,2 72,8 C50,10 30,16 40,24 C64,20 82,22 87,29 C55,32 22,36 15,44 C35,52 50,44 60,48 C74,54 84,58 82,63 C60,68 40,72 33,82";

// Generic torn-parchment silhouette — a fixed set of jagged points around a
// 0–100 box, applied as a clip-path so the map reads as weathered paper
// rather than a clean rectangle.
const TORN_EDGE_CLIP =
  "polygon(2% 3%, 9% 0%, 18% 2%, 27% 0%, 38% 2%, 49% 0%, 60% 2%, 71% 0%, 82% 2%, 92% 0%, 100% 4%, 98% 14%, 100% 24%, 97% 34%, 100% 45%, 98% 56%, 100% 67%, 97% 78%, 100% 89%, 96% 97%, 88% 99%, 78% 97%, 68% 100%, 57% 97%, 46% 100%, 35% 97%, 24% 100%, 13% 97%, 3% 99%, 0% 90%, 3% 79%, 0% 68%, 3% 57%, 0% 46%, 3% 35%, 0% 24%, 3% 13%, 0% 5%)";

const RIBBON_CLIP = "polygon(3% 50%, 0% 0%, 100% 0%, 97% 50%, 100% 100%, 0% 100%)";

function Ribbon({ children, tone = "dark" }: { children: React.ReactNode; tone?: "dark" | "gold" }) {
  return (
    <div
      style={{
        clipPath: RIBBON_CLIP,
        background: tone === "gold" ? "linear-gradient(135deg, #C9A56D, #8B5E2E)" : "rgba(58,40,20,0.92)",
        padding: "0.35rem 0.9rem",
        boxShadow: "0 3px 8px rgba(43,31,18,0.35)",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-cormorant), Georgia, serif",
          fontSize: "0.6rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#FFF6E5",
          whiteSpace: "nowrap",
        }}
      >
        {children}
      </span>
    </div>
  );
}

function CompassRose() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" aria-hidden="true">
      <circle cx="26" cy="26" r="22" fill="none" stroke="rgba(107,74,34,0.55)" strokeWidth="1" />
      <circle cx="26" cy="26" r="16" fill="none" stroke="rgba(107,74,34,0.4)" strokeWidth="0.6" />
      {[0, 90, 180, 270].map((angle) => (
        <polygon
          key={angle}
          points="26,6 29,26 26,24 23,26"
          fill="rgba(107,74,34,0.75)"
          transform={`rotate(${angle} 26 26)`}
        />
      ))}
      {[45, 135, 225, 315].map((angle) => (
        <polygon
          key={angle}
          points="26,12 27.6,26 26,24.6 24.4,26"
          fill="rgba(107,74,34,0.4)"
          transform={`rotate(${angle} 26 26)`}
        />
      ))}
      <text x="26" y="8" textAnchor="middle" fontSize="6" fill="#4A2E08" fontFamily="Georgia, serif">N</text>
      <text x="26" y="49" textAnchor="middle" fontSize="6" fill="#4A2E08" fontFamily="Georgia, serif">S</text>
      <text x="4" y="28.5" textAnchor="middle" fontSize="6" fill="#4A2E08" fontFamily="Georgia, serif">W</text>
      <text x="48" y="28.5" textAnchor="middle" fontSize="6" fill="#4A2E08" fontFamily="Georgia, serif">E</text>
    </svg>
  );
}

// ── Rolled scroll — the closed state that invites a tap ─────────────────────
function RolledScroll({ onOpen }: { onOpen: () => void }) {
  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: EASE }}
    >
      <motion.button
        onClick={onOpen}
        aria-label="Open the map to reveal our story"
        animate={{ y: [0, -14, 0], rotate: [0, -2, 2, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.94 }}
        style={{
          width: "min(88vw, 380px)",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          filter: "drop-shadow(0 18px 30px rgba(74,54,26,0.32))",
        }}
      >
        <img
          src="/images/story/scroll.png"
          alt="A rolled, sealed scroll"
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </motion.button>

      <p
        style={{
          marginTop: "1.25rem",
          fontFamily: "var(--font-cormorant), Georgia, serif",
          fontSize: "0.85rem",
          fontStyle: "italic",
          color: "rgba(74,64,58,0.6)",
        }}
      >
        Tap the seal to unroll our story
      </p>
    </motion.div>
  );
}

function MarkerArt({ milestone }: { milestone: Milestone }) {
  const { media } = milestone;
  if (media.kind === "icon") {
    const Icon = media.icon;
    return (
      <div
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          background: "rgba(58,40,20,0.85)",
          border: "2px solid rgba(255,246,229,0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 10px rgba(43,31,18,0.4)",
        }}
      >
        <Icon size={18} strokeWidth={1.6} color="#FFF6E5" />
      </div>
    );
  }
  // No frame, no crop — the picture exactly as it is, just resting on the map.
  return (
    <img
      src={media.src}
      alt=""
      style={{
        maxWidth: "110px",
        maxHeight: "100px",
        width: "auto",
        height: "auto",
        display: "block",
        filter: "drop-shadow(0 5px 10px rgba(43,31,18,0.4))",
      }}
    />
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
        transform: `translate(-50%, -50%) rotate(${milestone.rotate}deg)`,
        zIndex: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.3rem",
      }}
    >
      {isLast ? (
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
          style={{ position: "relative", background: "none", border: "none", cursor: "pointer", padding: "10px" }}
        >
          <motion.span
            aria-hidden="true"
            className="absolute inset-0"
            style={{ borderRadius: "50%", border: "1.5px dashed rgba(201,165,109,0.7)" }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0, 0.7] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
          />
          <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
            <path d="M4 4 L30 30 M30 4 L4 30" stroke="#8B1E14" strokeWidth="5" strokeLinecap="round" />
          </svg>
        </motion.button>
      ) : (
        <motion.button
          onClick={onOpen}
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.06, ease: EASE }}
          animate={{ scale: hovered ? 1.12 : 1 }}
          aria-label={`Reveal: ${milestone.title}`}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          <MarkerArt milestone={milestone} />
        </motion.button>
      )}

      <Ribbon tone={isLast ? "gold" : "dark"}>{milestone.year}</Ribbon>
    </div>
  );
}

function MemoryCard({ milestone, onClose }: { milestone: Milestone; onClose: () => void }) {
  const { media } = milestone;

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex: 300, background: "rgba(15,12,9,0.78)" }}
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
          position: "relative",
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
            zIndex: 1,
          }}
        >
          <X size={15} strokeWidth={1.5} />
        </button>

        {/* Frameless — the image itself, no boxed background */}
        {media.kind !== "icon" && (
          <img
            src={media.src}
            alt={media.alt}
            style={{
              width: "100%",
              maxHeight: "45vh",
              objectFit: "contain",
              display: "block",
              margin: "0 auto 1.1rem",
            }}
          />
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

function TreasureMap({ onClose }: { onClose: () => void }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const openMilestone = MILESTONES.find((m) => m.id === openId) ?? null;

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center p-0 sm:p-4"
      style={{ zIndex: 250, background: "rgba(15,12,9,0.82)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.4, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
        className="w-screen h-[100dvh] sm:w-[min(95vw,680px)] sm:h-auto sm:max-h-[92vh] sm:aspect-[680/620]"
        style={{
          position: "relative",
          clipPath: TORN_EDGE_CLIP,
          boxShadow: "0 30px 90px rgba(0,0,0,0.55)",
          background:
            "radial-gradient(ellipse at 25% 15%, #FBF3DC 0%, #EFDDB0 40%, #D8BE86 75%, #B8996B 100%)",
        }}
      >
        {/* Aged grain */}
        <svg aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", mixBlendMode: "multiply" }}>
          <filter id="story-map-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#story-map-grain)" opacity="0.08" />
        </svg>

        <button
          onClick={onClose}
          aria-label="Roll the map back up"
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            zIndex: 10,
            background: "rgba(74,54,26,0.18)",
            border: "1px solid rgba(139,94,46,0.45)",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#4A2E08",
          }}
        >
          <X size={16} strokeWidth={1.5} />
        </button>

        {/* Title banner */}
        <div style={{ position: "absolute", top: "1.2rem", left: "1.2rem", zIndex: 4 }}>
          <div
            style={{
              clipPath: RIBBON_CLIP,
              background: "linear-gradient(135deg, #C9A56D, #8B5E2E)",
              padding: "0.6rem 1.4rem",
              boxShadow: "0 4px 12px rgba(43,31,18,0.4)",
            }}
          >
            <p style={{ fontFamily: "var(--font-allura), cursive", fontSize: "1.5rem", color: "#FFF6E5", lineHeight: 1 }}>
              Our Story
            </p>
          </div>
        </div>

        {/* Compass rose */}
        <div style={{ position: "absolute", top: "1.1rem", right: "3.2rem", zIndex: 4 }}>
          <CompassRose />
        </div>

        {/* Route */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          aria-hidden="true"
        >
          <path
            d={TRAIL_PATH}
            fill="none"
            stroke="#8B1E14"
            strokeOpacity="0.55"
            strokeWidth="1"
            strokeDasharray="0.4 2.2"
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
      </motion.div>

      <AnimatePresence>
        {openMilestone && (
          <MemoryCard milestone={openMilestone} onClose={() => setOpenId(null)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function StorySection() {
  const [mapOpen, setMapOpen] = useState(false);

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
        style={{ marginBottom: "clamp(2.5rem, 6vw, 4rem)" }}
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

      <RolledScroll onOpen={() => setMapOpen(true)} />

      <AnimatePresence>
        {mapOpen && <TreasureMap onClose={() => setMapOpen(false)} />}
      </AnimatePresence>
    </section>
  );
}
