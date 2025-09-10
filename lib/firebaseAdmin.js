// lib/firebaseAdmin.js
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// Read the Base64 service account key from environment variables
const base64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64;
if (!base64) {
  throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_KEY_BASE64 environment variable");
}

// Decode Base64 into JSON
const serviceAccount = JSON.parse(
  Buffer.from(base64, "base64").toString("utf-8")
);

// Prevent re-initializing in development (Hot Reload)
if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

export const adminAuth = getAuth();
export const adminDb = getFirestore();
