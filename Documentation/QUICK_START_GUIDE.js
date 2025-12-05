/**
 * QUICK START GUIDE - Task Notifications
 * 
 * Copy & paste examples to get started immediately
 */

// ============================================================================
// 1. TESTING TASK CREATION NOTIFICATION
// ============================================================================

// Option A: In the UI
/*
1. Open Project Manager
2. Select a project
3. Go to Timeline tab
4. Click "Add New Stage" → Fill form → Save
5. In the stage, click "Add Task" → Fill form → Save
6. ✅ Notifications sent automatically!

Check:
- Notification bell should show new count
- Firestore "notifications" collection has new doc
- Check email in recipient's inbox
*/

// Option B: In browser console
/*
// Check if notifications are working
fetch('/api/send-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: 'your-email@example.com',
    subject: 'Test Email',
    message: '<h1>Test</h1>',
    name: 'Test User'
  })
})
.then(r => r.json())
.then(d => console.log('Email test:', d))
*/

// ============================================================================
// 2. TESTING OVERDUE TASK NOTIFICATION
// ============================================================================

// Option A: Manual API call (browser console)
fetch('/api/check-overdue-tasks', { method: 'POST' })
  .then(r => r.json())
  .then(d => console.log('Overdue check result:', d))

// Option B: In browser address bar
/*
http://localhost:3000/api/check-overdue-tasks
(will trigger GET request)
*/

// Option C: Using curl in terminal
/*
curl -X POST http://localhost:3000/api/check-overdue-tasks
*/

// ============================================================================
// 3. IMPORTING & USING NOTIFICATIONS IN YOUR CODE
// ============================================================================

// Import notification functions
import { 
  notifyTaskCreation,
  notifyOverdueTasks,
  notifyPhaseCompletion,
  notifyTaskCompletion
} from '@/utils/notifications'

// Send task creation notification
await notifyTaskCreation({
  projectId: 'proj-123',
  taskName: 'Task Name',
  stageName: 'Stage Name',
  taskCost: '5000',
  startDate: '2025-10-08',
  endDate: '2025-10-17',
  createdById: 'user-id',
  createdByName: 'User Name'
})

// Check for overdue tasks (typically called via API or cron)
await notifyOverdueTasks()

// ============================================================================
// 4. FIRESTORE QUERIES TO DEBUG
// ============================================================================

// Check if notifications were created
db.collection('notifications')
  .where('projectId', '==', 'proj-123')
  .orderBy('createdAt', 'desc')
  .limit(10)
  .get()
  .then(snap => console.log('Notifications:', snap.docs.map(d => d.data())))

// Check current user notifications
db.collection('notifications')
  .where('recipientId', '==', currentUser.uid)
  .orderBy('createdAt', 'desc')
  .get()
  .then(snap => console.log('My notifications:', snap.docs.map(d => d.data())))

// Check project details
db.collection('projects').doc('proj-123').get()
  .then(snap => {
    const data = snap.data()
    console.log('Project users:', data.projectUsers)
    console.log('Project manager:', data.projectManager)
    console.log('Task timeline:', data.taskTimeline)
  })

// ============================================================================
// 5. ENVIRONMENT VARIABLES NEEDED
// ============================================================================

// Add to .env.local:
/*
ZEPTOMAIL_API_KEY=your_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
*/

// Verify in code:
console.log('API Key set:', !!process.env.ZEPTOMAIL_API_KEY)
console.log('App URL:', process.env.NEXT_PUBLIC_APP_URL)

// ============================================================================
// 6. CHECKING WHICH USERS GET NOTIFIED
// ============================================================================

// Function to see who will be notified (debug)
async function debugNotificationRecipients(projectId) {
  const projectDoc = await db.collection('projects').doc(projectId).get()
  const projectData = projectDoc.data()
  
  console.log('Project Users (References):', projectData.projectUsers)
  
  // Resolve references to actual user docs
  const projectUserDocs = await Promise.all(
    (projectData.projectUsers || []).map(userRef => userRef.get())
  )
  console.log('Project Users (Details):', 
    projectUserDocs.map(doc => ({
      uid: doc.id,
      email: doc.data().email,
      name: doc.data().displayName || doc.data().name
    }))
  )
  
  // Get admins
  const adminsSnap = await db.collection('users')
    .where('role', '==', 'admin')
    .get()
  console.log('Admins:', 
    adminsSnap.docs.map(doc => ({
      uid: doc.id,
      email: doc.data().email,
      name: doc.data().displayName || doc.data().name
    }))
  )
}

// Call it:
// debugNotificationRecipients('proj-123')

// ============================================================================
// 7. COMMON ISSUES & QUICK FIXES
// ============================================================================

// Issue: Emails not being sent
// Fix: Check if API key is set
if (!process.env.ZEPTOMAIL_API_KEY) {
  console.error('❌ ZEPTOMAIL_API_KEY not set in .env.local')
  // Email won't work until this is fixed
}

