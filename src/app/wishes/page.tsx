"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Send } from "lucide-react";
import { COUPLE } from "@/constants";
import BackToHome from "@/components/ui/BackToHome";
import { composeRelation } from "@/lib/wish-relation";
import type { Wish } from "@/types";

const OG = "linear-gradient(135deg,#F0BC3F,#FBE49C,#F9DE93)";

/* Each note takes one of these warm accents, cycled by position, so the wall
   reads as a collage of different hands rather than one repeated card. */
const NOTE_ACCENTS = [
  { hex: "#F0BC3F", rgb: "240,188,63" },  // gold
  { hex: "#F58893", rgb: "245,136,147" }, // blush
  { hex: "#E9A23B", rgb: "233,162,59" },  // amber
  { hex: "#EE7863", rgb: "238,120,99" },  // coral
] as const;

const accentFor = (i: number) => NOTE_ACCENTS[i % NOTE_ACCENTS.length];

// Deterministic golden-angle spread — avoids Math.random(), which would differ
// between server and client render and break hydration.
const BOKEH = Array.from({ length: 20 }, (_, i) => {
  const angle = i * 137.5;
  return {
    left: `${angle % 100}%`,
    top: `${(angle * 1.9) % 100}%`,
    size: 8 + (i % 5) * 9,
    rgb: accentFor(i).rgb,
    duration: 9 + (i % 5) * 2,
    delay: (i % 6) * 0.8,
  };
});

function RingMomentBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      <Image
        src="/images/ringMoment.jpeg"
        alt=""
        fill
        sizes="100vw"
        style={{ objectFit: "cover", objectPosition: "center", opacity: 0.16, filter: "sepia(0.4) saturate(1.25)" }}
      />
      {/* Warm light pooling in from two corners, in place of the old 28px
          gold mesh — that grid flattened the photo into grey noise. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 50% at 12% 0%, rgba(240,188,63,0.20) 0%, transparent 62%), radial-gradient(70% 55% at 90% 78%, rgba(238,120,99,0.16) 0%, transparent 64%)",
        }}
      />
      {/* Settle it into the page's ground so the photo never fights the text */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, rgba(20,8,9,0.78) 0%, rgba(14,6,7,0.9) 55%, #0B0506 100%)" }}
      />
    </div>
  );
}

/** Soft out-of-focus lights. The previous decor was dim emoji at 8% opacity,
 *  which rendered as brown specks rather than atmosphere. */
