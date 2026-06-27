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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "nav-glass py-3" : "py-5 bg-transparent"}`}>
      <div className="max-w-6xl mx-auto px-5 flex items-center justify-between">
        <Link href="/" className="flex flex-col items-start gap-0">
          <span className="font-script text-2xl text-orange-gradient leading-none" style={{
            background: "linear-gradient(135deg, #F97316, #FED7AA, #FB923C)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>Berlin & Jerlin</span>
          <span className="font-sans-custom text-[9px] tracking-[0.35em] text-orange-400 uppercase opacity-70">Dec 10, 2026</span>
        </Link>

        <ul className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`font-sans-custom text-[11px] tracking-widest uppercase transition-colors duration-300 relative group ${
                  pathname === link.href ? "text-orange-400" : "text-white/60 hover:text-orange-400"
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

        <button className="md:hidden text-orange-400 p-1" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden nav-glass border-t border-orange-500/10"
          >
            <ul className="flex flex-col px-5 py-4 gap-5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`font-sans-custom text-sm tracking-widest uppercase ${
                      pathname === link.href ? "text-orange-400" : "text-white/60"
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
  );
}
