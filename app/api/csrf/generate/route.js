import { NextResponse } from 'next/server';
import { getUserIdFromToken } from '@/lib/ipUtils';
import { refreshCsrfToken } from '@/lib/csrf';

/**
 * Generate CSRF Token Endpoint
 * 
 * POST /api/csrf/generate
 * 
 * Generates a new CSRF token for the authenticated user.
 * Requires valid Firebase authentication token.
 */
export async function POST(request) {
  try {
    // Extract and verify authentication token
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }

    const idToken = authHeader.split('Bearer ')[1];
    const userId = await getUserIdFromToken(idToken);

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }

    // Generate and store new CSRF token
    const csrfToken = await refreshCsrfToken(userId);

    console.log(`[CSRF] Generated token for user: ${userId}`);

    return NextResponse.json(
      { 
        success: true,
        csrfToken,
        expiresIn: 3600, // 1 hour in seconds
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[CSRF] Error generating token:', error);
    return NextResponse.json(
      { error: 'Failed to generate CSRF token' },
      { status: 500 }
    );
  }
}
