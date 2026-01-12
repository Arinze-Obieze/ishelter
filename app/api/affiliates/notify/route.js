import { NextResponse } from "next/server";
import { SendMailClient } from "zeptomail";
import { getClientIP } from "@/lib/ipUtils";
import { checkRateLimitEmail, recordEmailAttempt } from "@/lib/rateLimit";

export const runtime = "nodejs";
const url = "api.zeptomail.com/";
const token = process.env.ZEPTOMAIL_API_KEY; 
const client = new SendMailClient({ url, token });

// Helper to generate professional email content
const generateEmailContent = (bookings) => {
  const isPlural = bookings !== 1;
  const bookingText = isPlural ? 'successful bookings' : 'successful booking';
  
  return `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; color: #333333; line-height: 1.6;">
      <div style="background-color: #fdf3e4; padding: 20px; text-align: center; border-bottom: 3px solid #f59e0b;">
        <h1 style="color: #f59e0b; margin: 0; font-size: 24px; font-weight: bold;">iSHELTER</h1>
      </div>
      
      <div style="padding: 30px 20px;">
        <h2 style="color: #1a1a1a; font-size: 20px; margin-bottom: 20px;">Performance Update</h2>
        
        <p style="margin-bottom: 15px;">Hello Valued Partner,</p>
        
        <p style="margin-bottom: 25px;">We are writing to keep you updated on your performance as an iShelter affiliate. Your partnership is vital to our mission of providing expert construction guidance.</p>
        
        <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 25px;">
          <p style="margin: 0; color: #6b7280; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Total Confirmed Bookings</p>
          <p style="margin: 10px 0 0; color: #f59e0b; font-size: 36px; font-weight: bold;">${bookings}</p>
        </div>
        
        <p style="margin-bottom: 15px;">Each of these bookings represents a client who is now one step closer to a successful construction project, thanks to your referral.</p>
        
        <p style="margin-bottom: 0;">We appreciate your continued trust and partnership.</p>
      </div>
      
      <div style="background-color: #1a1a1a; color: #9ca3af; padding: 20px; text-align: center; font-size: 12px; border-top: 1px solid #e5e7eb;">
        <p style="margin: 0 0 10px;">&copy; ${new Date().getFullYear()} iShelter. All rights reserved.</p>
        <p style="margin: 0;">Providing expert guidance for your construction needs.</p>
      </div>
    </div>
  `;
};

export async function POST(req) {
  if (!token) {
    console.error("❌ Zeptomail API key is missing");
    return NextResponse.json({ error: "Email configuration error" }, { status: 500 });
  }

  try {
    // SECURITY: Rate Limiting
    const ipAddress = getClientIP(req);
    // Stricter limit for bulk operations: 10 requests per hour per IP (assuming admin IP)
    // NOTE: In a production app, verify the user's session token here too.
    const rateLimitCheck = await checkRateLimitEmail(ipAddress, 'admin-bulk-email', 10);
    
    if (!rateLimitCheck.allowed) {
      console.warn(`[SECURITY] Rate limit exceeded for admin-bulk-email from IP: ${ipAddress}`);
      return NextResponse.json(
        { error: "Too many email requests. Please wait before sending more." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { recipients } = body;

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json({ error: "No recipients provided" }, { status: 400 });
    }

    // Process emails
    let successCount = 0;
    let failureCount = 0;
    const errors = [];

    // Send emails sequentially to avoid overwhelming the provider and for better error tracking
    // For very large lists, a queue system would be better, but for manual admin trigger this is fine.
    for (const recipient of recipients) {
      const { email, bookings, affiliateId } = recipient;

      if (!email) {
        failureCount++;
        continue; // Skip if no email
      }

      try {
        const htmlContent = generateEmailContent(bookings || 0);
        
        await client.sendMail({
          from: {
            address: "auth@ishelter.everythingshelter.com.ng",
            name: "iShelter Team"
          },
          to: [{
            email_address: {
              address: email,
              name: "Reviewer"
            }
          }],
          subject: "Your iShelter Affiliate Performance Update",
          htmlbody: htmlContent,
        });

        successCount++;
        
        // Add a small delay to be nice to the API
        await new Promise(resolve => setTimeout(resolve, 200));
        
      } catch (err) {
        console.error(`Failed to email affiliate ${affiliateId}:`, err);
        failureCount++;
        errors.push({ affiliateId, error: err.message });
      }
    }

    // Log the bulk attempt
    await recordEmailAttempt(ipAddress, 'admin-bulk-email', successCount);

    return NextResponse.json({
      success: true,
      summary: {
        total: recipients.length,
        sent: successCount,
        failed: failureCount,
        errors: errors.length > 0 ? errors : undefined
      }
    });

  } catch (error) {
    console.error("Bulk email error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
