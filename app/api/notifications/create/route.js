import { adminDb } from '@/lib/firebaseAdmin'

export async function POST(req) {
  try {
    const payload = await req.json()

    const { title, body, recipientId, recipientIds, roles, isGlobal, relatedId, projectId, actionUrl, senderId, type } = payload

    if (!title) {
      return new Response(JSON.stringify({ error: 'Missing title' }), { status: 400 })
    }

    // Require at least one target (recipientId, recipientIds, roles) unless global
    if (!isGlobal && !recipientId && !(recipientIds && recipientIds.length) && !(roles && roles.length)) {
      return new Response(JSON.stringify({ error: 'No recipients specified' }), { status: 400 })
    }

    const docRef = await adminDb.collection('notifications').add({
      title,
      body: body || '',
      type: type || 'generic',
      recipientId: recipientId || null,
      recipientIds: recipientIds || null,
      roles: roles || null,
      isGlobal: !!isGlobal,
      relatedId: relatedId || null,
      projectId: projectId || null,
      actionUrl: actionUrl || null,
      senderId: senderId || null,
      read: false,
      createdAt: new Date(),
    })

    return new Response(JSON.stringify({ id: docRef.id }), { status: 201 })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
}