// Issue: Notifications not appearing
// Fix: Check if NotificationProvider is wrapping your app
// In app/layout.js:
/*
import { NotificationProvider } from '@/contexts/NotificationContext'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </body>
    </html>
  )
}
*/

// Issue: Only some users getting notified
// Fix: Verify project.projectUsers has correct references
// In Firestore console:
// 1. Open projects collection
// 2. Select your project
// 3. Look at projectUsers field
// 4. Should be array of DocumentReferences
// 5. Each should point to valid user in users collection

// ============================================================================
// 8. SCHEDULING OVERDUE CHECKS (Choose One)
// ============================================================================

// Option 1: Vercel Cron (Recommended for production)
// Create/edit vercel.json in project root:
/*
{
  "crons": [{
    "path": "/api/check-overdue-tasks",
    "schedule": "0 8 * * *"
  }]
}
*/
// This runs daily at 8:00 AM UTC

// Option 2: Firebase Cloud Function
// Create a new Cloud Function:
/*
const functions = require('firebase-functions');
const axios = require('axios');

exports.checkOverdueTasksDaily = functions
  .pubsub
  .schedule('every day 08:00')
  .timeZone('America/New_York')
  .onRun(async (context) => {
    try {
      const response = await axios.post(
        'https://your-domain.com/api/check-overdue-tasks'
      );
      console.log('Overdue check result:', response.data);
    } catch (error) {
      console.error('Overdue check failed:', error);
    }
  });
*/

// Option 3: External Cron Service (e.g., cron-job.org)
// 1. Go to https://cron-job.org
// 2. Create new cron job
// 3. Set URL: https://your-domain.com/api/check-overdue-tasks
// 4. Set Method: POST
// 5. Set Schedule: Daily at desired time

// Option 4: Manual testing in development
/*
// In browser console:
fetch('/api/check-overdue-tasks', { method: 'POST' })
  .then(r => r.json())
  .then(d => console.log(d))
*/

// ============================================================================
// 9. CUSTOMIZING EMAIL TEMPLATES
// ============================================================================

// To change email template:
// 1. Open /utils/emailTemplates/taskCreationTemplate.js
// 2. Modify the HTML inside getTaskCreationEmailTemplate()
// 3. Common changes:
//    - Change primaryColor: '#F07D00' → your color
//    - Change text content in <p> tags
//    - Add/remove fields from template
//    - Modify styling in <style> block
// 4. Same for overdueTaskTemplate.js

// Example: Change button color
/*
Original:
const cta-button = {
  background-color: ${primaryColor};  // Uses #F07D00
}

Change to:
const cta-button = {
  background-color: #FF0000;  // Red button
}
*/

// ============================================================================
// 10. MONITORING & LOGS
// ============================================================================

// Check browser console for logs (all start with emoji):
/*
✅ Success message
❌ Error message
📬 Info about notifications
📨 Email sent
🔍 Starting check
⏰ Task found
🚨 Alert/urgent
*/

// Check Firestore console:
// 1. Go to Firebase console
// 2. Open Firestore Database
// 3. Look at "notifications" collection
// 4. Should have documents created when:
//    - Tasks are created
//    - Tasks are overdue

// Check Zeptomail (email provider):
// 1. Login to Zeptomail dashboard
// 2. Check delivery status
// 3. View bounced/failed emails
// 4. Check spam folder if emails not arriving

// ============================================================================
// 11. USEFUL CODE SNIPPETS
// ============================================================================

// Mark all notifications as read
const notificationContext = useNotifications()
await notificationContext.markAllAsRead()

// Get count of unread notifications
const { unreadCount } = useNotifications()
console.log('Unread notifications:', unreadCount)

// Get all notifications for current user
const { notifications } = useNotifications()
notifications.forEach(notif => {
  console.log(notif.title, notif.body)
})

// Filter notifications by type
const { notifications } = useNotifications()
const taskNotifications = notifications.filter(n => n.type === 'task')
console.log('Task notifications:', taskNotifications)

// ============================================================================
// 12. TESTING CHECKLIST
// ============================================================================

/*
✓ Task Creation:
  - [ ] Create a new task in timeline
  - [ ] Check notification appears in UI
  - [ ] Check email arrives
  - [ ] Check Firestore has notification doc
  
✓ Overdue Detection:
  - [ ] Create task with past end date
  - [ ] Set status to "Ongoing"
  - [ ] Call /api/check-overdue-tasks
  - [ ] Check notification appears
  - [ ] Check email arrives
  - [ ] Check multiple recipients notified
  
✓ Recipients:
  - [ ] Project users get notified
  - [ ] Project manager gets notified
  - [ ] Admin users get notified
  - [ ] Disabled users are skipped
  
✓ Email:
  - [ ] Subject line is correct
  - [ ] Email HTML renders properly
  - [ ] Links are clickable
  - [ ] Colors are correct
  - [ ] Mobile responsive
  
✓ Database:
  - [ ] Notifications collection populated
  - [ ] Documents have correct fields
  - [ ] createdAt timestamps are set
  - [ ] read: false initially
*/

export default {}; // Dummy export for linting
