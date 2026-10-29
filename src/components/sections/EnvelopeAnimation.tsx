"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { EASE } from "@/constants/motion";
import { COUPLE, MEDIA, WEDDING_DATE } from "@/constants";

interface EnvelopeAnimationProps {
  onEnter: () => void;
}

/** How long the flap takes to fall open before the site is revealed. */
const OPEN_TO_ENTER_MS = 900;

/* The envelope is one sheet of deep red pressed paper filling the whole
   screen. Every tone here is mixed from that one base so the folds, the
   embossing and the grain all read as the same material under one light. */
const RED = {
  body: "#9C3123",
  flap: "#A93A2B",
  deepest: "#7A2217",
  highlight: "rgba(255,198,178,0.2)",
  shadow: "rgba(70,14,7,0.34)",
};
const CREAM = "#F2E2CF";

/* Where the flap's V closes — the seal is pressed over that point, and the
   lower folds run out from it to the bottom corners. Shared by the clip
   paths, the crease lines and the seal so the three always meet. */
const APEX_Y = 60; // % of viewport height
const FLAP_SIDE_Y = 46; // % — where the flap's edge leaves the left/right sides

/* Tone-on-tone line art pressed into the flap. Drawn once and stamped three
   times by <use>: a pale copy up-left, a dark copy down-right, then the paper
   colour on top — which is what makes a same-colour line read as raised. */
const FLORA_ID = "envelope-flora";

