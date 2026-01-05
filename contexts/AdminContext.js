'use client'
import React, { createContext, useState, useCallback, useEffect } from 'react'
import { collection, query, where, getDocs, limit, startAfter, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export const AdminContext = createContext()

const PAGE_SIZE = 20
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export const AdminProvider = ({ children }) => {
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [lastDoc, setLastDoc] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredAdmins, setFilteredAdmins] = useState([])
  const [cacheTimestamp, setCacheTimestamp] = useState(null)
  const [isSearching, setIsSearching] = useState(false)

  // Check if cache is still valid
  const isCacheValid = useCallback(() => {
    if (!cacheTimestamp) return false
    const now = Date.now()
    return now - cacheTimestamp < CACHE_TTL
  }, [cacheTimestamp])

  // Load initial batch of admins
  const loadAdmins = useCallback(async (forceRefresh = false) => {
    if (!forceRefresh && isCacheValid() && admins.length > 0) {
      return
    }

    setLoading(true)
    try {
      const q = query(
        collection(db, 'users'),
        where('role', '==', 'admin'),
        orderBy('createdAt', 'desc'),
        limit(PAGE_SIZE)
      )

      const snapshot = await getDocs(q)
      const adminList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

      setAdmins(adminList)
      setFilteredAdmins(adminList)
      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null)
      setHasMore(snapshot.docs.length === PAGE_SIZE)
      setCacheTimestamp(Date.now())
    } catch (error) {
      console.error('Error loading admins:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [isCacheValid, admins.length])

  // Load next batch of admins
  const loadMoreAdmins = useCallback(async () => {
    if (!lastDoc || !hasMore || loading) return

    setLoading(true)
    try {
      const q = query(
        collection(db, 'users'),
        where('role', '==', 'admin'),
        orderBy('createdAt', 'desc'),
        startAfter(lastDoc),
        limit(PAGE_SIZE)
      )

      const snapshot = await getDocs(q)
      const newAdmins = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

      setAdmins((prev) => [...prev, ...newAdmins])
      setFilteredAdmins((prev) => [...prev, ...newAdmins])
      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null)
      setHasMore(snapshot.docs.length === PAGE_SIZE)
    } catch (error) {
      console.error('Error loading more admins:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [lastDoc, hasMore, loading])

  // Search admins with debouncing
  const searchAdmins = useCallback((term) => {
    setSearchTerm(term)
    setIsSearching(true)

    // Debounce search
    const filtered = admins.filter(
      (admin) =>
        admin.displayName?.toLowerCase().includes(term.toLowerCase()) ||
        admin.email?.toLowerCase().includes(term.toLowerCase())
    )

    setFilteredAdmins(filtered)
    setIsSearching(false)
  }, [admins])

  // Reset search
  const resetSearch = useCallback(() => {
    setSearchTerm('')
    setFilteredAdmins(admins)
  }, [admins])

  // Invalidate cache when admin is created or deleted
  const invalidateCache = useCallback(() => {
    setCacheTimestamp(null)
    setLastDoc(null)
    setAdmins([])
    setFilteredAdmins([])
    setHasMore(true)
  }, [])

  // Initial load
  useEffect(() => {
    loadAdmins()
  }, [])

  const value = {
    admins,
    filteredAdmins,
    loading,
    hasMore,
    searchTerm,
    isSearching,
    loadAdmins,
    loadMoreAdmins,
    searchAdmins,
    resetSearch,
    invalidateCache,
  }

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

export const useAdmin = () => {
  const context = React.useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}
