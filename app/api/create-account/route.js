import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

function generatePassword(length = 12) {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()";
  
  // Ensure at least one character from each category
  let password = [
    lowercase[Math.floor(Math.random() * lowercase.length)],
    uppercase[Math.floor(Math.random() * uppercase.length)],
    numbers[Math.floor(Math.random() * numbers.length)],
    symbols[Math.floor(Math.random() * symbols.length)]
  ].join('');
  
  // Fill remaining characters
  const allChars = lowercase + uppercase + numbers + symbols;
  for (let i = password.length; i < length; i++) {
    password += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

export async function POST(req) {
  try {
    const { email, displayName, role, projectManagerId } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

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

    return NextResponse.json({
      success: true,
      uid: userRecord.uid,
      email: userRecord.email,
      password, // Only for development
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