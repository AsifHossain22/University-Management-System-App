import type { ReactNode } from 'react';
import RoleGuard from '@/components/auth/role-guard';
import DashboardShell from '@/components/dashboard/dashboard-shell';

export default function InstructorLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <RoleGuard roles={['INSTRUCTOR']}>
      <DashboardShell userRole="INSTRUCTOR">{children}</DashboardShell>
    </RoleGuard>
  );
}
