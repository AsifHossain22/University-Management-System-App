import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  LayoutDashboard,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow,
} from 'lucide-react';

const purposeItems = [
  {
    icon: Workflow,
    title: 'Connected operations',
    description:
      'Bring courses, sections, registrations, attendance, examinations, results, fees and payments into one coordinated academic workflow.',
    number: '01',
  },
  {
    icon: ShieldCheck,
    title: 'Role-based management',
    description:
      'Give students, instructors and administrators relevant tools and information through role-specific experiences and controlled access.',
    number: '02',
  },
  {
    icon: Sparkles,
    title: 'A consistent experience',
    description:
      'Make academic and administrative information easier to organize, access and manage through a unified platform.',
    number: '03',
  },
];

const userRoles = [
  {
    icon: GraduationCap,
    title: 'Students',
    description:
      'Stay informed about academic progress, register for courses, monitor attendance, view results and manage fees and payments.',
    capabilities: [
      'Course registration',
      'Attendance and results',
      'Fees and payments',
    ],
  },
  {
    icon: BookOpen,
    title: 'Instructors',
    description:
      'Manage assigned sections, track student participation, record attendance and work with examinations and results.',
    capabilities: [
      'Section management',
      'Attendance tracking',
      'Exams and results',
    ],
  },
  {
    icon: LayoutDashboard,
    title: 'Administrators',
    description:
      'Coordinate university operations, manage academic records and oversee the administrative workflows that keep the institution organized.',
    capabilities: [
      'Academic management',
      'User administration',
      'Fees and applications',
    ],
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden border-b">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
          <div className="absolute -right-24 -top-32 size-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-24 size-80 rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-sm font-semibold text-primary">
              <GraduationCap className="size-4" />
              About the system
            </div>

            <h1 className="mt-7 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl lg:leading-[1.12]">
              A better-connected way to manage{' '}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                university life.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              A centralized University Management System that brings academic,
              administrative, and student services together in one structured
              digital environment.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/features"
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/15 transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-xl sm:w-auto"
              >
                Explore platform features
                <ArrowRight className="size-4" />
              </Link>

              <Link
                href="/programs"
                className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-border bg-background/80 px-6 text-sm font-semibold transition-colors hover:bg-accent sm:w-auto"
              >
                Explore academic programs
              </Link>
            </div>

            {/* ProductOverviewPanel */}
            <div className="mx-auto mt-16 max-w-3xl rounded-2xl border border-border/70 bg-card/80 p-4 text-left shadow-xl shadow-black/[0.04] backdrop-blur sm:mt-20 sm:p-6">
              <div className="flex items-center gap-3 border-b border-border/70 pb-4">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <LayoutDashboard className="size-5" />
                </div>

                <div>
                  <p className="font-semibold">One connected platform</p>
                  <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                    Designed around university workflows
                  </p>
                </div>

                <span className="ml-auto hidden rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary sm:inline-flex">
                  Unified experience
                </span>
              </div>

              <div className="grid gap-3 pt-4 sm:grid-cols-3">
                <div className="rounded-xl bg-muted/50 p-4">
                  <Users className="size-5 text-primary" />
                  <p className="mt-3 text-sm font-semibold">People</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Role-specific tools and access
                  </p>
                </div>

                <div className="rounded-xl bg-muted/50 p-4">
                  <BookOpen className="size-5 text-primary" />
                  <p className="mt-3 text-sm font-semibold">Academics</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Courses and academic records
                  </p>
                </div>

                <div className="rounded-xl bg-muted/50 p-4">
                  <ShieldCheck className="size-5 text-primary" />
                  <p className="mt-3 text-sm font-semibold">Operations</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Organized administrative workflows
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Purpose */}
      <section className="py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
                Our purpose
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Simplifying the moving parts of university life.
              </h2>
            </div>

            <p className="max-w-2xl text-base leading-8 text-muted-foreground lg:justify-self-end">
              University operations involve many interconnected
              responsibilities. This platform is designed to bring those
              workflows into a more organized environment, with tools shaped
              around the people who use them.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {purposeItems.map(item => {
              const Icon = item.icon;

              return (
                <article
                  key={item.number}
                  className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/[0.06] sm:p-7"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="size-6" />
                    </div>

                    <span className="text-sm font-semibold tracking-widest text-muted-foreground/50">
                      {item.number}
                    </span>
                  </div>

                  <h3 className="mt-6 text-lg font-semibold tracking-tight">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {item.description}
                  </p>

                  <div className="mt-6 h-1 w-12 rounded-full bg-primary/30 transition-all duration-300 group-hover:w-20 group-hover:bg-primary" />
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* UserRoles */}
      <section className="border-y bg-muted/25 py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
              Designed around people
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              The right experience for every role.
            </h2>

            <p className="mt-4 leading-7 text-muted-foreground">
              Each user has different responsibilities. Role-based experiences
              help keep the relevant tools and information organized.
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {userRoles.map(role => {
              const Icon = role.icon;

              return (
                <article
                  key={role.title}
                  className="flex flex-col rounded-2xl border border-border/70 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-7"
                >
                  <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-6" />
                  </div>

                  <h3 className="mt-5 text-xl font-semibold tracking-tight">
                    {role.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {role.description}
                  </p>

                  <ul className="mt-6 space-y-3 border-t border-border/70 pt-5">
                    {role.capabilities.map(capability => (
                      <li
                        key={capability}
                        className="flex items-center gap-2.5 text-sm"
                      >
                        <CheckCircle2 className="size-4 shrink-0 text-primary" />
                        <span>{capability}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ClosingCTA */}
      <section className="px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-primary px-6 py-6 text-primary-foreground shadow-xl shadow-primary/15 sm:px-12 sm:py-8 lg:px-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-32 size-80 rounded-full border-[40px] border-white/[0.08]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-36 right-1/3 size-72 rounded-full bg-white/[0.06] blur-2xl"
          />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold">
                <Sparkles className="size-3.5" />
                One connected academic experience
              </div>

              <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
                Explore a more organized approach to university management.
              </h2>

              <p className="mt-4 max-w-xl leading-7 text-primary-foreground/80">
                Discover the platform's capabilities and explore the academic
                programs available through the system.
              </p>
            </div>

            <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                href="/features"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-background px-5 text-sm font-semibold text-foreground transition-colors hover:bg-background/90"
              >
                Discover features
                <ArrowRight className="size-4" />
              </Link>

              <Link
                href="/programs"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-white/25 px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-white/10"
              >
                View programs
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
