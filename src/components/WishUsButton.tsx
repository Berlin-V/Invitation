"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import {
  GOLD_PILL_STYLE,
  GOLD_PILL_TRANSITION,
  GOLD_PILL_VARIANTS,
  PulseRing,
} from "@/components/ui/GoldPill";

// The link *is* the animated pill. A wrapping motion.div would add a second
// inline box, whose line-box descender space leaves this pill sitting a couple
// of pixels off from the Gift Us pill it stands next to.
const MotionLink = motion.create(Link);

interface WishUsButtonProps {
  className?: string;
  style?: React.CSSProperties;
  /** Ambient ring around the pill. Off by default so a pair of pills has only one. */
  pulse?: boolean;
}

/**
 * Sibling of GiftUsButton: the same pill, but instead of opening the registry
 * it routes to the Wishes Wall so the visitor can leave a blessing.
 *
 * No heart burst on click, unlike Gift Us: that one opens a modal over the
 * page, so its burst has somewhere to play, while this one navigates away and
 * unmounts within a frame or two. GlobalConfetti doesn't cover the gap either
 * — it skips anything matching its INTERACTIVE selector, which includes the
 * <a> this renders. The tap scale is the feedback here.
 */
export default function WishUsButton({ className, style, pulse = false }: WishUsButtonProps) {
  return (
    <div className="relative inline-block" style={style}>
      {pulse && <PulseRing />}

      <MotionLink
        href="/wishes"
        initial="rest"
        whileHover="hover"
        whileTap={{ scale: 0.95 }}
        variants={GOLD_PILL_VARIANTS}
        transition={GOLD_PILL_TRANSITION}
        className={`gold-pill relative ${className ?? ""}`}
        style={GOLD_PILL_STYLE}
      >
        <Sparkles size={15} strokeWidth={2} /> Wish Us
      </MotionLink>
    </div>
  );
}
