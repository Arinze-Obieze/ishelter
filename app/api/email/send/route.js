import { NextResponse } from 'next/server';
import { getClientIP } from '@/lib/ipUtils';
import { checkRateLimitEmail, recordEmailAttempt } from '@/lib/rateLimit';

/**
 * Internal email wrapper endpoint
 * 
 * This endpoint provides a simple, public-facing interface for sending emails.
 * It uses the internal API key to call /api/send-email, keeping the key secure on the server.
 * 
 * Accepts all email requests from frontend components and utilities.
 */
export async function POST(req) {
  console.log('🎯 Email wrapper POST called');
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

    const body = await req.json();
    
    // Validate required fields
    if (!body.to || !body.subject || !body.message) {
      console.error('❌ Email wrapper: Missing required fields', { hasTo: !!body.to, hasSubject: !!body.subject, hasMessage: !!body.message });
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, message' },
        { status: 400 }
      );
    }

    // Validate internal API key is configured
    const internalApiKey = process.env.INTERNAL_API_KEY;
    if (!internalApiKey) {
      console.error('❌ Email wrapper: INTERNAL_API_KEY not configured in environment');
      return NextResponse.json(
        { error: 'Server configuration error: Internal API key not set' },
        { status: 500 }
      );
    }

    // Forward to /api/send-email with internal API key
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const internalKeyValue = internalApiKey;
    
    console.log('📧 Email wrapper: Preparing request to send-email');
    console.log('  - API URL:', apiUrl);
    console.log('  - Internal API Key set:', !!internalKeyValue);
    console.log('  - Key value (first 20 chars):', internalKeyValue.substring(0, 20) + '...');
    
    const headers = {
      'Content-Type': 'application/json',
      'x-internal-api-key': internalKeyValue,
    };
    
    console.log('📧 Email wrapper: Headers being sent:', { 
      'Content-Type': headers['Content-Type'],
      'x-internal-api-key-set': !!headers['x-internal-api-key']
    });
    
    // Use query parameter as well for better compatibility
    const sendUrl = new URL(`${apiUrl}/api/send-email`);
    sendUrl.searchParams.append('internal_api_key', internalKeyValue);
    
    const response = await fetch(sendUrl.toString(), {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Email send failed:', { status: response.status, error: data });
      return NextResponse.json(
        { error: data.error || 'Failed to send email' },
        { status: response.status }
      );
    }

    // Record successful email attempt (count recipients)
    const recipientCount = Array.isArray(body.to) ? body.to.length : 1;
    await recordEmailAttempt(ipAddress, 'ip', recipientCount).catch(err =>
      console.error('Failed to record email attempt:', err)
    );

    console.log('✅ Email sent successfully via wrapper');
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('❌ Email wrapper error:', error.message);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}
