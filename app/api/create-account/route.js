import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { createAccountSchema, validateData } from "@/lib/validationSchemas";
import { logAccountCreated } from "@/lib/auditLog";
import { randomBytes } from "crypto";

function generatePassword(length = 12) {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()";
  
  // Ensure at least one character from each category using cryptographically secure random
  let password = [
    lowercase[randomBytes(1)[0] % lowercase.length],
    uppercase[randomBytes(1)[0] % uppercase.length],
    numbers[randomBytes(1)[0] % numbers.length],
    symbols[randomBytes(1)[0] % symbols.length]
  ].join('');
  
  // Fill remaining characters with cryptographically secure random
  const allChars = lowercase + uppercase + numbers + symbols;
  for (let i = password.length; i < length; i++) {
    password += allChars.charAt(randomBytes(1)[0] % allChars.length);
  }
  
  // Fisher-Yates shuffle using cryptographically secure random
  const arr = password.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randomBytes(1)[0] % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join('');
}

export async function POST(req) {
  try {
    const body = await req.json();
    
    // Validate request body
    const validation = validateData(body, createAccountSchema);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    const { email, displayName, role, projectManagerId } = validation.data;

    const password = generatePassword();

    // 1. Create user in Firebase Auth
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: displayName || '',
    });

    // 2. Prepare user data for Firestore
    const userData = {
      uid: userRecord.uid,
      email,
      displayName: displayName || '',
      role: role || 'client',
      status: 'Active',
      createdAt: new Date().toISOString(),
      lastLogin: null
    };

    // 3. Add project manager reference if provided (only for clients)
    if (role === 'client' && projectManagerId) {
      // Create a Firestore document reference to the project manager
      userData.projectManager = adminDb.collection('users').doc(projectManagerId);
    }

    // 4. Add user to Firestore
    await adminDb.collection('users').doc(userRecord.uid).set(userData);

    // Log account creation
    await logAccountCreated(userRecord.uid, email, role || 'client', req).catch(err => 
      console.error('Failed to log account creation:', err)
    );

    // 5. Send login credentials email to the new user
    try {
      const emailSubject = "Your iShelter Account Details";
      const emailMessage = `Hello ${displayName || email},<br><br>Your account has been created on iShelter.<br><br><b>Login Credentials:</b><br>Email: <b>${email}</b><br>Password: <b>${password}</b><br><br>Please log in and change your password immediately for security.<br><br>Login at: <a href='https://ishelter.everythingshelter.com.ng/login'>https://ishelter.everythingshelter.com.ng/login</a>`;
      
      const internalKey = process.env.INTERNAL_API_KEY;
      console.log('📧 create-account: Sending email with internal key:', !!internalKey);
      
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const sendUrl = new URL(`${baseUrl}/api/send-email`);
      sendUrl.searchParams.append('internal_api_key', internalKey || '');
      
      const emailResponse = await fetch(sendUrl.toString(), {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-internal-api-key': internalKey || ''
        },
        body: JSON.stringify({
          to: email,
          subject: emailSubject,
          message: emailMessage,
          name: displayName || email
        })
      });

      if (!emailResponse.ok) {
        console.error('Failed to send welcome email:', await emailResponse.text());
      }
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError);
      // Don't fail the account creation if email fails
    }

    return NextResponse.json({
      success: true,
      uid: userRecord.uid,
      email: userRecord.email,
      password: password,
      message: 'Account created. Login credentials have been sent to the email address.',
    });
  } catch (error) {
    console.error("Firebase createUser error:", error);

    let message = "Failed to create account";
    let status = 500;

    if (error.code === "auth/email-already-exists" || error.code === "auth/email-already-in-use") {
      message = "An account with this email already exists";
      status = 409;
    } else if (error.code === "auth/invalid-email") {
      message = "Invalid email address";
      status = 400;
    } else if (error.code === "auth/operation-not-allowed") {
      message = "Email/password accounts are not enabled";
      status = 403;
    } else if (error.code === "auth/weak-password") {
      message = "The password is too weak";
      status = 400;
    }

    return NextResponse.json(
      { 
        success: false,
        error: message,
        code: error.code 
      },
      { status }
    );
  }
}