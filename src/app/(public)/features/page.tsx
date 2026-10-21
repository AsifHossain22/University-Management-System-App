import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  ClipboardCheck,
  CreditCard,
  FileText,
  GraduationCap,
  Layers3,
  LockKeyhole,
  Network,
  ShieldCheck,
  Sparkles,
  Users,
  Wallet,
  Workflow,
} from 'lucide-react';

const academicFeatures = [
  {
    icon: BookOpen,
    title: 'Courses & Sections',
    description:
      'Organize courses, prerequisites, semesters, sections, instructor assignments and enrollment capacity.',
    tag: 'Academic structure',
  },
  {
    icon: ClipboardCheck,
    title: 'Course Registration',
    description:
      'Maintain structured enrollment records and connect students with their registered course sections.',
    tag: 'Enrollment',
  },
  {
    icon: CalendarCheck,
    title: 'Attendance Tracking',
    description:
      'Record and monitor student attendance across registered courses and assigned sections.',
    tag: 'Class management',
  },
  {
    icon: FileText,
    title: 'Examinations',
    description:
      'Organize examination records and connect assessments with courses and academic sections.',
    tag: 'Assessment',
  },
  {
    icon: GraduationCap,
    title: 'Academic Results',
    description:
      'Keep student examination results organized and accessible through structured academic records.',
    tag: 'Performance',
  },
  {
    icon: Users,
    title: 'Academic Profiles',
    description:
      'Maintain student and instructor information in dedicated profiles linked to the university.',
    tag: 'People & profiles',
  },
];

const administrationFeatures = [
  {
    icon: Users,
    title: 'User Management',
    description:
      'Manage student, instructor and administrator accounts with role-based access.',
  },
  {
    icon: Network,
    title: 'Departments & Programs',
    description:
      'Organize academic departments and programs into a connected university structure.',
  },
  {
    icon: Wallet,
    title: 'Fees & Payments',
    description:
      'Manage student fee records and payment workflows in a centralized system.',
  },
  {
    icon: ClipboardCheck,
    title: 'Audit Records',
    description:
      'Keep audit information available for important administrative and system activities.',
  },
  {
    icon: LockKeyhole,
    title: 'Access Control',
    description:
      'Support secure workflows through authentication, authorization and role permissions.',
  },
  {
    icon: Layers3,
    title: 'Connected Records',
    description:
      'Keep academic and administrative information structured and connected across the platform.',
  },
];

const roleExperiences = [
  {
    icon: GraduationCap,
    role: 'Student',
    subtitle: 'Your academic journey',
    description:
      'Access essential academic information and keep track of your university activities.',
    features: [
      'Course registration',
      'Attendance and results',
      'Fee and payment information',
      'Personal academic profile',
    ],
    accent: 'from-blue-500/15 to-cyan-500/5',
  },
  {
    icon: BookOpen,
    role: 'Instructor',
    subtitle: 'Your teaching workspace',
    description:
      'Work with assigned sections and manage the academic activities connected to your teaching.',
    features: [
      'Assigned sections and students',
      'Attendance management',
      'Examinations and results',
      'Academic statistics',
    ],
    accent: 'from-violet-500/15 to-purple-500/5',
  },
  {
    icon: ShieldCheck,
    role: 'Administrator',
    subtitle: 'Your operations center',
    description:
      'Coordinate university operations and manage the records that support the institution.',
    features: [
      'User and role management',
      'Departments and programs',
      'Fees and payment workflows',
      'Administrative records',
    ],
    accent: 'from-emerald-500/15 to-teal-500/5',
  },
];

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
        <Sparkles className="size-3.5" aria-hidden="true" />
        {eyebrow}
      </p>

      <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
        {title}
      </h2>

      <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
        {description}
      </p>
    </div>
  );
}

