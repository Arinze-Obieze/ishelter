/**
 * TASK NOTIFICATION SYSTEM - DATA FLOW & EXAMPLES
 * 
 * Real-world examples showing exactly how the system works
 */

// ============================================================================
// EXAMPLE 1: Task Creation Flow (Step by Step)
// ============================================================================

/*
SCENARIO: Project Manager creates a task in the Timeline

PROJECT STATE (Before):
{
  id: "proj-123",
  projectName: "Building Construction",
  projectManager: DocumentReference("users/pm-1"),
  projectUsers: [
    DocumentReference("users/client-1"),
    DocumentReference("users/client-2")
  ],
  taskTimeline: [
    {
      id: "stage-1",
      name: "Foundation",
      status: "Pending",
      cost: "100000",
      tasks: [] // Empty - no tasks yet
    }
  ]
}

ACTION:
Project Manager clicks "Add Task" → fills in:
- Task Name: "Digging"
- Start Date: 2025-10-08
- End Date: 2025-10-17
- Cost: 5000
- Status: Pending
→ Clicks Save

CODE EXECUTION (in handleSaveTask):
1. Task is validated
2. Task is added to stage.tasks array with unique ID
3. Firestore is updated: updateDoc(db, "projects/proj-123", { taskTimeline: [...] })
4. STATE IS UPDATED
5. notifyTaskCreation() is called with:
   {
     projectId: "proj-123",
     taskName: "Digging",
     stageName: "Foundation",
     taskCost: "5000",
     startDate: "2025-10-08",
     endDate: "2025-10-17",
     createdById: "pm-1",
     createdByName: "John Manager"
   }

INSIDE notifyTaskCreation():
1. Fetch project doc → Get recipients and admins
2. Send in-app notifications:
   Recipients = [
     DocumentReference("users/client-1"),
     DocumentReference("users/client-2"),
     DocumentReference("users/pm-1"),
     DocumentReference("users/admin-1"),
     DocumentReference("users/admin-2")
   ]
   For each recipient:
   - Fetch user document
   - Create notification doc in Firestore:
     {
       id: "notif-123",
       title: "🎯 New Task Created - Building Construction",
       body: "\"Digging\" has been created in Foundation",
       type: "task",
       recipientId: "client-1",
       projectId: "proj-123",
       read: false,
       createdAt: serverTimestamp(),
       taskName: "Digging",
       stageName: "Foundation",
       ...etc
     }

3. Send emails:
   For each recipient:
   - Get email from user doc (e.g., "client1@example.com")
   - Generate HTML from taskCreationTemplate:
     Subject: "🎯 New Task Created: Digging - Building Construction"
     Body: HTML with task details, styled email
   - Call fetch('/api/send-email', {
       to: "client1@example.com",
       subject: "🎯 New Task Created: Digging - Building Construction",
       message: "<html>...</html>",
       name: "Client Name"
     })
   - Zeptomail sends email

RESULT:
✅ Notification appears in app for all 5 recipients
✅ Email sent to: client-1, client-2, pm-1, admin-1, admin-2
✅ Firestore has 5 notification documents
✅ Console shows: "✅ Task creation notification sent successfully"

WHAT CLIENT SEES:
- Notification bell shows "1" unread
- Click bell → See notification:
  Title: "🎯 New Task Created - Building Construction"
  Body: "\"Digging\" has been created in Foundation"
  Link: "/dashboard/project-details/proj-123"
- Email arrives with formatted HTML showing:
  - Task name: Digging
  - Stage: Foundation
  - Budget: ₦5,000
  - Start: 2025-10-08
  - End: 2025-10-17
  - Link to view project
*/

// ============================================================================
// EXAMPLE 2: Overdue Task Detection Flow (Step by Step)
// ============================================================================

