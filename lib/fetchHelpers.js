/**
 * Fetch Helper Utility with CSRF Token Support
 * 
 * Provides a wrapper around fetch that automatically includes:
 * - Firebase authentication token
 * - CSRF token
 * - Standard headers
 */

/**
 * Enhanced fetch with automatic auth and CSRF token injection
 * @param {string} url - API endpoint URL
 * @param {object} options - Fetch options
 * @param {object} auth - Auth object with currentUser and getIdToken
 * @param {function} getCsrfToken - Function to get CSRF token
 * @returns {Promise<Response>}
 */
export async function fetchWithAuth(url, options = {}, currentUser, getCsrfToken) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  // Add Firebase auth token if user is authenticated
  if (currentUser) {
    try {
      const authToken = await currentUser.getIdToken();
      headers['Authorization'] = `Bearer ${authToken}`;
    } catch (error) {
      console.error('[fetchWithAuth] Failed to get auth token:', error);
    }
  }

  // Add CSRF token if available
  if (getCsrfToken) {
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      headers['X-CSRF-Token'] = csrfToken;
    }
  }

  return fetch(url, {
    ...options,
    headers,
  });
}

/**
 * Helper to extract and parse JSON response with error handling
 * @param {Response} response - Fetch response
 * @returns {Promise<object>}
 */
export async function parseResponse(response) {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }
  
  return data;
}
