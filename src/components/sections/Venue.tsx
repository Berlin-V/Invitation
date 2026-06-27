"use client";

import { motion } from "framer-motion";
import { MapPin, Navigation } from "lucide-react";
import { MAPS } from "@/lib/config";

const VENUES = [
  {
    name: "Bride's Home",
    time: "December 9 · 9:00 AM",
    note: "Engagement Ceremony",
    mapUrl: MAPS.brideHouse,
  },
  {
    name: "Wedding Church",
    time: "December 10 · 9:00 AM",
    note: "Holy Matrimony",
    mapUrl: MAPS.weddingChurch,
  },
  {
    name: "Groom's Home",
    time: "December 10 · 5:30 PM",
    note: "Groom's Celebration",
    mapUrl: MAPS.groomHouse,
  },
  {
    name: "Reception Hall",
    time: "December 10 · 6:00 PM",
    note: "Evening Reception",
    mapUrl: MAPS.receptionHall,
  },
];

export default function Venue() {
  return (
    <section id="venue" className="section-pad" style={{ background: "#FFFDF9" }}>
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
        >
          <p style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "0.72rem",
            letterSpacing: "0.42em", color: "#C9A56D", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            Find Us
          </p>
          <h2 style={{ fontFamily: "var(--font-allura), cursive", fontSize: "clamp(2.5rem,7vw,3.8rem)",
            color: "#4A403A" }}>
            Venue & Directions
          </h2>
          <div className="divider-gold max-w-[80px] mx-auto mt-5" />
        </motion.div>

        {/* Embedded map - shows wedding church as primary */}
        <motion.div
          className="w-full rounded-3xl overflow-hidden mb-12"
          style={{
            height: 400,
            border: "1px solid rgba(201,165,109,0.2)",
            boxShadow: "0 8px 40px rgba(74,64,58,0.08)",
          }}
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
        >
          <iframe
            src="https://maps.google.com/maps?q=Tamil+Nadu,+India&z=10&output=embed"
            width="100%"
            height="100%"
            style={{ border: "none", filter: "saturate(0.7) contrast(1.05)" }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Wedding Venue Map"
          />
        </motion.div>

        {/* Venue cards */}
        <div className="grid sm:grid-cols-2 gap-4">
          {VENUES.map((v, i) => (
            <motion.a
              key={v.name}
              href={v.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-4 p-6 rounded-2xl no-underline"
              style={{
                background: "#F8F4EF",
                border: "1px solid rgba(201,165,109,0.15)",
                textDecoration: "none",
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              whileHover={{ y: -3, boxShadow: "0 12px 40px rgba(74,64,58,0.08)" }}
            >
              {/* Pin icon */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: "rgba(201,165,109,0.12)" }}
              >
                <MapPin size={16} color="#C9A56D" strokeWidth={1.5} />
              </div>

              <div className="flex-1 min-w-0">
                <p style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "0.7rem",
                  letterSpacing: "0.25em", color: "#C9A56D", textTransform: "uppercase", marginBottom: "0.3rem" }}>
                  {v.note}
                </p>
                <h3 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "1.2rem",
                  fontWeight: 500, color: "#4A403A", marginBottom: "0.3rem" }}>
                  {v.name}
                </h3>
                <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.78rem",
                  color: "#8A7C73" }}>
                  {v.time}
                </p>
              </div>

              {/* Arrow */}
              <Navigation
                size={16}
                color="#C9A56D"
                strokeWidth={1.5}
                className="shrink-0 opacity-50 group-hover:opacity-100 transition-opacity mt-1"
              />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
