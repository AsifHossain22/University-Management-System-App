'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
};

export function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname();

  const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={
        isActive
          ? 'text-sm font-semibold text-primary'
          : 'text-sm font-medium text-muted-foreground transition-colors hover:text-primary'
      }
    >
      {children}
    </Link>
  );
}
