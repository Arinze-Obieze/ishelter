// lib/firebaseAdmin.js
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage"; 


const base64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64;
if (!base64) {
  throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_KEY_BASE64 environment variable");
}

const serviceAccount = JSON.parse(
  Buffer.from(base64, "base64").toString("utf-8")
);

// Prevent re-initializing in development (Hot Reload)
if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
    storageBucket: 'ishelter1122.firebasestorage.app'
  });
}

export const adminAuth = getAuth();
export const adminDb = getFirestore();
export const adminStorage = getStorage(); 