"use client";

import { motion } from "framer-motion";
import { MapPin, Clock, Heart, Church, Star } from "lucide-react";
import { MAPS } from "@/lib/config";

const DAYS = [
  {
    day: "Day One",
    date: "December 9, 2026",
    tagline: "The Celebration Begins",
    events: [
      {
        time: "9:00 AM – 2:00 PM",
        title: "Engagement Ceremony",
        venue: "Bride's Home",
        description: "A joyful gathering to celebrate the promise of forever, surrounded by family and blessings.",
        mapUrl: MAPS.brideHouse,
        icon: Heart,
        accent: "#FAC2BC",
      },
    ],
  },
  {
    day: "Day Two",
    date: "December 10, 2026",
    tagline: "The Sacred Union",
    events: [
      {
        time: "9:00 AM – 2:00 PM",
        title: "Wedding Ceremony",
        venue: "Wedding Church",
        description: "The holy matrimony of Berlin & Jerlin Ashika — vows exchanged in the presence of God and loved ones.",
        mapUrl: MAPS.weddingChurch,
        icon: Church,
        accent: "#E8D5B0",
      },
      {
        time: "5:30 PM – 9:00 PM",
        title: "Reception",
        venue: "Reception Hall",
        description: "An elegant evening reception — dine, dance, and celebrate as we step into our new chapter together.",
        mapUrl: MAPS.receptionHall,
        icon: Star,
        accent: "#C9A56D",
      },
    ],
  },
];

export default function Events() {
  return (
    <section id="events" className="section-pad" style={{ background: "#FFFDF9" }}>
      <div className="max-w-5xl mx-auto px-6">
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
            Save the Date
          </p>
          <h2 style={{ fontFamily: "var(--font-allura), cursive", fontSize: "clamp(2.5rem,7vw,3.8rem)",
            color: "#4A403A" }}>
            Wedding Events
          </h2>
          <div className="divider-gold max-w-[80px] mx-auto mt-5" />
        </motion.div>

        {/* Days */}
        <div className="flex flex-col gap-16">
          {DAYS.map((day, di) => (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.9, delay: di * 0.15 }}
            >
              {/* Day header */}
              <div className="flex items-center gap-4 mb-8">
                <div style={{ width: 32, height: 1, background: "#C9A56D55" }} />
                <div>
                  <span style={{ fontFamily: "var(--font-allura), cursive", fontSize: "2rem",
                    color: "#C9A56D", lineHeight: 1 }}>
                    {day.day}
                  </span>
                  <p style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "0.72rem",
                    letterSpacing: "0.28em", color: "#8A7C73", textTransform: "uppercase", marginTop: 2 }}>
                    {day.date}  ·  {day.tagline}
                  </p>
                </div>
                <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, #C9A56D44, transparent)" }} />
              </div>

              {/* Event cards */}
              <div className={`grid gap-4 ${day.events.length > 1 ? "sm:grid-cols-2" : "max-w-lg"}`}>
                {day.events.map((ev, ei) => {
                  const Icon = ev.icon;
                  return (
                    <motion.div
                      key={ev.title}
                      className="rounded-3xl p-7 group"
                      style={{
                        background: "#F8F4EF",
                        border: "1px solid rgba(201,165,109,0.15)",
                        boxShadow: "0 2px 20px rgba(74,64,58,0.04)",
                      }}
                      whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(74,64,58,0.1)" }}
                      transition={{ duration: 0.3 }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                    >
                      {/* Icon */}
                      <div
                        className="w-11 h-11 rounded-full flex items-center justify-center mb-5"
                        style={{ background: `${ev.accent}30` }}
                      >
                        <Icon size={18} strokeWidth={1.5} color={ev.accent === "#E8D5B0" ? "#C9A56D" : ev.accent} />
                      </div>

                      {/* Time */}
                      <div className="flex items-center gap-2 mb-2">
                        <Clock size={11} color="#C9A56D" strokeWidth={1.5} />
                        <span style={{ fontFamily: "var(--font-cormorant), Georgia, serif",
                          fontSize: "0.72rem", letterSpacing: "0.2em", color: "#C9A56D", textTransform: "uppercase" }}>
                          {ev.time}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "1.5rem",
                        fontWeight: 500, color: "#4A403A", marginBottom: "0.3rem" }}>
                        {ev.title}
                      </h3>

                      {/* Venue */}
                      <div className="flex items-center gap-1.5 mb-4">
                        <MapPin size={11} color="#8A7C73" strokeWidth={1.5} />
                        <span style={{ fontFamily: "var(--font-cormorant), Georgia, serif",
                          fontSize: "0.85rem", fontStyle: "italic", color: "#8A7C73" }}>
                          {ev.venue}
                        </span>
                      </div>

                      <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.82rem",
                        lineHeight: 1.7, color: "#8A7C73", marginBottom: "1.25rem" }}>
                        {ev.description}
                      </p>

                      {/* Directions */}
                      <a
                        href={ev.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 group/link"
                        style={{
                          fontFamily: "var(--font-cormorant), Georgia, serif",
                          fontSize: "0.75rem",
                          letterSpacing: "0.22em",
                          color: "#C9A56D",
                          textTransform: "uppercase",
                          textDecoration: "none",
                          borderBottom: "1px solid rgba(201,165,109,0.3)",
                          paddingBottom: "2px",
                        }}
                      >
                        Get Directions
                        <MapPin size={10} strokeWidth={2} />
                      </a>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
