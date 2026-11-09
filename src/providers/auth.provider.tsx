"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useGetMe } from "@/hooks/auth.hook";
import type { User } from "@/types/auth.type";

type AuthContextValue = {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const { data, isLoading: isUserLoading, isError } = useGetMe();

  useEffect(() => {
    if (data?.data) {
      setUser(data.data);
    } else if (isError) {
      setUser(null);
    }

    if (!isUserLoading) {
      setIsInitializing(false);
    }
  }, [data, isError, isUserLoading]);

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
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
