import { NextRequest, NextResponse } from "next/server";
import { getAdminDb, isAdminAuthorized } from "@/lib/firebase-admin";
import { sampleWishes } from "@/lib/sample-wishes";

export async function GET(req: NextRequest) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getAdminDb();
  if (!db) {
    // Sample data when Firebase isn't configured, so the edit UI still works.
    return NextResponse.json({ wishes: sampleWishes() });
  }

  try {
    const snap = await db.collection("wishes").orderBy("createdAt", "desc").get();
    const wishes = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return NextResponse.json({ wishes });
  } catch {
    return NextResponse.json({ error: "Failed to load wishes" }, { status: 500 });
  }
}
