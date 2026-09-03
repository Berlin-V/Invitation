"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Send, ChevronDown, ArrowLeft } from "lucide-react";
import { COUPLE } from "@/lib/config";

interface Wish {
  id: string;
  name: string;
  relation: string;
  message: string;
  createdAt: string;
}

const OG = "linear-gradient(135deg,#C9A56D,#F2CB8E,#E8D5B0)";

// Deterministic golden-angle spread — avoids Math.random(), which would differ
// between server and client render and break hydration.
const FLOAT_ITEMS = Array.from({ length: 18 }, (_, i) => {
  const angle = i * 137.5;
  return {
    left: `${angle % 100}%`,
    top: `${(angle * 1.9) % 100}%`,
    icon: i % 3 === 0 ? "🤍" : i % 3 === 1 ? "✨" : "🧡",
    size: 10 + (i % 4) * 3,
    duration: 6 + (i % 5) * 1.5,
    delay: (i % 6) * 0.6,
  };
});

function RingMomentBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      <Image
        src="/images/ringMoment.jpeg"
        alt=""
        fill
        style={{ objectFit: "cover", objectPosition: "center", opacity: 0.1, filter: "grayscale(0.4)" }}
      />
      {/* Fine grid overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(201,165,109,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,165,109,0.1) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* Blend into the page's dark gradient */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, rgba(8,5,3,0.7) 0%, rgba(8,5,3,0.92) 60%, #0D0804 100%)" }}
      />
    </div>
  );
}

