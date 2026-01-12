'use client'

/**
 * CSRF Token Context
 * 
 * Manages CSRF tokens in the frontend application.
 * Automatically generates and refreshes tokens based on authentication state.
 */

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';

const CsrfContext = createContext();

export const CsrfProvider = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  // Initialize from sessionStorage to prevent unnecessary regeneration on reload
  const [csrfToken, setCsrfToken] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('csrf_token') || null;
    }
    return null;
  });
  
  const isGeneratingRef = useRef(false);
  // Keep state for UI components that might need to know loading status, 
  // but don't use it in generateToken's dependency array
  const [isGenerating, setIsGenerating] = useState(false);

  /**
   * Generate a new CSRF token from the server
   */
  const generateToken = useCallback(async () => {
    if (!currentUser || isGeneratingRef.current) return;

    isGeneratingRef.current = true;
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
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('csrf_token', data.csrfToken);
        }
        
        console.log('[CSRF] Token generated successfully');
      } else {
        console.error('[CSRF] Failed to generate token:', response.status);
      }
    } catch (error) {
      console.error('[CSRF] Error generating token:', error);
    } finally {
      isGeneratingRef.current = false;
      setIsGenerating(false);
    }
  }, [currentUser]);

  /**
   * Refresh token periodically (every 30 minutes)
   */
  useEffect(() => {
    // Wait for auth loading to complete before making decisions
    if (loading) return;

    if (!currentUser) {
      setCsrfToken(null);
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('csrf_token');
      }
      return;
    }

    // Generate initial token only if missing
    if (!csrfToken) {
      generateToken();
    }

    // Refresh token every 30 minutes
    const refreshInterval = setInterval(() => {
      console.log('[CSRF] Auto-refreshing token...');
      generateToken();
    }, 30 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [currentUser, loading, generateToken, csrfToken]);

  /**
   * Restore token from sessionStorage on page load
   */
  useEffect(() => {
    if (currentUser && !csrfToken && typeof window !== 'undefined') {
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
    
    if (typeof window !== 'undefined') {
      const storedToken = sessionStorage.getItem('csrf_token');
      if (storedToken) {
        setCsrfToken(storedToken);
        return storedToken;
      }
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
