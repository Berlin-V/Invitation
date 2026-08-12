// ─────────────────────────────────────────────
//  Wedding Config — update all values here
// ─────────────────────────────────────────────

export const COUPLE = {
  groom: "Berlin",
  bride: "Jerlin Ashika",
  groomShort: "Berlin",
  brideShort: "Jerlin",
};

export const WEDDING_DATE = {
  iso: "2026-12-10T09:00:00+05:30", // IST
  display: "December 10, 2026",
  displayShort: "Dec 10, 2026",
  time: "9:00 AM",
};

// ─── Video ────────────────────────────────────
export const VIDEO = {
  // Google Drive file ID (from the share link)
  driveFileId: "1_2p9GXY1ivlw6KpjEmVl63wABOgRHtdo",
  get embedUrl() {
    return `https://drive.google.com/file/d/${this.driveFileId}/preview?autoplay=1`;
  },
};

// ─── Map links ────────────────────────────────
export const MAPS = {
  brideHouse:    "https://goo.gl/maps/guaUbk5yJWDivrP28?g_st=aw",
  weddingChurch: "https://maps.app.goo.gl/doWzsv87nDVK18Sc6",
  groomHouse:    "https://maps.app.goo.gl/ToyHtFCFGUwNSDzM9",
  receptionHall: "https://maps.app.goo.gl/m1ACjjsAbfHrSUjY8",
};

// ─── Google Drive albums ──────────────────────
export const DRIVE = {
  engagementAlbum: "https://drive.google.com/drive/folders/1w_xCWzBJuUtID3Mq9Qype3kO4TzNONxW?usp=sharing",
  // Add more album folder links here as you get them:
  // preWeddingAlbum: "https://drive.google.com/...",
  // weddingAlbum:    "https://drive.google.com/...",
  // receptionAlbum:  "https://drive.google.com/...",
};

// ─── Event schedule ───────────────────────────
export const EVENTS = {
  brideSide: {
    label: "Bride's Side",
    date: WEDDING_DATE.display,
    timeRange: "9:00 AM – 2:00 PM",
    items: [
      { title: "Bride's Home",    time: "9:00 AM",  mapUrl: MAPS.brideHouse,    icon: "🏡", description: "The celebration begins at the bride's family home with traditional ceremonies." },
      { title: "Wedding Church",  time: "~10:00 AM", mapUrl: MAPS.weddingChurch, icon: "⛪", description: "The holy matrimony ceremony uniting Berlin & Jerlin Ashika." },
    ],
  },
  groomSide: {
    label: "Groom's Side",
    date: WEDDING_DATE.display,
    timeRange: "5:30 PM – 9:00 PM",
    items: [
      { title: "Groom's Home",    time: "5:30 PM",   mapUrl: MAPS.groomHouse,    icon: "🏠", description: "The groom's side celebration begins at the family home with a warm welcome." },
      { title: "Reception Hall",  time: "~6:00 PM",  mapUrl: MAPS.receptionHall, icon: "🎊", description: "The evening reception — a grand celebration of love, family, and new beginnings." },
    ],
  },
};

// ─── Site metadata ────────────────────────────
export const SITE = {
  title: `${COUPLE.groom} & ${COUPLE.bride} | Wedding — ${WEDDING_DATE.display}`,
  description: `Join us for the wedding celebration of ${COUPLE.groom} & ${COUPLE.bride} on ${WEDDING_DATE.display}.`,
};
