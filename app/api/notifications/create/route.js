import { adminDb, adminAuth } from '@/lib/firebaseAdmin'
import { validateCsrfToken } from '@/lib/csrf'

export async function POST(req) {
  try {
    // Verify authentication
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    const token = authHeader.split('Bearer ')[1]
    let decodedToken
    
    try {
      decodedToken = await adminAuth.verifyIdToken(token)
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401 })
    }

    const userId = decodedToken.uid

    // CSRF Protection (log-only mode)
    const csrfToken = req.headers.get('x-csrf-token')
    const csrfValidation = await validateCsrfToken(userId, csrfToken, false)
    if (!csrfValidation.valid) {
      console.warn('[CSRF] Validation failed for notifications/create:', csrfValidation.reason)
    }

    // Check if user is admin or project manager
    const userDoc = await adminDb.collection('users').doc(userId).get()
    if (!userDoc.exists) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 })
    }

    const userData = userDoc.data()
    const userRole = userData.role

    if (userRole !== 'admin' && userRole !== 'project manager') {
      return new Response(
        JSON.stringify({ error: 'Only admins and project managers can create notifications' }), 
        { status: 403 }
      )
    }

    // Parse request payload
    const payload = await req.json()
    const { title, body, recipientId, recipientIds, roles, isGlobal, relatedId, projectId, actionUrl, type } = payload

    if (!title) {
      return new Response(JSON.stringify({ error: 'Missing title' }), { status: 400 })
    }

    // Require at least one target (recipientId, recipientIds, roles) unless global
    if (!isGlobal && !recipientId && !(recipientIds && recipientIds.length) && !(roles && roles.length)) {
      return new Response(JSON.stringify({ error: 'No recipients specified' }), { status: 400 })
    }

    // If project manager is creating, verify they manage the project
    if (userRole === 'project manager' && projectId) {
      const projectDoc = await adminDb.collection('projects').doc(projectId).get()
      if (!projectDoc.exists) {
        return new Response(JSON.stringify({ error: 'Project not found' }), { status: 404 })
      }

      const projectData = projectDoc.data()
      const projectManagerRef = projectData.projectManager
      
      if (!projectManagerRef || projectManagerRef.id !== userId) {
        return new Response(
          JSON.stringify({ error: 'You are not the manager of this project' }), 
          { status: 403 }
        )
      }
    }

    // Create notification
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
      senderId: userId,
      read: false,
      createdAt: new Date(),
    })

    return new Response(JSON.stringify({ id: docRef.id }), { status: 201 })
  } catch (err) {
    console.error('Error creating notification:', err)
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
}