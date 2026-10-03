'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGetMe } from '@/hooks/auth.hook';
import AuthLoading from './auth-loading';

export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const { data, isLoading, isError } = useGetMe();

  const user = data?.data;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || isLoading) {
      return;
    }

    if (isError || !user) {
      router.replace('/login');
    }
  }, [mounted, isLoading, isError, user, router]);

  if (!mounted || isLoading) {
    return <AuthLoading />;
  }

  if (isError || !user) {
    return <AuthLoading label="Redirecting..." />;
  }

  return <>{children}</>;
}
