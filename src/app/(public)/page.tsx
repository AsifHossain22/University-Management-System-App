'use client';

import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  LayoutDashboard,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { features, roles } from '../data/data';
import apiClient from '@/lib/apiClient';
import type { ApiResponse } from '@/types/auth.type';
import type { Program } from '@/types/program.type';
import type { Course } from '@/types/course.type';

type PublicListResponse<T> = ApiResponse<T[]> & {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

async function getPublicPrograms() {
  return apiClient<PublicListResponse<Program>>('/programs/public', {
    query: { page: 1, limit: 6, sortBy: 'name', sortOrder: 'asc' },
  });
}

async function getPublicCourses() {
  return apiClient<PublicListResponse<Course>>('/courses/public', {
    query: { page: 1, limit: 6, sortBy: 'name', sortOrder: 'asc' },
  });
}

const featureIcons = [
  ShieldCheck,
  BookOpen,
  Users,
  CalendarCheck,
  ClipboardCheck,
  LayoutDashboard,
];

const roleIcons = [GraduationCap, BookOpen, ShieldCheck];

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
    <div className="mx-auto max-w-2xl text-center">
      <span className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1.5 text-xs font-semibold tracking-wide text-primary shadow-sm">
        <Sparkles className="size-3.5" />
        {eyebrow}
      </span>

      <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
        {title}
      </h2>

      <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
        {description}
      </p>
    </div>
  );
}

function LoadingCards() {
  return (
    <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }, (_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-2xl border bg-card p-6"
        >
          <div className="size-12 rounded-xl bg-muted" />
          <div className="mt-6 h-5 w-2/3 rounded bg-muted" />
          <div className="mt-4 h-3 w-full rounded bg-muted" />
          <div className="mt-2 h-3 w-4/5 rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}

function SectionMessage({
  children,
  onRetry,
}: {
  children: React.ReactNode;
  onRetry?: () => void;
}) {
  return (
    <div className="mt-12 rounded-2xl border border-dashed bg-card/50 px-6 py-12 text-center">
      <p className="text-sm leading-6 text-muted-foreground">{children}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-lg px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Try again
        </button>
      )}
    </div>
  );
}

function SectionLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {children}
      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
    </Link>
  );
}

