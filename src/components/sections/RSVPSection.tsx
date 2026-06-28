"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

interface FormData {
  name: string;
  phone: string;
  guests: string;
  attendance: "yes" | "no" | "";
  food: "vegetarian" | "non-vegetarian" | "vegan" | "";
}

interface FormErrors {
  name?: string;
  phone?: string;
  guests?: string;
  attendance?: string;
  food?: string;
}

const INITIAL: FormData = {
  name: "",
  phone: "",
  guests: "",
  attendance: "",
  food: "",
};

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.name.trim() || data.name.trim().length < 2) {
    errors.name = "Please enter your full name";
  }
  if (!data.phone.trim() || !/^[\d\s+\-().]{7,20}$/.test(data.phone.trim())) {
    errors.phone = "Please enter a valid phone number";
  }
  if (!data.guests || Number(data.guests) < 1 || Number(data.guests) > 20) {
    errors.guests = "Please enter a number between 1 and 20";
  }
  if (!data.attendance) {
    errors.attendance = "Please let us know if you can attend";
  }
  if (data.attendance === "yes" && !data.food) {
    errors.food = "Please select a food preference";
  }
  return errors;
}

interface FieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

function Field({ label, error, children }: FieldProps) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontFamily: "var(--font-cormorant), Georgia, serif",
          fontSize: "0.62rem",
          letterSpacing: "0.32em",
          color: "#8A7C73",
          textTransform: "uppercase",
          marginBottom: "0.5rem",
        }}
      >
        {label}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            style={{
              marginTop: "0.35rem",
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "0.75rem",
              color: "#EE7863",
              fontStyle: "italic",
            }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "transparent",
  border: "none",
  borderBottom: "1px solid rgba(201,165,109,0.3)",
  padding: "0.5rem 0",
  fontFamily: "var(--font-cormorant), Georgia, serif",
  fontSize: "1rem",
  color: "#4A403A",
  outline: "none",
  transition: "border-color 0.3s ease",
};

