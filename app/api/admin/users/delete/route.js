// /api/admin/users/delete/route.js
import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
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
      console.warn('[CSRF] Validation failed for users/delete:', csrfValidation.reason);
    }

    const { userId, userEmail, deletedByAdmin } = await req.json();

    if (!userId || !userEmail || !deletedByAdmin) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // SUPERADMIN PROTECTION: Check if target is a superAdmin
    const userToDeleteDoc = await adminDb.collection("users").doc(userId).get();
    
    if (userToDeleteDoc.exists && userToDeleteDoc.data().superAdmin === true) {
      return NextResponse.json(
        { error: "Cannot delete a Super Admin. Super Admins are protected from deletion." },
        { status: 403 }
      );
    }

    // 1. Delete user from Firebase Authentication
    await adminAuth.deleteUser(userId);

    // 2. Delete user document from Firestore
    await adminDb.collection("users").doc(userId).delete();

    /*
    // 3. Delete user's profile pictures from Storage - TEMPORARILY DISABLED
    try {
      const bucket = adminStorage.bucket();
      const profilePicturesPrefix = `profile-pictures/${userId}/`;
      const [files] = await bucket.getFiles({ prefix: profilePicturesPrefix });
      
      if (files.length > 0) {
        const deletePromises = files.map(file => file.delete());
        await Promise.all(deletePromises);
        console.log(`Deleted ${files.length} profile pictures for user ${userId}`);
      } else {
        console.log(`No profile pictures found for user ${userId}`);
      }
    } catch (storageError) {
      console.warn("Error deleting profile pictures:", storageError);
      // Continue with deletion even if storage cleanup fails
    }
    */

    // 4. Send email notification to admins
    try {
      const emailResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: deletedByAdmin.email, 
          subject: "User Deletion Notification",
          name: deletedByAdmin.name || "Admin",
          message: `
            <h2>User Deletion Completed</h2>
            <p><strong>Deleted User:</strong> ${userEmail}</p>
            <p><strong>Deleted By:</strong> ${deletedByAdmin.name} (${deletedByAdmin.email})</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Action:</strong> Permanent hard delete</p>
            <hr>
            <p><em>This action permanently removed the user from authentication and database.</em></p>
          `,
        }),
      });

      if (!emailResponse.ok) {
        console.error("Failed to send email notification");
      }
    } catch (emailError) {
      console.error("Error sending email notification:", emailError);
      // Don't fail the deletion if email fails
    }

    return NextResponse.json({
      success: true,
      message: "User permanently deleted",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete user" },
      { status: 500 }
    );
  }
}