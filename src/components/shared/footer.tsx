import { ArrowUpRight, GraduationCap } from 'lucide-react';
import Link from 'next/link';

const footerLinks = [
  { label: 'About us', href: '/about' },
  { label: 'Features', href: '/features' },
  { label: 'Academic programs', href: '/programs' },
  { label: 'Contact', href: '/contact' },
];

export function Footer() {
  return (
    <footer className="border-t border-border/70 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr] lg:gap-16">
          {/* BrandAndDescription */}
          <div className="flex flex-col items-start">
            <Link
              href="/"
              className="group inline-flex items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
              aria-label="University Management System home"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/15 transition-transform duration-200 group-hover:scale-105">
                <GraduationCap className="size-6" strokeWidth={1.8} />
              </span>

              <span className="text-base font-bold tracking-tight">
                University MS
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-muted-foreground">
              A modern platform designed to simplify university administration
              and bring students, instructors and administrators together in one
              connected academic experience.
            </p>

            <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground">
              <span className="size-2 rounded-full bg-emerald-500" />
              Built for modern education
            </span>
          </div>

          {/* QuickLinks */}
          <div>
            <h2 className="text-sm font-semibold tracking-wide">Explore</h2>

            <nav
              aria-label="Footer navigation"
              className="mt-5 flex flex-col items-start gap-3"
            >
              {footerLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* DeveloperLink */}
          <div>
            <h2 className="text-sm font-semibold tracking-wide">
              About this project
            </h2>

            <p className="mt-5 text-sm leading-6 text-muted-foreground">
              Created to demonstrate a modern approach to university management,
              academic workflows and role-based experiences.
            </p>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-border/70">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-center sm:px-6 md:flex-row md:text-left lg:px-8">
          <p className="text-xs leading-5 text-muted-foreground sm:text-sm">
            © {new Date().getFullYear()} University Management System. All
            rights reserved.
          </p>

          <p className="text-xs text-muted-foreground sm:text-sm">
            Designed and developed by{' '}
            <Link
              href="https://web-developer-asif.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary transition-colors hover:underline"
            >
              Hi ASIF
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
