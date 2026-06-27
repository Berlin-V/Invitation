"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/story", label: "Our Story" },
  { href: "/venue", label: "Venue" },
  { href: "/gallery", label: "Gallery" },
  { href: "/wishes", label: "Wishes" },
];

const OG = "linear-gradient(135deg,#F97316,#FED7AA,#FB923C)";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      {/* Floating pill nav */}
      <nav
        className="fixed top-4 left-1/2 z-50 transition-all duration-500"
        style={{ transform: "translateX(-50%)", width: "min(calc(100% - 2rem), 860px)" }}
      >
        <div
          className="flex items-center justify-between px-4 sm:px-6 py-3 rounded-2xl transition-all duration-500"
          style={{
            background: scrolled
              ? "rgba(8,5,3,0.82)"
              : "rgba(8,5,3,0.45)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(249,115,22,0.18)",
            boxShadow: scrolled ? "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(249,115,22,0.08)" : "none",
          }}
        >
          {/* Logo */}
          <Link href="/" className="flex flex-col items-start gap-0 shrink-0">
            <span className="font-script text-xl sm:text-2xl leading-none" style={{ background: OG,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Berlin & Jerlin
            </span>
            <span className="font-sans-custom text-[8px] tracking-[0.35em] text-orange-400 uppercase opacity-70">
              Dec 10, 2026
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`font-sans-custom text-[11px] tracking-widest uppercase transition-colors duration-300 relative ${
                    pathname === link.href ? "text-orange-400" : "text-white/55 hover:text-orange-300"
                  }`}
                >
                  {link.label}
                  {pathname === link.href && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 right-0 h-px bg-orange-500"
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile hamburger */}
          <button className="md:hidden text-orange-400 p-1" onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile dropdown — attached below the pill */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8, scaleY: 0.9 }}
              animate={{ opacity: 1, y: 4,  scaleY: 1 }}
              exit={{ opacity: 0,  y: -8, scaleY: 0.9 }}
              className="mt-1 rounded-2xl overflow-hidden"
              style={{
                transformOrigin: "top",
                background: "rgba(8,5,3,0.92)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(249,115,22,0.15)",
              }}
            >
              <ul className="flex flex-col px-5 py-4 gap-4">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={`font-sans-custom text-sm tracking-widest uppercase ${
                        pathname === link.href ? "text-orange-400" : "text-white/55"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
