// lib/rateLimit.js
// Rate limiting and IP abuse detection for consultation bookings

import { adminDb } from "@/lib/firebaseAdmin";

/**
 * Check rate limit for consultation bookings
 * Max 5 bookings per email per hour
 */
export async function checkRateLimitConsultation(email) {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

  try {
    const snapshot = await adminDb
      .collection("rate_limits")
      .where("email", "==", email.toLowerCase())
      .where("type", "==", "consultation")
      .where("timestamp", ">", oneHourAgo)
      .get();

    const count = snapshot.size;

    // Max 5 bookings per hour
    if (count >= 5) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: new Date(oneHourAgo.getTime() + 60 * 60 * 1000),
      };
    }

    return {
      allowed: true,
      remaining: 5 - count,
      resetTime: new Date(oneHourAgo.getTime() + 60 * 60 * 1000),
    };
  } catch (error) {
    console.error("Rate limit check error:", error);
    // On error, allow the request but log it
    return { allowed: true, remaining: 5 };
  }
}

/**
 * Record a consultation booking attempt
 */
export async function recordConsultationAttempt(email, ipAddress, success = true) {
  try {
    await adminDb.collection("rate_limits").add({
      email: email.toLowerCase(),
      type: "consultation",
      ipAddress,
      success,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Failed to record attempt:", error);
  }
}

/**
 * Check for suspicious IP patterns (multiple emails from same IP)
 * Detects coordinated attacks or bot networks
 */
export async function checkSuspiciousIP(ipAddress) {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

  try {
    const snapshot = await adminDb
      .collection("rate_limits")
      .where("ipAddress", "==", ipAddress)
      .where("type", "==", "consultation")
      .where("timestamp", ">", oneHourAgo)
      .get();

    // If same IP created >10 registrations with different emails in 1 hour = suspicious
    const uniqueEmails = new Set(snapshot.docs.map(doc => doc.data().email));
    const isSuspicious = uniqueEmails.size > 10;

    return {
      isSuspicious,
      attemptCount: snapshot.size,
      uniqueEmails: uniqueEmails.size,
    };
  } catch (error) {
    console.error("Suspicious IP check error:", error);
    return { isSuspicious: false, attemptCount: 0, uniqueEmails: 0 };
  }
}
