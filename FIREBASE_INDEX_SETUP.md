# Firebase Firestore Index Creation Guide

## Required Index for Notifications Collection

You're seeing this error because Firestore needs a composite index for your notifications query:

```
FirebaseError: [code=failed-precondition]: The query requires an index.
```

### Steps to Create the Index:

1. **Go to Firebase Console:**
   - Navigate to: https://console.firebase.google.com/
   - Select your project: `ishelter1122`

2. **Access Firestore Indexes:**
   - Go to Firestore Database → Indexes tab
   - Scroll down to "Composite Indexes" section

3. **Create the Composite Index:**
   Click "Create Index" and configure:
   
   - **Collection ID:** `notifications`
   - **Field 1:** `isGlobal` (Ascending)
   - **Field 2:** `createdAt` (Descending)
   - Click "Create Index"

   OR use the auto-generated link from your error message directly.

### Why This Index is Needed:

Your NotificationContext now has this query for global notifications:
```javascript
const q3 = query(
  collection(db, 'notifications'),
  where('isGlobal', '==', true),
  orderBy('createdAt', 'desc')
)
```

Firestore requires a composite index when you combine:
- A `where()` clause with `==` operator
- An `orderBy()` clause on different fields

### Index Status:

Once created, the index will take 5-10 minutes to be ready. You'll see its status as "Building" → "Enabled" in the console.

### What Changed in the Code:

1. **notifyUsers.js** - Now creates notifications with `recipientIds: [uid]` (array) instead of `recipientId` (string)
2. **NotificationContext.js** - Added admin-only query that fetches ALL notifications when user role is 'admin'
3. **firestore.rules** - Updated to only check `recipientIds` array (no more `recipientId` field)
4. **EditUserModal.jsx** - Removed the non-existent `notifyUserUpdate` import
5. **userNotifications.js** - New file with `notifyUserUpdate` and `notifyNewUserSignup` functions

### Admin Notification Visibility:

Admins now have a special query that fetches ALL notifications without filters. This means:
- ✅ Admins see notifications in `recipientIds` array
- ✅ Admins see global notifications (`isGlobal: true`)
- ✅ Admins see role-based notifications
- ✅ Admins see ALL other notifications (unrestricted access)

### Next Steps:

1. Create the Firestore index as described above
2. Test by logging in as an admin
3. Create a new invoice to test notifications
4. You should now see the notification in the admin's notification panel
