'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Plus,
  Search,
  XCircle,
} from 'lucide-react';
import DepartmentForm from '@/components/admin/department-form';
import { useDepartments } from '@/hooks/department.hook';

export default function AdminDepartmentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const searchTerm = searchParams.get('searchTerm') ?? '';
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;

  const { data, isLoading, isError } = useDepartments({
    searchTerm: searchTerm || undefined,
    page,
    limit,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const departments = data?.data ?? [];
  const meta = data?.meta;

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value.trim()) {
      params.set('searchTerm', value);
    } else {
      params.delete('searchTerm');
    }

    params.set('page', '1');

    router.push(`/admin-dashboard/departments?${params.toString()}`);
  };

  const handlePageChange = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(nextPage));

    router.push(`/admin-dashboard/departments?${params.toString()}`);
  };

  const clearSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('searchTerm');
    params.set('page', '1');

    router.push(`/admin-dashboard/departments?${params.toString()}`);
  };

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6 p-4 sm:p-6 lg:p-8">
      {/* PageHeading */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Building2 className="size-6" aria-hidden="true" />
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Departments
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              Manage academic departments and keep university information
              organized in one place.
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground">
            <Building2 className="size-3.5" aria-hidden="true" />
            {meta ? `${meta.total} total` : 'Department directory'}
          </span>
        </div>
      </section>

      {/* DepartmentForm */}
      <section className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Plus className="size-4" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-sm font-semibold">Department management</h2>
            <p className="text-xs text-muted-foreground">
              Create a department or manage existing records.
            </p>
          </div>
        </div>

        <DepartmentForm />
      </section>

      {/* Directory */}
      <section className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
        <div className="flex flex-col gap-4 border-b border-border/70 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-base font-semibold tracking-tight">
              Department directory
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Browse and search department records.
            </p>
          </div>

          <div className="relative w-full lg:max-w-sm">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              type="search"
              defaultValue={searchTerm}
              onChange={event => handleSearch(event.target.value)}
              placeholder="Search departments..."
              aria-label="Search departments"
              className="h-10 w-full rounded-xl border border-input bg-background pl-9 pr-9 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
            />

            {searchTerm && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="Clear department search"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <XCircle className="size-4" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        {isLoading && (
          <div className="space-y-4 p-5" role="status" aria-live="polite">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="size-4 animate-spin rounded-full border-2 border-primary/25 border-t-primary" />
              Loading departments...
            </div>

            {[1, 2, 3].map(row => (
              <div
                key={row}
                className="grid grid-cols-2 gap-4 sm:grid-cols-4"
                aria-hidden="true"
              >
                {[1, 2, 3, 4].map(column => (
                  <div
                    key={column}
                    className="h-4 animate-pulse rounded-md bg-muted"
                  />
                ))}
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center px-5 py-12 text-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertCircle className="size-6" aria-hidden="true" />
            </div>
            <h3 className="font-semibold">Unable to load departments</h3>
            <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
              Something went wrong while retrieving department records. Please
              try again.
            </p>
          </div>
        )}

        {!isLoading && !isError && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-170 text-left text-sm">
                <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th scope="col" className="px-5 py-4 font-semibold">
                      Department
                    </th>
                    <th scope="col" className="px-5 py-4 font-semibold">
                      Code
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
                  {departments.map(department => (
                    <tr
                      key={department.id}
                      className="transition-colors hover:bg-muted/30"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Building2 className="size-4" aria-hidden="true" />
                          </div>
                          <span className="font-medium">{department.name}</span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-md border border-border/70 bg-muted/40 px-2 py-1 font-mono text-xs font-medium">
                          {department.code}
                        </span>
                      </td>

                      <td className="max-w-sm px-5 py-4 leading-6 text-muted-foreground">
                        <span className="line-clamp-2">
                          {department.description || 'No description provided'}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        {department.isActive ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
                            <CheckCircle2
                              className="size-3.5"
                              aria-hidden="true"
                            />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                            <XCircle className="size-3.5" aria-hidden="true" />
                            Inactive
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {departments.length === 0 && (
              <div className="flex flex-col items-center px-5 py-12 text-center">
                <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <Building2 className="size-6" aria-hidden="true" />
                </div>
                <h3 className="font-semibold">
                  {searchTerm
                    ? 'No matching departments'
                    : 'No departments yet'}
                </h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                  {searchTerm
                    ? 'Try a different search term or clear the search to view all departments.'
                    : 'Departments will appear here once they have been created.'}
                </p>
                {searchTerm && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="mt-4 text-sm font-medium text-primary hover:underline"
                  >
                    Clear search
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
                  departments
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1 || isLoading}
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
                    disabled={page >= meta.totalPages || isLoading}
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
