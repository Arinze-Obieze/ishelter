import { adminDb } from '@/lib/firebaseAdmin';

export async function POST(req) {
  try {
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
