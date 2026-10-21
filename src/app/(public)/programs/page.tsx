'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight,
  BookOpen,
  Building2,
  CheckCircle2,
  GraduationCap,
  Layers3,
  Network,
  Sparkles,
} from 'lucide-react';
import {
  academicExperience,
  academicSteps,
  programAreas,
} from '@/app/data/data';
import apiClient from '@/lib/apiClient';
import type { ApiResponse } from '@/types/auth.type';
import type { Program } from '@/types/program.type';

type PublicProgramsResponse = ApiResponse<Program[]> & {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

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

export default function ProgramsPage() {
  const programsQuery = useQuery({
    queryKey: ['public-programs-page'],
    queryFn: () =>
      apiClient<PublicProgramsResponse>('/programs/public', {
        query: {
          page: 1,
          limit: 100,
          sortBy: 'name',
          sortOrder: 'asc',
        },
      }),
    retry: 1,
    staleTime: 60_000,
  });

  const programs = programsQuery.data?.data ?? [];
  const totalPrograms = programsQuery.data?.meta.total ?? programs.length;

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden border-b">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/15 via-background to-background"
        />

        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-10 sm:px-6 sm:py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16 lg:px-8 lg:py-14">
          <div className="text-center lg:text-left">
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
              <GraduationCap className="size-4" aria-hidden="true" />
              Discover your academic pathway
            </p>

            <h1 className="mt-7 max-w-2xl mx-auto lg:mx-start text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl lg:leading-[1.1]">
              Explore programs.
              <span className="mt-2 block bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                Shape your future.
              </span>
            </h1>

            <p className="mt-6 max-w-xl mx-auto lg:mx-0 text-base leading-8 text-muted-foreground sm:text-lg">
              Discover the academic programs available through the university
              and explore how courses, semesters and sections fit together into
              a structured learning experience.
            </p>

            <div className="mt-9 flex flex-col justify-center lg:justify-start gap-3 sm:flex-row">
              <a
                href="#available-programs"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/15 transition hover:opacity-90"
              >
                Browse programs
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>

              <Link
                href="/features"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border bg-background/70 px-6 py-3 text-sm font-semibold transition hover:bg-muted"
              >
                Explore platform features
              </Link>
            </div>

            <div className="mt-10 flex justify-center lg:justify-start flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2
                  className="size-4 text-primary"
                  aria-hidden="true"
                />
                Structured academic pathways
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2
                  className="size-4 text-primary"
                  aria-hidden="true"
                />
                Connected course structure
              </span>
            </div>
          </div>

          {/* AcademicOverviewVisual */}
          <div className="relative mx-auto w-full max-w-xl">
            <div
              aria-hidden="true"
              className="absolute -inset-5 -z-10 rounded-[2rem] bg-gradient-to-br from-primary/20 via-blue-500/10 to-transparent blur-2xl"
            />

            <div className="overflow-hidden rounded-3xl border bg-card shadow-2xl shadow-primary/5">
              <div className="flex items-center gap-3 border-b px-5 py-5 sm:px-6">
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Building2 className="size-5" aria-hidden="true" />
                </div>

                <div>
                  <h2 className="font-semibold">Academic framework</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    A connected university structure
                  </p>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-5">
                  <p className="text-sm text-muted-foreground">
                    From the big picture to the classroom
                  </p>
                  <p className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                    One connected academic journey
                  </p>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    Academic structures connect programs, courses, semesters and
                    course sections.
                  </p>
                </div>

                <div className="mt-5 space-y-3">
                  {[
                    {
                      number: '01',
                      title: 'Departments',
                      description: 'Organize academic disciplines',
                      icon: Building2,
                    },
                    {
                      number: '02',
                      title: 'Programs',
                      description: 'Group courses into pathways',
                      icon: GraduationCap,
                    },
                    {
                      number: '03',
                      title: 'Courses & sections',
                      description: 'Structure teaching and enrollment',
                      icon: BookOpen,
                    },
                  ].map(item => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.number}
                        className="flex items-center gap-4 rounded-2xl border p-4 transition hover:border-primary/30 hover:bg-muted/30"
                      >
                        <span className="text-xs font-semibold tabular-nums text-muted-foreground">
                          {item.number}
                        </span>

                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Icon className="size-5" aria-hidden="true" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="font-semibold">{item.title}</p>
                          <p className="mt-1 text-xs leading-5 text-muted-foreground">
                            {item.description}
                          </p>
                        </div>

                        <ArrowRight
                          className="size-4 shrink-0 text-muted-foreground"
                          aria-hidden="true"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LiveProgramsFromPublicAPI */}
      <section
        id="available-programs"
        className="scroll-mt-24 border-b py-10 sm:py-12"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Available programs"
            title="Find your academic pathway"
            description="Explore the programs currently published by the university. Each listing is loaded from the live public programs API."
          />

          {!programsQuery.isPending &&
            !programsQuery.isError &&
            programs.length > 0 && (
              <div className="mt-10 flex flex-col gap-3 rounded-2xl border bg-muted/30 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Layers3 className="size-5" aria-hidden="true" />
                  </div>

                  <div>
                    <p className="font-semibold">Published academic programs</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Browse the currently available program listings.
                    </p>
                  </div>
                </div>

                <p className="text-sm font-medium text-muted-foreground">
                  <span className="text-2xl font-bold tabular-nums text-foreground">
                    {totalPrograms}
                  </span>{' '}
                  {totalPrograms === 1 ? 'program' : 'programs'} available
                </p>
              </div>
            )}

          {programsQuery.isPending ? (
            <div
              className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
              role="status"
              aria-label="Loading academic programs"
            >
              {Array.from({ length: 6 }, (_, index) => (
                <div
                  key={index}
                  className="animate-pulse rounded-2xl border bg-card p-6 sm:p-7"
                >
                  <div className="flex items-center justify-between">
                    <div className="size-12 rounded-xl bg-muted" />
                    <div className="h-5 w-20 rounded-full bg-muted" />
                  </div>
                  <div className="mt-6 h-6 w-3/4 rounded bg-muted" />
                  <div className="mt-4 h-4 w-full rounded bg-muted" />
                  <div className="mt-2 h-4 w-5/6 rounded bg-muted" />
                  <div className="mt-7 h-4 w-28 rounded bg-muted" />
                </div>
              ))}
              <span className="sr-only">Loading academic programs...</span>
            </div>
          ) : programsQuery.isError ? (
            <div className="mt-12 rounded-3xl border bg-card px-6 py-12 text-center sm:px-10">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                <BookOpen className="size-6" aria-hidden="true" />
              </div>

              <h3 className="mt-5 text-xl font-semibold">
                Programs are temporarily unavailable
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
                We couldn&apos;t load the program list. Check your connection
                and try again.
              </p>

              <button
                type="button"
                onClick={() => programsQuery.refetch()}
                className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Try again
                <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            </div>
          ) : programs.length === 0 ? (
            <div className="mt-12 rounded-3xl border bg-card px-6 py-12 text-center sm:px-10">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <GraduationCap className="size-6" aria-hidden="true" />
              </div>

              <h3 className="mt-5 text-xl font-semibold">
                No programs available yet
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
                There are currently no programs to display. Please check back
                later for new academic opportunities.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3">
              {programs.map((program, index) => (
                <article
                  key={program.id}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card p-6 transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 sm:p-7"
                >
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-primary to-blue-500 transition-transform duration-300 group-hover:scale-x-100"
                  />

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                      <GraduationCap className="size-6" aria-hidden="true" />
                    </div>

                    <span className="rounded-full border bg-muted/40 px-3 py-1 text-xs font-semibold text-muted-foreground">
                      {program.code}
                    </span>
                  </div>

                  <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                    Academic program {String(index + 1).padStart(2, '0')}
                  </p>

                  <h3 className="mt-2 text-xl font-bold tracking-tight sm:text-2xl">
                    {program.name}
                  </h3>

                  <p className="mt-3 flex-1 text-sm leading-7 text-muted-foreground">
                    {program.description?.trim() ||
                      'Explore this academic program and its associated courses.'}
                  </p>

                  <div className="mt-6 border-t pt-5">
                    <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                      <BookOpen className="size-4" aria-hidden="true" />
                      <span>Academic pathway</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ProgramAreas */}
      <section className="border-b bg-muted/30 py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Program areas"
            title="Academic pathways across disciplines"
            description="Different academic areas can be organized within a shared university management structure."
          />

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-16">
            {programAreas.map((area, index) => (
              <article
                key={area.title}
                className="group flex gap-5 rounded-2xl border bg-card p-6 transition duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 sm:p-7"
              >
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                  {index % 2 === 0 ? (
                    <Building2 className="size-5" aria-hidden="true" />
                  ) : (
                    <Network className="size-5" aria-hidden="true" />
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold tracking-tight sm:text-xl">
                    {area.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {area.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* AcademicStructure */}
      <section className="border-b py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Academic structure"
            title="From departments to course sections"
            description="A clear academic hierarchy helps connect university information and organize the learning experience."
          />

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
            {academicSteps.map((step, index) => (
              <article
                key={step.number}
                className="group rounded-2xl border bg-card p-6 transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 sm:p-7"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold tabular-nums text-primary">
                    {step.number}
                  </span>

                  <div className="flex size-10 items-center justify-center rounded-xl bg-muted/70 text-muted-foreground transition group-hover:bg-primary/10 group-hover:text-primary">
                    {index === 0 ? (
                      <Building2 className="size-5" aria-hidden="true" />
                    ) : index === 1 ? (
                      <GraduationCap className="size-5" aria-hidden="true" />
                    ) : (
                      <Layers3 className="size-5" aria-hidden="true" />
                    )}
                  </div>
                </div>

                <h3 className="mt-6 text-lg font-semibold tracking-tight">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* AcademicExperience */}
      <section className="border-b bg-muted/30 py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Academic experience"
            title="More than a list of programs"
            description="Academic programs connect with the wider workflows that support students and instructors throughout the university experience."
          />

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
            {academicExperience.map(item => (
              <article
                key={item.title}
                className="group rounded-2xl border bg-card p-6 transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                  <CheckCircle2 className="size-5" aria-hidden="true" />
                </div>

                <h3 className="mt-5 text-lg font-semibold tracking-tight">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ClosingCTA */}
      <section className="px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
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
                Your university, connected
              </p>

              <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
                Explore what the platform can do
              </h2>

              <p className="mt-4 max-w-xl leading-7 text-primary-foreground/80">
                Discover how academic management, student services and
                administrative workflows work together in one system.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                href="/features"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-background px-5 py-3 text-sm font-semibold text-foreground transition hover:opacity-90"
              >
                Explore features
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>

              <Link
                href="/login"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-primary-foreground/25 px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-foreground/10"
              >
                Sign in to the platform
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
