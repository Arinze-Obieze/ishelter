'use client';
import { usePathname } from 'next/navigation';
import { FaChartBar, FaUsers, FaFileInvoiceDollar, FaHandshake, FaCog, FaShieldAlt, FaSignOutAlt } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import { getAuth, signOut } from 'firebase/auth';

export default function Sidebar({ isOpen = false, onClose }) {
  const pathname = usePathname();

  const navSections = [
    {
      title: "MAIN",
      items: [
        { name: "Dashboard", icon: FaChartBar, href: "/admin" },
        { name: "Project Oversight", icon: FaChartBar, href: "/admin/project" },
        { name: "User Management", icon: FaUsers, href: "/admin/user-management" }
      ]
    },
    {
      title: "BUSINESS",
      items: [
        { name: "Billing Reports", icon: FaFileInvoiceDollar, href: "/admin/billing" },
        { name: "Consultation Leads", icon: FaHandshake, href: "/admin/consultation-leads" }
      ]
    },
    {
      title: "ADMIN",
      items: [
        { name: "System Settings", icon: FaCog, href: "/settings" },
        { name: "Security", icon: FaShieldAlt, href: "/security" }
      ]
    }
  ];

  const isActive = (href) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href) && href !== '/admin';
  };

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      window.location.href = '/login'; // redirect after logout
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden" onClick={onClose}>
          <aside
            className="absolute left-0 top-0 h-full w-64 bg-white shadow-lg flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Close Icon */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <span className="text-xl font-bold tracking-tight text-gray-900">
                <span className="text-primary font-bold">i</span>SHELTER
              </span>
              <button onClick={onClose} className="text-gray-700 hover:text-gray-900">
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-4 overflow-y-auto">
              {navSections.map((section, i) => (
                <div key={i}>
                  <div className="text-xs font-bold text-text mb-2 mt-6">{section.title}</div>
                  <ul>
                    {section.items.map((item, j) => {
                      const Icon = item.icon;
                      const active = isActive(item.href);
                      return (
                        <li key={j}>
                          <a
                            href={item.href}
                            className={`flex items-center px-3 py-2 whitespace-nowrap transition-colors ${
                              active
                                ? 'bg-[#fdf3e4] text-primary font-bold'
                                : 'hover:bg-gray-100 hover:text-gray-900'
                            }`}
                            onClick={onClose}
                          >
                            <Icon className="mr-3 text-base" />
                            {item.name}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}

              {/* Logout button */}
              <div className="mt-6 border-t pt-4 border-gray-200">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 text-left text-red-600 hover:bg-gray-100 transition-colors"
                >
                  <FaSignOutAlt className="mr-3" />
                  Logout
                </button>
              </div>
            </nav>
          </aside>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-white h-screen md:fixed shadow flex-col">
        <div className="flex items-center px-6 py-8">
          <span className="text-2xl font-bold tracking-tight text-gray-900">
            <span className="text-primary font-bold">i</span>SHELTER
          </span>
        </div>

        <nav className="flex-1 px-4">
          {navSections.map((section, i) => (
            <div key={i}>
              <div className="text-xs font-bold text-text mb-2 mt-6">{section.title}</div>
              <ul>
                {section.items.map((item, j) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <li key={j}>
                      <a
                        href={item.href}
                        className={`flex items-center px-3 py-2 whitespace-nowrap transition-colors ${
                          active
                            ? 'bg-[#fdf3e4] text-primary font-bold'
                            : 'hover:bg-gray-100 hover:text-gray-900'
                        }`}
                      >
                        <Icon className="mr-3 text-base" />
                        {item.name}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          {/* Logout button for desktop */}
          <div className="mt-6 border-t border-gray-200 pt-4">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-left text-red-600 hover:bg-gray-100 transition-colors"
            >
              <FaSignOutAlt className="mr-3" />
              Logout
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
}
