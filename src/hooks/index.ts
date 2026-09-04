"use client";

import { useEffect, useState } from "react";

export interface ScrollPosition {
  y: number;
  direction: "up" | "down" | null;
  isAtTop: boolean;
  isScrolled: boolean;
  /** True once scrollY exceeds the given threshold (default: 60px) */
  pastThreshold: boolean;
}

export function useScrollPosition(threshold = 60): ScrollPosition {
  const [position, setPosition] = useState<ScrollPosition>({
    y: 0,
    direction: null,
    isAtTop: true,
    isScrolled: false,
    pastThreshold: false,
  });

  useEffect(() => {
    let lastY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      setPosition((prev) => ({
        y,
        // A horizontal scroll fires this with y unchanged; keep the last
        // vertical direction rather than reporting a phantom "up".
        direction: y > lastY ? "down" : y < lastY ? "up" : prev.direction,
        isAtTop: y === 0,
        isScrolled: y > 0,
        pastThreshold: y > threshold,
      }));
      lastY = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return position;
}
