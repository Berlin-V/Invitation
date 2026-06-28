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
export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  category?: string;
}

export interface GalleryAlbum {
  id: string;
  label: string;
  images: GalleryImage[];
}

// ── Wishes / Guestbook ────────────────────────────────────────────────────────
export interface WishEntry {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: Date | string;
}

// ── Events ────────────────────────────────────────────────────────────────────
export interface EventItem {
  title: string;
  time: string;
  mapUrl: string;
  icon: string;
  description: string;
}

export interface EventGroup {
  label: string;
  date: string;
  timeRange: string;
  items: EventItem[];
}

// ── Dress code ────────────────────────────────────────────────────────────────
export interface DressCodeColor {
  hex: string;
  name: string;
}

// ── Chatbot ───────────────────────────────────────────────────────────────────
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// ── API responses ─────────────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
}
