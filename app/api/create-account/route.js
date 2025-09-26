import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";

function generatePassword(length = 12) {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    const password = generatePassword();

    const userRecord = await adminAuth.createUser({
      email,
      password,
    });

    return NextResponse.json({
      success: true,
      email: userRecord.email,
      password, 
    });
  } catch (error) {
    console.error("Firebase createUser error:", error);

    let message = "Failed to create account";
    if (error.code === "auth/email-already-exists") {
      message = "Email already exists in Firebase";
    }

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
