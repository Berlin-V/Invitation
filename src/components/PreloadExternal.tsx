"use client";

import ReactDOM from "react-dom";

/**
 * Warms up the third-party origins the site hands visitors off to, so the TLS
 * handshake is already done by the time someone taps the gift link. The films
 * are served by the site itself, so they need no third-party origin at all.
 *
 * Next's Metadata API deliberately doesn't cover resource hints — the
 * documented route is these ReactDOM methods, which React hoists into <head>.
 *
 * No `crossOrigin` on purpose: this is a plain document navigation, and a
 * preconnect opened in CORS mode would not be reused by it — it would just
 * cost a second, wasted connection.
 */
const PRECONNECT = [
  "https://giftus.io", // Gift Us registry
];

export default function PreloadExternal() {
  for (const origin of PRECONNECT) ReactDOM.preconnect(origin);

  return null;
}
