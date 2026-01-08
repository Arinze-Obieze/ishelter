'use client'

/**
 * CSRF Token Context
 * 
 * Manages CSRF tokens in the frontend application.
 * Automatically generates and refreshes tokens based on authentication state.
 */

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';

const CsrfContext = createContext();

export const CsrfProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [csrfToken, setCsrfToken] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  /**
   * Generate a new CSRF token from the server
   */
  const generateToken = useCallback(async () => {
    if (!currentUser || isGenerating) return;

    setIsGenerating(true);
    try {
      const idToken = await currentUser.getIdToken();
      
      const response = await fetch('/api/csrf/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCsrfToken(data.csrfToken);
        
        // Store in sessionStorage as backup
        sessionStorage.setItem('csrf_token', data.csrfToken);
        
        console.log('[CSRF] Token generated successfully');
      } else {
        console.error('[CSRF] Failed to generate token:', response.status);
      }
    } catch (error) {
      console.error('[CSRF] Error generating token:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [currentUser, isGenerating]);

  /**
   * Refresh token periodically (every 30 minutes)
   */
  useEffect(() => {
    if (!currentUser) {
      setCsrfToken(null);
      sessionStorage.removeItem('csrf_token');
      return;
    }

    // Generate initial token
    generateToken();

    // Refresh token every 30 minutes
    const refreshInterval = setInterval(() => {
      console.log('[CSRF] Auto-refreshing token...');
      generateToken();
    }, 30 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [currentUser, generateToken]);

  /**
   * Restore token from sessionStorage on page load
   */
  useEffect(() => {
    if (currentUser && !csrfToken) {
      const storedToken = sessionStorage.getItem('csrf_token');
      if (storedToken) {
        setCsrfToken(storedToken);
        console.log('[CSRF] Token restored from sessionStorage');
      }
    }
  }, [currentUser, csrfToken]);

  /**
   * Get CSRF token (with fallback to sessionStorage)
   */
  const getToken = useCallback(() => {
    if (csrfToken) return csrfToken;
    
    const storedToken = sessionStorage.getItem('csrf_token');
    if (storedToken) {
      setCsrfToken(storedToken);
      return storedToken;
    }
    
    return null;
  }, [csrfToken]);

  /**
   * Force refresh token
   */
  const refreshToken = useCallback(async () => {
    console.log('[CSRF] Manually refreshing token...');
    await generateToken();
  }, [generateToken]);

  const value = {
    csrfToken: csrfToken || getToken(),
    getToken,
    refreshToken,
    isGenerating,
  };

  return (
    <CsrfContext.Provider value={value}>
      {children}
    </CsrfContext.Provider>
  );
};

export const useCsrf = () => {
  const context = useContext(CsrfContext);
  if (context === undefined) {
    throw new Error('useCsrf must be used within a CsrfProvider');
  }
  return context;
};
