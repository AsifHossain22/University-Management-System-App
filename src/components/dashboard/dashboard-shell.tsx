import type { ReactNode } from 'react';
import { Navbar } from '@/components/shared/navbar';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { DashboardSidebar } from './dashboard-sidebar';

export default function DashboardShell({
  children,
  userRole,
}: {
  children: ReactNode;
  userRole: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
}) {
  return (
    <SidebarProvider>
      <DashboardSidebar userRole={userRole} />
      <SidebarInset>
        <Navbar />
        <div className="flex h-12 items-center border-b px-4">
          <SidebarTrigger className="-ml-1" />
        </div>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
