"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

interface RSVPData {
  name: string;
  phone: string;
  guests: string;
  attending: "" | "yes" | "no";
  food: string;
}

const INITIAL: RSVPData = { name: "", phone: "", guests: "1", attending: "", food: "" };

// TODO: Replace with Supabase client when ready:
// import { createClient } from "@supabase/supabase-js";
// const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

async function submitRSVP(data: RSVPData): Promise<void> {
  // Supabase integration point:
  // await supabase.from("rsvp").insert([{ ...data, guests: parseInt(data.guests) }]);
  await new Promise((r) => setTimeout(r, 1000)); // simulate network
}

export default function RSVP() {
  const [form, setForm] = useState<RSVPData>(INITIAL);
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");

  const set = (k: keyof RSVPData, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("loading");
    try {
      await submitRSVP(form);
      setState("success");
    } catch {
      setState("error");
    }
  };

  return (
    <section id="rsvp" className="section-pad" style={{ background: "#FFFDF9" }}>
      <div className="max-w-xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
        >
          <p style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "0.72rem",
            letterSpacing: "0.42em", color: "#C9A56D", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            Join Us
          </p>
          <h2 style={{ fontFamily: "var(--font-allura), cursive", fontSize: "clamp(2.5rem,7vw,3.8rem)",
            color: "#4A403A" }}>
            RSVP
          </h2>
          <p style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "1rem",
            fontStyle: "italic", color: "#8A7C73", marginTop: "0.75rem" }}>
            Kindly reply by November 1, 2026
          </p>
          <div className="divider-gold max-w-[80px] mx-auto mt-5" />
        </motion.div>

        {/* Glass card */}
        <motion.div
          className="glass rounded-3xl p-8 md:p-10"
          style={{ boxShadow: "0 20px 80px rgba(74,64,58,0.08)" }}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {state === "success" ? (
            <motion.div
              className="text-center py-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 280 }}
            >
              <CheckCircle size={48} color="#C9A56D" strokeWidth={1} className="mx-auto mb-5" />
              <h3 style={{ fontFamily: "var(--font-allura), cursive", fontSize: "2.2rem",
                color: "#4A403A", marginBottom: "0.5rem" }}>
                Thank you, {form.name}!
              </h3>
              <p style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "1rem",
                fontStyle: "italic", color: "#8A7C73" }}>
                We're so glad you can celebrate with us.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Name */}
              <Field label="Full Name">
                <input
                  required
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Your name"
                />
              </Field>

              {/* Phone */}
              <Field label="Phone Number">
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="+91 00000 00000"
                />
              </Field>

              {/* Guests */}
              <Field label="Number of Guests">
                <select value={form.guests} onChange={(e) => set("guests", e.target.value)}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </Field>

              {/* Attending */}
              <div>
                <p style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "0.72rem",
                  letterSpacing: "0.25em", color: "#4A403A", textTransform: "uppercase", marginBottom: "0.75rem" }}>
                  Will You Attend?
                </p>
                <div className="flex gap-3">
                  {[
                    { v: "yes", l: "Joyfully Accept" },
                    { v: "no",  l: "Regretfully Decline" },
                  ].map((opt) => (
                    <button
                      key={opt.v}
                      type="button"
                      onClick={() => set("attending", opt.v)}
                      className="flex-1 py-3 rounded-xl text-sm transition-all duration-300"
                      style={{
                        fontFamily: "var(--font-cormorant), Georgia, serif",
                        fontSize: "0.82rem",
                        letterSpacing: "0.1em",
                        background: form.attending === opt.v ? "#C9A56D" : "transparent",
                        color: form.attending === opt.v ? "#FFFDF9" : "#8A7C73",
                        border: form.attending === opt.v
                          ? "1px solid #C9A56D"
                          : "1px solid rgba(201,165,109,0.3)",
                      }}
                    >
                      {opt.l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Food preference */}
              <Field label="Food Preference">
                <select value={form.food} onChange={(e) => set("food", e.target.value)}>
                  <option value="">No preference</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="non-vegetarian">Non-Vegetarian</option>
                  <option value="vegan">Vegan</option>
                </select>
              </Field>

              {state === "error" && (
                <p style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "0.85rem",
                  color: "#EE7863", fontStyle: "italic" }}>
                  Something went wrong. Please try again.
                </p>
              )}

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={state === "loading"}
                className="mt-2 w-full py-4 rounded-xl"
                style={{
                  fontFamily: "var(--font-cormorant), Georgia, serif",
                  fontSize: "0.85rem",
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  background: state === "loading" ? "#E8D5B0" : "#C9A56D",
                  color: "#FFFDF9",
                  border: "none",
                  cursor: state === "loading" ? "not-allowed" : "pointer",
                }}
                whileHover={state !== "loading" ? { scale: 1.02 } : {}}
                whileTap={state !== "loading" ? { scale: 0.98 } : {}}
              >
                {state === "loading" ? "Sending…" : "Send RSVP"}
              </motion.button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactElement }) {
  return (
    <div>
      <label style={{ display: "block", fontFamily: "var(--font-cormorant), Georgia, serif",
        fontSize: "0.72rem", letterSpacing: "0.25em", color: "#4A403A",
        textTransform: "uppercase", marginBottom: "0.5rem" }}>
        {label}
      </label>
      {/* Clone child with shared styles */}
      <div style={{
        width: "100%",
        borderRadius: "0.75rem",
        border: "1px solid rgba(201,165,109,0.3)",
        background: "rgba(255,253,249,0.6)",
        overflow: "hidden",
      }}>
        {React.cloneElement(children as React.ReactElement<React.HTMLAttributes<HTMLElement>>, {
          style: {
            width: "100%",
            padding: "0.85rem 1rem",
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "1rem",
            color: "#4A403A",
            background: "transparent",
            border: "none",
            outline: "none",
            appearance: "none" as const,
          },
        })}
      </div>
    </div>
  );
}

// Need React for cloneElement
import React from "react";
