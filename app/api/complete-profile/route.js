import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { getClientIP, getUserIdFromToken } from "@/lib/ipUtils";
import { checkRateLimitByIP, recordAttemptByIP } from "@/lib/rateLimit";
import { validateCsrfToken } from "@/lib/csrf";

export async function POST(req) {
  try {
    // RATE LIMITING: Max 10 profile completions per IP per hour
    const ipAddress = getClientIP(req);
    const rateLimitCheck = await checkRateLimitByIP(ipAddress, 'complete-profile', 10, 60);
    
    if (!rateLimitCheck.allowed) {
      console.warn(`[SECURITY] Rate limit exceeded for complete-profile from IP: ${ipAddress}`);
      
      await recordAttemptByIP(ipAddress, 'complete-profile', {
        blocked: true,
        reason: 'rate-limit-exceeded'
      });
      
      return new Response(JSON.stringify({ 
        error: "Too many requests. Please try again later.",
        resetTime: rateLimitCheck.resetTime
      }), { status: 429 });
    }

    // CSRF Protection (log-only mode)
    const authHeader = req.headers.get('authorization');
    const authToken = authHeader?.split('Bearer ')[1];
    const requesterId = await getUserIdFromToken(authToken);
    const csrfToken = req.headers.get('x-csrf-token');
    const csrfValidation = await validateCsrfToken(requesterId, csrfToken, false);
    if (!csrfValidation.valid) {
      console.warn('[CSRF] Validation failed for complete-profile:', csrfValidation.reason);
    }

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

    // Record successful attempt
    await recordAttemptByIP(ipAddress, 'complete-profile', {
      email,
      success: true
    });

    return new Response(JSON.stringify({ message: "Profile completed" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
