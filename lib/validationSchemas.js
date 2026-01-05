// lib/validationSchemas.js
// Validation schemas and utilities

/**
 * Schema for account creation validation
 */
export const createAccountSchema = {
  email: {
    required: true,
    type: 'string',
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Valid email is required'
  },
  displayName: {
    required: false,
    type: 'string',
    maxLength: 100,
    message: 'Display name must be less than 100 characters'
  },
  role: {
    required: false,
    type: 'string',
    enum: ['admin', 'project-manager', 'client'],
    message: 'Invalid role'
  },
  projectManagerId: {
    required: false,
    type: 'string',
    message: 'Invalid project manager ID'
  }
};

/**
 * Generic data validation function
 * @param {Object} data - Data to validate
 * @param {Object} schema - Validation schema
 * @returns {Object} - Validation result {success: boolean, error?: string, data?: Object}
 */
export function validateData(data, schema) {
  if (!data || typeof data !== 'object') {
    return {
      success: false,
      error: 'Invalid data format'
    };
  }

  const errors = [];
  const validatedData = {};

  for (const [key, rules] of Object.entries(schema)) {
    const value = data[key];

    // Check required fields
    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push(`${key} is required`);
      continue;
    }

    // Skip optional fields that are empty
    if (!rules.required && (value === undefined || value === null || value === '')) {
      continue;
    }

    // Validate type
    if (rules.type && typeof value !== rules.type) {
      errors.push(`${key} must be of type ${rules.type}`);
      continue;
    }

    // Validate pattern (regex)
    if (rules.pattern && !rules.pattern.test(value)) {
      errors.push(rules.message || `${key} format is invalid`);
      continue;
    }

    // Validate enum
    if (rules.enum && !rules.enum.includes(value)) {
      errors.push(rules.message || `${key} has an invalid value`);
      continue;
    }

    // Validate maxLength
    if (rules.maxLength && value.length > rules.maxLength) {
      errors.push(rules.message || `${key} exceeds maximum length of ${rules.maxLength}`);
      continue;
    }

    validatedData[key] = value;
  }

  if (errors.length > 0) {
    return {
      success: false,
      error: errors[0] // Return first error
    };
  }

  return {
    success: true,
    data: validatedData
  };
}
