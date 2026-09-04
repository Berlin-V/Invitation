import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { clientKey, createRateLimiter } from "@/lib/rate-limit";
import { sampleWishes } from "@/lib/sample-wishes";

// Without an auth gate, this is the only spam guard on the guestbook.
const isRateLimited = createRateLimiter({ windowMs: 60 * 60 * 1000, max: 5 });

export async function GET() {
  const db = getAdminDb();
  if (!db) {
    return NextResponse.json({ wishes: sampleWishes().slice(0, 1) });
  }

  try {
    const snap = await db.collection("wishes").orderBy("createdAt", "desc").limit(50).get();
    const wishes = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((w) => !(w as { deleted?: boolean }).deleted);
    return NextResponse.json(
      { wishes },
      { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" } }
    );
  } catch {
    return NextResponse.json({ wishes: [] });
  }
}

export async function POST(req: NextRequest) {
  if (isRateLimited(clientKey(req))) {
    return NextResponse.json(
      { error: "You've submitted enough wishes for now — thank you!" },
      { status: 429 }
    );
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
      deleted: false,
    };

    const ref = await db.collection("wishes").add(wish);
    return NextResponse.json({ id: ref.id, ...wish });
  } catch {
    return NextResponse.json({ error: "Failed to save wish" }, { status: 500 });
  }
}
