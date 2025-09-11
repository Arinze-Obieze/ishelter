import { getAuth } from 'firebase-admin/auth';
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getApp, getApps } from 'firebase-admin/app';

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  initializeApp({ credential: applicationDefault() });
}

export async function POST(req) {
  const { email } = await req.json();
  const auth = getAuth();

  try {
    let user;
    try {
      user = await auth.getUserByEmail(email);
    } catch (e) {
      if (e.code === 'auth/user-not-found') {
        user = await auth.createUser({ email });
      } else {
        throw e;
      }
    }

    // If user was just created, send magic link
    if (!user.passwordHash) {
      // Use Firebase Client SDK on frontend to send magic link
      return Response.json({ status: 'send-magic-link' });
    } else {
      // Use Firebase Client SDK on frontend to send password reset
      return Response.json({ status: 'send-password-reset' });
    }
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
