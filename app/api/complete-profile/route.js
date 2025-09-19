// /app/api/complete-profile/route.js
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

export async function POST(req) {
  try {
    const { email, password, role } = await req.json();
    if (!email || !password || !role) {
      return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
    }

    // Find or create user
    let userRecord;
    try {
      userRecord = await adminAuth.getUserByEmail(email);
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        userRecord = await adminAuth.createUser({ email, password });
      } else {
        throw err;
      }
    }

    // If user exists but has no password, set it
    if (!userRecord.passwordHash) {
      await adminAuth.updateUser(userRecord.uid, { password });
    }

    // Add profile to Firestore
    await adminDb.collection("users").doc(userRecord.uid).collection("profile").doc("main").set({
      email,
      role,
      completedAt: new Date(),
    });

    return new Response(JSON.stringify({ message: "Profile completed" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
