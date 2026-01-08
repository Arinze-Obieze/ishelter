import { adminAuth as auth, adminDb as db } from "@/lib/firebaseAdmin";
import { validateCsrfToken } from "@/lib/csrf";
import { getUserIdFromToken } from "@/lib/ipUtils";

export async function POST(req) {
  try {
    // CSRF Protection (log-only mode)
    const authHeader = req.headers.get('authorization');
    const authToken = authHeader?.split('Bearer ')[1];
    const requesterId = await getUserIdFromToken(authToken);
    const csrfToken = req.headers.get('x-csrf-token');
    const csrfValidation = await validateCsrfToken(requesterId, csrfToken, false);
    if (!csrfValidation.valid) {
      console.warn('[CSRF] Validation failed for admin/invite-user:', csrfValidation.reason);
    }

    const { email } = await req.json();
    if (!email) {
      return new Response(JSON.stringify({ error: "Missing email" }), { status: 400 });
    }

    // Check if user exists
    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(email);
    } catch (err) {
      // User does not exist, create user
      userRecord = await auth.createUser({ email });
      // Optionally set claims or add to Firestore
      await db.collection("users").doc(userRecord.uid).set({
        email,
        invitedAt: new Date(),
        role: "user",
        status: "Pending"
      });
    }

    // Send magic link or password reset
    let linkType, link;
    try {
      // If user exists, send password reset
      link = await auth.generatePasswordResetLink(email);
      linkType = "reset";
    } catch (err) {
      // If just created, send sign-in link
      link = await auth.generateSignInWithEmailLink(email, {
        url: process.env.NEXT_PUBLIC_MAGIC_LINK_REDIRECT_URL || "https://your-app-url.com/login"
      });
      linkType = "magic";
    }

    // Save invitation record
    await db.collection("invitations").add({
      email,
      link,
      linkType,
      sentAt: new Date()
    });

    return new Response(JSON.stringify({ message: "Invitation sent", link, linkType }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function GET() {
  // Fetch recent invitations
  const snapshot = await db.collection("invitations").orderBy("sentAt", "desc").limit(10).get();
  const invitations = snapshot.docs.map(doc => doc.data());
  return new Response(JSON.stringify({ invitations }), { status: 200 });
}