function FloatingDecor() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {FLOAT_ITEMS.map((f, i) => (
        <motion.span
          key={i}
          style={{ position: "absolute", left: f.left, top: f.top, fontSize: f.size }}
          animate={{ y: [0, -18, 0], opacity: [0.08, 0.28, 0.08] }}
          transition={{ duration: f.duration, delay: f.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          {f.icon}
        </motion.span>
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

function composeRelation(side: SideKey | null, type: RelationTypeKey | null): string {
  if (!side || !type) return "";
  const typeLabel = RELATION_TYPES.find((t) => t.key === type)!.label;
  if (side === "groom") return `${COUPLE.groom}'s ${typeLabel}`;
  if (side === "bride") return `${COUPLE.bride}'s ${typeLabel}`;
  return `${typeLabel} of ${COUPLE.groom} & ${COUPLE.bride}`;
}

/* ── Two-step relation picker — pick a side, then a relation type ── */
function RelationPicker({ onChange }: { onChange: (relation: string) => void }) {
  const [side, setSide] = useState<SideKey | null>(null);
  const [type, setType] = useState<RelationTypeKey | null>(null);
  const composed = composeRelation(side, type);
  const sideMeta = SIDES.find((s) => s.key === side);
  const typeMeta = RELATION_TYPES.find((t) => t.key === type);

  const selectSide = (s: SideKey) => {
    setSide(s);
    onChange(composeRelation(s, type));
  };
  const selectType = (t: RelationTypeKey) => {
    setType(t);
    onChange(composeRelation(side, t));
  };

  return (
    <div className="space-y-3">
      <div>
        <p className="font-sans-custom text-[10px] tracking-widest uppercase text-[#C9A56D]/60 mb-2">
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
              style={{
                background: side === s.key ? "linear-gradient(135deg,#8B5E2E,#C9A56D)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${side === s.key ? "transparent" : "rgba(201,165,109,0.18)"}`,
                color: side === s.key ? "#fff" : "rgba(255,255,255,0.6)",
              }}
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
            <p className="font-sans-custom text-[10px] tracking-widest uppercase text-[#C9A56D]/60 mb-2 mt-1">
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
                  style={{
                    background: type === t.key ? "linear-gradient(135deg,#8B5E2E,#C9A56D)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${type === t.key ? "transparent" : "rgba(201,165,109,0.18)"}`,
                    color: type === t.key ? "#fff" : "rgba(255,255,255,0.6)",
                  }}
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
            style={{ background: "rgba(201,165,109,0.12)", border: "1px solid rgba(201,165,109,0.3)" }}
          >
            <span className="text-sm">{sideMeta?.emoji} {typeMeta?.emoji}</span>
            <span className="font-sans-custom text-xs text-[#E8D5B0]">{composed}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Hover wish card — shows compact view, expands on hover/tap ── */
function WishCard({ wish, index }: { wish: Wish; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const initials = wish.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
      onHoverStart={() => setExpanded(true)}
      onHoverEnd={() => setExpanded(false)}
      onClick={() => setExpanded((p) => !p)}
      className="relative cursor-pointer select-none group"
      style={{
        background: "rgba(201,165,109,0.04)",
        border: `1px solid ${expanded ? "rgba(201,165,109,0.4)" : "rgba(201,165,109,0.12)"}`,
        borderRadius: 14,
        transition: "border-color 0.3s, box-shadow 0.3s",
        boxShadow: expanded ? "0 0 24px rgba(201,165,109,0.12)" : "none",
      }}
    >
      {/* Left accent bar */}
      <div className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full transition-all duration-300"
        style={{ background: expanded ? "linear-gradient(to bottom,#C9A56D,#FBBF24)" : "rgba(201,165,109,0.2)", left: 0, borderRadius: "0 2px 2px 0" }} />

      <div className="px-4 py-4 pl-4">
        {/* Top row: avatar + name + relation */}
        <div className="flex items-center gap-3 mb-2">
          <div className="relative w-10 h-10 flex-shrink-0">
            <div
              className="absolute inset-0 rounded-full flex items-center justify-center font-sans-custom text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg,#8B5E2E,#C9A56D)" }}
            >
              {initials}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-sans-custom text-sm font-medium text-[#E8D5B0] truncate">{wish.name}</p>
            <p className="font-sans-custom text-[10px] text-[#C9A56D]/60 truncate">{wish.relation}</p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <p className="font-sans-custom text-[9px] text-white/30">
              {new Date(wish.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
            </p>
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.25 }}
              className="text-[#C9A56D]/40"
            >
              <ChevronDown size={13} />
            </motion.div>
          </div>
        </div>

        {/* Message — truncated by default, full on expand */}
        <div className="pl-[52px]">
          <p className={`font-serif text-sm leading-relaxed text-white/75 transition-all duration-300 ${
            expanded ? "" : "line-clamp-2"
          }`}>
            {wish.message}
          </p>

          {/* Heart footer */}
          <div className="flex items-center gap-1.5 mt-2.5">
            <motion.div
              animate={{ scale: expanded ? [1, 1.3, 1] : 1 }}
              transition={{ duration: 0.4 }}
            >
              <Heart size={11} fill={expanded ? "#C9A56D" : "none"} className="transition-colors duration-300"
                style={{ color: "#C9A56D" }} />
            </motion.div>
            <span className="font-sans-custom text-[9px] text-[#C9A56D]/50">wishes for the couple</span>
          </div>
        </div>
      </div>
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
    <div className="min-h-screen pt-20 relative" style={{ background: "linear-gradient(180deg,#080503 0%,#0D0804 100%)" }}>
      <RingMomentBackdrop />
      <FloatingDecor />

      {/* Back to home */}
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        style={{ position: "fixed", top: "1.25rem", left: "1.25rem", zIndex: 50 }}
      >
        <Link
          href="/#wishes"
          className="flex items-center gap-2 px-4 py-2 rounded-full font-sans-custom text-xs tracking-wide backdrop-blur-md transition-colors hover:bg-white/10"
          style={{ background: "rgba(15,12,9,0.55)", border: "1px solid rgba(201,165,109,0.25)", color: "rgba(255,255,255,0.75)" }}
        >
          <ArrowLeft size={14} /> Back to Home
        </Link>
      </motion.div>

      <div className="relative" style={{ zIndex: 1 }}>
      {/* Header */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(201,165,109,0.07) 0%, transparent 60%)" }} />
        <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <p className="font-sans-custom text-[10px] tracking-[0.45em] uppercase text-[#C9A56D] mb-3">Messages of Love</p>
          <h1 className="font-script mb-4" style={{ fontSize: "clamp(3rem,10vw,5rem)", color: "#E8D5B0" }}>
            Wishes Wall
          </h1>
          <div className="divider-gold mx-auto mb-4" style={{ maxWidth: "100px" }} />
          <p className="font-serif text-base sm:text-lg text-white/50 italic max-w-sm mx-auto">
            Leave your heartfelt blessings for {COUPLE.groom} & {COUPLE.bride}
          </p>
        </motion.div>
      </section>

      <div className="divider-gold max-w-sm mx-auto mb-10 sm:mb-14" />

      {/* Write a wish */}
      <section className="px-4 sm:px-6 max-w-2xl mx-auto mb-12 sm:mb-16">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-6 sm:p-8"
          style={{ background: "rgba(201,165,109,0.04)", border: "1px solid rgba(201,165,109,0.18)" }}
          whileInView={{
            boxShadow: [
              "0 0 0px rgba(201,165,109,0)",
              "0 0 32px rgba(201,165,109,0.12)",
              "0 0 0px rgba(201,165,109,0)",
            ],
          }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{
            opacity: { duration: 0.7 },
            y: { duration: 0.7 },
            boxShadow: { duration: 4, repeat: Infinity, ease: "easeInOut" },
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
              <p className="font-sans-custom text-sm text-white/50">Your wish has been added to the wall</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                maxLength={60}
                className="w-full rounded-xl px-4 py-3 font-sans-custom text-sm text-white placeholder-white/20 outline-none transition-all"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(201,165,109,0.15)" }}
              />

              <RelationPicker onChange={setRelation} />

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your heartfelt wishes for the couple…"
                rows={4}
                maxLength={500}
                className="w-full rounded-xl px-4 py-3 font-serif text-base text-white placeholder-white/20 outline-none resize-none leading-relaxed transition-all"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(201,165,109,0.15)" }}
              />
              <div className="flex items-center justify-between">
                <span className="font-sans-custom text-[9px] text-white/22">{message.length}/500</span>
              </div>

              {error && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="font-sans-custom text-sm text-[#C9A56D] text-center">{error}</motion.p>
              )}

              <motion.button type="submit" disabled={submitting || !name.trim() || !relation || !message.trim()}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="w-full py-3.5 rounded-xl font-sans-custom text-[11px] tracking-widest uppercase text-white disabled:opacity-45 flex items-center justify-center gap-2 transition-opacity"
                style={{ background: "linear-gradient(135deg,#8B5E2E,#C9A56D)" }}>
                {submitting ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-4 h-4 rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <><Send size={13} /> Send Wishes</>
                )}
              </motion.button>
            </form>
          )}
        </motion.div>
      </section>

      {/* Wishes tree */}
      <section className="px-4 sm:px-6 max-w-3xl mx-auto pb-24">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-8">
          <p className="font-script mb-1"
            style={{ fontSize: "clamp(2rem,6vw,2.8rem)", background: OG,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Messages of Love
          </p>
          <p className="font-sans-custom text-[10px] text-white/30 tracking-widest uppercase">
            {wishes.length} wish{wishes.length !== 1 ? "es" : ""} · hover a card to read
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-8 h-8 rounded-full border-2 border-t-transparent border-[#C9A56D]" />
          </div>
        ) : wishes.length === 0 ? (
          <div className="text-center py-20 rounded-2xl"
            style={{ background: "rgba(201,165,109,0.04)", border: "1px solid rgba(201,165,109,0.12)" }}>
            <div className="text-4xl mb-3">💌</div>
            <p className="font-sans-custom text-sm text-white/35">Be the first to leave a wish!</p>
          </div>
        ) : (
          /* Tree / comment wall layout */
          <div className="relative">
            {/* vertical connector line */}
            <div className="absolute left-5 top-0 bottom-0 w-px pointer-events-none"
              style={{ background: "linear-gradient(to bottom, rgba(201,165,109,0.3), rgba(201,165,109,0.05))" }} />

            <div className="flex flex-col gap-3 pl-10">
              {wishes.map((wish, i) => (
                <WishCard key={wish.id} wish={wish} index={i} />
              ))}
            </div>
          </div>
        )}
      </section>
      </div>
    </div>
  );
}
