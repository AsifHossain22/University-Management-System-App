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
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { clearAuthTokens } from '@/lib/auth-storage';
import { useAuth } from '@/providers/auth.provider';
import { useQueryClient } from '@tanstack/react-query';
import {
  ArrowRight,
  ChevronDown,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dashboardHref = user ? dashboardRoutes[user.role] : '/';

  const initials = user
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
    : '';

  const handleLogout = () => {
    clearAuthTokens();
    setUser(null);
    queryClient.removeQueries({ queryKey: ['user'] });

    setMobileMenuOpen(false);
    toast.success('Logged out successfully.');
    router.push('/');
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 shadow-sm shadow-black/[0.02] backdrop-blur-xl">
      <div className="mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          href="/"
          onClick={closeMobileMenu}
          className="group flex shrink-0 items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
          aria-label="University Management System home"
        >
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20 transition-transform duration-200 group-hover:scale-105">
            <GraduationCap className="size-6" strokeWidth={1.8} />
          </span>

          <span className="flex flex-col">
            <span className="text-sm font-bold tracking-tight sm:text-base">
              University MS
            </span>
            <span className="hidden text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground sm:block">
              Academic management
            </span>
          </span>
        </Link>

        {/* DesktopNavigation */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-8 lg:flex"
        >
          {navItems.map(item => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* DesktopActions */}
        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          {!isLoading && !user && (
            <>
              <Link
                href="/login"
                className="inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                Sign in
              </Link>

              <Link
                href="/register"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Get started
                <ArrowRight className="size-4" />
              </Link>
            </>
          )}

          {!isLoading && user && (
            <DropdownMenu>
              <DropdownMenuTrigger
                className="group inline-flex items-center gap-2 rounded-full border border-border/70 bg-background p-1 pr-3 outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label="Open user menu"
              >
                <Avatar className="size-8">
                  <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                    {initials || <User className="size-4" />}
                  </AvatarFallback>
                </Avatar>

                <span className="max-w-28 truncate text-sm font-medium">
                  {user.firstName}
                </span>

                <ChevronDown className="size-3.5 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
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

                <DropdownMenuItem className="cursor-pointer rounded-lg py-2.5">
                  <Link href="/profile" className="flex items-center gap-2">
                    <User className="size-4 text-muted-foreground" />
                    <span>My profile</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem className="cursor-pointer rounded-lg py-2.5">
                  <Link
                    href={dashboardHref}
                    className="flex items-center gap-2"
                  >
                    <LayoutDashboard className="size-4 text-muted-foreground" />
                    <span>My dashboard</span>
                  </Link>
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

          <div className="border-l border-border/70 pl-3">
            <ThemeToggle />
          </div>
        </div>

        {/* MobileActions */}
        <div className="flex shrink-0 items-center gap-2 lg:hidden">
          {!isLoading && user && (
            <DropdownMenu>
              <DropdownMenuTrigger
                className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label="Open user menu"
              >
                <Avatar className="size-9">
                  <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                    {initials || <User className="size-4" />}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="w-60 rounded-xl p-2"
              >
                <div className="px-2 py-2">
                  <p className="truncate text-sm font-semibold">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </p>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuItem className="cursor-pointer rounded-lg">
                  <Link href="/profile" className="flex items-center gap-2">
                    <User className="size-4" />
                    My profile
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem className="cursor-pointer rounded-lg">
                  <Link
                    href={dashboardHref}
                    className="flex items-center gap-2"
                  >
                    <LayoutDashboard className="size-4" />
                    My dashboard
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer rounded-lg text-destructive focus:bg-destructive/10 focus:text-destructive"
                >
                  <LogOut className="size-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <ThemeToggle />

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger
              aria-label="Open navigation menu"
              className="inline-flex size-9 items-center justify-center rounded-xl border border-border/70 bg-background transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Menu className="size-5" />
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[ min(85vw, 360px)] p-0 sm:max-w-sm"
            >
              <SheetHeader className="border-b px-5 py-5 text-left">
                <SheetTitle className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <GraduationCap className="size-6" />
                  </span>
                  <span>University MS</span>
                </SheetTitle>
                <SheetDescription>Your university, connected.</SheetDescription>
              </SheetHeader>

              <div className="flex h-[calc(100%-100px)] flex-col overflow-y-auto px-4 py-5">
                <nav
                  aria-label="Mobile navigation"
                  className="flex flex-col gap-1"
                >
                  {navItems.map(item => (
                    <div
                      key={item.href}
                      onClick={closeMobileMenu}
                      className="rounded-xl px-2 py-1 transition-colors hover:bg-accent"
                    >
                      <NavLink href={item.href}>{item.label}</NavLink>
                    </div>
                  ))}
                </nav>

                {!isLoading && !user && (
                  <div className="mt-6 flex flex-col gap-3 border-t pt-5">
                    <Link
                      href="/login"
                      onClick={closeMobileMenu}
                      className="inline-flex h-11 items-center justify-center rounded-xl border border-border px-4 text-sm font-semibold transition-colors hover:bg-accent"
                    >
                      Sign in
                    </Link>

                    <Link
                      href="/register"
                      onClick={closeMobileMenu}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      Get started
                      <ArrowRight className="size-4" />
                    </Link>
                  </div>
                )}

                {!isLoading && user && (
                  <div className="mt-6 rounded-xl border bg-muted/30 p-3">
                    <p className="text-xs text-muted-foreground">
                      Signed in as
                    </p>
                    <p className="mt-1 truncate text-sm font-semibold">
                      {user.firstName} {user.lastName}
                    </p>
                    <Link
                      href={dashboardHref}
                      onClick={closeMobileMenu}
                      className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      <LayoutDashboard className="size-4" />
                      Open dashboard
                    </Link>
                  </div>
                )}

                <div className="mt-auto border-t pt-5">
                  <p className="text-center text-xs text-muted-foreground">
                    A smarter way to manage university life.
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
