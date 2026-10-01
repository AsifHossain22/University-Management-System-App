'use client';

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useGetMe } from '@/hooks/auth.hook';
import { getAccessToken } from '@/lib/auth-storage';
import type { User } from '@/types/auth.type';

type AuthContextValue = {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const hasAccessToken = Boolean(getAccessToken());

  const { data, isLoading: isUserLoading, isError } = useGetMe();

  useEffect(() => {
    if (!hasAccessToken) {
      setIsInitializing(false);
      return;
    }

    if (data?.data) {
      setUser(data.data);
    }

    if (isError) {
      setUser(null);
    }

    if (!isUserLoading) {
      setIsInitializing(false);
    }
  }, [data, hasAccessToken, isError, isUserLoading]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoading: isInitializing,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
