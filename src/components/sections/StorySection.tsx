"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Heart, MapPinned, X, Compass, LucideIcon } from "lucide-react";

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
}

const MILESTONES: Milestone[] = [
  {
    id: "beginning",
    year: "Grade 3",
    title: "Where It Began",
    description:
      "Two kids joined the same 3rd grade class at Bethlehem Metric Hr. Sec. School, Karungal — and even sat their entrance exam in the very same hall, with no idea what was already being written for them.",
    media: { kind: "illustration", src: "/images/story/entrance_exam.png", alt: "Berlin and Jerlin Ashika as children, sitting their entrance exam" },
  },
  {
    id: "classmates",
    year: "Grade 7",
    title: "Classmates",
    description:
      "By 7th grade, they had become classmates properly — sharing classrooms and school days, still years away from knowing what was quietly taking shape between them.",
    media: { kind: "illustration", src: "/images/story/7th_grade.png", alt: "Berlin and Jerlin Ashika as classmates in 7th grade" },
  },
  {
    id: "first-words",
    year: "Grade 12",
    title: "The First Real Conversation",
    description:
      "It wasn't until 12th grade that they actually spoke for the first time — in the physics lab, during a public lab exam. A simple beginning, in the most unexpected place.",
    media: { kind: "illustration", src: "/images/story/lab.png", alt: "Berlin and Jerlin Ashika's first conversation in the 12th grade lab" },
  },
  {
    id: "whatsapp",
    year: "May 4th",
    title: "Hello, WhatsApp",
    description:
      "Their first real conversation happened over WhatsApp. What began as messages soon turned into deep, late-night calls — both of them quietly falling, neither saying it out loud yet.",
    media: { kind: "icon", icon: MessageCircle },
  },
  {
    id: "confession",
    year: "June 18th",
    title: "She Said It First",
    description:
      "Jerlin Ashika was the braver one — the first to confess her love to Berlin. From that day, what had been unspoken became real.",
    media: { kind: "icon", icon: Heart },
  },
  {
    id: "long-distance",
    year: "3 Years",
    title: "A Long-Distance Love",
    description:
      "Three years of long-distance love followed — no in-person meetings, just calls and messages carrying them through fights, misunderstandings, and everything in between: strangers → schoolmates → classmates → friends → crush → lovers → fiancés.",
    media: { kind: "icon", icon: MapPinned },
  },
  {
    id: "engagement",
    year: "Apr 4, 2026",
    title: "Engaged, on Easter Sunday",
    description: "On Easter Sunday, their long-distance love became a promise for forever.",
    media: { kind: "photo", src: "/images/proposeBJ.jpeg", alt: "Berlin proposing to Jerlin Ashika" },
  },
  {
    id: "wedding",
    year: "Dec 10, 2026",
    title: "Forever Begins",
    description: "And now, a new role and a new beginning await — Berlin and Jerlin Ashika are getting married.",
    media: { kind: "photo", src: "/images/stageClose.jpeg", alt: "Berlin & Jerlin Ashika on stage" },
  },
];

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

// The story stays hidden until tapped — this is the on-map marker only.
function TrailStop({
  milestone,
  index,
  onOpen,
}: {
  milestone: Milestone;
  index: number;
  onOpen: () => void;
}) {
  const { media } = milestone;
  const isLast = index === MILESTONES.length - 1;
  const fromLeft = index % 2 === 0;

  return (
    <motion.div
      className="relative flex items-center"
      style={{ justifyContent: fromLeft ? "flex-start" : "flex-end", marginBottom: index === MILESTONES.length - 1 ? 0 : "1.75rem" }}
      initial={{ opacity: 0, x: fromLeft ? -30 : 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: 0.04 * index, ease: EASE }}
    >
      {/* Trail connector dot, centered */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: isLast ? "#C9A56D" : "#8B5E2E",
          boxShadow: "0 0 0 4px rgba(139,94,46,0.15)",
          zIndex: 1,
        }}
      />

      <button
        onClick={onOpen}
        aria-label={`Reveal: ${milestone.title}`}
        style={{
          width: "44%",
          maxWidth: "230px",
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          textAlign: fromLeft ? "left" : "right",
        }}
      >
        {media.kind === "icon" ? (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              background: "rgba(139,94,46,0.12)",
              border: "1px solid rgba(139,94,46,0.3)",
            }}
          >
            <media.icon size={22} strokeWidth={1.5} color="#6B4A22" />
          </div>
        ) : (
          <img
            src={media.src}
            alt={media.alt}
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              filter: "drop-shadow(0 6px 14px rgba(43,31,18,0.35))",
            }}
          />
        )}
        <p
          style={{
            marginTop: "0.4rem",
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "0.62rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#6B5D53",
          }}
        >
          {milestone.year}
        </p>
      </button>
    </motion.div>
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
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex: 250, background: "rgba(15,12,9,0.8)" }}
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
        style={{
          position: "relative",
          width: "min(94vw, 480px)",
          maxHeight: "90vh",
          overflowY: "auto",
          borderRadius: "6px",
          border: "3px double rgba(139,94,46,0.55)",
          boxShadow: "0 30px 90px rgba(0,0,0,0.55)",
          background:
            "radial-gradient(ellipse at 30% 0%, #FCF6E4, #E8D6AC 55%, #D2BA8A 100%)",
          padding: "2.5rem 1.5rem 2rem",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Roll the map back up"
          style={{
            position: "sticky",
            top: "0",
            float: "right",
            marginTop: "-1.75rem",
            marginRight: "-0.75rem",
            zIndex: 5,
            background: "rgba(74,54,26,0.15)",
            border: "1px solid rgba(139,94,46,0.4)",
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

        {/* Compass rose */}
        <div
          aria-hidden="true"
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "50%",
            border: "1px solid rgba(139,94,46,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "rgba(139,94,46,0.6)",
            margin: "0 auto 1.75rem",
          }}
        >
          <Compass size={18} strokeWidth={1.2} />
        </div>

        {/* Vertical trail line */}
        <div style={{ position: "relative" }}>
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "50%",
              top: 0,
              bottom: 0,
              width: "0",
              borderLeft: "2px dashed rgba(139,94,46,0.5)",
              transform: "translateX(-50%)",
            }}
          />

          {MILESTONES.map((milestone, i) => (
            <TrailStop
              key={milestone.id}
              milestone={milestone}
              index={i}
              onOpen={() => setOpenId(milestone.id)}
            />
          ))}
        </div>
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
