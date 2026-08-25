import { NextRequest, NextResponse } from "next/server";
import { getAdminDb, isAdminAuthorized } from "@/lib/firebase-admin";

export async function GET(req: NextRequest) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getAdminDb();
  if (!db) {
    // Sample data when Firebase isn't configured, so the edit UI can still be exercised.
    return NextResponse.json({
      wishes: [
        {
          id: "sample1",
          name: "Sarah & James",
          relation: "Friend of the Couple",
          message: "Wishing you both a lifetime of love and happiness! May your journey together be filled with joy, laughter, and endless blessings. Congratulations Berlin and Jerlin Ashika! 🎉",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: "sample2",
          name: "Aunt Priya",
          relation: "Family",
          message: "So happy for you both — wishing you a lifetime of love!",
          createdAt: new Date(Date.now() - 172800000).toISOString(),
        },
      ],
    });
  }

  try {
    const snap = await db.collection("wishes").orderBy("createdAt", "desc").get();
    const wishes = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return NextResponse.json({ wishes });
  } catch {
    return NextResponse.json({ error: "Failed to load wishes" }, { status: 500 });
  }
}
