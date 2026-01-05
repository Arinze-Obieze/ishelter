import { adminDb } from '@/lib/firebaseAdmin';
import { getClientIP } from '@/lib/ipUtils';
import { checkRateLimitByIP, recordAttemptByIP } from '@/lib/rateLimit';

export async function POST(req) {
  try {
    // RATE LIMITING: Max 10 affiliate submissions per IP per hour
    const ipAddress = getClientIP(req);
    const rateLimitCheck = await checkRateLimitByIP(ipAddress, 'affiliate-submit', 10, 60);
    
    if (!rateLimitCheck.allowed) {
      console.warn(`[SECURITY] Rate limit exceeded for affiliate-submit from IP: ${ipAddress}`);
      
      await recordAttemptByIP(ipAddress, 'affiliate-submit', {
        blocked: true,
        reason: 'rate-limit-exceeded'
      });
      
      return new Response(JSON.stringify({
        error: 'Too many submission attempts. Please try again later.',
        resetTime: rateLimitCheck.resetTime
      }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { affiliateId, timestamp } = await req.json();

    if (!affiliateId) {
      return new Response(JSON.stringify({ error: 'Affiliate ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const affiliateBookingsRef = adminDb.collection('affiliateBookings');
    const docRef = await affiliateBookingsRef.add({
      affiliateId,
      submittedAt: timestamp || new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });

    console.log('Affiliate booking recorded:', docRef.id);

    // Record successful attempt
    await recordAttemptByIP(ipAddress, 'affiliate-submit', {
      affiliateId,
      success: true
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Affiliate ID recorded successfully',
        bookingId: docRef.id,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error submitting affiliate booking:', error);
    return new Response(JSON.stringify({ error: 'Failed to submit affiliate booking' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
