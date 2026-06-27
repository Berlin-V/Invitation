"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink } from "lucide-react";
import Image from "next/image";

import { DRIVE, COUPLE, WEDDING_DATE } from "@/lib/config";
const ENGAGEMENT_DRIVE = DRIVE.engagementAlbum;

// Placeholder engagement photos — replace with actual Drive photo URLs
const engagementPhotos = Array.from({ length: 9 }, (_, i) => ({
  id: i + 1,
  src: `https://picsum.photos/seed/engagement${i + 1}/600/800`,
  alt: `${COUPLE.groom} & ${COUPLE.bride} - Engagement ${i + 1}`,
  aspect: i % 3 === 0 ? "tall" : i % 3 === 1 ? "wide" : "square",
}));

const albums = [
  {
    id: "engagement",
    title: "Engagement",
    subtitle: "The day she said yes",
    emoji: "💍",
    photos: engagementPhotos,
    available: true,
  },
  {
    id: "pre-wedding",
    title: "Pre-Wedding",
    subtitle: "Coming soon",
    emoji: "🌸",
    photos: [],
    available: false,
  },
  {
    id: "wedding",
    title: "Wedding Day",
    subtitle: WEDDING_DATE.display,
    emoji: "🕊️",
    photos: [],
    available: false,
  },
  {
    id: "reception",
    title: "Reception",
    subtitle: "Evening celebrations",
    emoji: "✨",
    photos: [],
    available: false,
  },
];

export default function GalleryPage() {
  const [activeAlbum, setActiveAlbum] = useState(albums[0]);
  const [lightboxPhoto, setLightboxPhoto] = useState<typeof engagementPhotos[0] | null>(null);

  return (
    <div className="min-h-screen pt-20" style={{ background: "linear-gradient(180deg, #080503 0%, #0D0804 100%)" }}>
      {/* Lightbox */}
      <AnimatePresence>
        {lightboxPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-lg p-4"
            onClick={() => setLightboxPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              className="relative max-w-3xl w-full max-h-[90vh] rounded-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={lightboxPhoto.src}
                alt={lightboxPhoto.alt}
                width={900}
                height={1200}
                className="w-full h-full object-contain"
              />
              <button
                onClick={() => setLightboxPhoto(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white"
              >
                <X size={16} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <section className="py-20 px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <p className="font-sans-custom text-[11px] tracking-[0.5em] uppercase text-[var(--orange)] mb-4">Captured Moments</p>
          <h1 className="font-script text-6xl md:text-7xl text-orange-gradient mb-4">Our Gallery</h1>
          <p className="font-serif text-lg text-[#FAF5EE]/60 italic">A collection of beautiful memories</p>
        </motion.div>
      </section>

      <div className="divider-orange max-w-sm mx-auto mb-12" />

      {/* Album tabs */}
      <section className="px-6 max-w-6xl mx-auto">
        <div className="flex gap-3 flex-wrap justify-center mb-12">
          {albums.map((album) => (
            <button
              key={album.id}
              onClick={() => album.available && setActiveAlbum(album)}
              className={`flex items-center gap-2 px-5 py-3 rounded-full border font-sans-custom text-xs tracking-widest uppercase transition-all duration-300 ${
                activeAlbum.id === album.id
                  ? "border-[var(--orange)] bg-[var(--orange)]/15 text-[var(--orange)]"
                  : album.available
                  ? "border-[var(--orange)]/20 text-[#FAF5EE]/50 hover:border-[var(--orange)]/40"
                  : "border-white/10 text-[#FAF5EE]/25 cursor-not-allowed"
              }`}
            >
              <span>{album.emoji}</span>
              <span>{album.title}</span>
              {!album.available && <span className="text-[9px] text-[#FAF5EE]/30 normal-case">soon</span>}
            </button>
          ))}
        </div>

        {/* Drive link */}
        <div className="text-center mb-8">
          <a
            href={ENGAGEMENT_DRIVE}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-sans-custom text-xs tracking-widest uppercase text-[var(--orange)] border border-[var(--orange)]/30 px-5 py-2.5 rounded-full hover:bg-[var(--orange)]/10 transition-all"
          >
            <ExternalLink size={12} />
            View Full Album on Google Drive
          </a>
        </div>

        {/* Photo grid */}
        {activeAlbum.available && activeAlbum.photos.length > 0 ? (
          <motion.div
            key={activeAlbum.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="columns-2 md:columns-3 gap-3 space-y-3 pb-24"
          >
            {activeAlbum.photos.map((photo, i) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="break-inside-avoid cursor-pointer group overflow-hidden rounded-xl"
                onClick={() => setLightboxPhoto(photo)}
              >
                <div className="relative overflow-hidden rounded-xl">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    width={600}
                    height={800}
                    className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                    <span className="font-sans-custom text-[10px] tracking-widest uppercase text-white/80">View</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 glass-card max-w-md mx-auto mb-24"
          >
            <div className="text-5xl mb-4">{activeAlbum.emoji}</div>
            <h3 className="font-script text-4xl text-orange-gradient mb-3">{activeAlbum.title}</h3>
            <p className="font-sans-custom text-sm text-[#FAF5EE]/40">{activeAlbum.subtitle}</p>
            <p className="font-sans-custom text-xs text-[#FAF5EE]/30 mt-3">Photos will be added soon</p>
          </motion.div>
        )}
      </section>
    </div>
  );
}
