/** Format a date for display, defaulting to en-IN locale. */
export function formatDate(date: Date | string, locale = "en-IN"): string {
  return new Date(date).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Format a time for display, defaulting to en-IN locale. */
export function formatTime(date: Date | string, locale = "en-IN"): string {
  return new Date(date).toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Returns remaining time until a target ISO date string. */
export function getCountdown(targetISO: string): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
} {
  const total = Math.max(0, new Date(targetISO).getTime() - Date.now());
  return {
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((total / (1000 * 60)) % 60),
    seconds: Math.floor((total / 1000) % 60),
    total,
  };
}
