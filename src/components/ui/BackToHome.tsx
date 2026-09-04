"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

/**
 * Fixed "back" pill for the subpages. None of them render the Navbar, so
 * without this a visitor who lands on one has no way back to the site —
 * /gallery and /story were outright dead ends before.
 *
 * @param href where "back" goes; use a hash so the reader returns to the
 *   home section they came from rather than the top of the page.
 */
export default function BackToHome({
  href = "/",
  label = "Back to Home",
}: {
  href?: string;
  label?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      style={{ position: "fixed", top: "1.25rem", left: "1.25rem", zIndex: 50 }}
    >
      <Link
        href={href}
        className="flex items-center gap-2 rounded-full px-4 py-2 font-sans-custom text-xs tracking-wide backdrop-blur-md transition-colors hover:bg-white/10"
        style={{
          background: "rgba(15,12,9,0.55)",
          border: "1px solid rgba(217,180,65,0.25)",
          color: "rgba(255,255,255,0.75)",
        }}
      >
        <ArrowLeft size={14} /> {label}
      </Link>
    </motion.div>
  );
}
