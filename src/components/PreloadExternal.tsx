"use client";

import ReactDOM from "react-dom";

/**
 * Warms up the third-party origins the site hands visitors off to, so the TLS
 * handshake is already done by the time someone taps a highlights film, a
 * Drive album or the gift link.
 *
 * Next's Metadata API deliberately doesn't cover resource hints — the
 * documented route is these ReactDOM methods, which React hoists into <head>.
 *
 * No `crossOrigin` on purpose: these are plain document navigations and a
 * non-CORS <img>, and a preconnect opened in CORS mode would not be reused by
 * them — it would just cost a second, wasted connection.
 */
const PRECONNECT = [
  "https://drive.google.com",      // highlight films + shared albums
  "https://lh3.googleusercontent.com", // where Drive thumbnails actually serve from
  "https://giftus.io",             // Gift Us registry
];

// Second-hop origins the Drive player reaches for once it's open. Only worth a
// DNS lookup — a full handshake we may never use would compete with the
// connections the page needs right now.
const DNS_ONLY = [
  "https://docs.google.com",
  "https://accounts.google.com",
];

export default function PreloadExternal() {
  for (const origin of PRECONNECT) ReactDOM.preconnect(origin);
  for (const origin of DNS_ONLY) ReactDOM.prefetchDNS(origin);

  return null;
}
