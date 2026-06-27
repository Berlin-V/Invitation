"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoadingAnimation from "@/components/LoadingAnimation";
import EnvelopeAnimation from "@/components/EnvelopeAnimation";
import Navbar from "@/components/Navbar";
import FloatingPetals from "@/components/FloatingPetals";
import MusicPlayer from "@/components/MusicPlayer";
import Hero from "@/components/sections/Hero";
import Countdown from "@/components/sections/Countdown";
import Story from "@/components/sections/Story";
import Events from "@/components/sections/Events";
import VideoSection from "@/components/sections/VideoSection";
import Gallery from "@/components/sections/Gallery";
import Venue from "@/components/sections/Venue";
import DressCode from "@/components/sections/DressCode";
import RSVP from "@/components/sections/RSVP";
import Footer from "@/components/sections/Footer";

type Phase = "loading" | "envelope" | "site";

export default function HomePage() {
  const [phase, setPhase] = useState<Phase>("loading");

  useEffect(() => {
    // Skip intro if already visited this session
    if (sessionStorage.getItem("wed_visited")) {
      setPhase("site");
      return;
    }
    const t = setTimeout(() => setPhase("envelope"), 2600);
    return () => clearTimeout(t);
  }, []);

  const handleEnvelopeOpen = () => {
    sessionStorage.setItem("wed_visited", "1");
    setPhase("site");
  };

  return (
    <AnimatePresence mode="wait">
      {phase === "loading" && (
        <motion.div key="loading" exit={{ opacity: 0 }} transition={{ duration: 0.7 }}>
          <LoadingAnimation />
        </motion.div>
      )}

      {phase === "envelope" && (
        <motion.div
          key="envelope"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <EnvelopeAnimation onOpen={handleEnvelopeOpen} />
        </motion.div>
      )}

      {phase === "site" && (
        <motion.div
          key="site"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <FloatingPetals />
          <MusicPlayer />
          <Navbar />
          <main>
            <Hero />
            <Countdown />
            <Story />
            <Events />
            <VideoSection />
            <Gallery />
            <Venue />
            <DressCode />
            <RSVP />
          </main>
          <Footer />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
