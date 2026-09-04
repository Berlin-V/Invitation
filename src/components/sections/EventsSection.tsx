"use client";

import { motion } from "framer-motion";
import { MapPin, Clock } from "lucide-react";
import { EVENTS, WEDDING_DATE } from "@/constants";
import { EASE } from "@/constants/motion";

type EventItem = (typeof EVENTS.brideSide.items)[0];
type EventGroup = typeof EVENTS.brideSide;

function SubEvent({ item, index }: { item: EventItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: EASE }}
      style={{
        borderTop: index > 0 ? "1px solid rgba(217,180,65,0.18)" : "none",
        paddingTop: index > 0 ? "1.4rem" : 0,
        marginTop: index > 0 ? "1.4rem" : 0,
      }}
    >
      {/* Time */}
      <div className="flex items-center gap-2" style={{ marginBottom: "0.45rem" }}>
        <Clock size={11} strokeWidth={1.5} style={{ color: "#8F6410", flexShrink: 0 }} />
        <span
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "0.65rem",
            letterSpacing: "0.24em",
            color: "#8F6410",
            textTransform: "uppercase",
          }}
        >
          {item.time}
        </span>
      </div>

      {/* Icon + title */}
      <div className="flex items-center gap-2.5" style={{ marginBottom: "0.6rem" }}>
        <span style={{ fontSize: "1.05rem", lineHeight: 1 }}>{item.icon}</span>
        <h4
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "clamp(1.05rem, 2.4vw, 1.35rem)",
            fontWeight: 400,
            color: "#4A403A",
            lineHeight: 1.2,
          }}
        >
          {item.title}
        </h4>
      </div>

      {/* Description */}
      <p
        style={{
          fontFamily: "var(--font-cormorant), Georgia, serif",
          fontSize: "0.9rem",
          fontStyle: "italic",
          lineHeight: 1.7,
          color: "#796D65",
          marginBottom: "1rem",
        }}
      >
        {item.description}
      </p>

      {/* Directions link */}
      <a
        href={item.mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5"
        style={{
          fontFamily: "var(--font-cormorant), Georgia, serif",
          fontSize: "0.62rem",
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: "#8F6410",
          textDecoration: "none",
          borderBottom: "1px solid rgba(217,180,65,0.35)",
          paddingBottom: "2px",
          transition: "color 0.25s ease, border-color 0.25s ease",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLAnchorElement;
          el.style.color = "#B08A2E";
          el.style.borderColor = "#B08A2E";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLAnchorElement;
          el.style.color = "#D9B441";
          el.style.borderColor = "rgba(217,180,65,0.35)";
        }}
      >
        <MapPin size={10} strokeWidth={1.5} />
        Get Directions
      </a>
    </motion.div>
  );
}

function GroupPanel({ group, index }: { group: EventGroup; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay: index * 0.15, ease: EASE }}
      style={{
        flex: "1 1 320px",
        maxWidth: "480px",
        background: "#FFFDF9",
        border: "1px solid rgba(217,180,65,0.22)",
        padding: "clamp(1.75rem, 5vw, 2.75rem)",
        position: "relative",
      }}
    >
      {/* Gold top accent */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "2rem",
          right: "2rem",
          height: "1px",
          background: "linear-gradient(90deg, transparent, #D9B441, transparent)",
        }}
      />

      {/* Side label */}
      <p
        style={{
          fontFamily: "var(--font-cormorant), Georgia, serif",
          fontSize: "0.6rem",
          letterSpacing: "0.42em",
          color: "#8F6410",
          textTransform: "uppercase",
          marginBottom: "0.45rem",
        }}
      >
        {group.label}
      </p>

      {/* Date */}
      <h3
        style={{
          fontFamily: "var(--font-cormorant), Georgia, serif",
          fontSize: "clamp(1.3rem, 3vw, 1.65rem)",
          fontWeight: 400,
          color: "#4A403A",
          lineHeight: 1.2,
          marginBottom: "0.4rem",
        }}
      >
        {group.date}
      </h3>

      {/* Time range */}
      <p
        style={{
          fontFamily: "var(--font-cormorant), Georgia, serif",
          fontSize: "0.76rem",
          letterSpacing: "0.14em",
          color: "#796D65",
          marginBottom: "1.75rem",
        }}
      >
        {group.timeRange}
      </p>

      {/* Divider */}
      <div
        style={{
          height: "1px",
          width: "28px",
          background: "rgba(217,180,65,0.4)",
          marginBottom: "1.75rem",
        }}
      />

      {/* Sub-events */}
      <div>
        {group.items.map((item, i) => (
          <SubEvent key={item.title} item={item} index={i} />
        ))}
      </div>
    </motion.div>
  );
}

export default function EventsSection() {
  return (
    <section
      id="events"
      style={{
        backgroundColor: "#FFFDF9",
        padding: "clamp(4rem, 10vw, 8rem) clamp(1.25rem, 5vw, 3rem)",
      }}
    >
      {/* Header */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.9, ease: EASE }}
        style={{ marginBottom: "clamp(3rem, 8vw, 5rem)" }}
      >
        <p
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "0.62rem",
            letterSpacing: "0.46em",
            color: "#8F6410",
            textTransform: "uppercase",
            marginBottom: "1rem",
          }}
        >
          {WEDDING_DATE.display}
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
          Wedding Events
        </h2>
        <div className="divider-gold" style={{ maxWidth: "100px", margin: "0 auto" }} />
      </motion.div>

      {/* Two group panels */}
      <div
        className="flex flex-wrap justify-center"
        style={{ gap: "clamp(1.25rem, 4vw, 2rem)", maxWidth: "1020px", margin: "0 auto" }}
      >
        <GroupPanel group={EVENTS.brideSide} index={0} />
        <GroupPanel group={EVENTS.groomSide} index={1} />
      </div>
    </section>
  );
}
