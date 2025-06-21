
import type { ReactNode } from 'react';
import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <section className="min-h-screen bg-gray-100 p-6">
      <Sidebar />
      {children}
    </section>
  );
}
