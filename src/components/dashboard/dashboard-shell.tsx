import type { ReactNode } from 'react';
import { DashboardHeader } from './dashboard-header';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { DashboardSidebar } from './dashboard-sidebar';

type DashboardShellProps = {
  children: ReactNode;
  userRole: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
};

export default function DashboardShell({
  children,
  userRole,
}: DashboardShellProps) {
  return (
    <SidebarProvider>
      <DashboardSidebar userRole={userRole} />

      <SidebarInset className="min-h-svh min-w-0 bg-background">
        <DashboardHeader />

        <div className="sticky top-17 z-20 flex h-11 shrink-0 items-center border-b border-border/70 bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/80">
          <SidebarTrigger className="-ml-1 rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground" />
          <div className="ml-3 h-4 w-px bg-border" />
          <span className="ml-3 text-xs font-medium tracking-wide text-muted-foreground">
            Academic Portal
          </span>
        </div>

        <main className="min-w-0 flex-1">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
