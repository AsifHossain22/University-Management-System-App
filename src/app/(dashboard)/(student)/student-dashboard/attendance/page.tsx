'use client';

import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  RotateCcw,
  Search,
  XCircle,
} from 'lucide-react';
import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMyAttendance } from '@/hooks/attendance.hook';
import type { AttendanceStatus } from '@/api/attendance.api';
import { getApiErrorMessage } from '@/lib/api-error';

const attendanceStatuses: AttendanceStatus[] = [
  'PRESENT',
  'ABSENT',
  'LATE',
  'EXCUSED',
];

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

function getStatusClass(status: AttendanceStatus) {
  switch (status) {
    case 'PRESENT':
      return 'border-green-500/20 bg-green-500/10 text-green-700 dark:text-green-400';
    case 'ABSENT':
      return 'border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-400';
    case 'LATE':
      return 'border-yellow-500/20 bg-yellow-500/10 text-yellow-800 dark:text-yellow-400';
    case 'EXCUSED':
      return 'border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-400';
    default:
      return 'border-border bg-muted text-muted-foreground';
  }
}

function getStatusIcon(status: AttendanceStatus) {
  switch (status) {
    case 'PRESENT':
      return <CheckCircle2 className="size-3.5" />;
    case 'ABSENT':
      return <XCircle className="size-3.5" />;
    default:
      return <CalendarDays className="size-3.5" />;
  }
}

