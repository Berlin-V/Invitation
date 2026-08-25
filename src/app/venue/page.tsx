"use client";

import { motion } from "framer-motion";
import { MapPin, Clock, ArrowUpRight } from "lucide-react";
import { EVENTS, WEDDING_DATE } from "@/lib/config";

const brideEvents = EVENTS.brideSide.items.map((item, i) => ({
  id: ["bride-house", "church"][i],
  subtitle: ["Starting Point", "Sacred Ceremony"][i],
  ...item,
}));

const groomEvents = EVENTS.groomSide.items.map((item, i) => ({
  id: ["groom-house", "reception"][i],
  subtitle: ["Welcome to the Family", "Grand Celebration"][i],
  ...item,
}));

function VenueCard({ event, index }: { event: typeof brideEvents[0]; index: number }) {
  return (
    <motion.div
      id={event.id}
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.15 }}
      className="glass-card overflow-hidden group hover:border-[var(--orange)]/40 transition-all duration-500"
    >
      <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start">
        {/* Icon & time */}
        <div className="flex-shrink-0 text-center">
          <div className="w-16 h-16 rounded-full border border-[var(--orange)]/30 flex items-center justify-center text-3xl mb-2 mx-auto">
            {event.icon}
          </div>
          <div className="flex items-center gap-1.5 text-[var(--orange)]">
            <Clock size={12} />
            <span className="font-sans-custom text-[11px] tracking-widest">{event.time}</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <p className="font-sans-custom text-[10px] tracking-[0.35em] uppercase text-[var(--orange)]/70 mb-1">{event.subtitle}</p>
          <h3 className="font-serif text-2xl text-[#FAF5EE] mb-2">{event.title}</h3>
          <p className="font-sans-custom text-sm text-[#FAF5EE]/55 leading-relaxed mb-4">{event.description}</p>
          <a
            href={event.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-sans-custom text-xs tracking-widest uppercase text-[var(--orange)] border border-[var(--orange)]/40 px-4 py-2 rounded hover:bg-[var(--orange)]/10 transition-all duration-300 group"
          >
            <MapPin size={12} />
            Get Directions
            <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

function EventTimeline({ events, side }: { events: typeof brideEvents; side: "bride" | "groom" }) {
  const colors = side === "bride"
    ? { accent: "#FB923C", glow: "rgba(212,84,122,0.15)" }
    : { accent: "var(--orange)", glow: "rgba(201,168,76,0.15)" };

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-7 md:left-1/2 top-0 bottom-0 w-px"
        style={{ background: `linear-gradient(to bottom, transparent, ${colors.accent}80, transparent)` }} />

      <div className="space-y-6">
        {events.map((ev, i) => (
          <div key={ev.id} className={`flex gap-4 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-start`}>
            {/* Dot */}
            <div className="flex-shrink-0 w-14 flex items-start justify-center pt-6 relative z-10">
              <motion.div
                className="w-3 h-3 rounded-full border-2"
                style={{ backgroundColor: colors.accent, borderColor: colors.accent, boxShadow: `0 0 12px ${colors.glow}` }}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
              />
            </div>
            <div className="flex-1">
              <VenueCard event={ev} index={i} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function VenuePage() {
  return (
    <div className="min-h-screen pt-20" style={{ background: "linear-gradient(180deg, #080503 0%, #0D0804 100%)" }}>
      {/* Header */}
      <section className="py-20 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.06) 0%, transparent 60%)" }} />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <p className="font-sans-custom text-[11px] tracking-[0.5em] uppercase text-[var(--orange)] mb-4">Venue & Directions</p>
          <h1 className="font-script text-6xl md:text-7xl text-orange-gradient mb-4">Find Your Way</h1>
          <p className="font-serif text-lg text-[#FAF5EE]/60 italic max-w-md mx-auto">
            Two families, one celebration — here&apos;s how to join us on {WEDDING_DATE.display}
          </p>
        </motion.div>
      </section>

      <div className="divider-orange max-w-sm mx-auto mb-16" />

      {/* Bride Side */}
      <section id="bride" className="py-12 px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-[#FB923C]/30 mb-4"
            style={{ background: "rgba(212,84,122,0.08)" }}>
            <span className="text-lg">🌸</span>
            <span className="font-sans-custom text-[11px] tracking-widest uppercase text-[#FB923C]">Bride&apos;s Side</span>
          </div>
          <h2 className="font-serif text-3xl text-[#FAF5EE] mb-2">Morning Celebrations</h2>
          <p className="font-sans-custom text-sm text-[#FAF5EE]/50">{EVENTS.brideSide.timeRange} · {WEDDING_DATE.display}</p>
        </motion.div>
        <EventTimeline events={brideEvents} side="bride" />
      </section>

      <div className="divider-orange max-w-sm mx-auto my-16" />

      {/* Groom Side */}
      <section id="groom" className="py-12 px-6 max-w-4xl mx-auto pb-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-[var(--orange)]/30 mb-4"
            style={{ background: "rgba(201,168,76,0.08)" }}>
            <span className="text-lg">✨</span>
            <span className="font-sans-custom text-[11px] tracking-widest uppercase text-[var(--orange)]">Groom&apos;s Side</span>
          </div>
          <h2 className="font-serif text-3xl text-[#FAF5EE] mb-2">Evening Reception</h2>
          <p className="font-sans-custom text-sm text-[#FAF5EE]/50">{EVENTS.groomSide.timeRange} · {WEDDING_DATE.display}</p>
        </motion.div>
        <EventTimeline events={groomEvents} side="groom" />
      </section>

      {/* Full day summary card */}
      <section className="py-12 px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto glass-card p-8 text-center"
          style={{ border: "1px solid rgba(201,168,76,0.25)" }}
        >
          <p className="font-script text-4xl text-orange-gradient mb-6">{WEDDING_DATE.display}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { time: "9 AM", event: "Bride's Home" },
              { time: "~10 AM", event: "Church Ceremony" },
              { time: "5:30 PM", event: "Groom's Home" },
              { time: "~6 PM", event: "Reception" },
            ].map((item, i) => (
              <div key={i}>
                <p className="font-sans-custom text-[11px] tracking-widest text-[var(--orange)] mb-1">{item.time}</p>
                <p className="font-serif text-sm text-[#FAF5EE]/70">{item.event}</p>
              </div>
            ))}
          </div>
          <div className="divider-orange my-6" />
          <p className="font-sans-custom text-xs text-[#FAF5EE]/40 tracking-wide">
            All event timings are approximate. Please arrive 15 minutes early.
          </p>
        </motion.div>
      </section>
    </div>
  );
}
