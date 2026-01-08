/**
 * CSRF Protection Utility
 * 
 * Provides token generation, validation, and management for Cross-Site Request Forgery protection.
 * 
 * Security Features:
 * - Cryptographically secure random token generation
 * - Token binding to user sessions
 * - Automatic token rotation
 * - Firestore-backed token storage for validation
 */

import { randomBytes } from 'crypto';
import { adminDb } from './firebaseAdmin';

/**
 * Generate a cryptographically secure CSRF token
 * @returns {string} 64-character hexadecimal token
 */
export function generateCsrfToken() {
  return randomBytes(32).toString('hex');
}

/**
 * Store CSRF token in Firestore for validation
 * @param {string} userId - User ID to associate token with
 * @param {string} token - CSRF token to store
 * @param {number} expiresInMs - Token expiration time in milliseconds (default: 1 hour)
 */
export async function storeCsrfToken(userId, token, expiresInMs = 60 * 60 * 1000) {
  const expiresAt = new Date(Date.now() + expiresInMs);
  
  await adminDb.collection('csrfTokens').doc(userId).set({
    token,
    expiresAt,
    createdAt: new Date(),
  });
}

/**
 * Validate CSRF token from request against stored token
 * @param {string} userId - User ID to validate token for
 * @param {string} requestToken - Token from request header
 * @param {boolean} strictMode - If false, only logs violations without blocking (default: false)
 * @returns {Promise<{valid: boolean, reason?: string}>}
 */
export async function validateCsrfToken(userId, requestToken, strictMode = false) {
  // Missing token
  if (!requestToken) {
    const violation = { valid: false, reason: 'CSRF token missing from request' };
    
    if (!strictMode) {
      console.warn('[CSRF] Log-only violation:', { userId, reason: violation.reason });
      return { valid: true }; // Allow in log-only mode
    }
    
    return violation;
  }

  // Missing user ID
  if (!userId) {
    const violation = { valid: false, reason: 'User ID not found' };
    
    if (!strictMode) {
      console.warn('[CSRF] Log-only violation:', { reason: violation.reason });
      return { valid: true };
    }
    
    return violation;
  }

  try {
    // Retrieve stored token
    const tokenDoc = await adminDb.collection('csrfTokens').doc(userId).get();
    
    if (!tokenDoc.exists) {
      const violation = { valid: false, reason: 'CSRF token not found in database' };
      
      if (!strictMode) {
        console.warn('[CSRF] Log-only violation:', { userId, reason: violation.reason });
        return { valid: true };
      }
      
      return violation;
    }

    const storedData = tokenDoc.data();
    const { token: storedToken, expiresAt } = storedData;

    // Check expiration
    if (expiresAt.toDate() < new Date()) {
      const violation = { valid: false, reason: 'CSRF token expired' };
      
      if (!strictMode) {
        console.warn('[CSRF] Log-only violation:', { userId, reason: violation.reason });
        return { valid: true };
      }
      
      return violation;
    }

    // Compare tokens (constant-time comparison to prevent timing attacks)
    const tokensMatch = timingSafeEqual(requestToken, storedToken);
    
    if (!tokensMatch) {
      const violation = { valid: false, reason: 'CSRF token mismatch' };
      
      if (!strictMode) {
        console.warn('[CSRF] Log-only violation:', { userId, reason: violation.reason });
        return { valid: true };
      }
      
      return violation;
    }

    return { valid: true };
  } catch (error) {
    console.error('[CSRF] Error validating token:', error);
    
    if (!strictMode) {
      console.warn('[CSRF] Log-only mode: allowing request despite validation error');
      return { valid: true };
    }
    
    return { valid: false, reason: 'CSRF validation error: ' + error.message };
  }
}

/**
 * Timing-safe string comparison to prevent timing attacks
 * @param {string} a - First string
 * @param {string} b - Second string
 * @returns {boolean} True if strings match
 */
function timingSafeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') {
    return false;
  }
  
  if (a.length !== b.length) {
    return false;
  }
  
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  
  return mismatch === 0;
}

/**
 * Delete expired CSRF tokens (for cleanup cron job)
 * @returns {Promise<number>} Number of tokens deleted
 */
export async function cleanupExpiredTokens() {
  const now = new Date();
  const expiredTokens = await adminDb
    .collection('csrfTokens')
    .where('expiresAt', '<', now)
    .get();

  const batch = adminDb.batch();
  expiredTokens.docs.forEach(doc => {
    batch.delete(doc.ref);
  });

  await batch.commit();
  return expiredTokens.size;
}

/**
 * Refresh CSRF token for a user (generates new token and stores it)
 * @param {string} userId - User ID
 * @returns {Promise<string>} New CSRF token
 */
export async function refreshCsrfToken(userId) {
  const newToken = generateCsrfToken();
  await storeCsrfToken(userId, newToken);
  return newToken;
}

/**
 * Delete CSRF token for a user (on logout)
 * @param {string} userId - User ID
 */
export async function deleteCsrfToken(userId) {
  await adminDb.collection('csrfTokens').doc(userId).delete();
}
