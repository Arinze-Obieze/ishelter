importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in the messagingSenderId.
// This is required for background notifications to work.
firebase.initializeApp({
  apiKey: "REPLACE_WITH_YOUR_API_KEY", // Ideally we'd inject this, but for SW we might need to hardcode or fetch config. 
  // However, for just messaging, the messagingSenderId is often enough in some configs, 
  // but safest to put full config roughly or rely on default if hosted on Firebase.
  // Since we can't easily inject .env into a static SW file without a build step,
  // we will try to rely on the fact that if it's not strictly required or if we can fetch it.
  
  // Actually, for the SW, we only strictly need the messagingSenderId for 'compat' usually, 
  // but let's try to keep it simple. If this fails, we might need a workaround to inject env vars.
  messagingSenderId: "366883296065" // SENDER ID from user's checking
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.png' // Make sure this exists or use a default
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
