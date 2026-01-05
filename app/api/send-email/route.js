import { NextResponse } from "next/server";
import { SendMailClient } from "zeptomail";
import { getClientIP } from "@/lib/ipUtils";
import { checkRateLimitEmail, recordEmailAttempt } from "@/lib/rateLimit";

export const runtime = "nodejs";
const url = "api.zeptomail.com/";
const token = process.env.ZEPTOMAIL_API_KEY; 
const client = new SendMailClient({ url, token });

export async function POST(req) {
  if (!token) {
    console.error("❌ Zeptomail API key is missing");
    return NextResponse.json({ error: "Email configuration error" }, { status: 500 });
  }

  try {
    // RATE LIMITING: Max 50 emails per IP per hour
    const ipAddress = getClientIP(req);
    const emailRateLimit = await checkRateLimitEmail(ipAddress, 'ip', 50);
    
    if (!emailRateLimit.allowed) {
      console.warn(`[SECURITY] Email rate limit exceeded from IP: ${ipAddress}`);
      
      await recordEmailAttempt(ipAddress, 'ip', 0).catch(err =>
        console.error('Failed to record blocked email attempt:', err)
      );
      
      return NextResponse.json(
        { 
          error: "Too many email requests. Please try again later.",
          resetTime: emailRateLimit.resetTime
        },
        { status: 429 }
      );
    }

    const { to, subject, message, name } = await req.json();

    // Check if 'to' is an array (multiple recipients) or a single email
    const isMultipleRecipients = Array.isArray(to);
    
    // Build recipients array
    let recipients = [];
    
    if (isMultipleRecipients) {
      // Handle array of emails
      recipients = to.map((email, index) => ({
        email_address: {
          address: email,
          name: Array.isArray(name) ? (name[index] || "Valued User") : (name || "Valued User")
        }
      }));
    } else {
      // Handle single email (backward compatibility)
      recipients = [{
        email_address: {
          address: to,
          name: name || "Valued User"
        }
      }];
    }

    // Send email
    const response = await client.sendMail({
      from: {
        address: "auth@ishelter.everythingshelter.com.ng",
        name: "ishelter"
      },
      to: recipients,
      subject: subject,
      htmlbody: `<div>${message}</div>`,
    });

    // Record successful email attempt
    const recipientCount = recipients.length;
    await recordEmailAttempt(ipAddress, 'ip', recipientCount).catch(err =>
      console.error('Failed to record email attempt:', err)
    );

    return NextResponse.json({ 
      success: true, 
      data: response,
      recipientCount: recipients.length 
    });
    
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}