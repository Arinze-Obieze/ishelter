import { adminAuth, adminDb } from '@/lib/firebaseAdmin'
import { getMessaging } from 'firebase-admin/messaging'

// Helper to get messaging instance safely
const getAdminMessaging = () => {
    try {
        // adminAuth.app is the initialized firebase-admin app
        return getMessaging(adminAuth.app)
    } catch (e) {
        console.error('Failed to get admin messaging:', e)
        return null
    }
}

export async function POST(req) {
  try {
    const { title, body, userIds, actionUrl } = await req.json()
    
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return new Response(JSON.stringify({ message: 'No recipients provided' }), { status: 400 })
    }

    const messaging = getAdminMessaging()
    if (!messaging) {
       return new Response(JSON.stringify({ message: 'Messaging not initialized' }), { status: 500 })
    }

    // Get tokens for users
    const tokens = []
    
    // Batch get users
    const userDocs = await Promise.all(
        userIds.map(uid => adminDb.collection('users').doc(uid).get())
    )
    
    userDocs.forEach(doc => {
        if (doc.exists && doc.data().fcmToken) {
            tokens.push(doc.data().fcmToken)
        }
    })

    if (tokens.length === 0) {
        return new Response(JSON.stringify({ message: 'No registered tokens found' }), { status: 200 })
    }

    // Send multicast message
    const message = {
      notification: {
        title: title || 'New Notification',
        body: body || '',
      },
      data: {
        url: actionUrl || '/'
      },
      tokens: tokens,
    }

    const response = await messaging.sendMulticast(message)
    console.log('Successfully sent message:', response.successCount, 'messages.')
    
    if (response.failureCount > 0) {
        const failedTokens = []
        response.responses.forEach((resp, idx) => {
            if (!resp.success) {
                failedTokens.push(tokens[idx])
            }
        })
        console.warn('List of tokens that caused failures: ' + failedTokens)
    }

    return new Response(JSON.stringify({ success: true, sentCount: response.successCount }), { status: 200 })
  } catch (error) {
    console.error('Error sending push notification:', error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
}
