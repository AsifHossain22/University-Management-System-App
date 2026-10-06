'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
    <Sidebar>
      <SidebarHeader>
        <Link href="/" className="font-semibold">
          University MS
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {routes.map(group => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map(item => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      render={<Link href={item.url} />}
                      isActive={pathname === item.url}
                    >
                      {item.title}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
