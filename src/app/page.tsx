"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import LoadingScreen from "@/components/sections/LoadingScreen";
import EnvelopeAnimation from "@/components/sections/EnvelopeAnimation";
import Navbar, { NAV_SCROLL_OFFSET } from "@/components/ui/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import CountdownSection from "@/components/sections/CountdownSection";
import StorySection from "@/components/sections/StorySection";
import EventsSection from "@/components/sections/EventsSection";
import GallerySection from "@/components/sections/GallerySection";
import WishesTreeSection from "@/components/sections/WishesTreeSection";
import CoupleCard3D from "@/components/sections/CoupleCard3D";
import FooterSection from "@/components/sections/FooterSection";
import ChatBot from "@/components/ChatBot";
import { EASE } from "@/constants/motion";
import { COUPLE, MEDIA, WEDDING_DATE } from "@/constants";
import type { AnimationPhase } from "@/types";

export default function HomePage() {
  const [ready, setReady] = useState(false);
  const [phase, setPhase] = useState<AnimationPhase>("loading");

  useEffect(() => {
    // Runs only on the client, after hydration is complete.
    // Setting ready=true here means both server and client render the
    // same static placeholder initially — zero chance of a hydration mismatch.
    const visited = Boolean(sessionStorage.getItem("wed_visited"));
    // Client-only read of sessionStorage; must run post-hydration so server/client first paint match.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPhase(visited ? "site" : "loading");
    setReady(true);
  }, []);

  const handleLoadingComplete = () => setPhase("envelope");

  const handleEnter = () => {
    sessionStorage.setItem("wed_visited", "1");
    setPhase("site");
  };

  // Deep links (e.g. "/#wishes" from the Wishes page) point at a section that
  // only mounts once phase === "site" — the browser's native hash-scroll fires
  // before that, so it misses. Scroll to it ourselves once it's actually there.
  // Waits for images etc. above the target to finish loading first — on a slow
  // connection, a fixed short delay can fire while the page is still growing,
  // landing the scroll at a stale offset.
  useEffect(() => {
    if (phase !== "site") return;
    const id = window.location.hash.slice(1);
    if (!id) return;

    const scrollToTarget = () => {
      const el = document.getElementById(id);
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY - NAV_SCROLL_OFFSET;
      window.scrollTo({ top, behavior: "smooth" });
    };

    if (document.readyState === "complete") {
      const timer = setTimeout(scrollToTarget, 100);
      return () => clearTimeout(timer);
    }
    window.addEventListener("load", scrollToTarget, { once: true });
    return () => window.removeEventListener("load", scrollToTarget);
  }, [phase]);

  // ── Pre-hydration placeholder ──────────────────────────────────────────────
  // Both server and client render this exact same markup on first pass.
  // Once useEffect fires (client-only), `ready` flips to true and the full
  // animation system takes over — hydration always succeeds.
  if (!ready) {
    return (
      <div
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
        style={{ backgroundColor: "#0F0C09" }}
      >
        {/* Mirrors the loading screen's mark and date so the hand-off to the
            real intro isn't a visible jump. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={MEDIA.logo}
          alt={`${COUPLE.groom} & ${COUPLE.bride}`}
          style={{ width: "clamp(160px, 40vw, 240px)", height: "auto" }}
        />
        <div
          style={{
            height: "1px",
            width: "80px",
            background: "rgba(217,180,65,0.4)",
            marginTop: "1.5rem",
          }}
        />
        <p
          style={{
            marginTop: "1.35rem",
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "clamp(0.82rem, 3vw, 1rem)",
            letterSpacing: "0.3em",
            color: "#F2DCA0",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          {WEDDING_DATE.display}
        </p>
      </div>
    );
  }

  // ── Full client-side animation system ─────────────────────────────────────
  return (
    <AnimatePresence mode="wait">
      {phase === "loading" && (
        <LoadingScreen key="loading" onComplete={handleLoadingComplete} />
      )}

      {phase === "envelope" && (
        <EnvelopeAnimation key="envelope" onEnter={handleEnter} />
      )}

      {phase === "site" && (
        <motion.div
          key="site"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: EASE }}
        >
          <Navbar />
          <main>
            <HeroSection />
            <CoupleCard3D />
            <CountdownSection />
            <StorySection />
            <EventsSection />
            <GallerySection />
            <WishesTreeSection />
          </main>
          <FooterSection />
          <ChatBot />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
