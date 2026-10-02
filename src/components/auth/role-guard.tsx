'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGetMe } from '@/hooks/auth.hook';
import type { UserRole } from '@/types/auth.type';
import AccessDenied from './access-denied';
import AuthLoading from './auth-loading';

interface RoleGuardProps {
  children: ReactNode;
  roles: UserRole[];
}

export default function RoleGuard({ children, roles }: RoleGuardProps) {
  const router = useRouter();

  const { data, isLoading, isError } = useGetMe();

  const user = data?.data;

  const isAuthorized = Boolean(user && roles.includes(user.role));

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (isError || !user) {
      router.replace('/login');
    }
  }, [isLoading, isError, user, router]);

  if (isLoading) {
    return <AuthLoading />;
  }

  if (isError || !user) {
    return <AuthLoading label="Redirecting..." />;
  }

  if (isAuthorized) {
    return <>{children}</>;
  }

  return <AccessDenied />;
}
