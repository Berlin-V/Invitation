"use client";

import { useState, useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import IntroOverlay from "@/components/IntroOverlay";
import CountdownTimer from "@/components/CountdownTimer";
import CelebrationParticles from "@/components/CelebrationParticles";
import Link from "next/link";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18 } },
};

export default function HomePage() {
  const [entered, setEntered] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const visited = sessionStorage.getItem("wedding_visited");
    if (visited) { setEntered(true); setShowContent(true); }
  }, []);

  const handleEnter = () => {
    sessionStorage.setItem("wedding_visited", "1");
    setEntered(true);
    setTimeout(() => setShowContent(true), 800);
  };

  return (
    <>
      {!entered && <IntroOverlay onEnter={handleEnter} />}
      {showContent && <CelebrationParticles count={16} />}

      <div className="relative min-h-screen">
        {/* Video Hero */}
        <section className="relative h-screen overflow-hidden">
          <video
            className="absolute inset-0 w-full h-full object-cover"
            src="/wedding-video.mov"
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="absolute inset-0" style={{
            background: "linear-gradient(to bottom, rgba(26,10,15,0.55) 0%, rgba(26,10,15,0.35) 50%, rgba(26,10,15,0.85) 100%)"
          }} />
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at center, transparent 30%, rgba(26,10,15,0.6) 100%)"
          }} />

          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
            initial="hidden"
            animate={showContent ? "show" : "hidden"}
            variants={stagger}
          >
            <motion.p variants={fadeUp} className="font-sans-custom text-[11px] tracking-[0.5em] uppercase text-[#C9A84C] mb-4">
              Together Forever
            </motion.p>
            <motion.h1 variants={fadeUp} className="font-script text-7xl md:text-9xl leading-tight mb-2">
              <span className="text-gold-gradient">Berlin</span>
            </motion.h1>
            <motion.div variants={fadeUp} className="flex items-center gap-4 my-2">
              <div className="divider-gold w-20" />
              <span className="font-sans-custom text-xs tracking-widest text-[#C9A84C]/70">&amp;</span>
              <div className="divider-gold w-20" />
            </motion.div>
            <motion.h1 variants={fadeUp} className="font-script text-7xl md:text-9xl leading-tight mb-8">
              <span className="text-gold-gradient">Jerlin Ashika</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="font-sans-custom text-sm tracking-[0.3em] uppercase text-[#FFF8F0]/70">
              December 10, 2026 · Tamil Nadu, India
            </motion.p>
            <motion.div variants={fadeUp} className="mt-10 flex gap-4 flex-wrap justify-center">
              <Link href="/venue"
                className="px-8 py-3 border border-[#C9A84C]/60 font-sans-custom text-xs tracking-[0.3em] uppercase text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-all duration-300 rounded">
                Venue & Events
              </Link>
              <Link href="/wishes"
                className="px-8 py-3 bg-[#8B1A4A]/70 border border-[#8B1A4A] font-sans-custom text-xs tracking-[0.3em] uppercase text-[#FFF8F0] hover:bg-[#8B1A4A] transition-all duration-300 rounded">
                Leave a Wish
              </Link>
            </motion.div>
          </motion.div>

          {showContent && (
            <motion.div
              className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <div className="w-px h-12 bg-gradient-to-b from-transparent to-[#C9A84C]/60" />
              <span className="font-sans-custom text-[9px] tracking-widest uppercase text-[#C9A84C]/50">Scroll</span>
            </motion.div>
          )}
        </section>

        {/* Countdown */}
        <section className="relative py-24 px-6" style={{ background: "linear-gradient(180deg, #1A0A0F 0%, #0D0508 100%)" }}>
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <CountdownTimer />
            </motion.div>
          </div>
        </section>

        <div className="divider-gold mx-auto max-w-sm" />

        {/* Events */}
        <section className="py-24 px-6" style={{ background: "linear-gradient(180deg, #0D0508 0%, #100A12 100%)" }}>
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="text-center mb-16"
            >
              <p className="font-sans-custom text-[11px] tracking-[0.5em] uppercase text-[#C9A84C] mb-3">Save the Date</p>
              <h2 className="font-script text-5xl md:text-6xl text-gold-gradient mb-4">December 10, 2026</h2>
              <p className="font-serif text-lg text-[#FFF8F0]/60 italic">A day of love, joy, and new beginnings</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                { icon: "⛪", title: "Bride Side Ceremony", time: "9:00 AM – 2:00 PM", detail: "Church Wedding & Family Celebrations", link: "/venue#bride" },
                { icon: "🎉", title: "Groom Side Reception", time: "5:30 PM – 9:00 PM", detail: "Evening Reception & Grand Celebration", link: "/venue#groom" },
              ].map((ev, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.2 }}
                  className="glass-card p-8 text-center group hover:border-[#C9A84C]/40 transition-all duration-500"
                >
                  <div className="text-4xl mb-4">{ev.icon}</div>
                  <p className="font-sans-custom text-[11px] tracking-[0.3em] uppercase text-[#C9A84C] mb-2">{ev.time}</p>
                  <h3 className="font-serif text-2xl text-[#FFF8F0] mb-2">{ev.title}</h3>
                  <p className="font-sans-custom text-sm text-[#FFF8F0]/50 mb-5">{ev.detail}</p>
                  <Link href={ev.link}
                    className="font-sans-custom text-xs tracking-widest uppercase text-[#C9A84C] border-b border-[#C9A84C]/30 pb-0.5 hover:border-[#C9A84C] transition-colors">
                    View Directions →
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <div className="divider-gold mx-auto max-w-sm" />

        {/* Explore */}
        <section className="py-20 px-6" style={{ background: "linear-gradient(180deg, #100A12 0%, #1A0A0F 100%)" }}>
          <div className="max-w-4xl mx-auto text-center">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-script text-4xl text-gold-gradient mb-12"
            >
              Explore Our Journey
            </motion.p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { href: "/story", emoji: "📖", label: "Our Story" },
                { href: "/gallery", emoji: "📸", label: "Gallery" },
                { href: "/venue", emoji: "📍", label: "Venue" },
                { href: "/wishes", emoji: "💌", label: "Wishes" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link href={item.href}
                    className="glass-card flex flex-col items-center gap-3 py-8 px-4 hover:border-[#C9A84C]/50 transition-all duration-300 group block">
                    <span className="text-3xl group-hover:scale-110 transition-transform duration-300">{item.emoji}</span>
                    <span className="font-sans-custom text-xs tracking-widest uppercase text-[#FFF8F0]/70">{item.label}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <footer className="py-10 text-center border-t border-[#C9A84C]/10">
          <p className="font-script text-3xl text-gold-gradient mb-2">Berlin & Jerlin Ashika</p>
          <p className="font-sans-custom text-[10px] tracking-widest uppercase text-[#FFF8F0]/30">December 10, 2026 · With Love</p>
        </footer>
      </div>
    </>
  );
}
