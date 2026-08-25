import { NextRequest, NextResponse } from "next/server";
import { getAdminDb, isAdminAuthorized } from "@/lib/firebase-admin";

export async function PATCH(req: NextRequest, { params }: RouteContext<"/api/wishes/[id]">) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const update: Record<string, string | boolean> = {};

  if (typeof body.deleted === "boolean") {
    update.deleted = body.deleted;
  }

  if (body.name !== undefined || body.relation !== undefined || body.message !== undefined) {
    const { name, relation, message } = body;
    if (!name?.trim() || !relation?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "Name, relation, and message are required" }, { status: 400 });
    }
    update.name = name.trim().slice(0, 60);
    update.relation = relation.trim();
    update.message = message.trim().slice(0, 500);
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const db = getAdminDb();
  if (!db) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  try {
    await db.collection("wishes").doc(id).update(update);
    return NextResponse.json({ id, ...update });
  } catch {
    return NextResponse.json({ error: "Failed to update wish" }, { status: 500 });
  }
}

// Soft delete — wishes are marked `deleted: true` rather than removed from the database,
// so they disappear from the public site but stay recoverable from the admin screen.
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
    await db.collection("wishes").doc(id).update({ deleted: true });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete wish" }, { status: 500 });
  }
}
