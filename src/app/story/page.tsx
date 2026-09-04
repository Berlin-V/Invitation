"use client";

import { motion } from "framer-motion";
import { WEDDING_DATE } from "@/constants";
import BackToHome from "@/components/ui/BackToHome";

const milestones = [
  {
    year: "The Beginning",
    title: "First Glance",
    text: "Every great love story has a beginning. Berlin and Jerlin Ashika's journey started with a moment that neither of them could have predicted — a chance meeting that would change everything.",
    icon: "✨",
    side: "left",
  },
  {
    year: "The Journey",
    title: "Growing Together",
    text: "Through seasons of laughter and quiet moments of understanding, their bond deepened. Two souls discovering in each other a home — a place of comfort, joy, and endless warmth.",
    icon: "🌱",
    side: "right",
  },
  {
    year: "The Promise",
    title: "He Asked, She Said Yes",
    text: "With love in his heart and hope in his eyes, Berlin asked Jerlin Ashika to be his forever. And with a smile that lit up the world, she said yes.",
    icon: "💍",
    side: "left",
  },
  {
    year: WEDDING_DATE.display,
    title: "Forever Begins",
    text: "On this sacred day, surrounded by family and friends who have witnessed their love story, Berlin and Jerlin Ashika will begin their greatest adventure yet — forever, together.",
    icon: "🕊️",
    side: "right",
  },
];

export default function StoryPage() {
  return (
    <div className="min-h-screen pt-20" style={{ background: "linear-gradient(180deg, #080503 0%, #0D0804 100%)" }}>
      <BackToHome href="/#story" />

      {/* Header */}
      <section className="py-20 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(139,26,74,0.1) 0%, transparent 60%)" }} />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
          <p className="font-sans-custom text-[11px] tracking-[0.5em] uppercase text-orange mb-4">A Love Story</p>
          <h1 className="font-script text-6xl md:text-8xl text-orange-gradient mb-6">Our Story</h1>
          <p className="font-serif text-xl text-[#FAF5EE]/60 italic max-w-lg mx-auto leading-relaxed">
            &ldquo;In all the world, there is no heart for me like yours.&rdquo;
          </p>
        </motion.div>
      </section>

      <div className="divider-orange max-w-sm mx-auto mb-20" />

      {/* Timeline */}
      <section className="px-6 max-w-4xl mx-auto pb-24">
        <div className="relative">
          {/* Center line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px hidden md:block"
            style={{ background: "linear-gradient(to bottom, transparent, rgba(201,168,76,0.4), transparent)" }} />

          <div className="space-y-16">
            {milestones.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className={`flex flex-col ${m.side === "right" ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-8`}
              >
                {/* Content */}
                <div className="flex-1">
                  <div className={`glass-card p-8 ${m.side === "right" ? "md:text-right" : ""}`}>
                    <p className="font-sans-custom text-[10px] tracking-[0.4em] uppercase text-orange mb-2">{m.year}</p>
                    <h3 className="font-script text-4xl text-[#FAF5EE] mb-3">{m.title}</h3>
                    <p className="font-serif text-base text-[#FAF5EE]/65 leading-relaxed">{m.text}</p>
                  </div>
                </div>

                {/* Icon node */}
                <div className="flex-shrink-0 flex flex-col items-center">
                  <motion.div
                    className="w-16 h-16 rounded-full border-2 border-orange/50 flex items-center justify-center text-2xl relative z-10"
                    style={{ background: "rgba(201,168,76,0.1)", boxShadow: "0 0 20px rgba(201,168,76,0.15)" }}
                    whileInView={{ scale: [0.8, 1.05, 1] }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    {m.icon}
                  </motion.div>
                </div>

                {/* Spacer for other side */}
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Coming soon note */}
      <section className="py-16 px-6 pb-24 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-lg mx-auto glass-card p-8"
        >
          <p className="text-3xl mb-4">💌</p>
          <h3 className="font-script text-4xl text-orange-gradient mb-3">More to Come</h3>
          <p className="font-sans-custom text-sm text-[#FAF5EE]/52 leading-relaxed">
            The full story of Berlin & Jerlin Ashika — how they met, fell in love, and chose each other — will be shared here soon. Stay tuned for the complete tale.
          </p>
        </motion.div>
      </section>
    </div>
  );
}
