import { NextRequest, NextResponse } from "next/server";
import { getAdminDb, isAdminAuthorized } from "@/lib/firebase-admin";

export async function PATCH(req: NextRequest, { params }: RouteContext<"/api/wishes/[id]">) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { name, relation, message } = await req.json();
  if (!name?.trim() || !relation?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "Name, relation, and message are required" }, { status: 400 });
  }

  const db = getAdminDb();
  if (!db) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  try {
    const update = {
      name: name.trim().slice(0, 60),
      relation: relation.trim(),
      message: message.trim().slice(0, 500),
    };
    await db.collection("wishes").doc(id).update(update);
    return NextResponse.json({ id, ...update });
  } catch {
    return NextResponse.json({ error: "Failed to update wish" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteContext<"/api/wishes/[id]">) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const db = getAdminDb();
  if (!db) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  try {
    await db.collection("wishes").doc(id).delete();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete wish" }, { status: 500 });
  }
}
