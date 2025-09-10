import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Missing email or password" }), { status: 400 });
    }

    const userRecord = await adminAuth.createUser({ email, password });

    await adminAuth.setCustomUserClaims(userRecord.uid, { admin: true });

    await adminDb.collection("users").doc(userRecord.uid).set({
      email,
      role: "admin",
      createdAt: new Date(),
    });

    return new Response(JSON.stringify({ message: "Admin created successfully", uid: userRecord.uid }), { status: 201 });
  } catch (error) {
    console.error("Error creating admin:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
