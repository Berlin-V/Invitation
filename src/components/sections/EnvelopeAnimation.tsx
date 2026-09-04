"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { EASE } from "@/constants/motion";
import { COUPLE, MEDIA, WEDDING_DATE } from "@/constants";

interface EnvelopeAnimationProps {
  onEnter: () => void;
}

/** How long the flap takes to fall open before the site is revealed. */
const OPEN_TO_ENTER_MS = 620;

export default function EnvelopeAnimation({ onEnter }: EnvelopeAnimationProps) {
  // The envelope stays sealed until the visitor breaks the seal themselves —
  // opening it is the only step, and it leads straight to the site.
  const [opening, setOpening] = useState(false);
  const enterTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (enterTimer.current) clearTimeout(enterTimer.current);
  }, []);

  const breakSeal = useCallback(() => {
    if (opening) return;
    setOpening(true);
    enterTimer.current = setTimeout(onEnter, OPEN_TO_ENTER_MS);
  }, [opening, onEnter]);

  return (
    <motion.div
      className="fixed inset-0 z-[90] flex flex-col items-center justify-center"
      style={{ backgroundColor: "#0F0C09" }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {/* Ambient grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0.025, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.94 }}
        animate={{
          opacity: opening ? 0 : 1,
          y: opening ? -18 : 0,
          scale: opening ? 0.96 : 1,
        }}
        transition={
          opening
            ? { duration: OPEN_TO_ENTER_MS / 1000, ease: "easeIn" }
            : { duration: 1.0, ease: EASE }
        }
        style={{ perspective: "1000px" }}
      >
        {/* Envelope body */}
        <div
          style={{
            width: "clamp(300px, 84vw, 440px)",
            height: "clamp(196px, 52vw, 276px)",
            position: "relative",
            background: "#F6F1E9",
            border: "1px solid rgba(217,180,65,0.4)",
            boxShadow: "0 24px 70px rgba(0,0,0,0.45)",
          }}
        >
          {/* Bottom V-fold lines (decorative) */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top right, rgba(217,180,65,0.09), transparent 50%), linear-gradient(to top left, rgba(217,180,65,0.09), transparent 50%)",
              pointerEvents: "none",
            }}
          />

          {/* Flap */}
          <motion.div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "50%",
              transformOrigin: "top center",
              transformStyle: "preserve-3d",
              zIndex: 10,
              pointerEvents: "none",
            }}
            animate={{ rotateX: opening ? -175 : 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            {/* Flap front face */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                background: "#EAE1D0",
                borderTop: "1px solid rgba(217,180,65,0.4)",
              }}
            />
            {/* Flap back face (shows when flipped) */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                background: "#F0EBE1",
                transform: "rotateX(180deg)",
                backfaceVisibility: "hidden",
              }}
            />
          </motion.div>

          {/* Wax seal — carries the monogram and is the only thing to press */}
          <motion.button
            type="button"
            onClick={breakSeal}
            aria-label="Break the seal and open the invitation"
            initial={{ scale: 0, opacity: 0, rotate: -12 }}
            animate={{
              scale: opening ? 0.4 : 1,
              opacity: opening ? 0 : 1,
              rotate: 0,
            }}
            transition={
              opening
                ? { duration: 0.32, ease: "easeIn" }
                : { duration: 0.7, delay: 0.35, ease: [0.34, 1.56, 0.64, 1] }
            }
            whileHover={opening ? undefined : { scale: 1.07 }}
            whileTap={opening ? undefined : { scale: 0.93 }}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              x: "-50%",
              y: "-50%",
              zIndex: 20,
              width: "clamp(92px, 24vw, 116px)",
              height: "clamp(92px, 24vw, 116px)",
              borderRadius: "50%",
              border: "none",
              padding: 0,
              cursor: opening ? "default" : "pointer",
              background:
                "radial-gradient(circle at 34% 30%, #F0D07A 0%, #D9B441 42%, #A67E22 100%)",
              boxShadow:
                "0 3px 22px rgba(150,115,30,0.55), inset 0 2px 3px rgba(255,255,255,0.4), inset 0 -3px 6px rgba(110,82,18,0.42)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            {/* Pressed-wax inner ring */}
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: "7%",
                borderRadius: "50%",
                border: "1px solid rgba(255,253,249,0.3)",
              }}
            />
            {/* The logo, stamped into the wax. The source mark is gold, which
                would vanish against the wax, so it renders as cream here.
                Plain <img>: the SVG is already resolution-independent, and
                next/image will not optimize SVG without dangerouslyAllowSVG. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={MEDIA.logo}
              alt=""
              aria-hidden="true"
              style={{
                position: "relative",
                width: "62%",
                height: "auto",
                filter:
                  "brightness(0) invert(1) drop-shadow(0 1px 1px rgba(112,84,20,0.6))",
                opacity: 0.95,
              }}
            />
          </motion.button>
        </div>
      </motion.div>

      {/* Press hint — fades out the moment the seal is broken */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: opening ? 0 : 1 }}
        transition={{ duration: opening ? 0.25 : 0.9, delay: opening ? 0 : 1.1 }}
        style={{
          marginTop: "2.25rem",
          fontFamily: "var(--font-cormorant), Georgia, serif",
          fontSize: "0.72rem",
          letterSpacing: "0.26em",
          color: "#F2DCA0",
          textTransform: "uppercase",
          textAlign: "center",
          padding: "0 1.5rem",
        }}
      >
        Tap the seal to open
      </motion.p>

      {/* Ambient names + date at the bottom */}
      <motion.div
        className="absolute flex flex-col items-center"
        style={{
          left: "50%",
          transform: "translateX(-50%)",
          bottom: "calc(env(safe-area-inset-bottom, 0px) + 1.75rem)",
          gap: "0.5rem",
          width: "100%",
          padding: "0 1.5rem",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.9 }}
      >
        <p
          style={{
            fontFamily: "var(--font-allura), cursive",
            fontSize: "clamp(1.35rem, 5vw, 1.75rem)",
            color: "#D9B441",
            lineHeight: 1.1,
            textAlign: "center",
          }}
        >
          {COUPLE.groom} &amp; {COUPLE.bride}
        </p>
        <p
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "0.64rem",
            letterSpacing: "0.34em",
            color: "rgba(242,220,160,0.7)",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          {WEDDING_DATE.display}
        </p>
      </motion.div>
    </motion.div>
  );
}