export default function RSVPSection() {
  const [form, setForm] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    // Simulate a brief delay — ready for real API integration
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <section
      id="rsvp"
      style={{
        backgroundColor: "#FFFDF9",
        padding: "clamp(4rem, 10vw, 8rem) clamp(1.25rem, 5vw, 3rem)",
      }}
    >
      {/* Section header */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.9, ease: EASE }}
        style={{ marginBottom: "clamp(3rem, 8vw, 5rem)" }}
      >
        <p
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "0.62rem",
            letterSpacing: "0.46em",
            color: "#C9A56D",
            textTransform: "uppercase",
            marginBottom: "1rem",
          }}
        >
          Kindly respond by November 1, 2026
        </p>
        <h2
          style={{
            fontFamily: "var(--font-allura), cursive",
            fontSize: "clamp(2.5rem, 7vw, 4.5rem)",
            color: "#4A403A",
            lineHeight: 1.1,
            marginBottom: "0.5rem",
          }}
        >
          RSVP
        </h2>
        <p
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "clamp(0.95rem, 2.5vw, 1.1rem)",
            fontStyle: "italic",
            color: "#8A7C73",
            marginBottom: "1.25rem",
          }}
        >
          Let us know you&rsquo;re coming — we can&rsquo;t wait to celebrate with you.
        </p>
        <div className="divider-gold" style={{ maxWidth: "100px", margin: "0 auto" }} />
      </motion.div>

      {/* Form card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 1.0, ease: EASE }}
        style={{
          maxWidth: "580px",
          margin: "0 auto",
          background: "#FFFDF9",
          border: "1px solid rgba(201,165,109,0.22)",
          padding: "clamp(2rem, 6vw, 3.5rem)",
          position: "relative",
        }}
      >
        {/* Top accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "2.5rem",
            right: "2.5rem",
            height: "1px",
            background: "linear-gradient(90deg, transparent, #C9A56D, transparent)",
          }}
        />

        <AnimatePresence mode="wait">
          {submitted ? (
            /* Success state */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="text-center"
              style={{ padding: "2rem 0" }}
            >
              {/* Gold ornament */}
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  border: "1px solid rgba(201,165,109,0.4)",
                  margin: "0 auto 1.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#C9A56D",
                  fontSize: "1.2rem",
                }}
              >
                ◆
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-allura), cursive",
                  fontSize: "2.2rem",
                  color: "#4A403A",
                  marginBottom: "1rem",
                }}
              >
                Thank you!
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-cormorant), Georgia, serif",
                  fontSize: "1.05rem",
                  fontStyle: "italic",
                  lineHeight: 1.7,
                  color: "#8A7C73",
                }}
              >
                We have received your RSVP, {form.name.split(" ")[0]}. We are so
                looking forward to celebrating with you on December 9–10, 2026.
              </p>
            </motion.div>
          ) : (
            /* Form */
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col"
              style={{ gap: "2rem" }}
              exit={{ opacity: 0 }}
            >
              {/* Name */}
              <Field label="Full Name" error={errors.name}>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Your full name"
                  style={{
                    ...inputStyle,
                    borderBottomColor: errors.name
                      ? "rgba(238,120,99,0.6)"
                      : "rgba(201,165,109,0.3)",
                  }}
                  aria-invalid={!!errors.name}
                />
              </Field>

              {/* Phone */}
              <Field label="Phone Number" error={errors.phone}>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  style={{
                    ...inputStyle,
                    borderBottomColor: errors.phone
                      ? "rgba(238,120,99,0.6)"
                      : "rgba(201,165,109,0.3)",
                  }}
                  aria-invalid={!!errors.phone}
                />
              </Field>

              {/* Number of guests */}
              <Field label="Number of Guests" error={errors.guests}>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={form.guests}
                  onChange={(e) => set("guests", e.target.value)}
                  placeholder="Including yourself"
                  style={{
                    ...inputStyle,
                    borderBottomColor: errors.guests
                      ? "rgba(238,120,99,0.6)"
                      : "rgba(201,165,109,0.3)",
                  }}
                  aria-invalid={!!errors.guests}
                />
              </Field>

              {/* Attendance */}
              <Field label="Will you be attending?" error={errors.attendance}>
                <div className="flex gap-6" style={{ marginTop: "0.25rem" }}>
                  {(["yes", "no"] as const).map((val) => (
                    <label
                      key={val}
                      className="flex items-center gap-2"
                      style={{ cursor: "pointer" }}
                    >
                      <input
                        type="radio"
                        name="attendance"
                        value={val}
                        checked={form.attendance === val}
                        onChange={() => set("attendance", val)}
                        style={{ accentColor: "#C9A56D" }}
                      />
                      <span
                        style={{
                          fontFamily: "var(--font-cormorant), Georgia, serif",
                          fontSize: "1rem",
                          color: "#4A403A",
                        }}
                      >
                        {val === "yes" ? "Joyfully accept" : "Regretfully decline"}
                      </span>
                    </label>
                  ))}
                </div>
              </Field>

              {/* Food preference — only shown when attending */}
              <AnimatePresence>
                {form.attendance === "yes" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    style={{ overflow: "hidden" }}
                  >
                    <Field label="Food Preference" error={errors.food}>
                      <select
                        value={form.food}
                        onChange={(e) => set("food", e.target.value as FormData["food"])}
                        style={{
                          ...inputStyle,
                          cursor: "pointer",
                          borderBottomColor: errors.food
                            ? "rgba(238,120,99,0.6)"
                            : "rgba(201,165,109,0.3)",
                        }}
                        aria-invalid={!!errors.food}
                      >
                        <option value="">Select a preference</option>
                        <option value="vegetarian">Vegetarian</option>
                        <option value="non-vegetarian">Non-Vegetarian</option>
                        <option value="vegan">Vegan</option>
                      </select>
                    </Field>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={submitting}
                whileTap={{ scale: 0.98 }}
                style={{
                  marginTop: "0.5rem",
                  padding: "1rem",
                  background: submitting ? "rgba(201,165,109,0.6)" : "#C9A56D",
                  border: "none",
                  color: "#FFFDF9",
                  fontFamily: "var(--font-cormorant), Georgia, serif",
                  fontSize: "0.7rem",
                  letterSpacing: "0.35em",
                  textTransform: "uppercase",
                  cursor: submitting ? "not-allowed" : "pointer",
                  transition: "background 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  if (!submitting)
                    (e.currentTarget as HTMLButtonElement).style.background = "#A8854A";
                }}
                onMouseLeave={(e) => {
                  if (!submitting)
                    (e.currentTarget as HTMLButtonElement).style.background = "#C9A56D";
                }}
              >
                {submitting ? "Sending..." : "Send RSVP"}
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
