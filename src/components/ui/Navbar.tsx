"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import MusicToggle from "./MusicToggle";

const NAV_LINKS = [
  { label: "Story",    href: "#story"    },
  { label: "Events",   href: "#events"   },
  { label: "Gallery",  href: "#gallery"  },
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

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-40 flex flex-col items-center"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Floating glass pill — a fixed dark tint + light text keeps it legible
          over both the dark hero photo and the light sections below, since the
          bar shows whatever is behind it blurred through rather than painting
          a solid color over it. */}
      <div
        className="flex items-center justify-between gap-6"
        style={{
          marginTop: "0.9rem",
          borderRadius: "999px",
          padding: "0.6rem 0.5rem 0.6rem 1.25rem",
          maxWidth: "min(94vw, 720px)",
          transition: "background 0.45s ease, box-shadow 0.45s ease, padding 0.45s ease",
          background: scrolled ? "rgba(20,16,12,0.45)" : "rgba(20,16,12,0.22)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          border: "1px solid rgba(255,253,249,0.1)",
          boxShadow: scrolled ? "0 8px 32px rgba(0,0,0,0.25)" : "none",
        }}
      >
        {/* Logo */}
        <button
          onClick={() => scrollTo("#hero")}
          className="flex items-center"
          style={{ background: "none", border: "none", cursor: "pointer" }}
          aria-label="Back to top"
        >
          <span
            style={{
              fontFamily: "var(--font-allura), cursive",
              fontSize: "1.3rem",
              lineHeight: 1,
              color: "#FFFDF9",
              whiteSpace: "nowrap",
            }}
          >
            Berlin & Jerlin Ashika
          </span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
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
                  fontSize: "0.8rem",
                  letterSpacing: "0.1em",
                  whiteSpace: "nowrap",
                  color: isActive ? "#E8D5B0" : "rgba(255,253,249,0.7)",
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
        <div className="flex items-center gap-3">
          <MusicToggle scrolled={false} />

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-1"
            onClick={() => setMenuOpen((o) => !o)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#FFFDF9",
            }}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen
              ? <X size={18} strokeWidth={1.5} />
              : <Menu size={18} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              overflow: "hidden",
              marginTop: "0.5rem",
              borderRadius: "24px",
              background: "rgba(20,16,12,0.6)",
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
              border: "1px solid rgba(255,253,249,0.1)",
              maxWidth: "min(94vw, 320px)",
            }}
          >
            <div className="flex flex-col px-6 py-5 gap-4">
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
                    fontSize: "1rem",
                    letterSpacing: "0.1em",
                    color: activeSection === link.href ? "#E8D5B0" : "rgba(255,253,249,0.8)",
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
