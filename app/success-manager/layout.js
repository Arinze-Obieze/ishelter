'use client'
import withAdminProtection from "@/components/Admin/withAdminProtection";
import Sidebar from '@/components/Admin/Sidebar'
import Header from '@/components/Dashboard/Header'


export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
    <div className="flex">
      <Sidebar/>
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  </div>
);
}
