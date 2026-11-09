"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
};

export function NavLink({ href, children, onClick }: NavLinkProps) {
  const pathname = usePathname();

  const isActive =
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={
        isActive
          ? "text-sm font-semibold text-primary transition-colors"
          : "text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      }
    >
      {children}
    </Link>
  );
}
