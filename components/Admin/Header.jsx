'use client'
import { FaBell, FaBars } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export default function Header({ onMenuClick }) {
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Fetch user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setAdminUser({
              displayName: userData.displayName || user.email,
              email: user.email,
              role: userData.role || 'admin'
            });
          } else {
            // Fallback to auth data if Firestore doc doesn't exist
            setAdminUser({
              displayName: user.email,
              email: user.email,
              role: 'admin'
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Fallback to auth data
          setAdminUser({
            displayName: user.email,
            email: user.email,
            role: 'admin'
          });
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Generate initials from name
  const getInitials = (name) => {
    if (!name) return 'AD';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Format role for display
  const formatRole = (role) => {
    if (!role) return 'Admin';
    return role
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading) {
    return (
      <header className="bg-gray-100 h-fit border-b border-gray-300 px-4 md:px-8 w-full pb-4 pt-5 flex items-center justify-between">
        <div className="flex items-center gap-3"></div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <FaBell className="text-2xl text-gray-600" />
            {/* <span className="absolute -top-1 -right-1 flex items-center justify-center h-4 w-4 rounded-full bg-red-500 text-white text-xs font-bold">
              3
            </span> */}
          </div>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gray-300 animate-pulse"></div>
            <div className="flex flex-col gap-1">
              <div className="h-4 w-24 bg-gray-300 rounded animate-pulse"></div>
              <div className="h-3 w-20 bg-gray-300 rounded animate-pulse"></div>
            </div>
          </div>
          <button
            className="md:hidden p-2 rounded hover:bg-gray-200 focus:outline-none"
            onClick={onMenuClick}
            aria-label="Open menu"
          >
            <FaBars className="text-2xl text-gray-700" />
          </button>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-gray-100 h-fit border-b border-gray-300 px-4 md:px-8 w-full pb-4 pt-5 flex items-center justify-between">
      {/* Left: Menu Icon + Logo */}
      <div className="flex items-center gap-3"></div>
   
      <div className="flex items-center gap-4">
        <div className="relative">
          <FaBell className="text-2xl text-gray-600" />
          {/* <span className="absolute -top-1 -right-1 flex items-center justify-center h-4 w-4 rounded-full bg-red-500 text-white text-xs font-bold">
            3
          </span> */}
        </div>

        {/* User Avatar + Info */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-orange-400 flex items-center justify-center text-white font-bold text-lg">
            {adminUser ? getInitials(adminUser.displayName) : 'AD'}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-gray-800">
              {adminUser ? adminUser.displayName : 'Admin'}
            </span>
            <span className="text-xs text-gray-500">
              {adminUser ? formatRole(adminUser.role) : 'System Admin'}
            </span>
          </div>
        </div>

        {/* Hamburger for mobile */}
        <button
          className="md:hidden p-2 rounded hover:bg-gray-200 focus:outline-none"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <FaBars className="text-2xl text-gray-700" />
        </button>
      </div>
    </header>
  );
}