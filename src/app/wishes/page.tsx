"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signIn, signOut } from "next-auth/react";
import { Heart, LogOut, Send, ChevronDown } from "lucide-react";
import Image from "next/image";

interface Wish {
  id: string;
  name: string;
  email: string;
  message: string;
  photoUrl?: string | null;
  createdAt: string;
}

const OG = "linear-gradient(135deg,#F97316,#FED7AA,#FB923C)";

/* ── Hover wish card — shows compact view, expands on hover/tap ── */
function WishCard({ wish, index }: { wish: Wish; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const initials = wish.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
      onHoverStart={() => setExpanded(true)}
      onHoverEnd={() => setExpanded(false)}
      onClick={() => setExpanded((p) => !p)}
      className="relative cursor-pointer select-none group"
      style={{
        background: "rgba(249,115,22,0.04)",
        border: `1px solid ${expanded ? "rgba(249,115,22,0.4)" : "rgba(249,115,22,0.12)"}`,
        borderRadius: 14,
        transition: "border-color 0.3s, box-shadow 0.3s",
        boxShadow: expanded ? "0 0 24px rgba(249,115,22,0.12)" : "none",
      }}
    >
      {/* Left accent bar */}
      <div className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full transition-all duration-300"
        style={{ background: expanded ? "linear-gradient(to bottom,#F97316,#FBBF24)" : "rgba(249,115,22,0.2)", left: 0, borderRadius: "0 2px 2px 0" }} />

      <div className="px-4 py-4 pl-4">
        {/* Top row: avatar + name + date */}
        <div className="flex items-center gap-3 mb-2">
          {/* Avatar — shows Google profile pic when expanded */}
          <div className="relative w-10 h-10 flex-shrink-0">
            <AnimatePresence mode="wait">
              {expanded && wish.photoUrl ? (
                <motion.div key="photo"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0 rounded-full overflow-hidden ring-2 ring-orange-500/60">
                  <Image src={wish.photoUrl} alt={wish.name} width={40} height={40} className="w-full h-full object-cover" />
                </motion.div>
              ) : (
                <motion.div key="initials"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 rounded-full flex items-center justify-center font-sans-custom text-sm font-semibold text-white"
                  style={{ background: "linear-gradient(135deg,#C2410C,#F97316)" }}>
                  {initials}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-sans-custom text-sm font-medium text-orange-200 truncate">{wish.name}</p>
            <AnimatePresence>
              {expanded && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="font-sans-custom text-[10px] text-orange-400/60 truncate"
                >
                  {wish.email}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <p className="font-sans-custom text-[9px] text-white/30">
              {new Date(wish.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
            </p>
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.25 }}
              className="text-orange-500/40"
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

          {/* Photo if any */}
          <AnimatePresence>
            {expanded && wish.photoUrl && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 rounded-xl overflow-hidden max-w-[240px]"
              >
                <Image src={wish.photoUrl} alt="Wish photo" width={400} height={300} className="w-full object-cover" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Heart footer */}
          <div className="flex items-center gap-1.5 mt-2.5">
            <motion.div
              animate={{ scale: expanded ? [1, 1.3, 1] : 1 }}
              transition={{ duration: 0.4 }}
            >
              <Heart size={11} fill={expanded ? "#F97316" : "none"} className="transition-colors duration-300"
                style={{ color: "#F97316" }} />
            </motion.div>
            <span className="font-sans-custom text-[9px] text-orange-400/50">wishes for the couple</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function WishesPage() {
  const { data: session, status } = useSession();
  const [wishes, setWishes] = useState<Wish[]>([]);
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

  useEffect(() => { fetchWishes(); }, [fetchWishes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || submitting) return;
    setSubmitting(true); setError("");
    try {
      const res = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Failed to submit");
      else { setSubmitted(true); setMessage(""); fetchWishes(); }
    } catch { setError("Something went wrong. Please try again."); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="min-h-screen pt-20" style={{ background: "linear-gradient(180deg,#080503 0%,#0D0804 100%)" }}>

      {/* Header */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(249,115,22,0.07) 0%, transparent 60%)" }} />
        <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <p className="font-sans-custom text-[10px] tracking-[0.45em] uppercase text-orange-400 mb-3">Messages of Love</p>
          <h1 className="font-script mb-3"
            style={{ fontSize: "clamp(3rem,10vw,5rem)", background: OG,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Wishes Wall
          </h1>
          <p className="font-serif text-base sm:text-lg text-white/50 italic max-w-sm mx-auto">
            Leave your heartfelt blessings for Berlin & Jerlin Ashika
          </p>
        </motion.div>
      </section>

      <div className="divider-orange max-w-sm mx-auto mb-10 sm:mb-14" />

      {/* Write a wish */}
      <section className="px-4 sm:px-6 max-w-2xl mx-auto mb-12 sm:mb-16">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          className="rounded-2xl p-6 sm:p-8"
          style={{ background: "rgba(249,115,22,0.04)", border: "1px solid rgba(249,115,22,0.18)" }}>
          <h2 className="font-script text-center mb-5 sm:mb-6"
            style={{ fontSize: "clamp(2rem,6vw,2.8rem)", background: OG,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Send Your Wishes
          </h2>

          {status === "loading" ? (
            <div className="flex justify-center py-8">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-7 h-7 rounded-full border-2 border-t-transparent border-orange-500" />
            </div>
          ) : !session ? (
            <div className="text-center space-y-4">
              <p className="font-sans-custom text-sm text-white/55">Sign in with Google to leave your wish</p>
              <p className="font-sans-custom text-xs text-white/28">One wish per account to keep the wall authentic</p>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => signIn("google")}
                className="flex items-center gap-3 mx-auto px-6 py-3 bg-white text-gray-700 rounded-full font-sans-custom text-sm font-medium hover:bg-gray-50 transition-colors shadow-lg">
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                  <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </motion.button>
            </div>
          ) : submitted ? (
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
              {/* User info bar */}
              <div className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.1)" }}>
                {session.user?.image ? (
                  <Image src={session.user.image} alt="You" width={36} height={36} className="rounded-full ring-2 ring-orange-500/40" />
                ) : (
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-sans-custom text-sm text-white"
                    style={{ background: "linear-gradient(135deg,#C2410C,#F97316)" }}>
                    {session.user?.name?.[0]?.toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-sans-custom text-sm text-orange-200 truncate">{session.user?.name}</p>
                  <p className="font-sans-custom text-[10px] text-orange-400/50 truncate">{session.user?.email}</p>
                </div>
                <button type="button" onClick={() => signOut()}
                  className="text-white/25 hover:text-white/50 transition-colors p-1">
                  <LogOut size={13} />
                </button>
              </div>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your heartfelt wishes for the couple…"
                rows={4}
                maxLength={500}
                className="w-full rounded-xl px-4 py-3 font-serif text-base text-white placeholder-white/20 outline-none resize-none leading-relaxed transition-all"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(249,115,22,0.15)" }}
              />
              <div className="flex items-center justify-between">
                <span className="font-sans-custom text-[9px] text-white/22">{message.length}/500</span>
              </div>

              {error && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="font-sans-custom text-sm text-orange-400 text-center">{error}</motion.p>
              )}

              <motion.button type="submit" disabled={submitting || !message.trim()}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="w-full py-3.5 rounded-xl font-sans-custom text-[11px] tracking-widest uppercase text-white disabled:opacity-45 flex items-center justify-center gap-2 transition-opacity"
                style={{ background: "linear-gradient(135deg,#C2410C,#F97316)" }}>
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
              className="w-8 h-8 rounded-full border-2 border-t-transparent border-orange-500" />
          </div>
        ) : wishes.length === 0 ? (
          <div className="text-center py-20 rounded-2xl"
            style={{ background: "rgba(249,115,22,0.04)", border: "1px solid rgba(249,115,22,0.12)" }}>
            <div className="text-4xl mb-3">💌</div>
            <p className="font-sans-custom text-sm text-white/35">Be the first to leave a wish!</p>
          </div>
        ) : (
          /* Tree / comment wall layout */
          <div className="relative">
            {/* vertical connector line */}
            <div className="absolute left-5 top-0 bottom-0 w-px pointer-events-none"
              style={{ background: "linear-gradient(to bottom, rgba(249,115,22,0.3), rgba(249,115,22,0.05))" }} />

            <div className="flex flex-col gap-3 pl-10">
              {wishes.map((wish, i) => (
                <WishCard key={wish.id} wish={wish} index={i} />
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