/*
SCENARIO: Daily automated check finds an overdue task

PROJECT STATE:
{
  id: "proj-456",
  projectName: "Home Renovation",
  projectUsers: [DocumentReference("users/client-1")],
  projectManager: DocumentReference("users/pm-1"),
  taskTimeline: [
    {
      id: "stage-1",
      name: "Painting",
      status: "Ongoing",
      tasks: [
        {
          id: "task-1",
          name: "Interior Wall Paint",
          status: "Ongoing",  // ← Still ongoing
          cost: "15000",
          dueDate: { start: "2025-09-01", end: "2025-09-15" }  // ← Past date!
        },
        {
          id: "task-2",
          name: "Exterior Paint",
          status: "Completed",
          cost: "20000",
          dueDate: { start: "2025-08-01", end: "2025-08-20" }
        }
      ]
    }
  ]
}

TODAY: 2025-12-03

ACTION:
Cron job calls: POST /api/check-overdue-tasks
OR manually: fetch('/api/check-overdue-tasks', { method: 'POST' })

CODE EXECUTION (in /api/check-overdue-tasks/route.js):
1. Handler receives request
2. Calls: await notifyOverdueTasks()

INSIDE notifyOverdueTasks():
1. Fetch ALL projects
2. For each project:
   - Get taskTimeline
   - For each stage:
     - For each task:
       - Parse endDate: "2025-09-15"
       - Compare: "2025-09-15" < "2025-12-03" (today) ✓
       - Check status: "Ongoing" ✓
       - MATCH! Task is overdue
       
3. For the overdue task:
   daysOverdue = (2025-12-03 - 2025-09-15) = 79 days
   
4. Send in-app notifications to:
   Recipients = [
     DocumentReference("users/client-1"),
     DocumentReference("users/pm-1"),
     DocumentReference("users/admin-1"),
     DocumentReference("users/admin-2")
   ]
   
   For each recipient:
   - Create notification doc in Firestore:
     {
       title: "🚨 Task Overdue - Home Renovation",
       body: "\"Interior Wall Paint\" in Painting is overdue by 79 days",
       type: "task",
       recipientId: "client-1",
       projectId: "proj-456",
       taskName: "Interior Wall Paint",
       stageName: "Painting",
       daysOverdue: 79,
       action: "overdue-task-alert",
       ...etc
     }

5. Send emails:
   For each recipient:
   - Get email
   - Generate HTML from overdueTaskTemplate:
     Subject: "🚨 Task Overdue: Interior Wall Paint - Home Renovation"
     Body: HTML with urgent warning banner, red theme
   - Call fetch('/api/send-email')
   - Zeptomail sends email

RESULT:
✅ 4 notifications created in Firestore
✅ 4 emails sent (client-1, pm-1, admin-1, admin-2)
✅ Console shows progress:
   "🔍 Starting overdue tasks check..."
   "⏰ Found overdue task: Interior Wall Paint in Home Renovation"
   "✅ Overdue tasks check completed. Found 1 overdue tasks."

WHAT CLIENT SEES:
- Notification: "🚨 Task Overdue - Home Renovation"
  Body: "\"Interior Wall Paint\" in Painting is overdue by 79 days"
- Email arrives with:
  - Big red warning header: "🚨 Task Overdue Alert"
  - Yellow alert banner: "⚠️ URGENT: A task is overdue by 79 days"
  - Task details:
    * Task: Interior Wall Paint (with red OVERDUE badge)
    * Was Due: 2025-09-15
    * Budget: ₦15,000
    * Stage: Painting
  - Action button: "View & Update Task" (red)
  - Urgent message about immediate action needed

MULTIPLE OVERDUE TASKS:
If the check found 3 overdue tasks:
- Same recipients get 3 separate notifications
- Same recipients get 3 separate emails
- All deduped correctly
- Console shows: "✅ Found 3 overdue tasks"
*/

// ============================================================================
// EXAMPLE 3: Email Template Examples
// ============================================================================

