// app/api/admin/delete-admin/route.js
import { NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebaseAdmin'
import { headers } from 'next/headers'

export async function DELETE(request) {
  try {
    // Get the authorization token from headers
    const headersList = headers()
    const authorization = headersList.get('authorization')
    
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      )
    }

    const token = authorization.split('Bearer ')[1]

    // Verify the token and get the user
    let decodedToken
    try {
      decodedToken = await adminAuth.verifyIdToken(token)
    } catch (error) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      )
    }

    const requesterId = decodedToken.uid

    // Check if the requester is an admin
    const requesterDoc = await adminDb.collection('users').doc(requesterId).get()
    
    if (!requesterDoc.exists || requesterDoc.data().role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Only admins can delete admin accounts' },
        { status: 403 }
      )
    }

    // Get request body
    const { adminId, deletedBy } = await request.json()

    // Validate inputs
    if (!adminId) {
      return NextResponse.json(
        { error: 'Missing required field: adminId' },
        { status: 400 }
      )
    }

    // Prevent self-deletion
    if (adminId === requesterId) {
      return NextResponse.json(
        { error: 'You cannot delete your own admin account' },
        { status: 403 }
      )
    }

    // Get the admin to be deleted
    const adminToDeleteDoc = await adminDb.collection('users').doc(adminId).get()
    
    if (!adminToDeleteDoc.exists) {
      return NextResponse.json(
        { error: 'Admin account not found' },
        { status: 404 }
      )
    }

    if (adminToDeleteDoc.data().role !== 'admin') {
      return NextResponse.json(
        { error: 'User is not an admin' },
        { status: 400 }
      )
    }

    // COUNT TOTAL ADMINS - Prevent deleting the last admin
    const adminsSnapshot = await adminDb
      .collection('users')
      .where('role', '==', 'admin')
      .get()

    const totalAdmins = adminsSnapshot.size

    if (totalAdmins <= 1) {
      return NextResponse.json(
        { error: 'Cannot delete the last admin account. At least one admin must exist.' },
        { status: 403 }
      )
    }

    // Store admin data for audit log before deletion
    const adminData = adminToDeleteDoc.data()

    // Delete from Firebase Authentication
    try {
      await adminAuth.deleteUser(adminId)
    } catch (error) {
      console.error('Error deleting from Auth:', error)
      if (error.code === 'auth/user-not-found') {
        // Continue to delete from Firestore even if Auth user doesn't exist
        console.log('User not found in Auth, continuing with Firestore deletion')
      } else {
        throw error
      }
    }

    // Delete from Firestore
    await adminDb.collection('users').doc(adminId).delete()

    // Log the admin deletion for audit trail
    await adminDb.collection('admin_audit_logs').add({
      action: 'DELETE_ADMIN',
      performedBy: requesterId,
      performedByEmail: requesterDoc.data().email,
      targetUserId: adminId,
      targetUserEmail: adminData.email,
      timestamp: new Date(),
      details: {
        displayName: adminData.displayName,
        deletedUserData: {
          email: adminData.email,
          displayName: adminData.displayName,
          createdAt: adminData.createdAt
        }
      }
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Admin account deleted successfully'
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error deleting admin:', error)
    
    // Handle specific Firebase errors
    if (error.code === 'auth/user-not-found') {
      return NextResponse.json(
        { error: 'Admin account not found in authentication system' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to delete admin account. Please try again.' },
      { status: 500 }
    )
  }
}