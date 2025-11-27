import { NextResponse } from "next/server";
import { SendMailClient } from "zeptomail";

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