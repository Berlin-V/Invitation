"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";

import { ENGAGEMENT_PHOTOS } from "@/constants/gallery";
import BackToHome from "@/components/ui/BackToHome";
import type { GalleryPhoto } from "@/types";

export default function GalleryPage() {
  const [lightboxPhoto, setLightboxPhoto] = useState<GalleryPhoto | null>(null);

  return (
    <div className="min-h-screen pt-20" style={{ background: "linear-gradient(180deg, #080503 0%, #0D0804 100%)" }}>
      <BackToHome href="/#gallery" />

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
                width={lightboxPhoto.w}
                height={lightboxPhoto.h}
                quality={90}
                sizes="(max-width: 768px) 92vw, 768px"
                className="h-auto w-full object-contain"
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
          <p className="font-sans-custom text-[11px] tracking-[0.5em] uppercase text-orange mb-4">Captured Moments</p>
          <h1 className="font-script text-6xl md:text-7xl text-orange-gradient mb-4">Our Gallery</h1>
          <p className="font-serif text-lg text-[#FAF5EE]/60 italic">A collection of beautiful memories</p>
        </motion.div>
      </section>

      <div className="divider-orange max-w-sm mx-auto mb-12" />

      {/* Photo grid */}
      <section className="px-6 max-w-6xl mx-auto">
        {ENGAGEMENT_PHOTOS.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="columns-2 md:columns-3 gap-3 space-y-3 pb-24"
          >
            {ENGAGEMENT_PHOTOS.map((photo, i) => (
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
                    width={photo.w}
                    height={photo.h}
                    quality={90}
                    sizes="(max-width: 768px) 48vw, 33vw"
                    className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
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
            <div className="text-5xl mb-4">💍</div>
            <h3 className="font-script text-4xl text-orange-gradient mb-3">Engagement</h3>
            <p className="font-sans-custom text-sm text-[#FAF5EE]/52">The day she said yes</p>
            <p className="font-sans-custom text-xs text-[#FAF5EE]/52 mt-3">Photos will be added soon</p>
          </motion.div>
        )}
      </section>
    </div>
  );
}