export default function FeaturesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden border-b">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/15 via-background to-background"
        />

        <div className="mx-auto grid max-w-7xl gap-14 px-4 py-10 sm:px-6 sm:py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16 lg:px-8 lg:py-14">
          <div className="text-center lg:text-left">
            <p className="inline-flex justify-center lg:justify-start items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
              <Sparkles className="size-4" aria-hidden="true" />
              One platform. Connected workflows.
            </p>

            <h1 className="mt-7 max-w-2xl mx-auto lg:mx-start text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl lg:leading-[1.1]">
              Everything your university needs,{' '}
              <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                working together.
              </span>
            </h1>

            <p className="mt-6 max-w-xl mx-auto lg:mx-0 text-base leading-8 text-muted-foreground sm:text-lg">
              Bring academic management, student services, administration and
              financial workflows into one connected University Management
              System.
            </p>

            <div className="mt-9 flex flex-col justify-center lg:justify-start gap-3 sm:flex-row">
              <Link
                href="/programs"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/15 transition hover:opacity-90"
              >
                Explore programs
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>

              <Link
                href="/about"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border bg-background/70 px-6 py-3 text-sm font-semibold transition hover:bg-muted"
              >
                About the platform
              </Link>
            </div>

            <div className="mt-10 flex justify-center lg:justify-start flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2
                  className="size-4 text-primary"
                  aria-hidden="true"
                />
                Role-based workspaces
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2
                  className="size-4 text-primary"
                  aria-hidden="true"
                />
                Connected academic records
              </span>
            </div>
          </div>

          {/* PlatformOverviewVisual */}
          <div className="relative mx-auto w-full max-w-xl">
            <div
              aria-hidden="true"
              className="absolute -inset-5 -z-10 rounded-[2rem] bg-gradient-to-br from-primary/20 via-blue-500/10 to-transparent blur-2xl"
            />

            <div className="overflow-hidden rounded-3xl border bg-card shadow-2xl shadow-primary/5">
              <div className="flex items-center justify-between border-b px-5 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <GraduationCap className="size-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-semibold">University Management</p>
                    <p className="text-xs text-muted-foreground">
                      Connected academic workspace
                    </p>
                  </div>
                </div>

                <span className="rounded-full border bg-muted/50 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                  Overview
                </span>
              </div>

              <div className="space-y-5 p-5 sm:p-6">
                <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-5">
                  <p className="text-sm text-muted-foreground">
                    One connected ecosystem
                  </p>
                  <p className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                    Built around your university
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Bring people, academic processes and administration into a
                    consistent workflow.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border p-4 transition hover:border-primary/40">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      <BookOpen className="size-5" aria-hidden="true" />
                    </div>
                    <p className="mt-4 font-semibold">Academics</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      Courses, attendance and results
                    </p>
                  </div>

                  <div className="rounded-2xl border p-4 transition hover:border-primary/40">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
                      <Users className="size-5" aria-hidden="true" />
                    </div>
                    <p className="mt-4 font-semibold">People</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      Students and instructors
                    </p>
                  </div>

                  <div className="rounded-2xl border p-4 transition hover:border-primary/40">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <CreditCard className="size-5" aria-hidden="true" />
                    </div>
                    <p className="mt-4 font-semibold">Finance</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      Fees and payment records
                    </p>
                  </div>

                  <div className="rounded-2xl border p-4 transition hover:border-primary/40">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                      <ShieldCheck className="size-5" aria-hidden="true" />
                    </div>
                    <p className="mt-4 font-semibold">Administration</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      Roles and operations
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border bg-muted/30 p-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Workflow className="size-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">
                      A more connected workflow
                    </p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      Organized around the needs of each university role.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AcademicManagement */}
      <section className="border-b py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Academic management"
            title="Manage the complete academic workflow"
            description="Bring the core academic activities of your university into an organized system, from course structures to student results."
          />

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
            {academicFeatures.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className="group relative overflow-hidden rounded-2xl border bg-card p-6 transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 sm:p-7"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="size-5" aria-hidden="true" />
                    </div>
                    <span className="text-sm font-semibold tabular-nums text-muted-foreground/60">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-primary">
                    {feature.tag}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Administration */}
      <section className="border-b bg-muted/30 py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Administration & operations"
            title="Keep university operations organized"
            description="Support the operational side of your institution with tools for user management, academic structures, financial workflows, and controlled access."
          />

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
            {administrationFeatures.map(feature => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className="group flex gap-4 rounded-2xl border bg-card p-6 transition duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 sm:p-7"
                >
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border bg-muted/50 text-primary transition group-hover:border-primary/20 group-hover:bg-primary/10">
                    <Icon className="size-5" aria-hidden="true" />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* RoleBasedExperience */}
      <section className="py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Role-based experience"
            title="A workspace for every role"
            description="Students, instructors, and administrators have different responsibilities. The platform organizes its workflows around those needs."
          />

          <div className="mt-12 grid gap-5 md:grid-cols-3 lg:mt-16">
            {roleExperiences.map(experience => {
              const Icon = experience.icon;

              return (
                <article
                  key={experience.role}
                  className="group overflow-hidden rounded-2xl border bg-card transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5"
                >
                  <div
                    className={`bg-gradient-to-br ${experience.accent} p-6 sm:p-7`}
                  >
                    <div className="flex size-14 items-center justify-center rounded-2xl border bg-background/80 text-primary shadow-sm">
                      <Icon className="size-7" aria-hidden="true" />
                    </div>

                    <p className="mt-6 text-sm font-medium text-muted-foreground">
                      {experience.subtitle}
                    </p>
                    <h3 className="mt-1 text-2xl font-bold tracking-tight">
                      {experience.role}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      {experience.description}
                    </p>
                  </div>

                  <div className="p-6 sm:p-7">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Key capabilities
                    </p>

                    <ul className="mt-5 space-y-3">
                      {experience.features.map(item => (
                        <li
                          key={item}
                          className="flex items-start gap-3 text-sm leading-6"
                        >
                          <CheckCircle2
                            className="mt-1 size-4 shrink-0 text-primary"
                            aria-hidden="true"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ClosingCTA */}
      <section className="px-4 pb-20 sm:px-6 sm:pb-24 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-primary text-primary-foreground">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-28 size-80 rounded-full border border-primary-foreground/10"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-8 -top-16 size-56 rounded-full border border-primary-foreground/10"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 -left-12 size-72 rounded-full bg-primary-foreground/5 blur-2xl"
          />

          <div className="relative grid gap-8 p-8 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center lg:p-14">
            <div className="max-w-2xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider">
                <GraduationCap className="size-4" aria-hidden="true" />
                Built for connected education
              </p>

              <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to explore the platform?
              </h2>

              <p className="mt-4 max-w-xl leading-7 text-primary-foreground/80">
                Discover the academic programs and see how the University
                Management System brings essential university workflows
                together.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                href="/programs"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-background px-5 py-3 text-sm font-semibold text-foreground transition hover:opacity-90"
              >
                Browse programs
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>

              <Link
                href="/about"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-primary-foreground/25 px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-foreground/10"
              >
                Learn about us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
