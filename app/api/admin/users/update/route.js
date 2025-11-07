// app/api/admin/users/update/route.js
import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export async function POST(req) {
  try {
    const { userId, updates, updatedByAdmin } = await req.json();

    if (!userId || !updates) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
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