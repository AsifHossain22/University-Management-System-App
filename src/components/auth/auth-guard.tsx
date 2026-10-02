'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGetMe } from '@/hooks/auth.hook';
import AuthLoading from './auth-loading';

export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();

  const { data, isLoading, isError } = useGetMe();

  const user = data?.data;

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

  return <>{children}</>;
}
