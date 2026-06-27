"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Story",    href: "#story"    },
  { label: "Events",   href: "#events"   },
  { label: "Gallery",  href: "#gallery"  },
  { label: "Venue",    href: "#venue"    },
  { label: "RSVP",     href: "#rsvp"     },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // IntersectionObserver for active section
  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.replace("#", ""));
    const observers: IntersectionObserver[] = [];

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(`#${id}`); },
        { threshold: 0.35 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollTo = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-40 transition-all duration-500"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
    >
      <div
        className="transition-all duration-500"
        style={scrolled ? {
          background: "rgba(255,253,249,0.92)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(201,165,109,0.18)",
          boxShadow: "0 1px 24px rgba(74,64,58,0.06)",
        } : {}}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => scrollTo("#hero")}
            className="flex flex-col items-start gap-0"
          >
            <span
              style={{
                fontFamily: "var(--font-allura), cursive",
                fontSize: "1.5rem",
                color: scrolled ? "#4A403A" : "#FFFDF9",
                lineHeight: 1,
                transition: "color 0.4s",
              }}
            >
              Berlin & Jerlin
            </span>
            <span style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "0.62rem",
              letterSpacing: "0.32em",
              color: scrolled ? "#C9A56D" : "rgba(255,253,249,0.7)",
              textTransform: "uppercase",
              transition: "color 0.4s",
            }}>
              Dec 9–10, 2026
            </span>
          </button>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="relative"
                style={{
                  fontFamily: "var(--font-cormorant), Georgia, serif",
                  fontSize: "0.9rem",
                  letterSpacing: "0.12em",
                  color: scrolled
                    ? active === link.href ? "#C9A56D" : "#4A403A"
                    : active === link.href ? "#E8D5B0" : "rgba(255,253,249,0.8)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  transition: "color 0.3s",
                }}
              >
                {link.label}
                {active === link.href && (
                  <motion.span
                    layoutId="nav-dot"
                    className="absolute -bottom-1 left-1/2 w-1 h-1 rounded-full"
                    style={{ background: "#C9A56D", transform: "translateX(-50%)" }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-1"
            onClick={() => setOpen(!open)}
            style={{ color: scrolled ? "#4A403A" : "#FFFDF9" }}
          >
            {open ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              background: "rgba(255,253,249,0.96)",
              backdropFilter: "blur(20px)",
              borderBottom: "1px solid rgba(201,165,109,0.15)",
            }}
          >
            <nav className="flex flex-col px-6 py-6 gap-5">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  style={{
                    fontFamily: "var(--font-cormorant), Georgia, serif",
                    fontSize: "1.15rem",
                    letterSpacing: "0.12em",
                    color: active === link.href ? "#C9A56D" : "#4A403A",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
