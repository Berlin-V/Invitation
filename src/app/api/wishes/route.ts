import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";

// Per-instance in-memory limiter — without an auth gate, this is the only spam guard.
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX_SUBMISSIONS = 5;
const submissionLog = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (submissionLog.get(key) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX_SUBMISSIONS) {
    submissionLog.set(key, recent);
    return true;
  }
  recent.push(now);
  submissionLog.set(key, recent);
  return false;
}

export async function GET() {
  const db = getAdminDb();
  if (!db) {
    // Return sample wishes when Firebase isn't configured
    return NextResponse.json({
      wishes: [
        {
          id: "sample1",
          name: "Sarah & James",
          relation: "Friend of the Couple",
          message: "Wishing you both a lifetime of love and happiness! May your journey together be filled with joy, laughter, and endless blessings. Congratulations Berlin and Jerlin Ashika! 🎉",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ],
    });
  }

  try {
    const snap = await db.collection("wishes").orderBy("createdAt", "desc").limit(50).get();
    const wishes = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return NextResponse.json(
      { wishes },
      { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" } }
    );
  } catch {
    return NextResponse.json({ wishes: [] });
  }
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "You've submitted enough wishes for now — thank you!" }, { status: 429 });
  }

  const { name, relation, message } = await req.json();
  if (!name?.trim() || !relation?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "Name, relation, and message are required" }, { status: 400 });
  }

  const db = getAdminDb();
  if (!db) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  try {
    const wish = {
      name: name.trim().slice(0, 60),
      relation: relation.trim(),
      message: message.trim().slice(0, 500),
      createdAt: new Date().toISOString(),
    };

    const ref = await db.collection("wishes").add(wish);
    return NextResponse.json({ id: ref.id, ...wish });
  } catch {
    return NextResponse.json({ error: "Failed to save wish" }, { status: 500 });
  }
}
