'use client';
import { usePathname } from 'next/navigation';
import { FaHome, FaUser, FaTimes } from 'react-icons/fa';
import { LuVideo } from "react-icons/lu";
import { IoDocumentTextOutline } from 'react-icons/io5';
import { FiCreditCard } from 'react-icons/fi';
import { useCurrentClient } from '@/contexts/CurrentClientContext';
import Link from 'next/link';

function getInitials(name) {
  if (!name) return 'U';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function MobileSidebar({ isOpen = false, onClose }) {
  const pathname = usePathname();
  const { currentClient, loading } = useCurrentClient();

  const userName = currentClient?.displayName || currentClient?.email || 'User';
  const userPhoto = currentClient?.photoURL || '';

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: <FaHome className="w-5 h-5" /> },
    { name: 'Live Feed', href: '/dashboard/live-feed', icon: <LuVideo className="w-5 h-5" /> },
    { name: 'Documents', href: '/dashboard/documents', icon: <IoDocumentTextOutline className="w-5 h-5" /> },
    { name: 'Billing', href: '/dashboard/billing', icon: <FiCreditCard className="w-5 h-5" /> },
    { name: 'Profile', href: '/dashboard/profile', icon: <FaUser className="w-5 h-5" /> },
  ];

  const isActive = (href) => pathname === href;

  const handleNavClick = () => {
    onClose();
  };

  return (
    <>
      {/* Backdrop with fade-in animation */}
      <div 
        className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      >
        {/* Sidebar with slide-in animation */}
        <div 
          className={`absolute right-0 top-0 h-full w-80 bg-white shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center">
              <span className="font-bold text-xl text-primary">i</span>
              <span className="font-bold text-xl ml-0.5">SHELTER</span>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
            >
              <FaTimes className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* User Profile with fade-in animation */}
          <div className="p-6 border-b border-gray-200 transform transition-all duration-300 delay-100">
            <Link href="/dashboard/profile" onClick={handleNavClick}>
              <div className="flex items-center gap-3">
                {loading ? (
                  <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
                ) : userPhoto ? (
                  <img
                    src={userPhoto}
                    alt={userName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 transition-all duration-300 hover:border-orange-400"
                  />
                ) : (
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-lg transition-all duration-300 hover:bg-orange-600">
                    {getInitials(userName)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-gray-900 truncate transition-colors duration-200 hover:text-orange-600">
                    {userName}
                  </h2>
                  <p className="text-sm text-gray-500">Client</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Navigation with staggered animation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navItems.map((item, index) => {
                const active = isActive(item.href);
                return (
                  <li 
                    key={item.name}
                    className="transform transition-all duration-300"
                    style={{
                      transitionDelay: isOpen ? `${index * 50}ms` : '0ms',
                      transform: isOpen ? 'translateX(0)' : 'translateX(20px)',
                      opacity: isOpen ? 1 : 0
                    }}
                  >
                    <Link
                      href={item.href}
                      onClick={handleNavClick}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] ${
                        active
                          ? 'bg-orange-50 text-orange-600 border-r-2 border-orange-600 shadow-sm'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <div className={`transition-transform duration-200 ${active ? 'scale-110' : ''}`}>
                        {item.icon}
                      </div>
                      <span className="transition-all duration-200">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer with fade-in animation */}
          <div 
            className="p-6 border-t border-gray-200 transform transition-all duration-300 delay-200"
            style={{
              opacity: isOpen ? 1 : 0,
              transform: isOpen ? 'translateY(0)' : 'translateY(10px)'
            }}
          >
            <p className="text-xs text-gray-500 text-center">
              iSHELTER is a product of Everything Shelter
            </p>
          </div>
        </div>
      </div>
    </>
  );
}