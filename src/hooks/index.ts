"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import { suspendBackgroundAudio } from "@/lib/background-audio";

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

/**
 * Playback etiquette shared by every film on the site.
 *
 * Two rules, and both have to hold across the whole page rather than within
 * one section: only one film plays at a time, and while a film is playing the
 * site music stands down until it stops. The highlights grid enforced the
 * first over `#highlights video` alone, so a story film and a highlights film
 * could play over each other, and the story film claimed the speakers from
 * nobody at all.
 *
 * The claim is released through the counted claim in background-audio, so two
 * films open at once can't hand the music back while one is still running.
 */
export function useFilmPlayback(videoRef: RefObject<HTMLVideoElement | null>) {
  const release = useRef<(() => void) | null>(null);

  const releaseAudio = useCallback(() => {
    release.current?.();
    release.current = null;
  }, []);

  // A film that goes away mid-play — the scroll rolled back up, the route
  // changed — must not keep the music silenced on its way out.
  useEffect(() => releaseAudio, [releaseAudio]);

  const claimPlayback = useCallback(() => {
    document.querySelectorAll<HTMLVideoElement>("video").forEach((other) => {
      if (other !== videoRef.current && !other.paused) other.pause();
    });
    release.current ??= suspendBackgroundAudio();
  }, [videoRef]);

  return { claimPlayback, releaseAudio };
}
