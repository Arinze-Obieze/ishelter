# Notification System Debugging Guide

## Changes Made

### 1. Firestore Rules (`firestore.rules`)
- **Notification Read Rules** now check in priority order:
  1. `request.auth.token.admin == true` (fastest)
  2. `isAdmin()` - checks user document role field
  3. Recipient in `recipientIds` array
  4. `isGlobal == true`
  5. Role-based via `roles` array

### 2. Notification Context (`contexts/NotificationContext.js`)
- Added error handler to gracefully log permission errors
- Removed admin-specific unrestricted query (now handled by Firestore rules)
- Maintains 3 queries:
  - `recipientIds` array contains
  - `roles` array contains
  - `isGlobal` == true

### 3. Notification Creation (`utils/notifications/notifyUsers.js`)
- ✅ Creates notifications with `recipientIds: [adminId]` for each admin
- ✅ Includes admins via `includeAdmins: true` parameter
- Each admin gets their own notification document

### 4. Payment Notifications (`utils/notifications/paymentNotifications.js`)
- ✅ `notifyPaymentStatusChange()` already has `includeAdmins: true`
- Invoices notify all project users + project manager + all admins

## How to Debug Admin Notifications

### Test Case: Create Invoice and Check Admin Notifications

1. **Login as Admin**
   - Verify your Firebase auth token has `admin: true` claim
   - Check: Browser DevTools → Application → Storage → IndexedDB → firebaseLocalStorageDb

2. **Create an Invoice**
   - Go to admin panel and create a new invoice
   - This should trigger `notifyPaymentStatusChange()` with `includeAdmins: true`

3. **Check Firestore Database**
   - Go to: https://console.firebase.google.com/project/ishelter1122/firestore/data
   - Navigate to `notifications` collection
   - Look for a document with:
     ```json
     {
       "recipientIds": ["<admin-uid>"],
       "type": "payment",
       "isGlobal": false,
       "title": "...",
       "body": "..."
     }
     ```

4. **Check Browser Console for Errors**
   - If you see: `[permission-denied]` error
   - This means Firestore rules are blocking the query
   - Check that admin's UID is in `recipientIds` array

5. **Check NotificationContext Logs**
   - Open browser console
   - Look for: `Notification query error: permission-denied`
   - If this appears, the Firestore rules need adjustment

## Firestore Rules Debugging

### Current Admin Access:
```firestore
allow read: if request.auth != null && (
  request.auth.token.admin == true ||  // FastestCheck
  isAdmin() ||                          // Falls back to DB lookup
  (recipientIds contains uid) ||        // Individual recipient
  isGlobal == true ||                   // Global broadcasts
  (roles array contains user role)      // Role-based
);
```

### If Admin Still Can't See Notifications:

**Check 1:** Is `request.auth.token.admin` set?
```javascript
// In browser console, after login:
firebase.auth().currentUser.getIdTokenResult().then(result => {
  console.log('Admin claim:', result.claims.admin);
});
```

**Check 2:** Is the notification in Firestore?
```javascript
// In browser console:
db.collection('notifications').where('recipientIds', 'array-contains', firebase.auth().currentUser.uid).onSnapshot(snap => {
  console.log('Notifications:', snap.docs.map(d => d.data()));
});
```

**Check 3:** Does admin's user document exist?
```javascript
// In browser console:
db.collection('users').doc(firebase.auth().currentUser.uid).get().then(doc => {
  console.log('User role:', doc.data().role);
});
```

## Expected Behavior After Fixes

1. Admin logs in
2. Admin creates invoice → `notifyPaymentStatusChange()` called
3. Function queries admins → finds admin UID
4. Creates notification document with `recipientIds: [adminUid]`
5. Admin's NotificationContext query reads notification
6. Admin sees notification in UI

## If Still Not Working

1. **Clear browser cache** - Old NotificationContext might be cached
2. **Redeploy Firestore rules** - Rules changes may not have synced
3. **Create new notification** - Test with fresh notification after rule update
4. **Check admin role** - Verify `users/{admin-uid}` has `role: "admin"` field
