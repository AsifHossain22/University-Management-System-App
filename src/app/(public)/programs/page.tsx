'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
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

  return (
    <>
      {/* PageHeading */}
      <section className="border-b py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Academic programs
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Explore structured academic programs
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Explore available programs and discover how departments, courses,
            semesters and sections come together to organize the
            university&apos;s academic experience.
          </p>
        </div>
      </section>

      {/* ProgramsFromPublicAPI */}
      <section className="border-b py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Available programs
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Find an academic pathway
            </h2>

            <p className="mt-4 text-muted-foreground">
              Browse programs currently available through the university
              management system.
            </p>
          </div>

          {programsQuery.isPending ? (
            <div
              className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              role="status"
              aria-label="Loading academic programs"
            >
              {Array.from({ length: 6 }, (_, index) => (
                <div
                  key={index}
                  className="animate-pulse rounded-xl border bg-card p-6"
                >
                  <div className="h-4 w-20 rounded bg-muted" />
                  <div className="mt-4 h-6 w-3/4 rounded bg-muted" />
                  <div className="mt-4 h-4 w-full rounded bg-muted" />
                  <div className="mt-2 h-4 w-5/6 rounded bg-muted" />
                </div>
              ))}
            </div>
          ) : programsQuery.isError ? (
            <div className="mt-10 rounded-xl border p-8 text-center">
              <h3 className="text-lg font-semibold">
                Programs are temporarily unavailable
              </h3>

              <p className="mt-2 text-sm text-muted-foreground">
                We couldn&apos;t load the program list. Please try again.
              </p>

              <button
                type="button"
                onClick={() => programsQuery.refetch()}
                className="mt-5 inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Try again
              </button>
            </div>
          ) : programs.length === 0 ? (
            <div className="mt-10 rounded-xl border p-8 text-center">
              <h3 className="text-lg font-semibold">
                No programs available yet
              </h3>

              <p className="mt-2 text-sm text-muted-foreground">
                Please check back later for available academic programs.
              </p>
            </div>
          ) : (
            <>
              <p className="mt-8 text-sm text-muted-foreground">
                {programsQuery.data?.meta.total ?? programs.length}{' '}
                {(programsQuery.data?.meta.total ?? programs.length) === 1
                  ? 'program'
                  : 'programs'}{' '}
                available
              </p>

              <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {programs.map(program => (
                  <article
                    key={program.id}
                    className="rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <span className="inline-flex rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                      {program.code}
                    </span>

                    <h3 className="mt-4 text-xl font-semibold">
                      {program.name}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {program.description?.trim() ||
                        'Explore this academic program and its associated courses.'}
                    </p>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ProgramAreas */}
      <section className="border-b bg-muted/30 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Program areas
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Academic pathways across disciplines
            </h2>

            <p className="mt-4 text-muted-foreground">
              Different academic areas can be organized within a common
              university management structure.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {programAreas.map(area => (
              <article
                key={area.title}
                className="rounded-xl border bg-card p-6 shadow-sm"
              >
                <h3 className="text-xl font-semibold">{area.title}</h3>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {area.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* AcademicStructure */}
      <section className="border-b py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Academic structure
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              From departments to course sections
            </h2>

            <p className="mt-4 text-muted-foreground">
              A structured academic hierarchy helps keep university data
              connected and easier to manage.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {academicSteps.map(step => (
              <article
                key={step.number}
                className="rounded-xl border bg-card p-6 shadow-sm"
              >
                <span className="text-sm font-semibold text-primary">
                  {step.number}
                </span>

                <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* AcademicExperience */}
      <section className="border-b bg-muted/30 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Academic experience
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              More than a list of programs
            </h2>

            <p className="mt-4 text-muted-foreground">
              Academic programs connect to wider university workflows for
              students and instructors throughout the academic journey.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {academicExperience.map(item => (
              <article
                key={item.title}
                className="rounded-xl border bg-card p-6 text-center shadow-sm"
              >
                <h3 className="text-lg font-semibold">{item.title}</h3>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CallToAction */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Explore the platform
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            See how the complete system works
          </h2>

          <p className="mt-4 text-muted-foreground">
            Discover how academic and administrative workflows work together in
            one university management system.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/features"
              className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-6 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Explore features
            </Link>

            <Link
              href="/login"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Login
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
