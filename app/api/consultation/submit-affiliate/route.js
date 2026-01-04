import { firebaseAdmin } from '@/lib/firebaseAdmin';

export async function POST(req) {
  try {
    const { affiliateId, timestamp } = await req.json();

    if (!affiliateId) {
      return Response.json(
        { error: 'Affiliate ID is required' },
        { status: 400 }
      );
    }

    // Store affiliate booking data in Firestore
    const db = firebaseAdmin.firestore();
    const affiliateBookingsRef = db.collection('affiliateBookings');

    const docRef = await affiliateBookingsRef.add({
      affiliateId,
      submittedAt: timestamp || new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });

    console.log('Affiliate booking recorded:', docRef.id);

    return Response.json(
      {
        success: true,
        message: 'Affiliate ID recorded successfully',
        bookingId: docRef.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error submitting affiliate booking:', error);
    return Response.json(
      { error: 'Failed to submit affiliate booking' },
      { status: 500 }
    );
  }
}
