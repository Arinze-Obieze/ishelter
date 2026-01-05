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

// ============================================================================
// NEW RATE LIMITING FUNCTIONS (IP-BASED FOR PUBLIC ENDPOINTS)
// ============================================================================

/**
 * Check rate limit by IP address for public endpoints
 * @param {string} ipAddress - Client IP address
 * @param {string} type - Rate limit type (e.g., 'create-account', 'email-send', 'affiliate')
 * @param {number} maxRequests - Maximum requests allowed in the time window (default: varies by type)
 * @param {number} windowMinutes - Time window in minutes (default: 60)
 */
export async function checkRateLimitByIP(ipAddress, type, maxRequests = 10, windowMinutes = 60) {
  const now = new Date();
  const windowStart = new Date(now.getTime() - windowMinutes * 60 * 1000);

  try {
    const snapshot = await adminDb
      .collection("rate_limits")
      .where("ipAddress", "==", ipAddress)
      .where("type", "==", type)
      .where("timestamp", ">", windowStart)
      .get();

    const count = snapshot.size;

    if (count >= maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: new Date(windowStart.getTime() + windowMinutes * 60 * 1000),
      };
    }

    return {
      allowed: true,
      remaining: maxRequests - count,
      resetTime: new Date(windowStart.getTime() + windowMinutes * 60 * 1000),
    };
  } catch (error) {
    console.error(`Rate limit check error for ${type}:`, error);
    return { allowed: true, remaining: maxRequests };
  }
}

/**
 * Record an API attempt by IP
 */
export async function recordAttemptByIP(ipAddress, type, metadata = {}) {
  try {
    await adminDb.collection("rate_limits").add({
      type,
      ipAddress,
      ...metadata,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error(`Failed to record ${type} attempt:`, error);
  }
}

/**
 * Check rate limit by user ID for authenticated endpoints
 * @param {string} userId - User ID
 * @param {string} type - Rate limit type (e.g., 'admin-operation', 'notification-create')
 * @param {number} maxRequests - Maximum requests allowed in the time window
 * @param {number} windowMinutes - Time window in minutes (default: 60)
 */
export async function checkRateLimitByUser(userId, type, maxRequests = 20, windowMinutes = 60) {
  const now = new Date();
  const windowStart = new Date(now.getTime() - windowMinutes * 60 * 1000);

  try {
    const snapshot = await adminDb
      .collection("rate_limits")
      .where("userId", "==", userId)
      .where("type", "==", type)
      .where("timestamp", ">", windowStart)
      .get();

    const count = snapshot.size;

    if (count >= maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: new Date(windowStart.getTime() + windowMinutes * 60 * 1000),
      };
    }

    return {
      allowed: true,
      remaining: maxRequests - count,
      resetTime: new Date(windowStart.getTime() + windowMinutes * 60 * 1000),
    };
  } catch (error) {
    console.error(`Rate limit check error for ${type}:`, error);
    return { allowed: true, remaining: maxRequests };
  }
}

/**
 * Record an API attempt by user
 */
export async function recordAttemptByUser(userId, type, metadata = {}) {
  try {
    await adminDb.collection("rate_limits").add({
      type,
      userId,
      ...metadata,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error(`Failed to record ${type} attempt:`, error);
  }
}

/**
 * Check rate limit for email sending
 * @param {string} identifier - IP address or email (whatever is being limited)
 * @param {string} identifierType - 'ip' or 'email'
 * @param {number} maxEmails - Maximum emails allowed (default: 50 per hour)
 */
export async function checkRateLimitEmail(identifier, identifierType = 'ip', maxEmails = 50) {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

  try {
    const query = adminDb
      .collection("rate_limits")
      .where("type", "==", "email-send")
      .where("timestamp", ">", oneHourAgo);

    let snapshot;
    if (identifierType === 'ip') {
      snapshot = await query.where("ipAddress", "==", identifier).get();
    } else {
      snapshot = await query.where("email", "==", identifier.toLowerCase()).get();
    }

    const count = snapshot.size;

    if (count >= maxEmails) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: new Date(oneHourAgo.getTime() + 60 * 60 * 1000),
      };
    }

    return {
      allowed: true,
      remaining: maxEmails - count,
      resetTime: new Date(oneHourAgo.getTime() + 60 * 60 * 1000),
    };
  } catch (error) {
    console.error("Email rate limit check error:", error);
    return { allowed: true, remaining: maxEmails };
  }
}

/**
 * Record an email sending attempt
 */
export async function recordEmailAttempt(identifier, identifierType = 'ip', recipientCount = 1) {
  try {
    const record = {
      type: "email-send",
      recipientCount,
      timestamp: new Date(),
    };

    if (identifierType === 'ip') {
      record.ipAddress = identifier;
    } else {
      record.email = identifier.toLowerCase();
    }

    await adminDb.collection("rate_limits").add(record);
  } catch (error) {
    console.error("Failed to record email attempt:", error);
  }
}