export default function EnvelopeAnimation({ onEnter }: EnvelopeAnimationProps) {
  // The envelope stays sealed until the visitor opens it themselves —
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
      className="fixed inset-0 z-[90] overflow-hidden"
      onClick={breakSeal}
      style={{
        backgroundColor: RED.body,
        perspective: "1400px",
        cursor: opening ? "default" : "pointer",
        WebkitTapHighlightColor: "transparent",
      }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {/* ── Envelope body: the paper everything else is folded from ───────── */}
      <div className="absolute inset-0" style={{ background: RED.body }}>
        <PaperGrain />
        {/* Light pools in the middle of the sheet and falls off at the edges */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 38%, rgba(255,150,120,0.16) 0%, transparent 58%), radial-gradient(100% 70% at 50% 108%, rgba(60,10,4,0.55) 0%, transparent 60%)",
          }}
        />
        {/* The two lower folds, running out from the seal to the bottom corners */}
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <g fill="none" vectorEffect="non-scaling-stroke" strokeWidth={1}>
            <path
              d={`M0 1000 L500 ${APEX_Y * 10} L1000 1000`}
              stroke={RED.shadow}
              vectorEffect="non-scaling-stroke"
            />
            <path
              d={`M0 ${1000 - 4} L500 ${APEX_Y * 10 - 4} L1000 ${1000 - 4}`}
              stroke={RED.highlight}
              vectorEffect="non-scaling-stroke"
            />
          </g>
        </svg>
      </div>

      {/* ── Flap: carries the embossed flora and the invitation to open ───── */}
      <motion.div
        className="absolute inset-0"
        style={{
          transformOrigin: "top center",
          transformStyle: "preserve-3d",
          zIndex: 10,
          pointerEvents: "none",
          // drop-shadow has to sit on an unclipped wrapper: the browser clips
          // after filtering, so a shadow on the clipped layer is cut away.
          filter: "drop-shadow(0 6px 16px rgba(55,10,4,0.45))",
        }}
        animate={{ rotateX: opening ? -168 : 0 }}
        transition={{ duration: 0.62, ease: EASE }}
      >
        <div
          className="absolute inset-0"
          style={{
            clipPath: `polygon(0 0, 100% 0, 100% ${FLAP_SIDE_Y}%, 50% ${APEX_Y}%, 0 ${FLAP_SIDE_Y}%)`,
            background: `linear-gradient(176deg, ${RED.flap} 0%, ${RED.body} 72%, ${RED.deepest} 100%)`,
          }}
        >
          <PaperGrain />

          {/* Pressed line art. It's given an explicit band to live in — from
              the top of the flap down to just above the wording — and fits
              itself to that band. Sizing it by width alone let it grow past
              "Tap to Open" on a short, wide window. */}
          <div
            className="absolute flex justify-center"
            style={{ top: "5%", left: 0, right: 0, height: `${FLAP_SIDE_Y - 16}%` }}
          >
          <svg
            viewBox="0 0 400 260"
            aria-hidden="true"
            preserveAspectRatio="xMidYMid meet"
            style={{ width: "min(94vw, 620px)", height: "100%" }}
          >
            <defs>
              <g
                id={FLORA_ID}
                fill="none"
                strokeWidth={3.1}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* leaf bleeding off the left edge */}
                <path d="M4 112 C 24 99, 48 103, 57 120 C 37 135, 13 131, 4 112 Z" />

                {/* upright stem, upper left */}
                <path d="M150 16 C 142 58, 134 90, 116 120" />
                <path d="M139 56 C 112 44, 86 54, 80 77 C 108 88, 131 77, 139 56 Z" />
                <path d="M131 86 C 147 69, 174 65, 188 77 C 176 98, 147 103, 131 86 Z" />

                {/* arching stem, upper right */}
                <path d="M298 14 C 294 53, 286 86, 266 116" />
                <path d="M292 51 C 318 38, 344 49, 350 72 C 322 83, 300 72, 292 51 Z" />
                <path d="M284 84 C 267 69, 240 71, 232 92 C 255 107, 276 100, 284 84 Z" />

                {/* loose five-petal flower, lower left */}
                <g transform="translate(92,186)">
                  <path d="M0 0 C -31 -20, -41 -59, 0 -75 C 41 -59, 31 -20, 0 0 Z" />
                  <path
                    d="M0 0 C -31 -20, -41 -59, 0 -75 C 41 -59, 31 -20, 0 0 Z"
                    transform="rotate(72)"
                  />
                  <path
                    d="M0 0 C -31 -20, -41 -59, 0 -75 C 41 -59, 31 -20, 0 0 Z"
                    transform="rotate(144)"
                  />
                  <path
                    d="M0 0 C -31 -20, -41 -59, 0 -75 C 41 -59, 31 -20, 0 0 Z"
                    transform="rotate(216)"
                  />
                  <path
                    d="M0 0 C -31 -20, -41 -59, 0 -75 C 41 -59, 31 -20, 0 0 Z"
                    transform="rotate(288)"
                  />
                  <path d="M0 0 C -15 -11, -20 -30, 0 -37 C 20 -30, 15 -11, 0 0 Z" transform="rotate(36)" />
                  <path d="M0 0 C -15 -11, -20 -30, 0 -37 C 20 -30, 15 -11, 0 0 Z" transform="rotate(180)" />
                  <circle cx="0" cy="-8" r="5" />
                </g>

                {/* heart bloom and tulip, lower right */}
                <path d="M311 252 C 305 224, 299 205, 294 191" />
                <path d="M294 191 C 264 171, 260 143, 279 139 C 290 137, 296 146, 296 156 C 296 146, 303 137, 313 140 C 331 145, 326 172, 294 191 Z" />
                <path d="M352 238 C 352 212, 352 192, 352 177" />
                <path d="M352 177 C 335 170, 329 149, 338 139 C 346 146, 349 156, 352 165 C 355 156, 359 146, 367 139 C 375 149, 369 170, 352 177 Z" />

                {/* seed dots drifting down toward the seal */}
                <circle cx="201" cy="206" r="5" />
                <circle cx="219" cy="219" r="4" />
                <circle cx="236" cy="203" r="6" />
              </g>
            </defs>
            <use href={`#${FLORA_ID}`} x={-1.4} y={-1.6} stroke="rgba(255,206,188,0.34)" />
            <use href={`#${FLORA_ID}`} x={1.6} y={1.8} stroke="rgba(62,12,6,0.42)" />
            <use href={`#${FLORA_ID}`} stroke={RED.flap} />
          </svg>
          </div>

          {/* The one instruction, sitting just above the flap's edge */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: opening ? 0 : 1 }}
            transition={{ duration: opening ? 0.22 : 0.9, delay: opening ? 0 : 1.0 }}
            style={{
              position: "absolute",
              top: `${FLAP_SIDE_Y - 7}%`,
              left: 0,
              right: 0,
              textAlign: "center",
              fontFamily: "var(--font-allura), cursive",
              fontSize: "clamp(1.9rem, 7.5vw, 2.9rem)",
              color: CREAM,
              textShadow: "0 1px 2px rgba(60,12,5,0.5)",
              padding: "0 1.5rem",
            }}
          >
            Tap to Open
          </motion.p>
        </div>
      </motion.div>

      {/* ── Wax seal — pressed over the apex, and the thing to press ──────── */}
      <motion.button
        type="button"
        onClick={breakSeal}
        aria-label="Open the invitation"
        initial={{ scale: 0, opacity: 0, rotate: -12 }}
        animate={{
          scale: opening ? 0.42 : 1,
          opacity: opening ? 0 : 1,
          rotate: 0,
        }}
        transition={
          opening
            ? { duration: 0.34, ease: "easeIn" }
            : { duration: 0.75, delay: 0.3, ease: [0.34, 1.56, 0.64, 1] }
        }
        whileHover={opening ? undefined : { scale: 1.06 }}
        whileTap={opening ? undefined : { scale: 0.94 }}
        style={{
          position: "absolute",
          top: `${APEX_Y}%`,
          left: "50%",
          x: "-50%",
          y: "-50%",
          zIndex: 20,
          width: "clamp(132px, 35vw, 196px)",
          height: "clamp(132px, 35vw, 196px)",
          borderRadius: "50%",
          border: "none",
          padding: 0,
          cursor: opening ? "default" : "pointer",
          background:
            "radial-gradient(circle at 36% 28%, #FFFAF2 0%, #F3E3CD 44%, #DCC5A6 100%)",
          boxShadow:
            "0 12px 30px rgba(52,10,4,0.5), 0 2px 6px rgba(52,10,4,0.35), inset 0 2px 4px rgba(255,255,255,0.8), inset 0 -5px 12px rgba(166,136,100,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        {/* Rippled wax rim, as if the stamp pushed the wax outward */}
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background:
              "repeating-conic-gradient(from 0deg, rgba(255,255,255,0.55) 0deg 3deg, rgba(168,138,100,0.4) 3deg 6deg)",
            WebkitMaskImage:
              "radial-gradient(circle, transparent 76%, #000 83%, #000 100%)",
            maskImage:
              "radial-gradient(circle, transparent 76%, #000 83%, #000 100%)",
            opacity: 0.5,
          }}
        />
        {/* Pressed inner ring */}
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: "13%",
            borderRadius: "50%",
            border: "1px solid rgba(150,118,84,0.4)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.7)",
          }}
        />
        {/* The logo, stamped into the wax. One colour of wax rather than gold,
            as on the reference seal — the white shadow under the mark is what
            makes it read as raised. The logo is the mask rather than an <img>:
            a filter can darken an image but not tint it, since sepia() has
            nothing to work with once brightness(0) has made the mark black. */}
        <span
          aria-hidden="true"
          style={{
            position: "relative",
            width: "58%",
            aspectRatio: "791 / 428", // the logo's own ratio, so contain is exact
            background: "#96754F",
            opacity: 0.6,
            WebkitMaskImage: `url(${MEDIA.logo})`,
            maskImage: `url(${MEDIA.logo})`,
            WebkitMaskSize: "contain",
            maskSize: "contain",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            maskPosition: "center",
            filter: "drop-shadow(0 1.6px 0.4px rgba(255,255,255,0.95))",
          }}
        />
      </motion.button>

      {/* ── The invitation itself, written across the lower fold ──────────── */}
      <motion.div
        className="absolute flex flex-col items-center"
        style={{
          // Anchored with left/right rather than a centring transform: this
          // block animates, and framer-motion's transform would wipe a translateX.
          left: 0,
          right: 0,
          bottom: "calc(env(safe-area-inset-bottom, 0px) + 7%)",
          zIndex: 15,
          width: "100%",
          padding: "0 1.5rem",
          textAlign: "center",
          color: CREAM,
          textShadow: "0 1px 2px rgba(60,12,5,0.45)",
          pointerEvents: "none",
        }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: opening ? 0 : 1, y: 0 }}
        transition={
          opening
            ? { duration: 0.25 }
            : { delay: 1.2, duration: 0.9, ease: EASE }
        }
      >
        <p
          style={{
            fontFamily: "var(--font-allura), cursive",
            fontSize: "clamp(1.25rem, 5vw, 1.8rem)",
            lineHeight: 1.5,
          }}
        >
          With love and blessings,
          <br />
          we invite you to the wedding of
        </p>
        <p
          style={{
            fontFamily: "var(--font-allura), cursive",
            fontSize: "clamp(1.7rem, 7vw, 2.5rem)",
            lineHeight: 1.3,
            marginTop: "0.15rem",
          }}
        >
          {COUPLE.groom} &amp; {COUPLE.bride}
        </p>
        <p
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "0.9rem",
            letterSpacing: "0.34em",
            textTransform: "uppercase",
            color: "rgba(242,226,207,0.72)",
            marginTop: "0.85rem",
            whiteSpace: "nowrap",
          }}
        >
          {WEDDING_DATE.display}
        </p>
      </motion.div>
    </motion.div>
  );
}

/** The tooth of the paper. Two frequencies so it reads as pressed card
 *  rather than television static. */
function PaperGrain() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        opacity: 0.16,
        mixBlendMode: "overlay",
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\"), url(\"data:image/svg+xml,%3Csvg viewBox='0 0 600 600' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='m'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.16' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23m)'/%3E%3C/svg%3E\")",
      }}
    />
  );
}
