// scripts/syncRolesToClaims.js
// Usage: node scripts/syncRolesToClaims.js [userId]
// If userId is provided, syncs only that user. Otherwise, syncs all users.

import { initializeApp, cert } from 'firebase-admin/app'
import { getAuth } from "firebase-admin/auth";
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
const auth = getAuth()

async function syncUser(userId) {
    try {
        const userDoc = await db.collection('users').doc(userId).get();
        if (!userDoc.exists) {
            console.log(`⚠️ User ${userId} not found in Firestore.`);
            return;
        }

        const userData = userDoc.data();
        const role = userData.role;

        if (role) {
            await auth.setCustomUserClaims(userId, { role });
            console.log(`✅ Set custom claim { role: '${role}' } for user ${userId} (${userData.email})`);
        } else {
            console.log(`ℹ️ No role found for user ${userId} (${userData.email})`);
        }
    } catch (error) {
        console.error(`❌ Error syncing user ${userId}:`, error.message);
    }
}

async function syncAllUsers() {
    console.log('🔄 Starting full sync of roles to custom claims...');
    try {
        const snapshot = await db.collection('users').get();
        if (snapshot.empty) {
            console.log('No users found in Firestore.');
            return;
        }

        let count = 0;
        for (const doc of snapshot.docs) {
            await syncUser(doc.id);
            count++;
        }
        console.log(`\n🎉 Completed! Synced ${count} users.`);
    } catch (error) {
        console.error('❌ Error listing users:', error);
    }
}

const targetUserId = process.argv[2];

if (targetUserId) {
    syncUser(targetUserId).then(() => process.exit(0));
} else {
    syncAllUsers().then(() => process.exit(0));
}
