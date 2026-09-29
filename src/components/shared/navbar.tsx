import { navItems } from '@/app/data/data';
import Link from 'next/link';
import { NavLink } from './nav-link';
import { Menu } from 'lucide-react';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export function Navbar() {
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

          <Link
            href="/login"
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Login
          </Link>

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
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm font-medium"
                  >
                    {item.label}
                  </Link>
                ))}

                <Link
                  href="/login"
                  className="mt-2 inline-flex h-9 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Login
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
