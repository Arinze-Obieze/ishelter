'use client';
import { usePathname } from 'next/navigation';
import { FaChartBar, FaUsers, FaFileInvoiceDollar, FaHandshake, FaCog, FaShieldAlt } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import Image from 'next/image';

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
        { name: "Consultation Leads", icon: FaHandshake, href: "/admin/consultation" }
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

  return (
    <>
      {/* Mobile Drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <aside
            className="absolute left-0 top-0 h-full w-64 bg-white shadow-lg flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Header with Close Icon */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div className="flex items-center">
                <span className="text-xl font-bold tracking-tight text-gray-900">
                  <span className="text-primary font-bold">i</span>SHELTER
                </span>
              </div>
              <button onClick={onClose} className="text-gray-700 hover:text-gray-900">
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-1 px-4 overflow-y-auto">
              {navSections.map((section, sectionIndex) => (
                <div key={sectionIndex}>
                  <div className="text-xs font-bold text-text mb-2 mt-6">{section.title}</div>
                  <ul>
                    {section.items.map((item, itemIndex) => {
                      const IconComponent = item.icon;
                      const active = isActive(item.href);
                      return (
                        <li key={itemIndex} className="space-y-4">
                          <a
                            href={item.href}
                            className={`flex items-center px-3 py-2 text-text whitespace-nowrap transition-colors ${active ? 'bg-[#fdf3e4] text-primary font-bold' : 'hover:bg-gray-100 hover:text-gray-900'}`}
                            onClick={onClose}
                          >
                            <IconComponent className="mr-3 text-base" />
                            {item.name}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex max-w-sm bg-white h-screen shadow flex-col">
        <div className="flex items-center px-6 py-8">
          <span className="text-2xl font-bold tracking-tight text-gray-900">
            <span className="text-primary font-bold">i</span>SHELTER
          </span>
        </div>
        <nav className="flex-1 px-4">
          {navSections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <div className="text-xs font-bold text-text mb-2 mt-6">{section.title}</div>
              <ul>
                {section.items.map((item, itemIndex) => {
                  const IconComponent = item.icon;
                  const active = isActive(item.href);
                  return (
                    <li key={itemIndex} className="space-y-4">
                      <a
                        href={item.href}
                        className={`flex items-center px-3 py-2 text-text whitespace-nowrap transition-colors ${active ? 'bg-[#fdf3e4] text-primary font-bold' : 'hover:bg-gray-100 hover:text-gray-900'}`}
                      >
                        <IconComponent className="mr-3 text-base" />
                        {item.name}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
