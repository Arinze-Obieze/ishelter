import { NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebaseAdmin'
import { headers } from 'next/headers'

export async function POST(request) {
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
        { error: 'Forbidden - Only admins can create admin accounts' },
        { status: 403 }
      )
    }

    // Get request body
    const { email, displayName, password, createdBy } = await request.json()

    // Validate inputs
    if (!email || !displayName || !password) {
      return NextResponse.json(
        { error: 'Missing required fields: email, displayName, password' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Check if user with email already exists
    try {
      await adminAuth.getUserByEmail(email.toLowerCase().trim())
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      )
    } catch (error) {
      // User doesn't exist, continue (this is what we want)
      if (error.code !== 'auth/user-not-found') {
        throw error
      }
    }

    // Create the user in Firebase Authentication
    const userRecord = await adminAuth.createUser({
      email: email.toLowerCase().trim(),
      password: password,
      displayName: displayName.trim(),
      emailVerified: false // Will be verified after password change
    })

    // Create the user document in Firestore
    await adminDb.collection('users').doc(userRecord.uid).set({
      email: email.toLowerCase().trim(),
      displayName: displayName.trim(),
      role: 'admin',
      createdAt: new Date(),
      createdBy: createdBy || requesterId,
      emailVerified: false,
      passwordChanged: false // Track if they changed initial password
    })

    // Log the admin creation for audit trail
    await adminDb.collection('admin_audit_logs').add({
      action: 'CREATE_ADMIN',
      performedBy: requesterId,
      performedByEmail: requesterDoc.data().email,
      targetUserId: userRecord.uid,
      targetUserEmail: email.toLowerCase().trim(),
      timestamp: new Date(),
      details: {
        displayName: displayName.trim()
      }
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Admin account created successfully',
        uid: userRecord.uid
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error creating admin:', error)
    
    // Handle specific Firebase errors
    if (error.code === 'auth/email-already-exists') {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      )
    }
    
    if (error.code === 'auth/invalid-email') {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }
    
    if (error.code === 'auth/weak-password') {
      return NextResponse.json(
        { error: 'Password is too weak' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create admin account. Please try again.' },
      { status: 500 }
    )
  }
}




























// import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

// export async function POST(req) {
//   try {
//     const { email, password } = await req.json();
//     if (!email || !password) {
//       return new Response(JSON.stringify({ error: "Missing email or password" }), { status: 400 });
//     }

//     const userRecord = await adminAuth.createUser({ email, password });

//     await adminAuth.setCustomUserClaims(userRecord.uid, { admin: true });

//     await adminDb.collection("users").doc(userRecord.uid).set({
//       email,
//       role: "admin",
//       createdAt: new Date(),
//     });

//     return new Response(JSON.stringify({ message: "Admin created successfully", uid: userRecord.uid }), { status: 201 });
//   } catch (error) {
//     console.error("Error creating admin:", error);
//     return new Response(JSON.stringify({ error: error.message }), { status: 500 });
//   }
// }
