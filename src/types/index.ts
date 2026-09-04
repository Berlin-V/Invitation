// ─────────────────────────────────────────────────────────────────────────────
// Core domain types for the wedding site.
// Import from here: import type { ... } from "@/types";
// ─────────────────────────────────────────────────────────────────────────────

// ── Intro sequence ────────────────────────────────────────────────────────────
export type AnimationPhase = "loading" | "envelope" | "site";

// ── Navigation ────────────────────────────────────────────────────────────────
export interface NavLink {
  href: string;
  label: string;
}

// ── Gallery ───────────────────────────────────────────────────────────────────
/** A gallery photo. `w`/`h` are the file's intrinsic pixel dimensions. */
export interface GalleryPhoto {
  id: string;
  src: string;
  w: number;
  h: number;
  alt: string;
}

export interface GalleryAlbum {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  photos: GalleryPhoto[];
  available: boolean;
}

// ── Wishes / Guestbook ────────────────────────────────────────────────────────
/** A guestbook entry as stored in Firestore and returned by /api/wishes. */
export interface Wish {
  id: string;
  name: string;
  /** Composed label, e.g. "Groom's College Mate" — see composeRelation(). */
  relation: string;
  message: string;
  createdAt: string;
  /** Soft-delete flag; only ever present on the admin endpoint's payload. */
  deleted?: boolean;
}

/** Which side of the family a wish came from, derived from `relation`. */
export type WishSide = "bride" | "groom" | "both";

// ── Chatbot ───────────────────────────────────────────────────────────────────
export interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}
