"use client";

import { useSyncExternalStore } from "react";

const BREAKPOINTS = {
  sm: "(min-width: 640px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 1024px)",
  xl: "(min-width: 1280px)",
  "2xl": "(min-width: 1536px)",
} as const;

type Breakpoint = keyof typeof BREAKPOINTS;

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (callback) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", callback);
      return () => media.removeEventListener("change", callback);
    },
    () => window.matchMedia(query).matches,
    () => false // server snapshot — defaults to not matching
  );
}

export function useBreakpoint(breakpoint: Breakpoint): boolean {
  return useMediaQuery(BREAKPOINTS[breakpoint]);
}
