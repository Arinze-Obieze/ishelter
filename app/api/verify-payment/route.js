import { adminDb } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req) {
  const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY;
  
  if (!FLW_SECRET_KEY) {
    console.error("❌ Flutterwave secret key is missing");
    return NextResponse.json({ error: "Payment configuration error" }, { status: 500 });
  }
  try {
    const body = await req.json();
    console.log("Received payload:", body);
    const { tx_ref, transaction_id, registrationId, amount } = body;
    if (!tx_ref || !transaction_id || !registrationId || !amount) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 422 });
    }

    // Verify payment with Flutterwave
    
  const verifyUrl=`https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`
    const verifyRes = await fetch(verifyUrl, {
      headers: {
        Authorization: `Bearer ${FLW_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    const verifyData = await verifyRes.json();
    console.log("Verification response received:", verifyData);
 
    if (verifyData.status === 'success' ) {
     
      if (verifyData.data.tx_ref !== tx_ref) {
        console.error("❌ Transaction reference mismatch:", {
          expected: tx_ref,
          got: verifyData.data.tx_ref,
        });
        return NextResponse.json({ error: 'Transaction reference mismatch' }, { status: 400 });
      }
   
  try{
  // Mark registration as paid
    await adminDb.collection("consultation-registrations").doc(registrationId).update({
      status: "paid",
      paidAt: new Date(),
      paymentRef: tx_ref,
      paymentId: transaction_id,
    });
    console.log(`✅ Firestore updated successfully for registration: ${registrationId}`);
  }catch(e){
    console.error("❌ Firestore update failed:", dbError);
  }

    return new Response(JSON.stringify({ status: "success" }), { status: 200 });
  } else {
    return new Response(JSON.stringify({ error: "Payment not verified" }), { status: 400 });
  }
  } catch (error) {
    console.error("Payment verification error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
