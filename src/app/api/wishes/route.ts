import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { initializeApp, getApps, getApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function getAdminDb() {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId || projectId === "your_project_id") return null;

  try {
    const app = getApps().length
      ? getApp()
      : initializeApp({ projectId });
    return getFirestore(app);
  } catch {
    return null;
  }
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
          email: "sample@example.com",
          message: "Wishing you both a lifetime of love and happiness! May your journey together be filled with joy, laughter, and endless blessings. Congratulations Berlin and Jerlin Ashika! 🎉",
          photoUrl: null,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ],
    });
  }

  try {
    const snap = await db.collection("wishes").orderBy("createdAt", "desc").limit(50).get();
    const wishes = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return NextResponse.json({ wishes });
  } catch {
    return NextResponse.json({ wishes: [] });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { message, photoUrl } = await req.json();
  if (!message?.trim()) {
    return NextResponse.json({ error: "Message required" }, { status: 400 });
  }

  const db = getAdminDb();
  if (!db) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  try {
    // One wish per email
    const existing = await db.collection("wishes").where("email", "==", session.user.email).get();
    if (!existing.empty) {
      return NextResponse.json({ error: "You have already left a wish!" }, { status: 409 });
    }

    const wish = {
      name: session.user.name ?? "Guest",
      email: session.user.email,
      message: message.trim().slice(0, 500),
      photoUrl: photoUrl ?? null,
      createdAt: new Date().toISOString(),
    };

    const ref = await db.collection("wishes").add(wish);
    return NextResponse.json({ id: ref.id, ...wish });
  } catch {
    return NextResponse.json({ error: "Failed to save wish" }, { status: 500 });
  }
}