function FloatingDecor() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {BOKEH.map((b, i) => (
        <motion.span
          key={i}
          style={{
            position: "absolute",
            left: b.left,
            top: b.top,
            width: b.size,
            height: b.size,
            borderRadius: "50%",
            background: `radial-gradient(circle at 35% 32%, rgba(${b.rgb},0.85) 0%, rgba(${b.rgb},0.25) 55%, transparent 72%)`,
            filter: "blur(1px)",
          }}
          animate={{ y: [0, -26, 0], opacity: [0.14, 0.42, 0.14] }}
          transition={{ duration: b.duration, delay: b.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

const SIDES = [
  { key: "groom", label: COUPLE.groom, emoji: "🤵" },
  { key: "bride", label: COUPLE.bride, emoji: "👰" },
  { key: "both", label: `${COUPLE.groom} & ${COUPLE.bride}`, emoji: "💑" },
] as const;

const RELATION_TYPES = [
  { key: "friend", label: "Friend", emoji: "🤝" },
  { key: "school", label: "School Mate", emoji: "🏫" },
  { key: "college", label: "College Mate", emoji: "🎓" },
  { key: "office", label: "Office Colleague", emoji: "💼" },
  { key: "family", label: "Family", emoji: "❤️" },
  { key: "wellwisher", label: "Well-wisher", emoji: "🌟" },
  { key: "other", label: "Other", emoji: "✨" },
] as const;

type SideKey = (typeof SIDES)[number]["key"];
type RelationTypeKey = (typeof RELATION_TYPES)[number]["key"];

function relationFor(side: SideKey | null, type: RelationTypeKey | null): string {
  if (!side || !type) return "";
  const typeLabel = RELATION_TYPES.find((t) => t.key === type)!.label;
  return composeRelation(side, typeLabel);
}

/** Shared look for the unselected pills. They used to sit at 4% white with a
 *  60%-white label, which read as disabled rather than pickable. */
const pillStyle = (selected: boolean) => ({
  background: selected
    ? "linear-gradient(135deg,#F0BC3F,#F8D977)"
    : "rgba(255,253,249,0.07)",
  border: `1px solid ${selected ? "transparent" : "rgba(240,188,63,0.3)"}`,
  color: selected ? "#2A1F14" : "rgba(255,253,249,0.86)",
  boxShadow: selected ? "0 6px 18px rgba(240,188,63,0.28)" : "none",
});

/* ── Two-step relation picker — pick a side, then a relation type ── */
function RelationPicker({ onChange }: { onChange: (relation: string) => void }) {
  const [side, setSide] = useState<SideKey | null>(null);
  const [type, setType] = useState<RelationTypeKey | null>(null);
  const composed = relationFor(side, type);
  const sideMeta = SIDES.find((s) => s.key === side);
  const typeMeta = RELATION_TYPES.find((t) => t.key === type);

  const selectSide = (s: SideKey) => {
    setSide(s);
    onChange(relationFor(s, type));
  };
  const selectType = (t: RelationTypeKey) => {
    setType(t);
    onChange(relationFor(side, t));
  };

  return (
    <div className="space-y-3">
      <div>
        <p className="font-sans-custom text-[10px] tracking-widest uppercase text-[#F0BC3F] mb-2">
          You&rsquo;re here for the…
        </p>
        <div className="flex gap-2 flex-wrap">
          {SIDES.map((s) => (
            <motion.button
              key={s.key}
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => selectSide(s.key)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full font-sans-custom text-xs transition-colors"
              style={pillStyle(side === s.key)}
            >
              <span>{s.emoji}</span> {s.label}
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {side && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="font-sans-custom text-[10px] tracking-widest uppercase text-[#F0BC3F] mb-2 mt-1">
              And your relation is…
            </p>
            <div className="flex gap-2 flex-wrap">
              {RELATION_TYPES.map((t) => (
                <motion.button
                  key={t.key}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => selectType(t.key)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full font-sans-custom text-xs transition-colors"
                  style={pillStyle(type === t.key)}
                >
                  <span>{t.emoji}</span> {t.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {composed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{ background: "rgba(240,188,63,0.16)", border: "1px solid rgba(240,188,63,0.42)" }}
          >
            <span className="text-sm">{sideMeta?.emoji} {typeMeta?.emoji}</span>
            <span className="font-sans-custom text-xs text-[#F9DE93]">{composed}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── One note pinned to the wall ──────────────────────────────────────────
   The message is shown in full rather than clamped behind a hover: on a phone
   there is no hover, so the old card hid most of what people came to read. */
function WishNote({ wish, index }: { wish: Wish; index: number }) {
  const accent = accentFor(index);
  const initials = wish.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const tilt = ((index % 3) - 1) * 0.7; // −0.7°, 0°, +0.7°, repeating

  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: Math.min(index, 8) * 0.06, duration: 0.5 }}
      className="mb-4 break-inside-avoid"
    >
      <article
        className="wish-note relative overflow-hidden px-5 py-5"
        style={{
          // Consumed by the .wish-note hover rule in globals.css
          ["--accent-rgb" as string]: accent.rgb,
          ["--tilt" as string]: `${tilt}deg`,
          background: `linear-gradient(155deg, rgba(${accent.rgb},0.17) 0%, rgba(255,253,249,0.05) 58%, rgba(255,253,249,0.025) 100%)`,
          border: `1px solid rgba(${accent.rgb},0.32)`,
          borderRadius: 18,
          boxShadow: "0 18px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,253,249,0.1)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
      >
        {/* Oversized quote mark watermarked into the top-right corner. It sits
            fully inside the card: the rounded corners need overflow-hidden,
            which would otherwise clip a bled-off glyph into a half mark. */}
        <span
          aria-hidden="true"
          className="font-script pointer-events-none select-none"
          style={{
            position: "absolute",
            top: 0,
            right: 14,
            fontSize: "4rem",
            lineHeight: 1,
            color: accent.hex,
            opacity: 0.18,
            zIndex: 0,
          }}
        >
          &rdquo;
        </span>

        {/* Who wrote it */}
        <div className="relative flex items-center gap-3 mb-3" style={{ zIndex: 1 }}>
          <div
            className="flex items-center justify-center flex-shrink-0 font-sans-custom text-sm font-semibold"
            style={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${accent.hex}, rgba(255,253,249,0.85))`,
              color: "#2A1F14",
              boxShadow: `0 4px 14px rgba(${accent.rgb},0.35)`,
            }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-sans-custom text-sm font-medium truncate" style={{ color: "#FFFDF9" }}>
              {wish.name}
            </p>
            <p className="font-sans-custom text-[10px] truncate" style={{ color: accent.hex }}>
              {wish.relation}
            </p>
          </div>
        </div>

        {/* The wish itself */}
        <p
          className="font-serif text-[0.95rem] leading-relaxed"
          style={{ color: "rgba(255,253,249,0.9)" }}
        >
          {wish.message}
        </p>

        {/* Footer */}
        <div
          className="flex items-center justify-between mt-4 pt-3"
          style={{ borderTop: `1px solid rgba(${accent.rgb},0.2)` }}
        >
          <span className="flex items-center gap-1.5">
            <Heart size={11} fill={accent.hex} style={{ color: accent.hex }} />
            <span className="font-sans-custom text-[9px] tracking-wider uppercase" style={{ color: `rgba(${accent.rgb},0.95)` }}>
              wishes for the couple
            </span>
          </span>
          <span className="font-sans-custom text-[9px]" style={{ color: "rgba(255,253,249,0.6)" }}>
            {new Date(wish.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
          </span>
        </div>
      </article>
    </motion.div>
  );
}

export default function WishesPage() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchWishes = useCallback(async () => {
    try {
      const data = await fetch("/api/wishes").then((r) => r.json());
      setWishes(data.wishes || []);
    } catch { setWishes([]); }
    finally { setLoading(false); }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch on mount.
  useEffect(() => { fetchWishes(); }, [fetchWishes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !relation || !message.trim() || submitting) return;
    setSubmitting(true); setError("");
    try {
      const res = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, relation, message }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Failed to submit");
      else { setSubmitted(true); setName(""); setRelation(""); setMessage(""); fetchWishes(); }
    } catch { setError("Something went wrong. Please try again."); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="min-h-screen pt-20 relative" style={{ background: "linear-gradient(180deg,#140809 0%,#0B0506 100%)" }}>
      <RingMomentBackdrop />
      <FloatingDecor />

      <BackToHome href="/#wishes" />

      <div className="relative" style={{ zIndex: 1 }}>
      {/* Header */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 text-center relative overflow-hidden">
        <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <p className="font-sans-custom text-[10px] tracking-[0.45em] uppercase text-[#F0BC3F] mb-3">Messages of Love</p>
          <h1
            className="font-script mb-4"
            style={{
              fontSize: "clamp(3rem,10vw,5rem)",
              color: "#F9DE93",
              textShadow: "0 0 40px rgba(240,188,63,0.35)",
            }}
          >
            Wishes Wall
          </h1>
          <div className="divider-gold mx-auto mb-4" style={{ maxWidth: "100px" }} />
          <p className="font-serif text-base sm:text-lg italic max-w-sm mx-auto" style={{ color: "rgba(255,253,249,0.74)" }}>
            Leave your heartfelt blessings for {COUPLE.groom} &amp; {COUPLE.bride}
          </p>
        </motion.div>
      </section>

      {/* Write a wish */}
      <section className="px-4 sm:px-6 max-w-2xl mx-auto mb-14 sm:mb-20">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="rounded-2xl p-6 sm:p-8"
          style={{
            background:
              "linear-gradient(160deg, rgba(255,245,230,0.085) 0%, rgba(255,245,230,0.03) 100%)",
            border: "1px solid rgba(240,188,63,0.34)",
            boxShadow: "0 28px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,253,249,0.12)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
          }}
        >
          <h2 className="font-script text-center mb-5 sm:mb-6"
            style={{ fontSize: "clamp(2rem,6vw,2.8rem)", background: OG,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Send Your Wishes
          </h2>

          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6 space-y-2">
              <div className="text-5xl">🎉</div>
              <p className="font-script text-4xl" style={{ background: OG,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Thank You!
              </p>
              <p className="font-sans-custom text-sm" style={{ color: "rgba(255,253,249,0.74)" }}>
                Your wish has been added to the wall
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                maxLength={60}
                className="wish-field w-full rounded-xl px-4 py-3 font-sans-custom text-sm outline-none"
              />

              <RelationPicker onChange={setRelation} />

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your heartfelt wishes for the couple…"
                rows={4}
                maxLength={500}
                className="wish-field w-full rounded-xl px-4 py-3 font-serif text-base outline-none resize-none leading-relaxed"
              />
              <div className="flex items-center justify-between">
                <span className="font-sans-custom text-[9px]" style={{ color: "rgba(255,253,249,0.6)" }}>
                  {message.length}/500
                </span>
              </div>

              {error && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="font-sans-custom text-sm text-[#F58893] text-center">{error}</motion.p>
              )}

              <motion.button type="submit" disabled={submitting || !name.trim() || !relation || !message.trim()}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="w-full py-3.5 rounded-xl font-sans-custom text-[11px] tracking-widest uppercase disabled:opacity-45 flex items-center justify-center gap-2 transition-opacity"
                style={{ background: "linear-gradient(135deg,#F0BC3F,#F8D977)", color: "#2A1F14",
                  boxShadow: "0 10px 26px rgba(240,188,63,0.3)" }}>
                {submitting ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-4 h-4 rounded-full border-2 border-t-transparent" style={{ borderColor: "#2A1F14", borderTopColor: "transparent" }} />
                ) : (
                  <><Send size={13} /> Send Wishes</>
                )}
              </motion.button>
            </form>
          )}
        </motion.div>
      </section>

      {/* The wall */}
      <section className="px-4 sm:px-6 max-w-5xl mx-auto pb-24">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-8">
          <p className="font-script mb-1"
            style={{ fontSize: "clamp(2rem,6vw,2.8rem)", background: OG,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Messages of Love
          </p>
          <p className="font-sans-custom text-[10px] tracking-widest uppercase" style={{ color: "rgba(255,253,249,0.64)" }}>
            {wishes.length} wish{wishes.length !== 1 ? "es" : ""} · pinned by friends and family
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-8 h-8 rounded-full border-2 border-t-transparent border-[#F0BC3F]" />
          </div>
        ) : wishes.length === 0 ? (
          <div
            className="text-center py-20 rounded-2xl"
            style={{
              background: "linear-gradient(160deg, rgba(255,245,230,0.07), rgba(255,245,230,0.025))",
              border: "1px dashed rgba(240,188,63,0.38)",
            }}
          >
            <div className="text-4xl mb-3">💌</div>
            <p className="font-sans-custom text-sm" style={{ color: "rgba(255,253,249,0.74)" }}>
              Be the first to leave a wish!
            </p>
          </div>
        ) : (
          /* Masonry wall — notes keep their own heights instead of being
             squared off into a single-file comment thread. */
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
            {wishes.map((wish, i) => (
              <WishNote key={wish.id} wish={wish} index={i} />
            ))}
          </div>
        )}
      </section>
      </div>
    </div>
  );
}
