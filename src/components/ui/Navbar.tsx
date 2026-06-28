"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import MusicToggle from "./MusicToggle";

const NAV_LINKS = [
  { label: "Story",    href: "#story"    },
  { label: "Events",   href: "#events"   },
  { label: "Gallery",  href: "#gallery"  },
  { label: "Venue",    href: "#venue"    },
  { label: "RSVP",     href: "#rsvp"     },
] as const;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  // Scroll state
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active section tracking
  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.slice(1));
    const observers: IntersectionObserver[] = [];

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(`#${id}`); },
        { threshold: 0.3, rootMargin: "-80px 0px -40% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollTo = useCallback((href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const isLight = scrolled;

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-40"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div
        style={{
          transition: "background 0.45s ease, border-color 0.45s ease, box-shadow 0.45s ease",
          background: scrolled ? "rgba(255,253,249,0.94)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled
            ? "1px solid rgba(201,165,109,0.18)"
            : "1px solid transparent",
          boxShadow: scrolled ? "0 1px 32px rgba(74,64,58,0.06)" : "none",
        }}
      >
        <div
          className="flex items-center justify-between"
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 clamp(1rem, 4vw, 2rem)",
            height: "68px",
          }}
        >
          {/* Logo */}
          <button
            onClick={() => scrollTo("#hero")}
            className="flex flex-col items-start"
            style={{ background: "none", border: "none", cursor: "pointer" }}
            aria-label="Back to top"
          >
            <span
              style={{
                fontFamily: "var(--font-allura), cursive",
                fontSize: "1.45rem",
                lineHeight: 1,
                color: isLight ? "#4A403A" : "#FFFDF9",
                transition: "color 0.4s ease",
              }}
            >
              Berlin & Jerlin Ashika
            </span>
            <span
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontSize: "0.55rem",
                letterSpacing: "0.3em",
                color: isLight ? "#C9A56D" : "rgba(255,253,249,0.55)",
                textTransform: "uppercase",
                transition: "color 0.4s ease",
              }}
            >
              Dec 10, 2026
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href;
              return (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="relative"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "var(--font-cormorant), Georgia, serif",
                    fontSize: "0.82rem",
                    letterSpacing: "0.12em",
                    color: isLight
                      ? isActive ? "#C9A56D" : "#4A403A"
                      : isActive ? "#E8D5B0" : "rgba(255,253,249,0.75)",
                    transition: "color 0.3s ease",
                  }}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 block rounded-full"
                      style={{ width: "3px", height: "3px", background: "#C9A56D" }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right side: music + hamburger */}
          <div className="flex items-center gap-4">
            <MusicToggle scrolled={scrolled} />

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-1"
              onClick={() => setMenuOpen((o) => !o)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: isLight ? "#4A403A" : "#FFFDF9",
                transition: "color 0.3s ease",
              }}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen
                ? <X size={20} strokeWidth={1.5} />
                : <Menu size={20} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              overflow: "hidden",
              background: "rgba(255,253,249,0.97)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              borderBottom: "1px solid rgba(201,165,109,0.15)",
            }}
          >
            <div className="flex flex-col px-6 py-6 gap-5">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: "var(--font-cormorant), Georgia, serif",
                    fontSize: "1.1rem",
                    letterSpacing: "0.12em",
                    color: activeSection === link.href ? "#C9A56D" : "#4A403A",
                  }}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
