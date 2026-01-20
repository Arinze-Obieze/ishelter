// scripts/setSuperAdmin.js
// Run this script ONCE to designate a super admin
// Usage: node scripts/setSuperAdmin.js <admin-user-id>
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import * as dotenv from 'dotenv'

dotenv.config()

// Decode base64 service account
const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64
if (!serviceAccountBase64) {
  console.error('❌ Error: FIREBASE_SERVICE_ACCOUNT_KEY_BASE64 not found in .env.local')
  process.exit(1)
}
const serviceAccount = JSON.parse(Buffer.from(serviceAccountBase64, 'base64').toString('utf8'))

// Initialize Firebase Admin
initializeApp({
  credential: cert(serviceAccount)
})

const db = getFirestore()



async function setSuperAdmin(userId) {
  if (!userId) {
    console.error('❌ Error: User ID is required')
    console.log('Usage: node scripts/setSuperAdmin.js <admin-user-id>')
    process.exit(1)
  }

  try {
    // Get user document
    const userRef = db.collection('users').doc(userId)
    const userDoc = await userRef.get()

    if (!userDoc.exists) {
      console.error(`❌ Error: User with ID "${userId}" not found`)
      process.exit(1)
    }

    const userData = userDoc.data()

    // Check if user is an admin
    if (userData.role !== 'admin') {
      console.error(`❌ Error: User "${userId}" is not an admin (role: ${userData.role})`)
      console.log('Only existing admin users can be promoted to super admin')
      process.exit(1)
    }

    // Check if already a super admin
    if (userData.superAdmin === true) {
      console.log(`ℹ️  User "${userData.displayName || userData.email}" is already a Super Admin`)
      process.exit(0)
    }

    // Set super admin flag
    await userRef.update({
      superAdmin: true,
      superAdminSince: new Date()
    })

    // FUTURE-PROOFING: Sync Custom Claims
    const { getAuth } = require("firebase-admin/auth");
    const auth = getAuth();
    // Maintain existing role but add superAdmin claim if we want to use it later, 
    // or mostly just ensure 'role' is set correctly (it should be 'admin' already per check above)
    await auth.setCustomUserClaims(userId, { 
      role: 'admin', 
      superAdmin: true 
    });

    console.log('✅ Success!')
    console.log(`👑 User "${userData.displayName || userData.email}" is now a Super Admin`)
    console.log(`   Email: ${userData.email}`)
    console.log(`   User ID: ${userId}`)
    console.log('\n⚠️  Super Admins have the following privileges:')
    console.log('   • Cannot be deleted by other admins')
    console.log('   • Can delete other admin accounts')
    console.log('   • Full system access')

  } catch (error) {
    console.error('❌ Error setting super admin:', error.message)
    process.exit(1)
  }
}

// Get user ID from command line arguments
const userId = process.argv[2]
setSuperAdmin(userId)