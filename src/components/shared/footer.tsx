import Link from 'next/link';

const footerLinks = [
  { label: 'About', href: '/about' },
  { label: 'Features', href: '/features' },
  { label: 'Programs', href: '/programs' },
  { label: 'Contact', href: '/contact' },
];

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 text-center lg:text-left">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:px-6 lg:flex-row md:items-center md:justify-between lg:px-8">
        <div>
          <p className="font-semibold">University Management System</p>
          <p className="mt-1 text-sm text-muted-foreground">
            A modern platform for university administration and academic
            management.
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {footerLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground font-medium hover:font-medium transition-colors hover:text-primary"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="border-t">
        <div className="mx-auto max-w-7xl px-4 py-4 text-center text-sm text-muted-foreground sm:px-6 lg:px-8">
          © {new Date().getFullYear()} University Management System. All rights
          reserved | Developed by{' '}
          <Link
            href="https://web-developer-asif.netlify.app"
            target="_blank"
            className="text-sm font-medium text-[#432dd7]"
          >
            <strong>
              Hi <span className="">ASIF</span>
            </strong>
          </Link>
        </div>
      </div>
    </footer>
  );
}
