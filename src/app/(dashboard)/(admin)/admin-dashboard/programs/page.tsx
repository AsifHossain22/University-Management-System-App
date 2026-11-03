'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Search,
  XCircle,
} from 'lucide-react';
import ProgramForm from '@/components/admin/program-form';
import { useDepartments } from '@/hooks/department.hook';
import { usePrograms } from '@/hooks/program.hook';

export default function AdminProgramsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const searchTerm = searchParams.get('searchTerm') ?? '';
  const departmentId = searchParams.get('departmentId') ?? '';
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;

  const { data, isLoading, isError } = usePrograms({
    searchTerm: searchTerm || undefined,
    departmentId: departmentId || undefined,
    page,
    limit,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const { data: departmentResponse } = useDepartments({
    page: 1,
    limit: 100,
    sortBy: 'name',
    sortOrder: 'asc',
  });

  const programs = data?.data ?? [];
  const meta = data?.meta;
  const departments = departmentResponse?.data ?? [];

  const updateFilters = (updates: {
    searchTerm?: string;
    departmentId?: string;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (updates.searchTerm !== undefined) {
      if (updates.searchTerm.trim()) {
        params.set('searchTerm', updates.searchTerm);
      } else {
        params.delete('searchTerm');
      }
    }

    if (updates.departmentId !== undefined) {
      if (updates.departmentId) {
        params.set('departmentId', updates.departmentId);
      } else {
        params.delete('departmentId');
      }
    }

    params.set('page', '1');

    router.push(`/admin-dashboard/programs?${params.toString()}`);
  };

  const handlePageChange = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(nextPage));

    router.push(`/admin-dashboard/programs?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push('/admin-dashboard/programs?page=1');
  };

  const hasActiveFilters = Boolean(searchTerm || departmentId);

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6 p-4 sm:p-6 lg:p-8">
      {/* PageHeading */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <GraduationCap className="size-6" aria-hidden="true" />
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Academic Programs
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              Organize degree programs, associate them with departments and
              manage academic offerings.
            </p>
          </div>
        </div>

        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border/70 bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground">
          <BookOpen className="size-3.5" aria-hidden="true" />
          {meta ? `${meta.total} total programs` : 'Program directory'}
        </span>
      </section>

      {/* ProgramForm */}
      <section className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <GraduationCap className="size-4" aria-hidden="true" />
          </div>

          <div>
            <h2 className="text-sm font-semibold">Program management</h2>
            <p className="text-xs text-muted-foreground">
              Create and manage academic programs.
            </p>
          </div>
        </div>

        <ProgramForm />
      </section>

      {/* ProgramDirectory */}
      <section className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
        <div className="space-y-4 border-b border-border/70 p-4 sm:p-5">
          <div>
            <h2 className="text-base font-semibold tracking-tight">
              Program directory
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Search programs or filter them by department.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {/* Search */}
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />

              <input
                type="search"
                defaultValue={searchTerm}
                onChange={event =>
                  updateFilters({ searchTerm: event.target.value })
                }
                placeholder="Search programs..."
                aria-label="Search programs"
                className="h-10 w-full rounded-xl border border-input bg-background pl-9 pr-9 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
              />

              {searchTerm && (
                <button
                  type="button"
                  onClick={() => updateFilters({ searchTerm: '' })}
                  aria-label="Clear program search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <XCircle className="size-4" aria-hidden="true" />
                </button>
              )}
            </div>

            {/* DepartmentFilter */}
            <select
              value={departmentId}
              onChange={event =>
                updateFilters({ departmentId: event.target.value })
              }
              aria-label="Filter programs by department"
              className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
            >
              <option value="">All Departments</option>

              {departments.map(department => (
                <option key={department.id} value={department.id}>
                  {department.name} ({department.code})
                </option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-muted-foreground">
                Showing filtered program results.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="space-y-4 p-5" role="status" aria-live="polite">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="size-4 animate-spin rounded-full border-2 border-primary/25 border-t-primary" />
              Loading programs...
            </div>

            {[1, 2, 3].map(row => (
              <div
                key={row}
                className="grid grid-cols-2 gap-4 sm:grid-cols-5"
                aria-hidden="true"
              >
                {[1, 2, 3, 4, 5].map(column => (
                  <div
                    key={column}
                    className="h-4 animate-pulse rounded-md bg-muted"
                  />
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="flex flex-col items-center px-5 py-12 text-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertCircle className="size-6" aria-hidden="true" />
            </div>

            <h3 className="font-semibold">Unable to load programs</h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
              Something went wrong while retrieving academic programs. Please
              try again.
            </p>
          </div>
        )}

        {/* ProgramTable */}
        {!isLoading && !isError && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-212.5 text-left text-sm">
                <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th scope="col" className="px-5 py-4 font-semibold">
                      Program
                    </th>
                    <th scope="col" className="px-5 py-4 font-semibold">
                      Code
                    </th>
                    <th scope="col" className="px-5 py-4 font-semibold">
                      Department
                    </th>
                    <th scope="col" className="px-5 py-4 font-semibold">
                      Description
                    </th>
                    <th scope="col" className="px-5 py-4 font-semibold">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border/70">
                  {programs.map(program => {
                    const department = departments.find(
                      item => item.id === program.departmentId,
                    );

                    return (
                      <tr
                        key={program.id}
                        className="transition-colors hover:bg-muted/30"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                              <GraduationCap
                                className="size-4"
                                aria-hidden="true"
                              />
                            </div>

                            <span className="font-medium">{program.name}</span>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span className="inline-flex rounded-md border border-border/70 bg-muted/40 px-2 py-1 font-mono text-xs font-medium">
                            {program.code}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-muted-foreground">
                          {department?.name ?? '—'}
                        </td>

                        <td className="max-w-sm px-5 py-4 leading-6 text-muted-foreground">
                          <span className="line-clamp-2">
                            {program.description || 'No description provided'}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          {program.isActive ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
                              <CheckCircle2
                                className="size-3.5"
                                aria-hidden="true"
                              />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                              <XCircle
                                className="size-3.5"
                                aria-hidden="true"
                              />
                              Inactive
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* EmptyState */}
            {programs.length === 0 && (
              <div className="flex flex-col items-center px-5 py-12 text-center">
                <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <GraduationCap className="size-6" aria-hidden="true" />
                </div>

                <h3 className="font-semibold">
                  {hasActiveFilters
                    ? 'No matching programs'
                    : 'No programs yet'}
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                  {hasActiveFilters
                    ? 'Try adjusting your search or department filter to find what you need.'
                    : 'Academic programs will appear here once they have been created.'}
                </p>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-4 text-sm font-medium text-primary hover:underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}

            {/* Pagination */}
            {meta && meta.total > 0 && (
              <div className="flex flex-col gap-3 border-t border-border/70 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <p className="text-sm text-muted-foreground">
                  Showing{' '}
                  <span className="font-medium text-foreground">
                    {(meta.page - 1) * limit + 1}
                  </span>
                  {'–'}
                  <span className="font-medium text-foreground">
                    {Math.min(meta.page * limit, meta.total)}
                  </span>{' '}
                  of{' '}
                  <span className="font-medium text-foreground">
                    {meta.total}
                  </span>{' '}
                  programs
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1}
                    className="inline-flex h-9 items-center gap-2 rounded-lg border border-border/70 bg-background px-3 text-sm font-medium transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
                  >
                    <ArrowLeft className="size-4" aria-hidden="true" />
                    Previous
                  </button>

                  <span className="min-w-20 text-center text-sm text-muted-foreground">
                    Page {meta.page} of {meta.totalPages}
                  </span>

                  <button
                    type="button"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= meta.totalPages}
                    className="inline-flex h-9 items-center gap-2 rounded-lg border border-border/70 bg-background px-3 text-sm font-medium transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
                  >
                    Next
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
