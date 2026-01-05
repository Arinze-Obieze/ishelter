import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { validateConsultationRegistration } from "@/lib/validation";
import { checkRateLimitConsultation, recordConsultationAttempt, checkSuspiciousIP } from "@/lib/rateLimit";
import { getClientIP } from "@/lib/ipUtils";

export async function POST(req) {
  try {
    // 1. EXTRACT CLIENT IP
    const ipAddress = getClientIP(req);

    // 2. CHECK FOR SUSPICIOUS IP PATTERNS
    const ipCheck = await checkSuspiciousIP(ipAddress);
    if (ipCheck.isSuspicious) {
      console.warn(`[SECURITY] Suspicious IP detected: ${ipAddress} (${ipCheck.uniqueEmails} unique emails in 1 hour)`);
      
      // Record failed attempt
      const data = await req.json();
      await recordConsultationAttempt(data.email || 'unknown', ipAddress, false);
      
      return NextResponse.json(
        { error: "Too many requests from your location. Please try again later." },
        { status: 429 }
      );
    }

    // 3. PARSE REQUEST BODY
    const data = await req.json();

    // 4. INPUT VALIDATION
    const validation = validateConsultationRegistration(data);
    if (!validation.valid) {
      // Record failed validation attempt
      await recordConsultationAttempt(data.email || 'unknown', ipAddress, false);
      
      return NextResponse.json(
        { 
          error: "Validation failed",
          details: validation.errors 
        },
        { status: 400 }
      );
    }

    const { sanitized } = validation;

    // 5. CHECK RATE LIMIT (max 5 per email per hour)
    const rateLimit = await checkRateLimitConsultation(sanitized.email);
    if (!rateLimit.allowed) {
      console.warn(`[SECURITY] Rate limit exceeded for email: ${sanitized.email}`);
      
      return NextResponse.json(
        { 
          error: `Too many booking attempts. Please try again in ${Math.ceil((rateLimit.resetTime - new Date()) / 60000)} minutes.`,
          resetTime: rateLimit.resetTime
        },
        { status: 429 }
      );
    }

    // 6. CHECK FOR DUPLICATE EMAILS (same day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const duplicateCheck = await adminDb
      .collection("consultation-registrations")
      .where("email", "==", sanitized.email)
      .where("createdAt", ">=", today)
      .limit(1)
      .get();

    if (!duplicateCheck.empty) {
      console.warn(`[SECURITY] Duplicate booking attempt: ${sanitized.email}`);
      
      return NextResponse.json(
        { error: "You have already submitted a booking today. Please check your email for confirmation." },
        { status: 409 }
      );
    }

    // 7. SAVE TO FIRESTORE
    const docRef = await adminDb.collection("consultation-registrations").add({
      ...sanitized,
      ipAddress,
      createdAt: new Date(),
      status: 'pending',
      ipChecks: {
        suspiciousCount: ipCheck.attemptCount,
        uniqueEmailsFromIP: ipCheck.uniqueEmails,
      },
    });

    // 8. RECORD SUCCESSFUL ATTEMPT
    await recordConsultationAttempt(sanitized.email, ipAddress, true);

    console.log(`[SUCCESS] Consultation registered: ${docRef.id} from ${sanitized.email}`);

    return NextResponse.json(
      {
        success: true,
        id: docRef.id,
        message: "Registration saved successfully" 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("[ERROR] Consultation registration error:", error);
    
    // Return generic error to client (don't expose internal details)
    return NextResponse.json(
      { error: "An error occurred. Please try again later." },
      { status: 500 }
    );
  }
}