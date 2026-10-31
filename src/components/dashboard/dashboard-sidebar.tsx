'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import type { SidebarItems } from '@/types/sidebar.type';
import { studentRoutes } from '@/routes/student.routes';
import { instructorRoutes } from '@/routes/instructor.routes';
import { adminRoutes } from '@/routes/admin.routes';

const sidebarRoutes: Partial<
  Record<'STUDENT' | 'INSTRUCTOR' | 'ADMIN', SidebarItems>
> = {
  STUDENT: studentRoutes,
  INSTRUCTOR: instructorRoutes,
  ADMIN: adminRoutes,
};

export function DashboardSidebar({
  userRole,
}: {
  userRole: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
}) {
  const pathname = usePathname();
  const routes = sidebarRoutes[userRole] ?? [];

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-sidebar-ring"
          aria-label="University MS home"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
            <GraduationCap className="size-6" aria-hidden="true" />
          </span>

          <span className="flex min-w-0 flex-col gap-0.5 group-data-[collapsible=icon]:hidden">
            <span className="truncate text-sm font-bold tracking-tight text-sidebar-foreground">
              University MS
            </span>
            <span className="text-xs text-muted-foreground">
              Academic portal
            </span>
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="gap-3 px-3 py-4">
        {routes.map(group => (
          <SidebarGroup key={group.title} className="px-0">
            <SidebarGroupLabel className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              {group.title}
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {group.items.map(item => {
                  const isActive =
                    pathname === item.url ||
                    (item.url !== '/student-dashboard' &&
                      item.url !== '/instructor-dashboard' &&
                      item.url !== '/admin-dashboard' &&
                      pathname.startsWith(`${item.url}/`));

                  return (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton
                        render={<Link href={item.url} />}
                        isActive={isActive}
                        tooltip={item.title}
                        className="h-10 rounded-lg px-3 text-sm font-medium text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:font-semibold data-[active=true]:text-sidebar-accent-foreground"
                      >
                        <span className="truncate">{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
