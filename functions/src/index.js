require('dotenv').config();
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { onRequest } = require("firebase-functions/v2/https");
const { logger } = require("firebase-functions/v2");
const admin = require('firebase-admin');
const { checkOverdueItems } = require('./scheduledChecks');

// Initialize Firebase Admin (once)
if (!admin.apps.length) {
  admin.initializeApp();
}

// ============================================
// SCHEDULED FUNCTION - Runs daily at midnight
// ============================================
exports.dailyOverdueCheck = onSchedule({
  schedule: '0 0 * * *',
  timeZone: 'Africa/Lagos',
}, async (event) => {
  try {
    logger.info('🕐 Starting daily overdue check...');
    const count = await checkOverdueItems();
    logger.info(`✅ Daily overdue check completed - sent ${count} notifications`);
    return null;
  } catch (error) {
    logger.error('❌ Error in daily overdue check:', error);
    throw error;
  }
});

// ============================================
// MANUAL TRIGGER - For testing
// ============================================
exports.manualOverdueCheck = onRequest(async (req, res) => {
  try {
    logger.info('🧪 Manual overdue check triggered...');
    const count = await checkOverdueItems();
    res.json({ 
      success: true, 
      message: 'Overdue check completed',
      notificationsSent: count
    });
  } catch (error) {
    logger.error('❌ Error in manual overdue check:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// ============================================
// TEST EMAIL FUNCTION
// ============================================
exports.testEmail = onRequest(async (req, res) => {
  try {
    // Import inside function to avoid duplicate import issues
    const { SendMailClient } = require("zeptomail");
    
    const client = new SendMailClient({
      url: "https://api.zeptomail.com/v1.1/email",
      token: process.env.ZEPTOMAIL_TOKEN
    });
    
    await client.sendMail({
      "from": {
        "address": process.env.EMAIL_FROM_ADDRESS || "noreply@ishelter.everythingshelter.com.ng",
        "name": process.env.EMAIL_FROM_NAME || "iShelter Test"
      },
      "to": [{
        "email_address": {
          "address": "everythingshelter.com.ng@gmail.com",
          "name": "Test User"
        }
      }],
      "subject": "✅ Test Email from iShelter Functions",
      "htmlbody": `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .success { color: #10b981; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1 class="success">✓ Test Successful!</h1>
          <p>This test email was sent from Firebase Functions using ZeptoMail.</p>
          <p>Timestamp: ${new Date().toISOString()}</p>
        </body>
        </html>
      `,
    });
    
    res.json({ 
      success: true, 
      message: "Test email sent successfully",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error("Test email error:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});