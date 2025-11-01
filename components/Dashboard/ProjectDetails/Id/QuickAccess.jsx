import React from 'react';
import { IoChatbubbleOutline, IoDocumentOutline, IoDocumentTextOutline } from 'react-icons/io5';
import Link from 'next/link';

const QuickAccess = () => {
  const quickAccessItems = [
    {
      href: "/dashboard/documents",
      icon: <IoDocumentTextOutline className="text-primary text-2xl" />,
      label: "Documents"
    },
    {
      href: "/dashboard/invoices", 
      icon: <IoDocumentTextOutline className="text-primary text-2xl" />,
      label: "Invoices"
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <IoDocumentOutline className="text-primary text-xl" />
        <h2 className="text-lg font-semibold text-gray-900">Quick Access</h2>
      </div>
      <div className="grid grid-cols-3 gap-4 [&>*]:cursor-pointer">
        {quickAccessItems.map((item, index) => (
          <Link key={index} href={item.href}>
            <button className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                {item.icon}
              </div>
              <span className="text-xs text-gray-700 font-medium">{item.label}</span>
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickAccess;