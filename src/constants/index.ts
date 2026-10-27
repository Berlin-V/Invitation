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

// ─── Event highlight films ────────────────────
// Films are served from the site itself rather than framed from Drive, whose
// player brings its own fullscreen, subtitle and quality controls that a
// cross-origin frame gives us no way to turn off.
//
// To add the next film: encode it into public/videos (H.264, +faststart so it
// streams rather than buffering whole), pull a poster frame beside it, and
// append an entry here — the section's grid reflows on its own, so nothing
// else needs touching. `aspect` must match the encode's real pixel dimensions,
// since the frame is built from it; if the master has black bars padded into
// the picture, crop them out first rather than encoding them in.
export const HIGHLIGHTS = [
  {
    id: "engagement",
    title: "Engagement Highlights",
    caption: "The day we said yes, surrounded by both our families.",
    src: "/videos/engagement-highlights.mp4",
    poster: "/images/story/engagement-poster.jpg",
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