/*
TASK CREATION EMAIL OUTPUT:

From: auth@ishelter.everythingshelter.com.ng
To: client@example.com
Subject: 🎯 New Task Created: Foundation Work - Building Construction

HTML PREVIEW:
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  ╔═══════════════════════════════════════════════════╗  │
│  ║              🎯 New Task Created                  ║  │
│  ║           (Orange gradient background)            ║  │
│  ╚═══════════════════════════════════════════════════╝  │
│                                                         │
│  Hi John Client,                                        │
│                                                         │
│  A new task has been created in your project           │
│  Building Construction. Here are the details:         │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │                                                 │   │
│  │  [Stage: Foundation]                            │   │
│  │                                                 │   │
│  │  Task:        Foundation Work                   │   │
│  │  Budget:      ₦50,000                          │   │
│  │  Start Date:  2025-10-08                        │   │
│  │  End Date:    2025-10-17                        │   │
│  │                                                 │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│                  [ View Project Timeline ]              │
│              (Orange button, clickable link)            │
│                                                         │
│  Please review the task details and ensure timely      │
│  completion. If you have any questions, feel free      │
│  to reach out.                                         │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  This is an automated notification from ishelter │   │
│  │  © 2025 ishelter. All rights reserved.          │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘

---

OVERDUE TASK EMAIL OUTPUT:

From: auth@ishelter.everythingshelter.com.ng
To: client@example.com
Subject: 🚨 Task Overdue: Interior Wall Paint - Home Renovation

HTML PREVIEW:
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  ╔═══════════════════════════════════════════════════╗  │
│  ║          🚨 Task Overdue Alert                   ║  │
│  ║           (Red gradient background)              ║  │
│  ╚═══════════════════════════════════════════════════╝  │
│                                                         │
│  Hi John Client,                                        │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ ⚠️ URGENT: A task in project Home Renovation    │   │
│  │ is overdue by 79 days and requires immediate    │   │
│  │ attention.                                       │   │
│  └─ Yellow warning banner ───────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │                                                 │   │
│  │  [Stage: Painting]                              │   │
│  │                                                 │   │
│  │  Task:       Interior Wall Paint [OVERDUE]     │   │
│  │  Was Due:    2025-09-15                        │   │
│  │  Budget:     ₦15,000                           │   │
│  │                                                 │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Please take immediate action to complete this task    │
│  or provide an update on the current status. Delays    │
│  may impact the overall project timeline and budget.   │
│                                                         │
│                 [ View & Update Task ]                 │
│               (Red button, clickable link)             │
│                                                         │
│  If you have completed this task or need to adjust     │
│  the timeline, please update the project status        │
│  immediately.                                          │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  This is an automated notification from ishelter │   │
│  │  © 2025 ishelter. All rights reserved.          │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
*/

// ============================================================================
// EXAMPLE 4: Database Records Created
// ============================================================================

/*
FIRESTORE COLLECTION: notifications

Document 1 (Task Creation - Client):
{
  id: "notif-001",
  title: "🎯 New Task Created - Building Construction",
  body: "\"Foundation Work\" has been created in Foundation",
  type: "task",
  recipientId: "client-1",
  relatedId: "task-id-123",
  projectId: "proj-123",
  actionUrl: "/dashboard/project-details/proj-123",
  senderId: "pm-1",
  isGlobal: false,
  read: false,
  createdAt: Timestamp(2025-12-03 14:30:00),
  taskName: "Foundation Work",
  stageName: "Foundation",
  taskCost: "50000",
  startDate: "2025-10-08",
  endDate: "2025-10-17",
  action: "task-creation",
  createdByName: "John Manager"
}

Document 2 (Task Creation - PM):
{
  // Same as above but recipientId: "pm-1"
}

Document 3 (Task Creation - Admin 1):
{
  // Same as above but recipientId: "admin-1"
  // Also different actionUrl: "/admin/project-overview/proj-123"
}

Document 4 (Task Creation - Admin 2):
{
  // Same as above but recipientId: "admin-2"
}

Document 5 (Overdue - Client):
{
  id: "notif-002",
  title: "🚨 Task Overdue - Home Renovation",
  body: "\"Interior Wall Paint\" in Painting is overdue by 79 days",
  type: "task",
  recipientId: "client-1",
  projectId: "proj-456",
  actionUrl: "/dashboard/project-details/proj-456",
  isGlobal: false,
  read: false,
  createdAt: Timestamp(2025-12-03 08:00:00),
  taskName: "Interior Wall Paint",
  stageName: "Painting",
  taskCost: "15000",
  daysOverdue: 79,
  action: "overdue-task-alert"
}

// ... More overdue notifications for pm-1, admin-1, admin-2 with same structure
*/

// ============================================================================
// EXAMPLE 5: Console Output During Execution
// ============================================================================

/*
TASK CREATION:
======================================
📬 Setting up notifications for: { uid: 'client-1', role: 'client' }
📨 recipientId query returned 1 notifications
📊 Total unique notifications: 1
📨 recipientIds array query returned 0 notifications
📨 global notifications query returned 0 notifications
📍 Fetching recipients for task creation...
✅ Task creation notification sent successfully
✅ Email sent successfully: { success: true, recipientCount: 1 }
✅ Email sent successfully: { success: true, recipientCount: 1 }
✅ Email sent successfully: { success: true, recipientCount: 2 }
✅ Task creation notifications and emails sent

OVERDUE CHECK:
======================================
🔍 Starting overdue tasks check...
⏰ Found overdue task: Interior Wall Paint in Home Renovation
✅ Overdue tasks check completed. Found 1 overdue tasks.
📬 Setting up notifications for: { uid: 'client-1', role: 'client' }
📨 recipientId query returned 1 notifications
✅ Email sent successfully: { success: true, recipientCount: 1 }
✅ Overdue alert notification completed
*/

export default {}; // Dummy export
