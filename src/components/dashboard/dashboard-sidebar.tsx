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

const sidebarRoutes: Partial<Record<'STUDENT', SidebarItems>> = {
  STUDENT: studentRoutes,
};

export function DashboardSidebar({ role }: { role: 'STUDENT' }) {
  const pathname = usePathname();
  const routes = sidebarRoutes[role] ?? [];

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
