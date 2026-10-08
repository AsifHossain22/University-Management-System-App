'use client';

import {
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  GraduationCap,
} from 'lucide-react';
import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(value));
}

function getStatusClass(status: AttendanceStatus) {
  switch (status) {
    case 'PRESENT':
      return 'bg-green-100 text-green-700';
    case 'ABSENT':
      return 'bg-red-100 text-red-700';
    case 'LATE':
      return 'bg-yellow-100 text-yellow-700';
    case 'EXCUSED':
      return 'bg-blue-100 text-blue-700';
    default:
      return 'bg-muted text-muted-foreground';
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

  // UpdateURLFilters
  function updateFilters(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  }

  // ChangePage
  function changePage(nextPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(nextPage));
    router.push(`${pathname}?${params.toString()}`);
  }

  const attendanceRecords = data?.data ?? [];
  const meta = data?.meta;
  const totalRecords = meta?.total ?? 0;
  const totalPages = meta?.totalPages ?? 0;

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* PageHeading */}
        <div>
          <p className="text-sm font-medium text-primary">Student Dashboard</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
            My Attendance
          </h1>
          <p className="mt-2 text-muted-foreground">
            Review your attendance records, course sessions, and attendance
            status.
          </p>
        </div>

        {/* AttendanceSummary */}
        <div className="grid gap-4 sm:grid-cols-2">
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
                Attendance records matching your filters
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
                {limit} records per page
              </p>
            </CardContent>
          </Card>
        </div>

        {/* AttendanceFilters */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Attendance</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
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
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
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
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AttendanceRecords */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance History</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map(item => (
                  <div
                    key={item}
                    className="h-16 animate-pulse rounded-md bg-muted"
                  />
                ))}
              </div>
            ) : isError ? (
              <div className="rounded-lg border border-destructive/30 p-6 text-center">
                <p className="font-medium text-destructive">
                  Failed to load attendance records.
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Please try again in a moment.
                </p>
              </div>
            ) : attendanceRecords.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-center">
                <ClipboardCheck className="mb-4 size-10 text-muted-foreground" />
                <h2 className="text-lg font-semibold">
                  No attendance records found
                </h2>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  Attendance records will appear here when your instructor
                  records attendance for your registered courses.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {attendanceRecords.map(record => (
                    <div
                      key={record.id}
                      className="rounded-lg border p-4 transition-colors hover:bg-muted/30"
                    >
                      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                        <div className="min-w-0 space-y-2">
                          <h2 className="font-semibold">
                            {record.registration.section.course.name}
                          </h2>

                          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                              <BookOpen className="size-4" />
                              {record.registration.section.course.code}
                            </span>

                            <span className="flex items-center gap-1.5">
                              <GraduationCap className="size-4" />
                              {record.registration.section.semester.name}
                            </span>
                          </div>

                          <p className="text-sm text-muted-foreground">
                            Section: {record.registration.section.name} (
                            {record.registration.section.code})
                          </p>
                        </div>

                        <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(record.status)}`}
                          >
                            {record.status}
                          </span>

                          <span className="text-sm text-muted-foreground">
                            {formatDate(record.date)}
                          </span>
                        </div>
                      </div>

                      {record.remarks && (
                        <div className="mt-4 rounded-md bg-muted/50 p-3">
                          <p className="text-xs font-medium text-muted-foreground">
                            Instructor remarks
                          </p>
                          <p className="mt-1 text-sm">{record.remarks}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="mt-6 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-muted-foreground">
                    Page {page} of {totalPages || 1} · {totalRecords} records
                  </p>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      disabled={page <= 1}
                      onClick={() => changePage(page - 1)}
                    >
                      Previous
                    </Button>

                    <Button
                      variant="outline"
                      disabled={page >= totalPages}
                      onClick={() => changePage(page + 1)}
                    >
                      Next
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
