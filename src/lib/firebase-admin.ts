import { initializeApp, getApps, getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { timingSafeEqual } from "crypto";
import { NextRequest } from "next/server";

export function getAdminDb() {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId || projectId === "your_project_id") return null;

  try {
    const app = getApps().length ? getApp() : initializeApp({ projectId });
    return getFirestore(app);
  } catch {
    return null;
  }
}

// Read from the environment so the passcode isn't committed to the repo.
// ADMIN_EDIT_PASSWORD must be set wherever this is deployed; the fallback
// keeps the previous value working so an unconfigured deploy doesn't lock
// the couple out of their own wishes screen.
const ADMIN_EDIT_PASSWORD = process.env.ADMIN_EDIT_PASSWORD || "80560";

export function isAdminAuthorized(req: NextRequest): boolean {
  const provided = req.headers.get("x-admin-secret");
  if (!provided) return false;

  const a = Buffer.from(provided);
  const b = Buffer.from(ADMIN_EDIT_PASSWORD);
  // Length check first — timingSafeEqual throws on a length mismatch.
  return a.length === b.length && timingSafeEqual(a, b);
}