export default function HomePage() {
  const programsQuery = useQuery({
    queryKey: ['public-home-programs'],
    queryFn: getPublicPrograms,
    retry: 1,
    staleTime: 60_000,
  });

  const coursesQuery = useQuery({
    queryKey: ['public-home-courses'],
    queryFn: getPublicCourses,
    retry: 1,
    staleTime: 60_000,
  });

  const programs = programsQuery.data?.data ?? [];
  const courses = coursesQuery.data?.data ?? [];

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden border-b">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-primary/[0.09] via-background to-background"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-32 -z-10 size-96 rounded-full bg-primary/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 left-1/4 -z-10 size-72 rounded-full bg-primary/[0.07] blur-3xl"
        />

        <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 py-10 sm:px-6 sm:py-12 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-14">
          <div className="max-w-2xl mx-auto text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/80 px-3.5 py-2 text-xs font-semibold text-primary shadow-sm sm:text-sm">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/50" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
              One platform. Every academic need.
            </div>

            <h1 className="mt-7 text-3xl font-bold leading-[1.12] tracking-tight sm:text-4xl md:text-5xl">
              A smarter way to <span className="text-primary">manage</span>{' '}
              university life.
            </h1>

            <p className="mt-6 max-w-xl mx-auto lg:mx-left text-base leading-8 text-muted-foreground sm:text-lg">
              Bring students, instructors and administrators together with one
              connected platform for academic management and university
              operations.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row md:justify-center lg:justify-start">
              <Link
                href="/login"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Get started
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/programs"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border bg-background/80 px-6 text-sm font-semibold transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Explore programs
                <ArrowUpRight className="size-4" />
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-5 gap-y-3 text-sm text-muted-foreground md:justify-center lg:justify-start">
              {[
                'Centralized academic records',
                'Role-based access',
                'Connected workflows',
              ].map(item => (
                <span key={item} className="inline-flex items-center gap-2">
                  <CheckCircle2 className="size-4 shrink-0 text-primary" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* DashboardInspiredVisualBuiltWithRealUIComponents */}
          <div className="relative mx-auto w-full max-w-xl">
            <div
              aria-hidden="true"
              className="absolute -inset-4 -z-10 rounded-[2rem] bg-primary/10 blur-2xl"
            />

            <div className="overflow-hidden rounded-2xl border bg-card shadow-2xl shadow-primary/10 sm:rounded-3xl">
              <div className="flex items-center justify-between border-b px-5 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <GraduationCap className="size-5" />
                  </div>
                  <div>
                    <p className="font-semibold tracking-tight">
                      University Portal
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Academic workspace
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  Connected
                </span>
              </div>

              <div className="p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Your academic workspace
                    </p>
                    <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
                      Everything in one place.
                    </h2>
                  </div>
                  <div className="hidden size-11 items-center justify-center rounded-xl border bg-muted/40 sm:flex">
                    <LayoutDashboard className="size-5 text-primary" />
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  {[
                    {
                      icon: BookOpen,
                      label: 'Academics',
                      detail: 'Programs & courses',
                    },
                    {
                      icon: Users,
                      label: 'Community',
                      detail: 'Students & faculty',
                    },
                    {
                      icon: CalendarCheck,
                      label: 'Attendance',
                      detail: 'Academic tracking',
                    },
                    {
                      icon: ShieldCheck,
                      label: 'Administration',
                      detail: 'Secure workflows',
                    },
                  ].map(item => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.label}
                        className="rounded-xl border bg-background p-4 transition-colors hover:bg-muted/40 sm:p-5"
                      >
                        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Icon className="size-5" />
                        </div>
                        <p className="mt-4 text-sm font-semibold">
                          {item.label}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                          {item.detail}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 flex items-center gap-3 rounded-xl border border-primary/15 bg-primary/[0.05] p-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Sparkles className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">
                      Designed around your role
                    </p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      Focused tools for students, instructors and
                      administrators.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t bg-muted/20 px-5 py-3.5 text-xs text-muted-foreground sm:px-6">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-primary" />
                  One connected experience
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-primary" />
                  Built for academic workflows
                </span>
              </div>
            </div>

            <div className="absolute -bottom-2 -left-2 hidden items-center gap-3 rounded-2xl border bg-card p-3.5 shadow-xl lg:-left-7">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">Role-based access</p>
                <p className="text-xs text-muted-foreground">
                  The right tools for each role
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Explore academics"
            title="Find your field of study"
            description="Explore the academic programs available through our university platform."
          />

          {programsQuery.isPending ? (
            <LoadingCards />
          ) : programsQuery.isError ? (
            <SectionMessage onRetry={() => programsQuery.refetch()}>
              We couldn’t load the programs right now. Please try again.
            </SectionMessage>
          ) : programs.length === 0 ? (
            <SectionMessage>
              No active programs are available at the moment. Please check back
              soon.
            </SectionMessage>
          ) : (
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {programs.map(program => (
                <article
                  key={program.id}
                  className="group flex h-full flex-col rounded-2xl border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/[0.06]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <GraduationCap className="size-5" />
                    </div>
                    <span className="rounded-lg border bg-muted/30 px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                      {program.code}
                    </span>
                  </div>

                  <h3 className="mt-6 text-xl font-bold tracking-tight">
                    {program.name}
                  </h3>

                  <p className="mt-3 flex-1 text-sm leading-7 text-muted-foreground">
                    {program.description || 'Explore this academic program.'}
                  </p>

                  <div className="mt-6 border-t pt-4">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                      Academic program
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="mt-10 text-center">
            <SectionLink href="/programs">Explore all programs</SectionLink>
          </div>
        </div>
      </section>

      {/* Courses */}
      <section className="border-y bg-muted/20 py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Learning opportunities"
            title="Explore the courses"
            description="Discover courses offered across the university's active academic catalog."
          />

          {coursesQuery.isPending ? (
            <LoadingCards />
          ) : coursesQuery.isError ? (
            <SectionMessage onRetry={() => coursesQuery.refetch()}>
              We couldn’t load the courses right now. Please try again.
            </SectionMessage>
          ) : courses.length === 0 ? (
            <SectionMessage>
              No active courses are available at the moment. Please check back
              soon.
            </SectionMessage>
          ) : (
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map(course => (
                <article
                  key={course.id}
                  className="group rounded-2xl border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/[0.06]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <BookOpen className="size-5" />
                    </div>
                    <span className="rounded-lg border bg-muted/30 px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                      {course.code}
                    </span>
                  </div>

                  <h3 className="mt-6 text-xl font-bold tracking-tight">
                    {course.name}
                  </h3>

                  <p className="mt-3 line-clamp-3 text-sm leading-7 text-muted-foreground">
                    {course.description ||
                      'Explore the details of this course.'}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t pt-4">
                    <span className="text-sm font-medium text-muted-foreground">
                      {course.credits}{' '}
                      {course.credits === 1 ? 'credit' : 'credits'}
                    </span>
                    <BookOpen className="size-4 text-primary/70" />
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Core capabilities"
            title="Everything connected. Nothing scattered."
            description="A centralized platform that brings essential university workflows into one organized experience."
          />

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = featureIcons[index % featureIcons.length];

              return (
                <article
                  key={feature.title}
                  className="group rounded-2xl border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
                >
                  <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="size-5" />
                  </div>

                  <h3 className="mt-5 text-lg font-bold tracking-tight">
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

      {/* RoleBasedExperiences */}
      <section className="border-y bg-muted/20 py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Built for every role"
            title="One platform, tailored experiences"
            description="Give every member of the university community a focused workspace for their responsibilities."
          />

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {roles.map((role, index) => {
              const Icon = roleIcons[index % roleIcons.length];

              return (
                <article
                  key={role.title}
                  className="group relative overflow-hidden rounded-2xl border bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
                >
                  <div
                    aria-hidden="true"
                    className="absolute -right-10 -top-10 size-32 rounded-full bg-primary/[0.06] transition-transform duration-500 group-hover:scale-150"
                  />

                  <div className="relative">
                    <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Icon className="size-7" />
                    </div>

                    <h3 className="mt-6 text-xl font-bold tracking-tight">
                      {role.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      {role.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* CallToAction */}
      <section className="px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-primary px-6 py-7 text-center text-primary-foreground shadow-2xl shadow-primary/15 sm:px-12 sm:py-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-32 size-72 rounded-full border border-primary-foreground/10"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-40 -left-20 size-96 rounded-full border border-primary-foreground/10"
          />

          <div className="relative mx-auto max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3.5 py-2 text-xs font-semibold sm:text-sm">
              <Sparkles className="size-4" />
              Your university, better connected
            </span>

            <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Ready for a smarter academic experience?
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-primary-foreground/80 sm:text-base sm:leading-8">
              Access your university workspace and bring academic information,
              everyday tasks and essential workflows together.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-background px-6 text-sm font-semibold text-foreground transition-colors hover:bg-background/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
              >
                Access your workspace
                <ArrowRight className="size-4" />
              </Link>

              <Link
                href="/features"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-primary-foreground/25 px-6 text-sm font-semibold transition-colors hover:bg-primary-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background"
              >
                Discover features
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
