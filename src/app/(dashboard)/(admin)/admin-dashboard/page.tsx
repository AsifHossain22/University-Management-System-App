import Link from 'next/link';
import { ArrowRight, Building2, GraduationCap, Users } from 'lucide-react';

const overviewCards = [
  {
    title: 'Departments',
    description: 'Organize academic departments and manage their information.',
    icon: Building2,
    href: '/admin-dashboard/departments',
    label: 'Academic structure',
  },
  {
    title: 'Programs',
    description: 'Manage degree programs and their academic structure.',
    icon: GraduationCap,
    href: '/admin-dashboard/programs',
    label: 'Academic programs',
  },
  {
    title: 'Students',
    description: 'View student records and monitor university enrollment.',
    icon: Users,
    href: '/admin-dashboard/students',
    label: 'Student records',
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-8 p-4 sm:p-6 lg:p-8">
      {/* WelcomeSection */}
      <section className="relative overflow-hidden rounded-2xl border border-border/70 bg-card p-6 shadow-sm sm:p-8">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wide text-primary">
            ADMINISTRATION
          </span>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Welcome to your dashboard
            </h1>
            <p className="max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              Manage academic operations, organize university resources and keep
              track of essential administrative activities from one place.
            </p>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -top-20 size-64 rounded-full bg-primary/5 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 right-28 size-48 rounded-full bg-primary/5 blur-3xl"
        />
      </section>

      {/* OverviewSection */}
      <section className="space-y-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold tracking-tight">
            University overview
          </h2>
          <p className="text-sm text-muted-foreground">
            Quick access to your essential management areas.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {overviewCards.map(card => {
            const Icon = card.icon;

            return (
              <Link
                key={card.title}
                href={card.href}
                className="group rounded-2xl border border-border/70 bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="size-6" aria-hidden="true" />
                  </div>

                  <ArrowRight className="size-5 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary" />
                </div>

                <div className="mt-6 space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {card.label}
                  </p>
                  <h3 className="text-lg font-semibold tracking-tight">
                    {card.title}
                  </h3>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {card.description}
                  </p>
                </div>

                <div className="mt-5 flex items-center gap-2 text-sm font-medium text-primary">
                  Explore section
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
