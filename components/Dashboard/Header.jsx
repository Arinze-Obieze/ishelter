'use client';
import { FaHome, FaRegCommentDots, FaUser } from 'react-icons/fa';
import { FaRegBell } from "react-icons/fa6";
import { RiMenu3Fill } from 'react-icons/ri';
import { LuVideo } from "react-icons/lu";
import { IoDocumentTextOutline } from 'react-icons/io5';
import { FiCreditCard } from 'react-icons/fi';
import { usePathname } from 'next/navigation';
import { useCurrentClient } from '@/contexts/CurrentClientContext';
import Link from 'next/link';

function getInitials(name) {
  if (!name) return 'U';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const Header = ({ onMenuClick }) => {
  const pathname = usePathname();
  const { currentClient, loading } = useCurrentClient();

  const userName = currentClient?.displayName || currentClient?.email || 'User';
  const userPhoto = currentClient?.photoURL || '';

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: <FaHome className="mr-1 text-base" /> },
    { name: 'Live Feed', href: '/dashboard/live-feed', icon: <LuVideo className="mr-1 text-base" /> },
    { name: 'Documents', href: '/dashboard/documents', icon: <IoDocumentTextOutline className="mr-1 text-base" /> },
    { name: 'Billing', href: '/dashboard/billing', icon: <FiCreditCard className="mr-1 text-base" /> },
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
        <div className="md:flex cursor-pointer hidden items-center gap-4">
          <span>
            <FaRegBell className="text-xl text-gray-700 hover:text-gray-900" />
          </span>
        
          <Link href="/dashboard/profile">
            <div className="flex items-center gap-2">
              {loading ? (
                <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse" />
              ) : userPhoto ? (
                <img
                  src={userPhoto}
                  alt={userName}
                  className="w-9 h-9 rounded-full object-cover border-2 border-gray-200"
                />
              ) : (
                <div className="w-9 h-9 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {getInitials(userName)}
                </div>
              )}
              <span className="text-gray-700 font-medium">{loading ? 'Loading...' : userName}</span>
            </div>
          </Link>
        </div>

        {/* Mobile Menu */}
        <button 
          onClick={onMenuClick}
          className="md:hidden flex space-x-4 text-gray-700 text-2xl py-4"
        >
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