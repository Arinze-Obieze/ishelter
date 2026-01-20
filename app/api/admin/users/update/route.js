import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { validateCsrfToken } from "@/lib/csrf";
import { getUserIdFromToken } from "@/lib/ipUtils";

export async function POST(req) {
  try {
    // CSRF Protection (log-only mode)
    const authHeader = req.headers.get('authorization');
    const authToken = authHeader?.split('Bearer ')[1];
    const requesterId = await getUserIdFromToken(authToken);
    const csrfToken = req.headers.get('x-csrf-token');
    const csrfValidation = await validateCsrfToken(requesterId, csrfToken, false);
    if (!csrfValidation.valid) {
      console.warn('[CSRF] Validation failed for users/update:', csrfValidation.reason);
    }

    const { userId, updates, updatedByAdmin } = await req.json();

    if (!userId || !updates) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // SUPERADMIN PROTECTION: Check if target is a superAdmin
    const userToUpdateDoc = await adminDb.collection("users").doc(userId).get();
    
    if (userToUpdateDoc.exists && userToUpdateDoc.data().superAdmin === true) {
      return NextResponse.json(
        { error: "Cannot update a Super Admin. Super Admins are protected from modification." },
        { status: 403 }
      );
    }

    // Remove any undefined fields and the id field
    const cleanUpdates = { ...updates };
    delete cleanUpdates.id;
    Object.keys(cleanUpdates).forEach(key => {
      if (cleanUpdates[key] === undefined) {
        delete cleanUpdates[key];
      }
    });

    // Update user in Firestore
    await adminDb.collection("users").doc(userId).update(cleanUpdates);

    // FUTURE-PROOFING: Sync Custom Claims if role is updated
    if (cleanUpdates.role) {
      console.log(`[AUTH] Syncing custom claims for user ${userId} to role: ${cleanUpdates.role}`);
      // Import adminAuth dynamically or ensure it's imported at top
      const { adminAuth } = require("@/lib/firebaseAdmin"); 
      await adminAuth.setCustomUserClaims(userId, { role: cleanUpdates.role });
    }

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update user" },
      { status: 500 }
    );
  }
}