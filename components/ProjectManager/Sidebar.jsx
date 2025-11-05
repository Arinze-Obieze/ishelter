'use client';
import { usePathname } from 'next/navigation';
import { FaChartBar, FaUsers, FaFileInvoiceDollar, FaHandshake, FaCog, FaShieldAlt, FaUserCircle } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import { useProjectManager } from '@/contexts/ProjectManagerProjectsContext';
import Link from 'next/link';

export default function Sidebar({ isOpen = false, onClose }) {
  const pathname = usePathname();
  const { userProfile } = useProjectManager();

  const navSections = [
    {
      title: "MAIN",
      items: [
        { name: "Dashboard", icon: FaChartBar, href: "/project-manager" },
        { name: "Clients", icon: FaChartBar, href: "/project-manager/project" },
      ]
    },
    {
      title: "MANAGE",
      items: [
        { name: "System Settings", icon: FaCog, href: "/project-manager/settings" },
      ]
    },
  ];

  const isActive = (href) => {
    if (href === '/project-manager') return pathname === '/project-manager';
    return pathname.startsWith(href) && href !== '/project-manager';
  };

  // Get user display info with fallbacks
  const displayName = userProfile?.displayName || 'Project Manager';
  const displayRole = 'Project Manager';
  const photoURL = userProfile?.photoURL;

  // Common navigation item component
  const NavItem = ({ item, active, onClick }) => {
    const Icon = item.icon;
    return (
      <li>
        <a
          href={item.href}
          className={`flex items-center px-3 py-2 whitespace-nowrap transition-colors ${
            active
              ? 'bg-[#fdf3e4] text-primary font-bold'
              : 'hover:bg-gray-100 hover:text-gray-900'
          }`}
          onClick={onClick}
        >
          <Icon className="mr-3 text-base" />
          {item.name}
        </a>
      </li>
    );
  };

  // Common navigation section component
  const NavSection = ({ section, onItemClick }) => (
    <div>
      <div className="text-xs font-bold text-text mb-2 mt-6">{section.title}</div>
      <ul>
        {section.items.map((item, j) => {
          const active = isActive(item.href);
          return (
            <NavItem 
              key={j} 
              item={item} 
              active={active} 
              onClick={onItemClick}
            />
          );
        })}
      </ul>
    </div>
  );

  // Common user profile component
  const UserProfile = ({ className = "" }) => (
    <Link href="/project-manager/settings">
   <div className={`flex space-x-4 cursor-pointer items-center px-6 pb-5 pt-8 border-t border-gray-100 ${className}`}>
    {photoURL ? (
        <img 
          src={photoURL} 
          alt={displayName} 
          className="w-10 h-10 rounded-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      ) : null}
      <div 
        className={`w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center ${photoURL ? 'hidden' : 'flex'}`}
      >
        <FaUserCircle className="w-6 h-6 text-primary" />
      </div>
      <div className="overflow-hidden">
        <h2 className="font-bold text-base truncate max-w-[140px] md:max-w-none">{displayName}</h2>
        <h6 className="text-text text-xs">{displayRole}</h6>
      </div>
    </div>
    </Link>

  );

  // Common header component
  const SidebarHeader = ({ onClose, showCloseButton = false }) => (
    <div className={`flex items-center ${showCloseButton ? 'justify-between px-6 py-4 ' : 'px-6 py-8'}`}>
      <span className={`font-bold tracking-tight text-gray-900 ${showCloseButton ? 'text-xl' : 'text-2xl'}`}>
        <span className="text-primary font-bold">i</span>SHELTER
      </span>
      {showCloseButton && (
        <button onClick={onClose} className="text-gray-700 hover:text-gray-900">
          <FiX className="w-6 h-6" />
        </button>
      )}
    </div>
  );

  const Navigation = ({ onItemClick }) => (
    <nav className="flex-1 px-4 overflow-y-auto">
      {navSections.map((section, i) => (
        <NavSection 
          key={i} 
          section={section} 
          onItemClick={onItemClick}
        />
      ))}
    </nav>
  );

  return (
    <>
      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden" onClick={onClose}>
          <aside
            className="absolute left-0 top-0 h-full w-64 bg-white shadow-lg flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarHeader onClose={onClose} showCloseButton={true} />
            <Navigation onItemClick={onClose} />
            <UserProfile />
          </aside>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-white h-screen md:fixed shadow flex-col">
        <SidebarHeader />
        <Navigation onItemClick={null} />
        <UserProfile />
      </aside>
    </>
  );
}