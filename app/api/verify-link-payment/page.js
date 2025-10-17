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
    console.log("Received payment verification request:", body);
    
    const { tx_ref, transaction_id, invoiceId } = body;
    
    if (!transaction_id) {
      return NextResponse.json({ error: "Missing transaction_id" }, { status: 422 });
    }

    // Verify payment with Flutterwave
    const verifyUrl = `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`;
    const verifyRes = await fetch(verifyUrl, {
      headers: {
        Authorization: `Bearer ${FLW_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    
    const verifyData = await verifyRes.json();
    console.log("Verification response received:", verifyData);
 
    if (verifyData.status === 'success' && verifyData.data.status === 'successful') {
      
      // Find invoice by tx_ref or invoiceId
      let invoiceDoc = null;
      let invoiceData = null;
      
      if (tx_ref) {
        const invoicesSnap = await adminDb
          .collection("project-invoices")
          .where("tx_ref", "==", tx_ref)
          .limit(1)
          .get();
          
        if (!invoicesSnap.empty) {
          invoiceDoc = invoicesSnap.docs[0];
          invoiceData = invoiceDoc.data();
        }
      } else if (invoiceId) {
        const docSnap = await adminDb.collection("project-invoices").doc(invoiceId).get();
        if (docSnap.exists) {
          invoiceDoc = docSnap;
          invoiceData = docSnap.data();
        }
      }
      
      if (!invoiceDoc) {
        console.error("❌ Invoice not found");
        return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
      }
      
      // Check if already paid
      if (invoiceData.status === "paid") {
        return NextResponse.json({ 
          status: "success",
          message: "Payment already confirmed",
          details: {
            invoiceNumber: invoiceData.invoiceNumber,
            amount: invoiceData.amount,
          }
        });
      }
      
      // Verify amount matches
      if (Number(verifyData.data.amount) !== Number(invoiceData.amount)) {
        console.error("❌ Amount mismatch:", {
          expected: invoiceData.amount,
          received: verifyData.data.amount,
        });
        return NextResponse.json({ error: 'Amount mismatch' }, { status: 400 });
      }
   
      try {
        // Mark invoice as paid
        await invoiceDoc.ref.update({
          status: "paid",
          paidAt: new Date(),
          paymentId: transaction_id,
          paymentData: {
            amount: verifyData.data.amount,
            currency: verifyData.data.currency,
            customer: verifyData.data.customer,
            payment_type: verifyData.data.payment_type,
          },
          updatedAt: new Date(),
        });
        
        console.log(`✅ Invoice updated successfully: ${invoiceDoc.id}`);
        
        // Send confirmation emails
        try {
          for (const email of invoiceData.sentTo || []) {
            await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/send-email`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                to: email,
                name: "Valued Client",
                subject: `Payment Confirmed - Invoice ${invoiceData.invoiceNumber}`,
                message: `
                  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #10b981;">Payment Successful!</h2>
                    <p>Hello,</p>
                    <p>Your payment for invoice <strong>${invoiceData.invoiceNumber}</strong> has been received and confirmed.</p>
                    
                    <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                      <p style="margin: 5px 0;"><strong>Project:</strong> ${invoiceData.projectName}</p>
                      <p style="margin: 5px 0;"><strong>Invoice Number:</strong> ${invoiceData.invoiceNumber}</p>
                      <p style="margin: 5px 0;"><strong>Amount Paid:</strong> ₦${Number(invoiceData.amount).toLocaleString()}</p>
                      <p style="margin: 5px 0;"><strong>Payment ID:</strong> ${transaction_id}</p>
                      <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                    </div>
                    
                    <p style="color: #10b981; font-weight: bold;">✓ Payment Status: CONFIRMED</p>
                    
                    <p>Thank you for your payment. If you have any questions, please contact us.</p>
                    
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                    <p style="color: #9ca3af; font-size: 12px;">
                      This is an automated email from iShelter.
                    </p>
                  </div>
                `,
              }),
            });
          }
        } catch (emailErr) {
          console.error("Failed to send confirmation email:", emailErr);
        }
        
      } catch (dbError) {
        console.error("❌ Database update failed:", dbError);
        return NextResponse.json({ error: "Failed to update invoice" }, { status: 500 });
      }

      return NextResponse.json({ 
        status: "success",
        message: "Payment verified successfully",
        details: {
          invoiceNumber: invoiceData.invoiceNumber,
          amount: invoiceData.amount,
          projectName: invoiceData.projectName,
        }
      });
    } else {
      return NextResponse.json({ 
        error: "Payment not verified",
        status: verifyData.data?.status || "unknown"
      }, { status: 400 });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}