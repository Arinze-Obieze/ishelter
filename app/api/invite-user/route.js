import { getAuth } from 'firebase-admin/auth';
import { initializeApp, cert } from 'firebase-admin/app';
import { getApps } from 'firebase-admin/app';

// Read the Base64 service account key and projectId from environment variables
const base64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64;
const projectId = process.env. NEXT_PUBLIC_FIREBASE_PROJECTID;
if (!base64) {
  throw new Error('Missing FIREBASE_SERVICE_ACCOUNT_KEY_BASE64 environment variable');
}
if (!projectId) {
  throw new Error('Missing FIREBASE_PROJECT_ID environment variable');
}
const serviceAccount = JSON.parse(Buffer.from(base64, 'base64').toString('utf-8'));

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  initializeApp({ credential: cert(serviceAccount), projectId });
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
