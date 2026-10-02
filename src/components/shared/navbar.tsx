'use client';

import { navItems } from '@/app/data/data';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { clearAuthTokens } from '@/lib/auth-storage';
import { useAuth } from '@/providers/auth.provider';
import { useQueryClient } from '@tanstack/react-query';
import { LayoutDashboard, LogOut, Menu, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { NavLink } from './nav-link';

const dashboardRoutes = {
  STUDENT: '/student-dashboard',
  INSTRUCTOR: '/instructor-dashboard',
  ADMIN: '/admin-dashboard',
} as const;

export function Navbar() {
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

    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-bold tracking-tight">
          University MS
        </Link>

        {/* DesktopNavigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map(item => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}

          {!isLoading && !user && (
            <Link
              href="/login"
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Login
            </Link>
          )}

          {!isLoading && user && (
            <DropdownMenu>
              <DropdownMenuTrigger
                className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Open user menu"
              >
                <Avatar className="size-9 cursor-pointer">
                  <AvatarFallback>
                    {initials || <User className="size-4" />}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="font-medium">
                    {user.firstName} {user.lastName}
                  </p>

                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuItem>
                  <Link
                    href="/profile"
                    className="flex w-full items-center gap-2"
                  >
                    <User className="size-4 shrink-0" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <Link
                    href={dashboardHref}
                    className="flex w-full items-center gap-2"
                  >
                    <LayoutDashboard className="size-4 shrink-0" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="size-4 shrink-0" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <ThemeToggle />
        </nav>

        {/* MobileNavigation */}
        <div className="flex items-center gap-2 md:hidden">
          <Sheet>
            <SheetTrigger
              aria-label="Open menu"
              className="inline-flex size-9 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
            >
              <Menu className="size-5" />
            </SheetTrigger>

            <SheetContent className="pt-6 text-center">
              <SheetHeader>
                <SheetTitle>University Management System</SheetTitle>
              </SheetHeader>

              <nav className="flex flex-col items-center gap-4 px-4">
                {navItems.map(item => (
                  <NavLink key={item.href} href={item.href}>
                    {item.label}
                  </NavLink>
                ))}

                {!isLoading && !user && (
                  <Link
                    href="/login"
                    className="mt-2 inline-flex h-9 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Login
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>

          {!isLoading && user && (
            <DropdownMenu>
              <DropdownMenuTrigger
                className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Open user menu"
              >
                <Avatar className="size-9 cursor-pointer">
                  <AvatarFallback>
                    {initials || <User className="size-4" />}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="font-medium">
                    {user.firstName} {user.lastName}
                  </p>

                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuItem>
                  <Link
                    href="/profile"
                    className="flex w-full items-center gap-2"
                  >
                    <User className="size-4 shrink-0" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <Link
                    href={dashboardHref}
                    className="flex w-full items-center gap-2"
                  >
                    <LayoutDashboard className="size-4 shrink-0" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="size-4 shrink-0" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
