import { NextResponse } from 'next/server';

/**
 * Middleware for API Route Protection
 * 
 * Implements:
 * - Origin-based access control
 * - Environment-aware origin allowlisting
 * - Firebase Cloud Functions support
 * - Internal API key validation
 * - Public endpoint exceptions
 */

export function middleware(request) {
  const origin = request.headers.get('origin');
  const pathname = request.nextUrl.pathname;
  const host = request.headers.get('host');
  
  // Determine environment based on host
  const isDevelopment = host?.includes('localhost') || host?.includes('127.0.0.1');
  
  // Allowed origins (environment-specific)
  const allowedOrigins = isDevelopment 
    ? [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3000',
      ]
    : [
        'https://ishelter.everythingshelter.com.ng',
        'https://www.ishelter.everythingshelter.com.ng',
        'https://shelter.everythingshelter.com.ng',
      ];
  
  // Firebase Cloud Functions domains (for scheduled tasks)
  const isFromFirebase = origin && (
    origin.includes('cloudfunctions.net') ||
    origin.includes('run.app')
  );
  
  // Public endpoints that don't require origin restriction
  const publicEndpoints = [
    '/api/consultation/registration',
    '/api/consultation/submit-affiliate',
    '/api/check-overdue-tasks', // For cron jobs
    '/api/csrf/generate', // Must be accessible for authenticated users
  ];
  
  const isPublic = publicEndpoints.some(ep => pathname.startsWith(ep));
  
  // Check for internal API key (server-to-server)
  const internalApiKey = request.headers.get('x-internal-api-key');
  const hasValidKey = internalApiKey === process.env.INTERNAL_API_KEY;
  
  // For protected API routes
  if (pathname.startsWith('/api/') && !isPublic) {
    const isAllowed = 
      !origin || // Same-origin request (browser to same server)
      allowedOrigins.includes(origin) ||
      isFromFirebase ||
      hasValidKey;
    
    if (!isAllowed) {
      console.warn(`[MIDDLEWARE] Blocked request: origin=${origin} → host=${host}${pathname}`);
      return NextResponse.json(
        { error: 'Forbidden - Invalid origin' },
        { status: 403 }
      );
    }
  }
  
  // Add CORS headers for allowed origins
  const response = NextResponse.next();
  
  if (origin && (allowedOrigins.includes(origin) || isFromFirebase)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT,OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Internal-Api-Key, Authorization, Content-Type, Accept');
  }
  
  // Handle preflight OPTIONS requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': origin || '*',
        'Access-Control-Allow-Methods': 'GET,DELETE,PATCH,POST,PUT,OPTIONS',
        'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Internal-Api-Key, Authorization, Content-Type, Accept',
        'Access-Control-Max-Age': '86400',
      },
    });
  }
  
  return response;
}

export const config = {
  matcher: '/api/:path*',
};
