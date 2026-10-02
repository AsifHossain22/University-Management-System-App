import RoleGuard from '@/components/auth/role-guard';
import type { ReactNode } from 'react';

export default function StudentLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <RoleGuard roles={['STUDENT']}>{children}</RoleGuard>
    </>
  );
}
