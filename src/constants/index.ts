// ─────────────────────────────────────────────
//  Wedding Config — update all values here.
//  Single source of truth: every component reads names, dates, map links
//  and the event schedule from here rather than hardcoding them.
// ─────────────────────────────────────────────

export const COUPLE = {
  groom: "Berlin",
  bride: "Jerlin Ashika",
  groomShort: "Berlin",
  brideShort: "Jerlin",
};

export const WEDDING_DATE = {
  iso: "2026-12-10T09:30:00+05:30", // IST
  display: "December 10, 2026",
  displayShort: "Dec 10, 2026",
  time: "9:30 AM",
};

// ─── Map links ────────────────────────────────
export const MAPS = {
  weddingChurch: "https://maps.app.goo.gl/dQSV2rJV6DMk89bDA",
  communityHall: "https://maps.app.goo.gl/NVhzs836jVU2kaXz7",
  groomHouse:    "https://maps.app.goo.gl/ToyHtFCFGUwNSDzM9",
  receptionHall: "https://maps.app.goo.gl/m1ACjjsAbfHrSUjY8",
};

// ─── Event schedule ───────────────────────────
export const EVENTS = {
  // The eve of the wedding. Chronologically first, so it is rendered first —
  // which is also why each group carries its own `date` rather than borrowing
  // WEDDING_DATE: the events no longer all fall on the one day.
  brideSideReception: {
    label: "Bride's Side",
    date: "December 9, 2026",
    timeRange: "6:00 PM \u2013 9:00 PM",
    items: [
      { title: "CSI Community Hall, Kodiyoor", time: "6:00 PM", mapUrl: MAPS.communityHall, icon: "\u2728", description: `The bride's family hosts a reception on the eve of the wedding, in the same hall the bride's side gathers in the next day.` },
    ],
  },
  brideSide: {
    label: "Bride's Side",
    date: WEDDING_DATE.display,
    timeRange: "9:30 AM – 2:00 PM",
    items: [
      { title: "Wedding Church", time: "9:30 AM",  mapUrl: MAPS.weddingChurch, icon: "⛪", description: `The holy matrimony ceremony uniting ${COUPLE.groom} & ${COUPLE.bride}.` },
      { title: "CSI Community Hall, Kodiyoor", time: "11:00 AM", mapUrl: MAPS.communityHall, icon: "🤝", description: "The bride's side gathers with family and the church community to celebrate the newly married couple." },
    ],
  },
  groomSide: {
    label: "Groom's Side",
    date: WEDDING_DATE.display,
    timeRange: "5:30 PM – 9:00 PM",
    items: [
      { title: "Groom's Home",   time: "5:30 PM",  mapUrl: MAPS.groomHouse,    icon: "🏠", description: "The groom's side celebration begins at the family home with a warm welcome." },
      { title: "Reception Hall", time: "~6:00 PM", mapUrl: MAPS.receptionHall, icon: "🎊", description: "The evening reception — a grand celebration of love, family, and new beginnings." },
    ],
  },
};

/**
 * The code that unrolls the story film.
 *
 * A gate, not a secret. The bundle ships this string and the film sits at a
 * public URL, so anyone who looks will find both — it keeps the story for the
 * guests who were given the code, and nothing stronger than that. Gating it
 * for real would mean serving the film from a route that checks a session.
 */
export const STORY_PIN = "8056";

// ─── Event highlight films ────────────────────
// Films are served from the site itself rather than framed from Drive, whose
// player brings its own fullscreen, subtitle and quality controls that a
// cross-origin frame gives us no way to turn off.
//
// To add the next film: encode it into public/videos (H.264, +faststart so it
// streams rather than buffering whole), pull a poster frame beside it, and
// append an entry here — the section's grid reflows on its own, so nothing
// else needs touching. `aspect` records the encode's real pixel dimensions;
// the section presents films in an ultra-wide frame that crops to it, so this
// stays the source of truth for what was actually encoded. If a master has
// black bars padded into the picture, crop them out of the encode rather than
// shipping them.
export const HIGHLIGHTS = [
  {
    id: "engagement",
    title: "Engagement Highlights",
    caption: "The day we said yes, surrounded by both our families.",
    src: "/videos/engagement-highlights.mp4",
    poster: "/images/ringMoment.jpeg",
    aspect: "1280 / 958",
  },
] as const;

// ─── Gift registry ────────────────────────────
export const GIFT_URL = "https://giftus.io/events/berlin-jerlin-ashika-7tji";

// ─── Media ────────────────────────────────────
export const MEDIA = {
  heroPhoto: "/images/berlinJerlin.jpeg",
  logo: "/images/logo.svg",
  music: "/music/wedding.mp3",
  storyVideo: "/videos/our-story.mp4",
  storyScroll: "/images/story/scroll.png",
};

// ─── Site metadata ────────────────────────────
export const SITE = {
  title: `${COUPLE.groom} & ${COUPLE.bride} — Wedding, ${WEDDING_DATE.display}`,
  description: `Join us as we celebrate the union of ${COUPLE.groom} & ${COUPLE.bride} on ${WEDDING_DATE.display}.`,
};
