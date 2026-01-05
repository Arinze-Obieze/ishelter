// lib/auditLog.js
// Audit logging utilities for tracking user actions and system events

import { adminDb } from './firebaseAdmin';

/**
 * Log account creation event
 * @param {string} userId - The UID of the created user
 * @param {string} email - The email of the created user
 * @param {string} role - The role of the created user (admin, project-manager, client)
 * @param {Request} req - The request object to extract IP and user agent
 */
export async function logAccountCreated(userId, email, role, req) {
  try {
    const timestamp = new Date().toISOString();
    
    // Extract client IP from request headers
    const ipAddress = req.headers.get('x-forwarded-for') || 
                     req.headers.get('x-client-ip') || 
                     req.headers.get('cf-connecting-ip') ||
                     'unknown';
    
    // Extract user agent
    const userAgent = req.headers.get('user-agent') || 'unknown';

    const auditEntry = {
      timestamp,
      event: 'account_created',
      userId,
      email,
      role,
      ipAddress: ipAddress.split(',')[0].trim(), // Get first IP if multiple
      userAgent,
      details: {
        accountType: 'manual_creation',
        createdVia: 'admin_panel'
      }
    };

    // Store in audit logs collection
    await adminDb.collection('audit_logs').add(auditEntry);

    console.log(`✅ Account creation logged for user: ${email}`);

    return { success: true };
  } catch (error) {
    console.error('❌ Failed to log account creation:', error);
    // Don't throw - audit logging should not block the main operation
    return { success: false, error: error.message };
  }
}

/**
 * Log user login event
 * @param {string} userId - The UID of the user logging in
 * @param {string} email - The email of the user
 * @param {Request} req - The request object to extract IP and user agent
 * @param {boolean} success - Whether the login was successful
 */
export async function logUserLogin(userId, email, req, success = true) {
  try {
    const timestamp = new Date().toISOString();
    
    const ipAddress = req.headers.get('x-forwarded-for') || 
                     req.headers.get('x-client-ip') || 
                     req.headers.get('cf-connecting-ip') ||
                     'unknown';
    
    const userAgent = req.headers.get('user-agent') || 'unknown';

    const auditEntry = {
      timestamp,
      event: 'user_login',
      userId: userId || null,
      email,
      success,
      ipAddress: ipAddress.split(',')[0].trim(),
      userAgent,
      details: {
        status: success ? 'successful' : 'failed'
      }
    };

    await adminDb.collection('audit_logs').add(auditEntry);

    console.log(`✅ Login event logged for user: ${email}`);

    return { success: true };
  } catch (error) {
    console.error('❌ Failed to log login event:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Log admin action
 * @param {string} action - The action performed (e.g., 'DELETE_USER', 'UPDATE_SETTINGS')
 * @param {string} performedBy - The UID of the admin performing the action
 * @param {string} targetId - The ID of the resource being affected
 * @param {Object} details - Additional details about the action
 */
export async function logAdminAction(action, performedBy, targetId, details = {}) {
  try {
    const timestamp = new Date().toISOString();

    const auditEntry = {
      timestamp,
      event: 'admin_action',
      action,
      performedBy,
      targetId,
      details,
      severity: 'info'
    };

    await adminDb.collection('audit_logs').add(auditEntry);

    console.log(`✅ Admin action logged: ${action}`);

    return { success: true };
  } catch (error) {
    console.error('❌ Failed to log admin action:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Log security event
 * @param {string} event - The security event type (e.g., 'FAILED_LOGIN_ATTEMPT', 'UNAUTHORIZED_ACCESS')
 * @param {string} userId - The UID of the user involved
 * @param {Object} details - Additional details about the event
 */
export async function logSecurityEvent(event, userId, details = {}) {
  try {
    const timestamp = new Date().toISOString();

    const auditEntry = {
      timestamp,
      event: 'security_event',
      type: event,
      userId: userId || null,
      details,
      severity: 'warning'
    };

    await adminDb.collection('audit_logs').add(auditEntry);

    console.log(`⚠️ Security event logged: ${event}`);

    return { success: true };
  } catch (error) {
    console.error('❌ Failed to log security event:', error);
    return { success: false, error: error.message };
  }
}
