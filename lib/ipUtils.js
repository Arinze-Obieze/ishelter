// lib/ipUtils.js
// Utility functions for extracting and validating IP addresses

/**
 * Extract client IP address from request headers
 * Checks multiple sources to handle proxies and CDNs
 */
export function getClientIP(request) {
  // Check x-forwarded-for (most reliable for proxies/load balancers)
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwarded.split(',')[0].trim();
  }

  // Check x-real-ip (used by some proxies)
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP.trim();
  }

  // Check cf-connecting-ip (Cloudflare)
  const cfIP = request.headers.get('cf-connecting-ip');
  if (cfIP) {
    return cfIP.trim();
  }

  // Fallback to x-client-ip
  const clientIP = request.headers.get('x-client-ip');
  if (clientIP) {
    return clientIP.trim();
  }

  // Last resort - this is less reliable
  return 'unknown';
}

/**
 * Validate IP address format (basic check)
 */
export function isValidIP(ip) {
  if (ip === 'unknown') {
    return false;
  }

  // IPv4 pattern
  const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
  // IPv6 pattern (simplified)
  const ipv6Pattern = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;

  return ipv4Pattern.test(ip) || ipv6Pattern.test(ip);
}

/**
 * Extract and verify Firebase Auth token from request headers
 * Returns { userId: string, valid: boolean, error?: string }
 */
export async function extractUserFromAuthToken(request) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { userId: null, valid: false, error: 'No authorization header' };
    }

    const token = authHeader.split('Bearer ')[1];
    if (!token) {
      return { userId: null, valid: false, error: 'Invalid token format' };
    }

    // Import adminAuth from firebaseAdmin
    const { adminAuth } = await import('@/lib/firebaseAdmin');
    
    try {
      const decodedToken = await adminAuth.verifyIdToken(token);
      return { userId: decodedToken.uid, valid: true };
    } catch (error) {
      return { userId: null, valid: false, error: 'Invalid or expired token' };
    }
  } catch (error) {
    return { userId: null, valid: false, error: error.message };
  }
}
