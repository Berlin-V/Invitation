import { COUPLE } from "@/constants";
import type { GalleryPhoto } from "@/types";

/**
 * The engagement photo set — shared by the home-page carousel and the
 * /gallery album page, which each kept their own copy of this list before.
 * Intrinsic w/h are the real file dimensions, needed by next/image.
 */
export const ENGAGEMENT_PHOTOS: GalleryPhoto[] = [
  { id: "propose", src: "/images/proposeBJ.jpeg",  w: 4082, h: 5429, alt: `${COUPLE.groom} proposing to ${COUPLE.bride}` },
  { id: "ring",    src: "/images/ringMoment.jpeg", w: 3592, h: 5392, alt: "The ring exchange moment" },
  { id: "stage",   src: "/images/stageClose.jpeg", w: 4082, h: 6123, alt: `${COUPLE.groom} & ${COUPLE.bride} on stage` },
  { id: "evening", src: "/images/berlinAshi.jpeg", w: 1080, h: 1546, alt: `${COUPLE.groom} & ${COUPLE.bride}, an evening together` },
];
