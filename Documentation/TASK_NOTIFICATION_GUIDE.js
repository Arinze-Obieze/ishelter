/**
 * TASK NOTIFICATION SYSTEM - IMPLEMENTATION GUIDE
 * 
 * This file documents the complete task notification system implementation
 * including task creation notifications, overdue task alerts, email templates,
 * and how to set up scheduling.
 */

// ============================================================================
// 1. TASK CREATION NOTIFICATIONS
// ============================================================================
/*
 * When a task is created:
 * - Notification is automatically sent to all project users + admins
 * - Email is sent to all project users + admins
 * 
 * Flow:
 * 1. User creates task in TimelineTab → handleSaveTask() called
 * 2. Task is saved to Firestore
 * 3. notifyTaskCreation() is automatically triggered
 * 4. Function sends:
 *    - In-app notification to project users + admins
 *    - Email to project users + admins
 *    - Email to all admins
 * 
 * Files involved:
 * - /hooks/useTimelineOperations.js (handleSaveTask function)
 * - /utils/notifications/taskNotifications.js (notifyTaskCreation function)
 * - /utils/emailTemplates/taskCreationTemplate.js (email HTML template)
 * - /app/api/send-email/route.js (sends email via Zeptomail)
 */

// Example of what happens:
/*
const handleSaveTask = async (stageIdx) => {
  // ... validation and task creation ...
  
  // NEW: Send notification when task is created
  try {
    await notifyTaskCreation({
      projectId: projectId,
      taskName: newTask.name,
      stageName: updatedStage.name,
      taskCost: newTask.cost,
      startDate: newTask.dueDate?.start,
      endDate: newTask.dueDate?.end,
      createdById: currentUser?.uid,
      createdByName: currentUser?.displayName
    })
  } catch (error) {
    console.error('Notification failed:', error)
    // Task creation succeeds even if notification fails
  }
}
*/

// ============================================================================
// 2. OVERDUE TASK NOTIFICATIONS
// ============================================================================
/*
 * Overdue task detection runs on a schedule and checks:
 * - All projects
 * - All tasks in each project
 * - If task end date < today AND status is 'Ongoing' or 'Pending'
 * - Sends notifications + emails to project users + admins
 * 
 * How to trigger overdue checks:
 * 
 * A. Manual Check (for testing):
 *    GET http://localhost:3000/api/check-overdue-tasks
 *    or
 *    POST http://localhost:3000/api/check-overdue-tasks
 * 
 * B. Scheduled via Vercel Cron (Production):
 *    Add to vercel.json:
 *    {
 *      "crons": [{
 *        "path": "/api/check-overdue-tasks",
 *        "schedule": "0 8 * * *"  // Daily at 8 AM UTC
 *      }]
 *    }
 * 
 * C. Scheduled via Firebase Cloud Functions:
 *    Create a Cloud Function that calls:
 *    POST https://your-domain.com/api/check-overdue-tasks
 * 
 * D. Third-party service (e.g., cron-job.org):
 *    Schedule POST to /api/check-overdue-tasks
 * 
 * Files involved:
 * - /app/api/check-overdue-tasks/route.js (API endpoint)
 * - /utils/notifications/taskNotifications.js (notifyOverdueTasks function)
 * - /utils/emailTemplates/overdueTaskTemplate.js (email HTML template)
 */

// ============================================================================
// 3. EMAIL TEMPLATES
// ============================================================================
/*
 * Two email templates are provided:
 * 
 * 1. Task Creation Email (/utils/emailTemplates/taskCreationTemplate.js)
 *    - Sent when a task is created
 *    - Shows: task name, stage, budget, start/end dates
 *    - Includes link to project timeline
 *    - Green theme (primary color)
 * 
 * 2. Overdue Task Email (/utils/emailTemplates/overdueTaskTemplate.js)
 *    - Sent when a task is overdue (end date < today)
 *    - Shows: task name, stage, budget, days overdue
 *    - Alert banner highlighting urgency
 *    - Red theme (warning color)
 *    - Includes link to update task
 * 
 * To customize templates:
 * - Edit the respective .js file in /utils/emailTemplates/
 * - Modify colors: primaryColor, secondaryColor parameters
 * - Modify content: HTML in the template strings
 * - Note: Both templates are responsive (work on mobile + desktop)
 */

// ============================================================================
// 4. DATABASE STRUCTURE (TaskTimeline)
// ============================================================================
/*
 * Tasks are nested in stages within the taskTimeline array:
 * 
 * project.taskTimeline = [
 *   {
 *     id: "1760534910251",
 *     name: "Foundation",
 *     status: "Completed",
 *     cost: "100000",
 *     dueDate: { start: "2025-10-08", end: "2025-10-17" },
 *     tasks: [
 *       {
 *         id: "1760535177210",
 *         name: "Digging Of Foundation",
 *         status: "Ongoing",  // Can be: Pending, Ongoing, Completed
 *         cost: "5000",
 *         dueDate: "dec 15- dec 20"  OR  { start: "2025-10-08", end: "2025-10-17" }
 *       },
 *       {
 *         id: "1760699931690",
 *         name: "Pilling",
 *         status: "Pending",
 *         cost: "200",
 *         dueDate: { start: "2025-10-08", end: "2025-10-17" }
 *       }
 *     ]
 *   }
 * ]
 * 
 * IMPORTANT: The system handles BOTH date formats:
 * - String format: "dec 15- dec 20"
 * - Object format: { start: "2025-10-08", end: "2025-10-17" }
 * 
 * For overdue detection:
 * - Extracts end date
 * - Compares with today's date
 * - Triggers alert if end date < today AND status is Ongoing/Pending
 */

