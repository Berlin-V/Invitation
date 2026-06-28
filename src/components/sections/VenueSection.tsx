"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { EVENTS } from "@/constants";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

const VENUES = [
  { ...EVENTS.brideSide.items[0], group: EVENTS.brideSide.label },
  { ...EVENTS.brideSide.items[1], group: EVENTS.brideSide.label },
  { ...EVENTS.groomSide.items[0], group: EVENTS.groomSide.label },
  { ...EVENTS.groomSide.items[1], group: EVENTS.groomSide.label },
];

type Venue = (typeof VENUES)[0];

function VenueCard({ venue, index }: { venue: Venue; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.85, delay: index * 0.1, ease: EASE }}
      style={{
        flex: "1 1 280px",
        maxWidth: "430px",
        border: "1px solid rgba(201,165,109,0.2)",
        background: "#FFFDF9",
        padding: "clamp(1.5rem, 4vw, 2.25rem)",
        position: "relative",
      }}
    >
      {/* Top accent */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "1.5rem",
          right: "1.5rem",
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, rgba(201,165,109,0.55), transparent)",
        }}
      />

      {/* Side label */}
      <p
        style={{
          fontFamily: "var(--font-cormorant), Georgia, serif",
          fontSize: "0.56rem",
          letterSpacing: "0.38em",
          color: "rgba(201,165,109,0.65)",
          textTransform: "uppercase",
          marginBottom: "0.75rem",
        }}
      >
        {venue.group}
      </p>

      {/* Icon + title */}
      <div className="flex items-center gap-3" style={{ marginBottom: "0.75rem" }}>
        <span style={{ fontSize: "1.5rem", lineHeight: 1 }}>{venue.icon}</span>
        <h3
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "clamp(1.1rem, 2.6vw, 1.4rem)",
            fontWeight: 400,
            color: "#4A403A",
            lineHeight: 1.2,
          }}
        >
          {venue.title}
        </h3>
      </div>

      {/* Time */}
      <p
        style={{
          fontFamily: "var(--font-cormorant), Georgia, serif",
          fontSize: "0.68rem",
          letterSpacing: "0.22em",
          color: "#C9A56D",
          textTransform: "uppercase",
          marginBottom: "1rem",
        }}
      >
        {venue.time}
      </p>

      {/* Divider */}
      <div
        style={{
          height: "1px",
          width: "24px",
          background: "rgba(201,165,109,0.35)",
          marginBottom: "1rem",
        }}
      />

      {/* Description */}
      <p
        style={{
          fontFamily: "var(--font-cormorant), Georgia, serif",
          fontSize: "0.9rem",
          fontStyle: "italic",
          lineHeight: 1.7,
          color: "#8A7C73",
          marginBottom: "1.5rem",
        }}
      >
        {venue.description}
      </p>

      {/* Directions */}
      <a
        href={venue.mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5"
        style={{
          fontFamily: "var(--font-cormorant), Georgia, serif",
          fontSize: "0.62rem",
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: "#C9A56D",
          textDecoration: "none",
          borderBottom: "1px solid rgba(201,165,109,0.35)",
          paddingBottom: "2px",
          transition: "color 0.25s ease, border-color 0.25s ease",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLAnchorElement;
          el.style.color = "#A8854A";
          el.style.borderColor = "#A8854A";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLAnchorElement;
          el.style.color = "#C9A56D";
          el.style.borderColor = "rgba(201,165,109,0.35)";
        }}
      >
        <MapPin size={11} strokeWidth={1.5} />
        Get Directions
      </a>
    </motion.div>
  );
}

export default function VenueSection() {
  return (
    <section
      id="venue"
      style={{
        backgroundColor: "#F8F4EF",
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
          Where it all happens
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
          Locations
        </h2>
        <div className="divider-gold" style={{ maxWidth: "100px", margin: "0 auto" }} />
      </motion.div>

      {/* 2×2 venue grid */}
      <div
        className="flex flex-wrap justify-center"
        style={{
          gap: "clamp(1rem, 3vw, 1.75rem)",
          maxWidth: "920px",
          margin: "0 auto",
        }}
      >
        {VENUES.map((venue, i) => (
          <VenueCard key={`${venue.group}-${venue.title}`} venue={venue} index={i} />
        ))}
      </div>
    </section>
  );
}
