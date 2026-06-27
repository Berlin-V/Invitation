"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signIn, signOut } from "next-auth/react";
import { Heart, LogOut, Upload, X, Send } from "lucide-react";
import Image from "next/image";

interface Wish {
  id: string;
  name: string;
  email: string;
  message: string;
  photoUrl?: string | null;
  createdAt: string;
}

function WishCard({ wish, index }: { wish: Wish; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="glass-card p-6 hover:border-[#C9A84C]/30 transition-all duration-500"
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8B1A4A] to-[#C9A84C] flex items-center justify-center text-white font-serif text-sm flex-shrink-0">
          {wish.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-2">
            <p className="font-sans-custom text-sm font-medium text-[#E8D5A3] truncate">{wish.name}</p>
            <p className="font-sans-custom text-[10px] text-[#FFF8F0]/30 flex-shrink-0">
              {new Date(wish.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
            </p>
          </div>
          <p className="font-serif text-base text-[#FFF8F0]/80 leading-relaxed">{wish.message}</p>
          {wish.photoUrl && (
            <div className="mt-3 rounded-lg overflow-hidden max-w-xs">
              <Image src={wish.photoUrl} alt="Wish photo" width={400} height={300} className="w-full object-cover" />
            </div>
          )}
          <div className="mt-3 flex items-center gap-1.5 text-[#D4547A]/60">
            <Heart size={12} fill="currentColor" />
            <span className="font-sans-custom text-[10px]">Wishes for the couple</span>
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
      const res = await fetch("/api/wishes");
      const data = await res.json();
      setWishes(data.wishes || []);
    } catch {
      setWishes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchWishes(); }, [fetchWishes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || submitting) return;
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to submit wish");
      } else {
        setSubmitted(true);
        setMessage("");
        fetchWishes();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-20" style={{ background: "linear-gradient(180deg, #1A0A0F 0%, #0D050A 100%)" }}>
      {/* Header */}
      <section className="py-20 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(212,84,122,0.08) 0%, transparent 60%)" }} />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <p className="font-sans-custom text-[11px] tracking-[0.5em] uppercase text-[#C9A84C] mb-4">Messages of Love</p>
          <h1 className="font-script text-6xl md:text-7xl text-gold-gradient mb-4">Wishes Wall</h1>
          <p className="font-serif text-lg text-[#FFF8F0]/60 italic max-w-md mx-auto">
            Leave your heartfelt blessings for Berlin & Jerlin Ashika
          </p>
        </motion.div>
      </section>

      <div className="divider-gold max-w-sm mx-auto mb-12" />

      {/* Write a wish */}
      <section className="px-6 max-w-2xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="glass-card p-8"
          style={{ border: "1px solid rgba(201,168,76,0.25)" }}
        >
          <h2 className="font-script text-4xl text-gold-gradient mb-6 text-center">Send Your Wishes</h2>

          {status === "loading" ? (
            <div className="text-center py-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full mx-auto"
              />
            </div>
          ) : !session ? (
            <div className="text-center space-y-4">
              <p className="font-sans-custom text-sm text-[#FFF8F0]/60">Sign in with Google to leave your wish</p>
              <p className="font-sans-custom text-xs text-[#FFF8F0]/35">One wish per account to keep the wall special</p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => signIn("google")}
                className="flex items-center gap-3 mx-auto px-6 py-3 bg-white text-gray-700 rounded-full font-sans-custom text-sm font-medium hover:bg-gray-50 transition-colors shadow-lg"
              >
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
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6 space-y-3"
            >
              <div className="text-5xl">💝</div>
              <p className="font-script text-4xl text-gold-gradient">Thank You!</p>
              <p className="font-sans-custom text-sm text-[#FFF8F0]/60">Your wish has been added to the wall</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                {session.user?.image && (
                  <Image src={session.user.image} alt="You" width={36} height={36} className="rounded-full" />
                )}
                <div>
                  <p className="font-sans-custom text-sm text-[#E8D5A3]">{session.user?.name}</p>
                  <p className="font-sans-custom text-[10px] text-[#FFF8F0]/40">{session.user?.email}</p>
                </div>
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="ml-auto text-[#FFF8F0]/30 hover:text-[#FFF8F0]/60 transition-colors"
                >
                  <LogOut size={14} />
                </button>
              </div>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your heartfelt wishes for the couple…"
                rows={4}
                maxLength={500}
                className="w-full bg-white/5 border border-[#C9A84C]/20 rounded-xl px-4 py-3 font-serif text-base text-[#FFF8F0] placeholder-[#FFF8F0]/25 outline-none focus:border-[#C9A84C]/50 transition-colors resize-none leading-relaxed"
              />
              <div className="flex items-center justify-between">
                <span className="font-sans-custom text-[10px] text-[#FFF8F0]/25">{message.length}/500</span>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-sans-custom text-sm text-[#D4547A] text-center"
                >
                  {error}
                </motion.p>
              )}

              <motion.button
                type="submit"
                disabled={submitting || !message.trim()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 bg-gradient-to-r from-[#8B1A4A] to-[#C9A84C] font-sans-custom text-sm tracking-widest uppercase text-white rounded-xl disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <>
                    <Send size={14} />
                    Send Wishes
                  </>
                )}
              </motion.button>
            </form>
          )}
        </motion.div>
      </section>

      {/* Wishes wall */}
      <section className="px-6 max-w-4xl mx-auto pb-24">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-10"
        >
          <p className="font-script text-4xl text-gold-gradient mb-2">Messages of Love</p>
          <p className="font-sans-custom text-xs text-[#FFF8F0]/30 tracking-widest uppercase">{wishes.length} wish{wishes.length !== 1 ? "es" : ""}</p>
        </motion.div>

        {loading ? (
          <div className="text-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full mx-auto"
            />
          </div>
        ) : wishes.length === 0 ? (
          <div className="text-center py-20 glass-card max-w-sm mx-auto">
            <div className="text-4xl mb-4">💌</div>
            <p className="font-sans-custom text-sm text-[#FFF8F0]/40">Be the first to leave a wish!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {wishes.map((wish, i) => (
              <WishCard key={wish.id} wish={wish} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
