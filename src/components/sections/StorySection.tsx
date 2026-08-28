"use client";

import { motion } from "framer-motion";
import { MessageCircle, Heart, MapPinned, LucideIcon } from "lucide-react";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

type Media =
  | { kind: "illustration"; src: string; alt: string; w: number; h: number }
  | { kind: "photo"; src: string; alt: string; w: number; h: number }
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
    media: {
      kind: "illustration",
      src: "/images/story/entrance_exam.png",
      alt: "Berlin and Jerlin Ashika as children, sitting their entrance exam at Bethlehem Metric Hr. Sec. School",
      w: 1536,
      h: 1024,
    },
  },
  {
    id: "classmates",
    year: "Grade 7",
    title: "Classmates",
    description:
      "By 7th grade, they had become classmates properly — sharing classrooms and school days, still years away from knowing what was quietly taking shape between them.",
    media: {
      kind: "illustration",
      src: "/images/story/7th_grade.png",
      alt: "Berlin and Jerlin Ashika as classmates in 7th grade",
      w: 1402,
      h: 1122,
    },
  },
  {
    id: "first-words",
    year: "Grade 12",
    title: "The First Real Conversation",
    description:
      "It wasn't until 12th grade that they actually spoke for the first time — in the physics lab, during a public lab exam. A simple beginning, in the most unexpected place.",
    media: {
      kind: "illustration",
      src: "/images/story/lab.png",
      alt: "Berlin and Jerlin Ashika's first conversation in the 12th grade lab",
      w: 1536,
      h: 1024,
    },
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
    description:
      "On Easter Sunday, their long-distance love became a promise for forever.",
    media: {
      kind: "photo",
      src: "/images/proposeBJ.jpeg",
      alt: "Berlin proposing to Jerlin Ashika",
      w: 4082,
      h: 5429,
    },
  },
  {
    id: "wedding",
    year: "Dec 10, 2026",
    title: "Forever Begins",
    description:
      "And now, a new role and a new beginning await — Berlin and Jerlin Ashika are getting married.",
    media: {
      kind: "photo",
      src: "/images/stageClose.jpeg",
      alt: "Berlin & Jerlin Ashika on stage",
      w: 4082,
      h: 6123,
    },
  },
];

function TimelineImage({ media }: { media: Media }) {
  if (media.kind === "icon") {
    const Icon = media.icon;
    return (
      <div
        className="img-reveal flex items-center justify-center"
        style={{
          width: "100%",
          aspectRatio: "4/3",
          borderRadius: "14px",
          background: "linear-gradient(145deg, rgba(20,16,12,0.92), rgba(42,31,20,0.92))",
          border: "1px solid rgba(201,165,109,0.25)",
        }}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(201,165,109,0.12)",
            border: "1px solid rgba(201,165,109,0.4)",
          }}
        >
          <Icon size={26} strokeWidth={1.4} color="#E8D5B0" />
        </motion.div>
      </div>
    );
  }

  const isIllustration = media.kind === "illustration";
  return (
    <div
      className="img-reveal"
      style={{
        width: "100%",
        aspectRatio: isIllustration ? "4/3" : "3/4",
        overflow: "hidden",
        borderRadius: "14px",
        background: isIllustration
          ? "linear-gradient(145deg, rgba(20,16,12,0.96), rgba(42,31,20,0.96))"
          : undefined,
        border: isIllustration ? "1px solid rgba(201,165,109,0.25)" : undefined,
        display: isIllustration ? "flex" : undefined,
        alignItems: isIllustration ? "center" : undefined,
        justifyContent: isIllustration ? "center" : undefined,
        padding: isIllustration ? "0.75rem" : undefined,
      }}
    >
      <motion.img
        src={media.src}
        alt={media.alt}
        loading="lazy"
        style={{
          width: "100%",
          height: "100%",
          objectFit: isIllustration ? "contain" : "cover",
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
          <TimelineImage media={milestone.media} />
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
              <TimelineImage media={milestone.media} />
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
              <TimelineImage media={milestone.media} />
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
