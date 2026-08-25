"use client";

import { useState, useEffect, useCallback } from "react";
import { Trash2, RotateCcw, Pencil, Check, X } from "lucide-react";

interface Wish {
  id: string;
  name: string;
  relation: string;
  message: string;
  createdAt: string;
  deleted?: boolean;
}

const SECRET_KEY = "wed_admin_secret";

function sideLabel(relation: string): string {
  if (relation.startsWith("Groom's")) return "Groom";
  if (relation.startsWith("Bride's")) return "Bride";
  return "Groom & Bride";
}

function relationshipLabel(relation: string): string {
  if (relation.startsWith("Groom's")) return relation.slice("Groom's ".length);
  if (relation.startsWith("Bride's")) return relation.slice("Bride's ".length);
  if (relation.endsWith(" of the Couple")) return relation.slice(0, -" of the Couple".length);
  return relation;
}

async function fetchWishes(secret: string): Promise<Wish[]> {
  const res = await fetch("/api/wishes/admin", { headers: { "x-admin-secret": secret } });
  if (!res.ok) throw new Error(res.status === 401 ? "unauthorized" : "load-failed");
  const data = await res.json();
  return data.wishes;
}

export default function EditWishesPage() {
  const [secret, setSecret] = useState<string | null>(null);
  const [passcodeInput, setPasscodeInput] = useState("");
  const [gateError, setGateError] = useState("");
  const [checking, setChecking] = useState(false);

  const [wishes, setWishes] = useState<Wish[] | null>(null);
  const [loadError, setLoadError] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState({ name: "", relation: "", message: "" });
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async (s: string) => {
    try {
      const list = await fetchWishes(s);
      setWishes(list);
      setLoadError("");
    } catch (err) {
      if (err instanceof Error && err.message === "unauthorized") {
        sessionStorage.removeItem(SECRET_KEY);
        setSecret(null);
        setGateError("Incorrect passcode.");
      } else {
        setLoadError("Couldn't load wishes. Try refreshing.");
      }
    }
  }, []);

  useEffect(() => {
    const stored = sessionStorage.getItem(SECRET_KEY);
    if (stored) {
      setSecret(stored);
      load(stored);
    }
  }, [load]);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setChecking(true);
    setGateError("");
    try {
      const list = await fetchWishes(passcodeInput);
      sessionStorage.setItem(SECRET_KEY, passcodeInput);
      setSecret(passcodeInput);
      setWishes(list);
    } catch {
      setGateError("Incorrect passcode.");
    } finally {
      setChecking(false);
    }
  };

  const startEdit = (w: Wish) => {
    setEditingId(w.id);
    setDraft({ name: w.name, relation: w.relation, message: w.message });
  };

  const cancelEdit = () => setEditingId(null);

  const saveEdit = async (id: string) => {
    if (!secret) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/wishes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-secret": secret },
        body: JSON.stringify(draft),
      });
      if (!res.ok) throw new Error("update-failed");
      setWishes((prev) => prev?.map((w) => (w.id === id ? { ...w, ...draft } : w)) ?? null);
      setEditingId(null);
    } catch {
      setLoadError("Couldn't save that edit. Try again.");
    } finally {
      setBusyId(null);
    }
  };

  const setWishDeleted = async (id: string, deleted: boolean) => {
    if (!secret) return;
    if (deleted && !window.confirm("Hide this wish from the site? It stays saved and can be restored here.")) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/wishes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-secret": secret },
        body: JSON.stringify({ deleted }),
      });
      if (!res.ok) throw new Error("update-failed");
      setWishes((prev) => prev?.map((w) => (w.id === id ? { ...w, deleted } : w)) ?? null);
    } catch {
      setLoadError(deleted ? "Couldn't hide that wish. Try again." : "Couldn't restore that wish. Try again.");
    } finally {
      setBusyId(null);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.4rem 0.6rem",
    borderRadius: "6px",
    border: "1px solid rgba(201,165,109,0.4)",
    fontFamily: "var(--font-inter), sans-serif",
    fontSize: "0.85rem",
    background: "#FFFDF9",
    color: "#4A403A",
  };

  if (!secret) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ backgroundColor: "#F8F4EF", padding: "1.5rem" }}
      >
        <form
          onSubmit={handleUnlock}
          style={{
            width: "min(90vw, 340px)",
            background: "#FFFDF9",
            border: "1px solid rgba(201,165,109,0.3)",
            borderRadius: "14px",
            padding: "2rem 1.75rem",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "0.62rem",
              letterSpacing: "0.32em",
              color: "#C9A56D",
              textTransform: "uppercase",
              marginBottom: "0.75rem",
            }}
          >
            Wishes admin
          </p>
          <input
            type="password"
            inputMode="numeric"
            autoFocus
            value={passcodeInput}
            onChange={(e) => setPasscodeInput(e.target.value)}
            placeholder="Enter passcode"
            style={{ ...inputStyle, textAlign: "center", marginBottom: "0.85rem" }}
          />
          {gateError && (
            <p style={{ color: "#C0392B", fontSize: "0.78rem", marginBottom: "0.75rem" }}>{gateError}</p>
          )}
          <button
            type="submit"
            disabled={checking || !passcodeInput}
            style={{
              width: "100%",
              padding: "0.55rem",
              borderRadius: "8px",
              border: "none",
              background: "#C9A56D",
              color: "#FFFDF9",
              fontSize: "0.8rem",
              letterSpacing: "0.08em",
              cursor: checking ? "default" : "pointer",
              opacity: checking ? 0.7 : 1,
            }}
          >
            {checking ? "Checking…" : "Unlock"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F8F4EF", padding: "clamp(1.5rem, 4vw, 3rem)" }}>
      <h1
        style={{
          fontFamily: "var(--font-allura), cursive",
          fontSize: "clamp(2rem, 5vw, 2.75rem)",
          color: "#4A403A",
          marginBottom: "0.25rem",
        }}
      >
        Wishes
      </h1>
      <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.8rem", color: "#8A7C73", marginBottom: "1.5rem" }}>
        {wishes ? `${wishes.length} wish${wishes.length === 1 ? "" : "es"}` : "Loading…"}
      </p>

      {loadError && (
        <p style={{ color: "#C0392B", fontSize: "0.85rem", marginBottom: "1rem" }}>{loadError}</p>
      )}

      <div style={{ overflowX: "auto", borderRadius: "12px", border: "1px solid rgba(201,165,109,0.25)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", background: "#FFFDF9", minWidth: "720px" }}>
          <thead>
            <tr style={{ background: "rgba(201,165,109,0.12)" }}>
              {["Name", "You're Here For", "Relationship", "Message", "Submitted", ""].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: "left",
                    padding: "0.75rem 1rem",
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "0.68rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#8A7C73",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {wishes?.map((w) => {
              const isEditing = editingId === w.id;
              const isBusy = busyId === w.id;
              return (
                <tr
                  key={w.id}
                  style={{
                    borderTop: "1px solid rgba(201,165,109,0.15)",
                    opacity: w.deleted ? 0.5 : 1,
                  }}
                >
                  <td style={{ padding: "0.75rem 1rem", verticalAlign: "top" }}>
                    {isEditing ? (
                      <input
                        style={inputStyle}
                        value={draft.name}
                        onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                      />
                    ) : (
                      <span style={{ fontSize: "0.85rem", color: "#4A403A" }}>
                        {w.name}
                        {w.deleted && (
                          <span
                            style={{
                              marginLeft: "0.5rem",
                              fontSize: "0.62rem",
                              letterSpacing: "0.08em",
                              textTransform: "uppercase",
                              color: "#C0392B",
                            }}
                          >
                            Hidden
                          </span>
                        )}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "0.75rem 1rem", verticalAlign: "top" }}>
                    {isEditing ? (
                      <input
                        style={inputStyle}
                        value={draft.relation}
                        onChange={(e) => setDraft((d) => ({ ...d, relation: e.target.value }))}
                      />
                    ) : (
                      <span style={{ fontSize: "0.85rem", color: "#8A7C73" }}>{sideLabel(w.relation)}</span>
                    )}
                  </td>
                  <td style={{ padding: "0.75rem 1rem", verticalAlign: "top" }}>
                    <span style={{ fontSize: "0.85rem", color: "#8A7C73" }}>
                      {relationshipLabel(isEditing ? draft.relation : w.relation)}
                    </span>
                  </td>
                  <td style={{ padding: "0.75rem 1rem", verticalAlign: "top", maxWidth: "360px" }}>
                    {isEditing ? (
                      <textarea
                        style={{ ...inputStyle, minHeight: "70px", resize: "vertical" }}
                        value={draft.message}
                        onChange={(e) => setDraft((d) => ({ ...d, message: e.target.value }))}
                      />
                    ) : (
                      <span style={{ fontSize: "0.82rem", color: "#4A403A" }}>{w.message}</span>
                    )}
                  </td>
                  <td style={{ padding: "0.75rem 1rem", verticalAlign: "top", whiteSpace: "nowrap" }}>
                    <span style={{ fontSize: "0.75rem", color: "#8A7C73" }}>
                      {new Date(w.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td style={{ padding: "0.75rem 1rem", verticalAlign: "top", whiteSpace: "nowrap" }}>
                    {isEditing ? (
                      <div style={{ display: "flex", gap: "0.4rem" }}>
                        <button
                          onClick={() => saveEdit(w.id)}
                          disabled={isBusy}
                          aria-label="Save"
                          style={{ ...iconBtnStyle, color: "#3E7A4A" }}
                        >
                          <Check size={15} strokeWidth={2} />
                        </button>
                        <button onClick={cancelEdit} aria-label="Cancel" style={iconBtnStyle}>
                          <X size={15} strokeWidth={2} />
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: "flex", gap: "0.4rem" }}>
                        <button onClick={() => startEdit(w)} aria-label="Edit" style={iconBtnStyle}>
                          <Pencil size={14} strokeWidth={1.5} />
                        </button>
                        {w.deleted ? (
                          <button
                            onClick={() => setWishDeleted(w.id, false)}
                            disabled={isBusy}
                            aria-label="Restore"
                            style={{ ...iconBtnStyle, color: "#3E7A4A" }}
                          >
                            <RotateCcw size={14} strokeWidth={1.5} />
                          </button>
                        ) : (
                          <button
                            onClick={() => setWishDeleted(w.id, true)}
                            disabled={isBusy}
                            aria-label="Hide"
                            style={{ ...iconBtnStyle, color: "#C0392B" }}
                          >
                            <Trash2 size={14} strokeWidth={1.5} />
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const iconBtnStyle: React.CSSProperties = {
  width: "30px",
  height: "30px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "6px",
  border: "1px solid rgba(201,165,109,0.35)",
  background: "#FFFDF9",
  color: "#8A7C73",
  cursor: "pointer",
};
