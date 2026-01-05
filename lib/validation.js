// lib/validation.js
// Input validation utilities for consultation registration

/**
 * Validate email format
 */
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email is required' };
  }

  if (email.length > 254) {
    return { valid: false, error: 'Email is too long' };
  }

  if (!emailRegex.test(email.trim())) {
    return { valid: false, error: 'Invalid email format' };
  }

  return { valid: true };
}

/**
 * Validate name format
 */
export function validateName(name) {
  if (!name || typeof name !== 'string') {
    return { valid: false, error: 'Name is required' };
  }

  const trimmed = name.trim();

  if (trimmed.length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters' };
  }

  if (trimmed.length > 100) {
    return { valid: false, error: 'Name must be less than 100 characters' };
  }

  // Check for dangerous characters (basic XSS prevention)
  if (/[<>\"'%;()&+]/.test(trimmed)) {
    return { valid: false, error: 'Name contains invalid characters' };
  }

  return { valid: true, sanitized: trimmed };
}

/**
 * Validate phone number
 */
export function validatePhone(phone) {
  if (!phone || typeof phone !== 'string') {
    return { valid: false, error: 'Phone number is required' };
  }

  // Remove common formatting characters
  const cleaned = phone.replace(/[\s\-\(\)\.]/g, '');

  if (cleaned.length < 10) {
    return { valid: false, error: 'Phone number too short' };
  }

  if (cleaned.length > 15) {
    return { valid: false, error: 'Phone number too long' };
  }

  // Check for valid phone format (digits and optional +)
  if (!/^\+?[\d]+$/.test(cleaned)) {
    return { valid: false, error: 'Phone number contains invalid characters' };
  }

  return { valid: true, sanitized: cleaned };
}

/**
 * Validate all consultation registration fields
 * Returns aggregated validation results
 */
export function validateConsultationRegistration(data) {
  const errors = [];

  // Validate email
  const emailValidation = validateEmail(data.email);
  if (!emailValidation.valid) {
    errors.push(emailValidation.error);
  }

  // Validate name
  const nameValidation = validateName(data.fullName);
  if (!nameValidation.valid) {
    errors.push(nameValidation.error);
  }

  // Validate phone
  const phoneValidation = validatePhone(data.phone);
  if (!phoneValidation.valid) {
    errors.push(phoneValidation.error);
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    sanitized: {
      email: data.email.toLowerCase().trim(),
      fullName: nameValidation.sanitized,
      phone: phoneValidation.sanitized,
    },
  };
}
