'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { clearAuthTokens } from '@/lib/auth-storage';
import { useAuth } from '@/providers/auth.provider';
import { useQueryClient } from '@tanstack/react-query';
import { GraduationCap, LayoutDashboard, LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const dashboardRoutes = {
  STUDENT: '/student-dashboard',
  INSTRUCTOR: '/instructor-dashboard',
  ADMIN: '/admin-dashboard',
} as const;

export function DashboardHeader() {
  const { user, setUser, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();

  const dashboardHref = user ? dashboardRoutes[user.role] : '/';

  const initials = user
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
    : '';

  const handleLogout = () => {
    clearAuthTokens();
    setUser(null);
    queryClient.removeQueries({ queryKey: ['user'] });

    toast.success('Logged out successfully.');
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-40 flex h-17 shrink-0 items-center justify-between border-b border-border/70 bg-background/90 px-4 backdrop-blur-xl sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <GraduationCap className="size-5" aria-hidden="true" />
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold tracking-tight">
            University MS
          </p>
          <p className="hidden text-xs text-muted-foreground sm:block">
            Academic management portal
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <ThemeToggle />

        {!isLoading && user && (
          <DropdownMenu>
            <DropdownMenuTrigger
              className="group inline-flex items-center gap-2 rounded-full border border-border/70 bg-background p-1 pr-2 outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:pr-3"
              aria-label="Open user menu"
            >
              <Avatar className="size-8">
                <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                  {initials || <User className="size-4" />}
                </AvatarFallback>
              </Avatar>

              <span className="hidden max-w-28 truncate text-sm font-medium sm:block">
                {user.firstName}
              </span>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              sideOffset={10}
              className="w-64 rounded-xl p-2 shadow-xl"
            >
              <div className="flex items-center gap-3 px-2 py-3">
                <Avatar className="size-10">
                  <AvatarFallback className="bg-primary/10 font-bold text-primary">
                    {initials || <User className="size-4" />}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
                    {user.role.toLowerCase()}
                  </p>
                </div>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                render={<Link href="/profile" />}
                className="cursor-pointer rounded-lg py-2.5"
              >
                <User className="size-4 text-muted-foreground" />
                <span>My profile</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                render={<Link href={dashboardHref} />}
                className="cursor-pointer rounded-lg py-2.5"
              >
                <LayoutDashboard className="size-4 text-muted-foreground" />
                <span>My dashboard</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer rounded-lg py-2.5 text-destructive focus:bg-destructive/10 focus:text-destructive"
              >
                <LogOut className="size-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
