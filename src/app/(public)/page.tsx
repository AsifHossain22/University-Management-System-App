'use client';

import { useQuery } from '@tanstack/react-query';
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
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 leading-7 text-muted-foreground">{description}</p>
    </div>
  );
}

function LoadingCards() {
  return (
    <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }, (_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-xl border bg-card p-6"
        >
          <div className="h-4 w-24 rounded bg-muted" />
          <div className="mt-4 h-6 w-3/4 rounded bg-muted" />
          <div className="mt-4 h-4 w-full rounded bg-muted" />
          <div className="mt-2 h-4 w-2/3 rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}

function SectionMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-10 rounded-xl border border-dashed p-8 text-center text-sm leading-6 text-muted-foreground">
      {children}
    </div>
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
      {/* HeroSection */}
      <section className="border-b">
        <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-12 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-12">
          <div className="mx-auto max-w-2xl">
            <div className="text-center lg:text-left">
              <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary">
                University Management System
              </p>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Manage your university operations with confidence.
              </h1>

              <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
                A modern platform designed to connect students, instructors and
                administrators through one centralized university management
                system.
              </p>
            </div>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <Link
                href="/login"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Get started
              </Link>

              <Link
                href="/features"
                className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-6 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Explore features
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl border bg-muted/40 p-8 shadow-sm">
              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                {[
                  {
                    title: 'Academic management',
                    subtitle: 'Students',
                  },
                  {
                    title: 'Teaching management',
                    subtitle: 'Instructors',
                  },
                  {
                    title: 'University operations',
                    subtitle: 'Administrators',
                  },
                ].map(item => (
                  <div
                    key={item.subtitle}
                    className="rounded-xl border bg-background p-5"
                  >
                    <p className="text-sm font-medium text-muted-foreground">
                      {item.subtitle}
                    </p>
                    <p className="mt-2 text-xl font-semibold">{item.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PublicProgramsSection */}
      <section className="border-b py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Explore academics"
            title="Discover our programs"
            description="Explore the academic programs available at our university."
          />

          {programsQuery.isPending ? (
            <LoadingCards />
          ) : programsQuery.isError ? (
            <SectionMessage>
              We couldn’t load the programs right now. Please refresh the page
              to try again.
            </SectionMessage>
          ) : programs.length === 0 ? (
            <SectionMessage>
              No active programs are available at the moment. Please check back
              soon.
            </SectionMessage>
          ) : (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {programs.map(program => (
                <article
                  key={program.id}
                  className="group rounded-xl border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="rounded-md bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      Program
                    </span>
                    <span className="text-xs font-medium text-muted-foreground">
                      {program.code}
                    </span>
                  </div>

                  <h3 className="mt-5 text-xl font-semibold tracking-tight">
                    {program.name}
                  </h3>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                    {program.description || 'Explore this academic program.'}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* PublicCoursesSection */}
      <section className="border-b bg-muted/30 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Learning opportunities"
            title="Explore our courses"
            description="Discover courses offered across our academic programs."
          />

          {coursesQuery.isPending ? (
            <LoadingCards />
          ) : coursesQuery.isError ? (
            <SectionMessage>
              We couldn’t load the courses right now. Please refresh the page to
              try again.
            </SectionMessage>
          ) : courses.length === 0 ? (
            <SectionMessage>
              No active courses are available at the moment. Please check back
              soon.
            </SectionMessage>
          ) : (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map(course => (
                <article
                  key={course.id}
                  className="rounded-xl border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="rounded-md bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      Course
                    </span>
                    <span className="text-xs font-medium text-muted-foreground">
                      {course.code}
                    </span>
                  </div>

                  <h3 className="mt-5 text-xl font-semibold tracking-tight">
                    {course.name}
                  </h3>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                    {course.description ||
                      'Explore the details of this course.'}
                  </p>

                  <p className="mt-5 text-sm font-medium text-muted-foreground">
                    {course.credits}{' '}
                    {course.credits === 1 ? 'credit' : 'credits'}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FeatureSection */}
      <section className="border-b py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Core capabilities"
            title="Everything you need to manage university operations"
            description="A centralized system for academic management, administration, communication and student services."
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(feature => (
              <article
                key={feature.title}
                className="rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* RoleBasedExperience */}
      <section className="border-b bg-muted/30 py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Built for every role"
            title="One platform, three focused experiences"
            description="Each role gets access to the tools and information needed to perform its responsibilities effectively."
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {roles.map(role => (
              <article
                key={role.title}
                className="rounded-xl border bg-card p-6 shadow-sm"
              >
                <h3 className="text-xl font-semibold">{role.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {role.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CallToAction */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to manage your university experience?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Access the university management platform and stay connected with
            everything you need for your academic journey.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Login
            </Link>

            <Link
              href="/features"
              className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-6 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Explore the system
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
