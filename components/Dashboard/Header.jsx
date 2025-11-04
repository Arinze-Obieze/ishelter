'use client';
import { FaHome, FaRegCommentDots, FaUser } from 'react-icons/fa';
import { FaRegBell } from "react-icons/fa6";
import { RiMenu3Fill } from 'react-icons/ri';
import { LuVideo } from "react-icons/lu";
import { IoDocumentTextOutline } from 'react-icons/io5';
import { FiCreditCard } from 'react-icons/fi';
import { usePathname } from 'next/navigation';
import { useUsers } from '@/contexts/UserContext';
import { auth } from '@/lib/firebase';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const Header = () => {
  const pathname = usePathname();
  const { users } = useUsers();
  const [currentUser, setCurrentUser] = useState(null);
  const [userName, setUserName] = useState('Loading...');

  // Get current authenticated user
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Find user details from users context
  useEffect(() => {
    if (currentUser && users.length > 0) {
      const userDetails = users.find(u => u.id === currentUser.uid);
      if (userDetails) {
        setUserName(userDetails.displayname || userDetails.email || 'User');
      } else {
        // Fallback to Firebase auth display name or email
        setUserName(currentUser.displayName || currentUser.email || 'User');
      }
    } else if (currentUser) {
      setUserName(currentUser.displayName || currentUser.email || 'User');
    }
  }, [currentUser, users]);

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: <FaHome className="mr-1 text-base" /> },
    { name: 'Live Feed', href: '/dashboard/live-feed', icon: <LuVideo className="mr-1 text-base" /> },
    { name: 'Documents', href: '/dashboard/documents', icon: <IoDocumentTextOutline className="mr-1 text-base" /> },
    { name: 'Billing', href: '/dashboard/billing', icon: <FiCreditCard className="mr-1 text-base" /> },
    // { name: 'Chat', href: '/dashboard/chat', icon: <FaRegCommentDots className="mr-1 text-base" /> },
  ];

  return (
    <div>
      <header className="bg-white place-items-center flex items-center justify-between px-6 py-2 md:mt-4">
        {/* Logo */}
        <div className="flex items-center">
          <span className="font-bold text-base md:text-2xl text-primary tracking-wide">i</span>
          <span className="font-bold text-base md:text-2xl ml-0.5">SHELTER</span>
        </div>

        {/* Navigation */}
        <nav className="md:flex items-center gap-8 text-xs hidden">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center font-medium ${
                  isActive ? 'text-primary' : 'text-gray-700 hover:text-primary'
                }`}
              >
                {item.icon}
                {item.name}
              </a>
            );
          })}
        </nav>

        {/* Notification & Profile */}
        <div className="md:flex cursor-pointer hidden items-center gap-4 ">
          <span>
            <FaRegBell className="text-xl text-gray-700 hover:text-gray-900" />
          </span>
        
        <Link href="/dashboard/profile">
        <div className="flex items-center gap-2">
            <span className="bg-gray-200 rounded-full p-2">
              <FaUser className="text-md text-gray-500" />
            </span>
            <span className="text-gray-700 font-medium">{userName}</span>
          </div>
        </Link>
        </div>

        {/* Mobile Menu */}
        <button className="md:hidden flex space-x-4 text-gray-700 text-2xl py-4">
          <span>
            <FaRegBell className="text-gray-700 hover:text-gray-900" />
          </span>
          <RiMenu3Fill />
        </button>
      </header>

      <div className="bg-[#FDF2E5] w-full text-center py-3 max-md:hidden">
        <h1 className="text-primary text-base font-semibold">
          iSHELTER is a product of Everything Shelter
        </h1>
      </div>
    </div>
  );
};

export default Header;