export default function StudentAttendancePage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const limit = 10;

  const statusParam = searchParams.get('status');
  const status = attendanceStatuses.includes(statusParam as AttendanceStatus)
    ? (statusParam as AttendanceStatus)
    : undefined;

  const date = searchParams.get('date') ?? '';

  const { data, isLoading, isError, error } = useMyAttendance({
    page,
    limit,
    ...(status && { status }),
    ...(date && { date }),
  });

  useEffect(() => {
    if (isError) {
      toast.error(getApiErrorMessage(error));
    }
  }, [isError, error]);

  function updateFilters(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    params.delete('page');

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  function changePage(nextPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(nextPage));

    router.push(`${pathname}?${params.toString()}`);
  }

  function clearFilters() {
    router.push(pathname);
  }

  const attendanceRecords = data?.data ?? [];
  const meta = data?.meta;
  const totalRecords = meta?.total ?? 0;
  const totalPages = meta?.totalPages ?? 0;
  const hasFilters = Boolean(status || date);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="space-y-8">
        {/* PageHeader */}
        <section className="relative overflow-hidden rounded-2xl border bg-card p-6 sm:p-8">
          <div className="absolute -right-12 -top-12 size-40 rounded-full bg-primary/5 blur-2xl" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                <GraduationCap className="size-4 text-primary" />
                Student Academic Portal
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                  My Attendance
                </h1>

                <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
                  Review your attendance history, check session statuses and
                  find records by date or attendance status.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border bg-background p-4 sm:min-w-48">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ClipboardCheck className="size-5" />
              </div>

              <div>
                <p className="text-2xl font-bold">
                  {isLoading ? '—' : totalRecords}
                </p>
                <p className="text-xs text-muted-foreground">
                  Matching records
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SummaryCards */}
        <section className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Records
              </CardTitle>
              <ClipboardCheck className="size-5 text-primary" />
            </CardHeader>

            <CardContent>
              <p className="text-3xl font-bold">
                {isLoading ? '—' : totalRecords}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Records matching your current filters
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Current Page
              </CardTitle>
              <CalendarDays className="size-5 text-primary" />
            </CardHeader>

            <CardContent>
              <p className="text-3xl font-bold">
                {isLoading ? '—' : `${page} / ${totalPages || 1}`}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Up to {limit} records per page
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Filters */}
        <Card className="overflow-hidden">
          <CardHeader className="border-b bg-muted/20 px-5 py-5 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Search className="size-5" />
              </div>

              <div>
                <CardTitle className="text-lg">Filter Attendance</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  Narrow your records by status or date.
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 p-5 sm:p-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="attendance-status"
                  className="text-sm font-medium"
                >
                  Attendance Status
                </label>

                <select
                  id="attendance-status"
                  value={status ?? ''}
                  onChange={event =>
                    updateFilters('status', event.target.value)
                  }
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
                >
                  <option value="">All statuses</option>
                  {attendanceStatuses.map(item => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="attendance-date"
                  className="text-sm font-medium"
                >
                  Attendance Date
                </label>

                <input
                  id="attendance-date"
                  type="date"
                  value={date}
                  onChange={event => updateFilters('date', event.target.value)}
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
                />
              </div>
            </div>

            {hasFilters && (
              <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                <p className="text-sm text-muted-foreground">
                  Showing filtered attendance records.
                </p>

                <Button variant="outline" size="sm" onClick={clearFilters}>
                  <RotateCcw className="size-4" />
                  Clear filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AttendanceHistory */}
        <Card className="overflow-hidden">
          <CardHeader className="border-b bg-muted/20 px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-lg">Attendance History</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  Individual attendance records for your registered courses.
                </p>
              </div>

              {!isLoading && !isError && (
                <span className="w-fit rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                  {attendanceRecords.length} records on this page
                </span>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-5 sm:p-6">
            {isLoading ? (
              <div
                className="space-y-4"
                aria-label="Loading attendance records"
              >
                {Array.from({ length: 4 }, (_, index) => (
                  <div
                    key={index}
                    className="animate-pulse space-y-3 rounded-xl border p-5"
                  >
                    <div className="h-5 w-2/3 rounded bg-muted" />
                    <div className="h-4 w-1/2 rounded bg-muted" />
                    <div className="h-4 w-1/3 rounded bg-muted" />
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center">
                <XCircle className="mx-auto size-9 text-destructive" />

                <h2 className="mt-3 font-semibold">
                  Unable to load attendance
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                  {getApiErrorMessage(error)}
                </p>
              </div>
            ) : attendanceRecords.length === 0 ? (
              <div className="rounded-xl border border-dashed px-5 py-12 text-center">
                <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-muted">
                  <ClipboardCheck className="size-7 text-muted-foreground" />
                </div>

                <h2 className="mt-4 text-lg font-semibold">
                  No attendance records found
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                  {hasFilters
                    ? 'No records match your selected filters. Try changing the status or date.'
                    : 'Attendance records will appear here when your instructors record attendance for your registered courses.'}
                </p>

                {hasFilters && (
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={clearFilters}
                  >
                    <RotateCcw className="size-4" />
                    Clear filters
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {attendanceRecords.map(record => (
                    <article
                      key={record.id}
                      className="rounded-xl border p-4 transition-colors hover:bg-muted/20 sm:p-5"
                    >
                      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                        <div className="min-w-0 space-y-3">
                          <h2 className="wrap-break-word font-semibold leading-6">
                            {record.registration.section.course.name}
                          </h2>

                          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                              <BookOpen className="size-4 shrink-0" />
                              {record.registration.section.course.code}
                            </span>

                            <span className="flex items-center gap-1.5">
                              <GraduationCap className="size-4 shrink-0" />
                              {record.registration.section.semester.name}
                            </span>
                          </div>

                          <p className="text-sm text-muted-foreground">
                            Section: {record.registration.section.name} (
                            {record.registration.section.code})
                          </p>
                        </div>

                        <div className="flex shrink-0 flex-row items-center justify-between gap-3 sm:flex-col sm:items-end">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusClass(record.status)}`}
                          >
                            {getStatusIcon(record.status)}
                            {record.status}
                          </span>

                          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <CalendarDays className="size-4" />
                            {formatDate(record.date)}
                          </span>
                        </div>
                      </div>

                      {record.remarks && (
                        <div className="mt-4 rounded-lg border bg-muted/30 p-3 sm:p-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Instructor remarks
                          </p>

                          <p className="mt-2 whitespace-pre-wrap text-sm leading-6">
                            {record.remarks}
                          </p>
                        </div>
                      )}
                    </article>
                  ))}
                </div>

                {/* Pagination */}
                <div className="mt-6 flex flex-col gap-4 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-muted-foreground">
                    Page {page} of {totalPages || 1}
                    <span className="mx-2">·</span>
                    {totalRecords} total records
                  </p>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      disabled={page <= 1 || isLoading}
                      onClick={() => changePage(page - 1)}
                    >
                      <span>Previous</span>
                    </Button>

                    <Button
                      variant="outline"
                      disabled={
                        page >= totalPages || totalPages === 0 || isLoading
                      }
                      onClick={() => changePage(page + 1)}
                    >
                      <span>Next</span>
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
