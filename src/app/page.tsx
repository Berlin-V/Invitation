"use client";

import { useState, useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import IntroOverlay from "@/components/IntroOverlay";
import CountdownTimer from "@/components/CountdownTimer";
import CelebrationParticles from "@/components/CelebrationParticles";
import Link from "next/link";
import { COUPLE, WEDDING_DATE, VIDEO, EVENTS, DRESS_CODE } from "@/lib/config";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75 } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const OG = "linear-gradient(135deg,#F97316,#FED7AA,#FB923C)";

export default function HomePage() {
  const [entered, setEntered] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("w_v")) { setEntered(true); setShowContent(true); }
  }, []);

  const handleEnter = () => {
    sessionStorage.setItem("w_v", "1");
    setEntered(true);
    setTimeout(() => setShowContent(true), 700);
  };

  return (
    <>
      {!entered && <IntroOverlay onEnter={handleEnter} />}
      {showContent && <CelebrationParticles count={14} />}

      <div className="relative min-h-screen">

        {/* ── VIDEO HERO ── */}
        <section className="relative h-screen overflow-hidden">
          {/* Fallback gradient — always visible, video layers on top */}
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at 40% 50%, #2A1208 0%, #120804 50%, #080503 100%)"
          }} />

          {/*
            Drive iframe — only mount after the user clicks "Open Invitation"
            so it loads inside a user-gesture context (required for autoplay).
            Extra 200px height keeps the iframe centered but pushes the Drive
            player control bar 100px below the section's overflow-hidden edge,
            making it invisible.  The section clips anything outside h-screen.
          */}
          {entered && (
            <iframe
              src={VIDEO.embedUrl}
              className="absolute pointer-events-none"
              style={{
                top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                width: "max(100vw, calc(177.78vh))",
                // +200px: iframe extends 100px beyond viewport top AND bottom;
                // overflow-hidden clips both, hiding the Drive control bar.
                height: "calc(max(100vh, calc(56.25vw)) + 200px)",
                border: "none",
              }}
              allow="autoplay; fullscreen; encrypted-media"
              title="Wedding video"
            />
          )}
          {/* dark gradient overlay */}
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, rgba(8,5,3,0.55) 0%, rgba(8,5,3,0.3) 45%, rgba(8,5,3,0.88) 100%)" }} />
          {/* radial vignette */}
          <div className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse at center, transparent 25%, rgba(8,5,3,0.65) 100%)" }} />
          {/* orange ember glow at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
            style={{ background: "linear-gradient(to top, rgba(194,65,12,0.18), transparent)" }} />

          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6"
            initial="hidden" animate={showContent ? "show" : "hidden"} variants={stagger}
          >
            <motion.p variants={fadeUp}
              className="font-sans-custom text-[9px] sm:text-[10px] tracking-[0.45em] uppercase text-orange-400 mb-3">
              Together Forever
            </motion.p>

            <motion.h1 variants={fadeUp}
              className="font-script leading-none mb-1"
              style={{ fontSize: "clamp(3.5rem, 14vw, 8rem)", background: OG,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              {COUPLE.groom}
            </motion.h1>

            <motion.div variants={fadeUp} className="flex items-center gap-3 my-1">
              <div className="divider-orange w-12 sm:w-20" />
              <span className="text-orange-500 text-base">♥</span>
              <div className="divider-orange w-12 sm:w-20" />
            </motion.div>

            <motion.h1 variants={fadeUp}
              className="font-script leading-none mb-6"
              style={{ fontSize: "clamp(2.8rem, 11vw, 6.5rem)", background: OG,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              {COUPLE.bride}
            </motion.h1>

            <motion.p variants={fadeUp}
              className="font-sans-custom text-[10px] sm:text-xs tracking-[0.3em] uppercase text-white/55">
              {WEDDING_DATE.display} · {COUPLE.location}
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 flex gap-3 flex-wrap justify-center">
              <Link href="/venue"
                className="px-5 sm:px-7 py-2.5 font-sans-custom text-[10px] sm:text-xs tracking-[0.3em] uppercase text-orange-300 rounded transition-all duration-300 hover:bg-orange-500/10"
                style={{ border: "1px solid rgba(249,115,22,0.45)" }}>
                Venue & Events
              </Link>
              <Link href="/wishes"
                className="px-5 sm:px-7 py-2.5 font-sans-custom text-[10px] sm:text-xs tracking-[0.3em] uppercase text-white rounded transition-all duration-300 hover:opacity-90"
                style={{ background: "linear-gradient(135deg,#C2410C,#F97316)" }}>
                Leave a Wish
              </Link>
            </motion.div>
          </motion.div>

          {showContent && (
            <motion.div
              className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
              animate={{ y: [0, 9, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
              <div className="w-px h-10 sm:h-12 bg-gradient-to-b from-transparent to-orange-500/50" />
              <span className="font-sans-custom text-[8px] tracking-widest uppercase text-orange-400/40">Scroll</span>
            </motion.div>
          )}
        </section>

        {/* ── COUNTDOWN ── */}
        <section className="relative py-16 sm:py-24 px-4 sm:px-6"
          style={{ background: "linear-gradient(180deg,#080503 0%,#0D0804 100%)" }}>
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <CountdownTimer />
            </motion.div>
          </div>
        </section>

        <div className="divider-orange max-w-sm mx-auto" />

        {/* ── EVENTS ── */}
        <section className="py-16 sm:py-24 px-4 sm:px-6"
          style={{ background: "linear-gradient(180deg,#0D0804 0%,#100907 100%)" }}>
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              viewport={{ once: true }} className="text-center mb-10 sm:mb-16">
              <p className="font-sans-custom text-[10px] tracking-[0.45em] uppercase text-orange-400 mb-3">Save the Date</p>
              <h2 className="font-script mb-3"
                style={{ fontSize: "clamp(2.2rem,7vw,3.5rem)", background: OG,
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                {WEDDING_DATE.display}
              </h2>
              <p className="font-serif text-base sm:text-lg text-white/50 italic">A day of love, joy, and new beginnings</p>
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              {[
                { icon: "⛪", title: "Bride Side Ceremony", time: EVENTS.brideSide.timeRange, detail: "Church Wedding & Celebrations", link: "/venue#bride" },
                { icon: "🎉", title: "Groom Side Reception", time: EVENTS.groomSide.timeRange, detail: "Evening Reception & Grand Celebration", link: "/venue#groom" },
              ].map((ev, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.18 }}
                  className="glass-card p-6 sm:p-8 text-center group hover:border-orange-500/35 transition-all duration-500">
                  <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{ev.icon}</div>
                  <p className="font-sans-custom text-[10px] tracking-[0.3em] uppercase text-orange-400 mb-2">{ev.time}</p>
                  <h3 className="font-serif text-xl sm:text-2xl text-white mb-2">{ev.title}</h3>
                  <p className="font-sans-custom text-xs sm:text-sm text-white/45 mb-4 sm:mb-5">{ev.detail}</p>
                  <Link href={ev.link}
                    className="font-sans-custom text-[11px] tracking-widest uppercase text-orange-400 border-b border-orange-500/30 pb-0.5 hover:border-orange-500 transition-colors">
                    View Directions →
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <div className="divider-orange max-w-sm mx-auto" />

        {/* ── DRESS CODE ── */}
        <section className="py-16 sm:py-24 px-4 sm:px-6"
          style={{ background: "linear-gradient(180deg,#100907 0%,#0D0804 100%)" }}>
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} className="text-center mb-10 sm:mb-14">
              <p className="font-sans-custom text-[10px] tracking-[0.45em] uppercase text-orange-400 mb-3">What to Wear</p>
              <h2 className="font-script mb-3"
                style={{ fontSize: "clamp(2.2rem,7vw,3.5rem)", background: OG,
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Dress Code
              </h2>
              <p className="font-serif text-base text-white/45 italic">Come dressed to celebrate — and to be remembered</p>
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">

              {/* Bride & Groom row */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.05 }}
                className="glass-card p-6 sm:p-8 flex items-center gap-5">
                <div className="w-14 h-14 rounded-full shrink-0 border-2 border-white/20 shadow-lg"
                  style={{ background: DRESS_CODE.bride.color }} />
                <div>
                  <p className="font-sans-custom text-[10px] tracking-[0.35em] uppercase text-orange-400 mb-1">Bride</p>
                  <p className="font-serif text-xl text-white">{DRESS_CODE.bride.name}</p>
                  <p className="font-sans-custom text-xs text-white/40 mt-1">Wedding gown / bridal white</p>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.1 }}
                className="glass-card p-6 sm:p-8 flex items-center gap-5">
                <div className="w-14 h-14 rounded-full shrink-0 border-2 border-white/20 shadow-lg"
                  style={{ background: DRESS_CODE.groom.color }} />
                <div>
                  <p className="font-sans-custom text-[10px] tracking-[0.35em] uppercase text-orange-400 mb-1">Groom</p>
                  <p className="font-serif text-xl text-white">{DRESS_CODE.groom.name}</p>
                  <p className="font-sans-custom text-xs text-white/40 mt-1">Beige suit / sherwanis</p>
                </div>
              </motion.div>

              {/* Ladies */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.15 }}
                className="glass-card p-6 sm:p-8">
                <p className="font-sans-custom text-[10px] tracking-[0.35em] uppercase text-orange-400 mb-3">Ladies</p>
                <div className="flex gap-3 mb-4 flex-wrap">
                  {DRESS_CODE.ladies.colors.map((c) => (
                    <div key={c.hex} className="flex flex-col items-center gap-1.5">
                      <div className="w-10 h-10 rounded-full border border-white/15 shadow-md"
                        style={{ background: c.hex }} />
                      <span className="font-sans-custom text-[8px] tracking-wide uppercase text-white/40">{c.name}</span>
                    </div>
                  ))}
                </div>
                <p className="font-sans-custom text-xs text-white/45">{DRESS_CODE.ladies.note}</p>
              </motion.div>

              {/* Gents */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.2 }}
                className="glass-card p-6 sm:p-8 flex items-start gap-5">
                <div className="w-14 h-14 rounded-full shrink-0 border border-white/10 shadow-lg flex items-center justify-center"
                  style={{ background: DRESS_CODE.gents.color }}>
                  <span className="text-xl">🤵</span>
                </div>
                <div>
                  <p className="font-sans-custom text-[10px] tracking-[0.35em] uppercase text-orange-400 mb-1">Gents</p>
                  <p className="font-serif text-xl text-white">{DRESS_CODE.gents.name} Suit</p>
                  <p className="font-sans-custom text-xs text-white/40 mt-1 leading-relaxed">{DRESS_CODE.gents.note}</p>
                  {/* Small colour swatches as tie accent reference */}
                  <div className="flex gap-1.5 mt-3">
                    {DRESS_CODE.ladies.colors.map((c) => (
                      <div key={c.hex} className="w-5 h-5 rounded-full border border-white/10"
                        style={{ background: c.hex }} />
                    ))}
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        <div className="divider-orange max-w-sm mx-auto" />

        {/* ── EXPLORE ── */}
        <section className="py-16 sm:py-20 px-4 sm:px-6"
          style={{ background: "linear-gradient(180deg,#100907 0%,#080503 100%)" }}>
          <div className="max-w-4xl mx-auto text-center">
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="font-script mb-8 sm:mb-12"
              style={{ fontSize: "clamp(2rem,6vw,3rem)", background: OG,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Explore Our Journey
            </motion.p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {[
                { href: "/story", emoji: "📖", label: "Our Story" },
                { href: "/gallery", emoji: "📸", label: "Gallery" },
                { href: "/venue", emoji: "📍", label: "Venue" },
                { href: "/wishes", emoji: "💌", label: "Wishes" },
              ].map((item, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                  <Link href={item.href}
                    className="glass-card flex flex-col items-center gap-2.5 py-6 sm:py-8 px-3 sm:px-4 hover:border-orange-500/40 transition-all duration-300 group block">
                    <span className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform duration-300">{item.emoji}</span>
                    <span className="font-sans-custom text-[9px] sm:text-[10px] tracking-widest uppercase text-white/60">{item.label}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="py-8 sm:py-10 text-center border-t border-orange-500/10">
          <p className="font-script mb-1.5"
            style={{ fontSize: "clamp(1.6rem,5vw,2rem)", background: OG,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            {COUPLE.groom} & {COUPLE.bride}
          </p>
          <p className="font-sans-custom text-[9px] tracking-widest uppercase text-white/25">{WEDDING_DATE.display} · With Love</p>
        </footer>
      </div>
    </>
  );
}
