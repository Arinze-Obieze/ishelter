'use client';
import { usePathname } from 'next/navigation';
import { FaChartBar, FaUsers, FaFileInvoiceDollar, FaHandshake, FaCog, FaShieldAlt } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';

export default function Sidebar({ isOpen = false, onClose }) {
  const pathname = usePathname();

  const navSections = [
    {
      title: "MAIN",
      items: [
        { name: "Dashboard", icon: FaChartBar, href: "/success-manager" },
        { name: "Clients", icon: FaChartBar, href: "/success-manager/project" },
        { name: "Schedule", icon: FaUsers, href: "/success-manager/user-management" }
      ]
    },
    {
      title: "MANAGE",
      items: [
        { name: "Invoices", icon: FaFileInvoiceDollar, href: "/success-manager/billing" },
        { name: "Reports", icon: FaHandshake, href: "/success-manager/consultation" },
         { name: "System Settings", icon: FaCog, href: "/settings" },
      ]
    },
  
  ];

  const isActive = (href) => {
    if (href === '/success-manager') return pathname === '/success-manager';
    return pathname.startsWith(href) && href !== '/success-manager';
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
            <div className="flex items-center justify-between px-6 py-4 border-b">
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
        </nav>

        <div className="flex space-x-4 cursor-pointer items-center px-6 pb-5 pt-8 border-t border-gray-100 ">
          <img src="/testimonial/1.png" alt="Michael Adebayo" className="w-10  h-10"/>
          <div className=''>
            <h2 className="font-bold text-base">Sarah Johnson</h2>
            <h6 className="text-text text-xs">Success Manager</h6>
          </div>
        </div>
      </aside>
    </>
  );
}
