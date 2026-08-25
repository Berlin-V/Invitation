import { initializeApp, getApps, getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
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

const ADMIN_EDIT_PASSWORD = "80560";

export function isAdminAuthorized(req: NextRequest): boolean {
  return req.headers.get("x-admin-secret") === ADMIN_EDIT_PASSWORD;
}
