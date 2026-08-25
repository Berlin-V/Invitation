"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import LoadingScreen from "@/components/sections/LoadingScreen";
import EnvelopeAnimation from "@/components/sections/EnvelopeAnimation";
import Navbar from "@/components/ui/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import CountdownSection from "@/components/sections/CountdownSection";
import StorySection from "@/components/sections/StorySection";
import EventsSection from "@/components/sections/EventsSection";
import VideoSection from "@/components/sections/VideoSection";
import GallerySection from "@/components/sections/GallerySection";
import WishesTreeSection from "@/components/sections/WishesTreeSection";
import CoupleCard3D from "@/components/sections/CoupleCard3D";
import FooterSection from "@/components/sections/FooterSection";
import ChatBot from "@/components/ChatBot";

type Phase = "loading" | "envelope" | "site";

export default function HomePage() {
  const [ready, setReady] = useState(false);
  const [phase, setPhase] = useState<Phase>("loading");

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
        <p
          style={{
            fontFamily: "var(--font-allura), cursive",
            fontSize: "clamp(3rem, 10vw, 4.5rem)",
            color: "#C9A56D",
            lineHeight: 1,
          }}
        >
          B & J
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
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Navbar />
          <main>
            <HeroSection />
            <CoupleCard3D />
            <CountdownSection />
            <StorySection />
            <EventsSection />
            <VideoSection />
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