// ============================================================================
// 5. RECIPIENTS (Who gets notified?)
// ============================================================================
/*
 * For Task Creation Notifications:
 * 1. All project.projectUsers (array of user references)
 * 2. project.projectManager (if exists)
 * 3. ALL ADMINS (users with role = "admin")
 * 
 * For Overdue Task Notifications:
 * 1. All project.projectUsers (array of user references)
 * 2. project.projectManager (if exists)
 * 3. ALL ADMINS (users with role = "admin")
 * 
 * Disabled users are automatically skipped (user.disabled = true)
 * 
 * How it works in code:
 * - notifyUsers() function handles all the logic
 * - Takes array of user DocumentReferences
 * - Automatically fetches admin users when includeAdmins=true
 * - Creates notification document for each recipient
 * - Deduplicates to avoid sending multiple times
 */

// ============================================================================
// 6. NOTIFICATION FLOW (In-App + Email)
// ============================================================================
/*
 * Step 1: Task Created
 * ├─ Firestore document created
 * └─ notifyTaskCreation() triggered
 *
 * Step 2: Fetch Recipients
 * ├─ Get project.projectUsers (DocumentReferences)
 * ├─ Get project.projectManager
 * └─ Query all admins
 *
 * Step 3: Send In-App Notifications
 * ├─ For each recipient:
 * │  ├─ Fetch user document
 * │  ├─ Check if user is disabled
 * │  └─ Create notification document in "notifications" collection
 * └─ Deduplicate to prevent duplicates
 *
 * Step 4: Send Emails
 * ├─ For each recipient:
 * │  ├─ Get email address
 * │  ├─ Generate HTML from template
 * │  └─ Call /api/send-email (uses Zeptomail)
 * └─ For each admin:
 *    ├─ Get admin email
 *    ├─ Generate HTML from template
 *    └─ Call /api/send-email
 */

// ============================================================================
// 7. TESTING
// ============================================================================
/*
 * Testing Task Creation Notification:
 * 1. Navigate to Project Manager → Project Details → Timeline Tab
 * 2. Click "Add New Stage" and create a stage
 * 3. Click "Add Task" and fill in task details
 * 4. Check:
 *    - Notification appears in NotificationContext
 *    - Email is sent (check Zeptomail logs)
 *    - Firestore "notifications" collection has new doc
 *
 * Testing Overdue Task Notification:
 * 1. Create a task with end date in the past
 * 2. Set status to "Ongoing" or "Pending"
 * 3. Manually call: GET /api/check-overdue-tasks
 * 4. Check:
 *    - Notification appears in NotificationContext
 *    - Email is sent
 *    - Firestore "notifications" collection has new doc
 *
 * Debug Tips:
 * - Check browser console for logs starting with ✅ or ❌
 * - Check Zeptomail dashboard for email delivery
 * - Check Firestore "notifications" collection for created docs
 * - Check project's projectUsers and admins in Firestore
 */

// ============================================================================
// 8. COMMON ISSUES & SOLUTIONS
// ============================================================================
/*
 * Issue 1: Emails not being sent
 * Solution:
 * - Check ZEPTOMAIL_API_KEY is set in .env.local
 * - Verify email addresses are correct in Firestore users
 * - Check Zeptomail dashboard for blocked/bounced emails
 * - Check /app/api/send-email/route.js logs
 *
 * Issue 2: Notifications not appearing
 * Solution:
 * - Check NotificationContext is wrapped around app
 * - Verify currentUser is properly set
 * - Check Firestore "notifications" collection in Firebase console
 * - Check user is not disabled (user.disabled = false)
 *
 * Issue 3: Wrong recipients getting notified
 * Solution:
 * - Verify project.projectUsers array has correct references
 * - Check project.projectManager reference is correct
 * - Verify admin users have role = "admin" in Firestore
 * - Check Firestore rules allow reading users collection
 *
 * Issue 4: Overdue check not running
 * Solution:
 * - Verify API endpoint is accessible: /api/check-overdue-tasks
 * - Check cron job is properly configured (if using scheduler)
 * - Verify environment variables are set (NEXT_PUBLIC_APP_URL)
 * - Check dates are in correct format in taskTimeline
 * - Verify tasks have dueDate with end date property
 */

// ============================================================================
// 9. CONFIGURATION
// ============================================================================
/*
 * Required Environment Variables:
 * - ZEPTOMAIL_API_KEY: API key for sending emails
 * - NEXT_PUBLIC_APP_URL: Public URL of your app (for email links)
 *
 * Optional Configuration:
 * - Email notification frequency: Modify notifyOverdueTasks() to check once per task
 * - Email template colors: Modify primaryColor/secondaryColor in templates
 * - Notification types: Extend type field in notifyUsers() call
 * - Admin inclusion: Set includeAdmins=false to skip admin notifications
 */

// ============================================================================
// 10. API ENDPOINTS CREATED
// ============================================================================
/*
 * POST /api/check-overdue-tasks
 * Description: Check for overdue tasks and send notifications
 * Response: { success: true, message: "...", timestamp: "..." }
 * 
 * GET /api/check-overdue-tasks
 * Description: Same as POST (for testing)
 * Response: { success: true, message: "...", timestamp: "..." }
 * 
 * Both endpoints:
 * - Are public (no auth required currently - add if needed)
 * - Can be called manually for testing
 * - Should be scheduled via cron job for production
 * - Handle errors gracefully
 */

export default {}; // Dummy export for linting
