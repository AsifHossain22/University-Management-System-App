'use client';

import { useEffect } from 'react';
import {
  AlertCircle,
  ArrowDownToLine,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  GraduationCap,
  TrendingUp,
  Trophy,
  XCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { useMyTranscript } from '@/hooks/transcript.hook';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getApiErrorMessage } from '@/lib/api-error';

function formatGPA(value: number) {
  return Number(value).toFixed(2);
}

function getGPAStyle(value: number) {
  if (value >= 3.5) {
    return 'text-emerald-600 dark:text-emerald-400';
  }

  if (value >= 3) {
    return 'text-blue-600 dark:text-blue-400';
  }

  if (value >= 2) {
    return 'text-amber-600 dark:text-amber-400';
  }

  return 'text-muted-foreground';
}

export default function StudentTranscriptPage() {
  const { data, isLoading, isError, error } = useMyTranscript();
  const transcript = data?.data;

  useEffect(() => {
    if (isError) {
      toast.error(getApiErrorMessage(error));
    }
  }, [isError, error]);

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="animate-pulse space-y-3">
          <div className="h-5 w-44 rounded bg-muted" />
          <div className="h-9 w-64 max-w-full rounded bg-muted" />
          <div className="h-4 w-80 max-w-full rounded bg-muted" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(item => (
            <div
              key={item}
              className="h-36 animate-pulse rounded-xl border bg-muted/40"
            />
          ))}
        </div>

        <div className="h-72 animate-pulse rounded-xl border bg-muted/40" />
      </main>
    );
  }

  if (isError) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Card className="border-destructive/30">
          <CardContent className="flex flex-col items-center px-6 py-12 text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="size-7 text-destructive" />
            </div>

            <h1 className="text-xl font-semibold">
              Unable to load your transcript
            </h1>

            <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              {getApiErrorMessage(error) ||
                'Something went wrong while retrieving your academic records. Please try again.'}
            </p>

            <Button
              className="mt-5"
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Try again
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (!transcript) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="flex flex-col items-center px-6 py-12 text-center">
            <GraduationCap className="mb-4 size-12 text-muted-foreground" />

            <h1 className="text-xl font-semibold">Transcript not available</h1>

            <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Your academic transcript is not available yet. Please check again
              later.
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  const allCourses = transcript.semesters.flatMap(semester => semester.courses);

  const passedCourses = allCourses.filter(course => course.isPassed).length;

  const studentName =
    `${transcript.student.firstName} ${transcript.student.lastName}`.trim();

  function exportTranscript() {
    window.print();
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="space-y-8">
        {/* PageHeading */}
        <section className="relative overflow-hidden rounded-2xl border bg-card shadow-sm">
          <div className="pointer-events-none absolute -right-16 -top-20 size-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 size-52 rounded-full bg-primary/5 blur-3xl" />

          <div className="relative flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1.5 text-sm font-medium">
                <GraduationCap className="size-4 text-primary" />
                Student Academic Portal
              </div>

              <div>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Academic Transcript
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                  Your academic journey, course grades, earned credits and
                  semester performance all in one place.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
                    <GraduationCap className="size-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Student name
                    </p>
                    <p className="font-semibold">{studentName}</p>
                  </div>
                </div>

                <div className="h-8 w-px bg-border" />

                <div>
                  <p className="text-xs text-muted-foreground">Student ID</p>
                  <p className="font-semibold">
                    {transcript.student.studentId}
                  </p>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              className="shrink-0 gap-2 self-start bg-background/80 lg:self-center print:hidden"
              onClick={exportTranscript}
            >
              <ArrowDownToLine className="size-4" />
              Print / Save PDF
            </Button>
          </div>
        </section>

        {/* AcademicSummary */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Academic Overview</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              A summary of your currently published academic records.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Cumulative GPA
                </CardTitle>

                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                  <GraduationCap className="size-5 text-primary" />
                </div>
              </CardHeader>

              <CardContent>
                <div
                  className={`text-3xl font-bold tracking-tight ${getGPAStyle(transcript.cumulativeGPA)}`}
                >
                  {formatGPA(transcript.cumulativeGPA)}
                  <span className="ml-1 text-base font-medium text-muted-foreground">
                    / 4.00
                  </span>
                </div>

                <p className="mt-2 text-xs text-muted-foreground">
                  Overall cumulative grade point average
                </p>
              </CardContent>
            </Card>

            <Card className="transition-shadow hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Credits Earned
                </CardTitle>

                <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/10">
                  <BookOpen className="size-5 text-blue-600 dark:text-blue-400" />
                </div>
              </CardHeader>

              <CardContent>
                <div className="text-3xl font-bold tracking-tight">
                  {transcript.totalCreditsEarned}
                </div>

                <p className="mt-2 text-xs text-muted-foreground">
                  Successfully completed academic credits
                </p>
              </CardContent>
            </Card>

            <Card className="transition-shadow hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Published Courses
                </CardTitle>

                <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10">
                  <TrendingUp className="size-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </CardHeader>

              <CardContent>
                <div className="text-3xl font-bold tracking-tight">
                  {allCourses.length}
                </div>

                <p className="mt-2 text-xs text-muted-foreground">
                  Courses included in your transcript
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CourseProgressSummary */}
        {allCourses.length > 0 && (
          <Card>
            <CardContent className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div className="flex items-start gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
                  <Trophy className="size-5 text-emerald-600 dark:text-emerald-400" />
                </div>

                <div>
                  <h2 className="font-semibold">Course Completion Summary</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Based on the published course results shown below.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:min-w-64">
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">
                    Passed courses
                  </p>
                  <p className="mt-1 flex items-center gap-2 text-xl font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="size-5" />
                    {passedCourses}
                  </p>
                </div>

                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">Other results</p>
                  <p className="mt-1 flex items-center gap-2 text-xl font-bold">
                    <XCircle className="size-5 text-muted-foreground" />
                    {allCourses.length - passedCourses}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* SemesterHistory */}
        <section className="space-y-5">
          <div>
            <h2 className="text-xl font-bold tracking-tight">
              Semester Breakdown
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Review individual course results and GPA for each semester.
            </p>
          </div>

          {transcript.semesters.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center px-6 py-14 text-center">
                <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-muted">
                  <GraduationCap className="size-7 text-muted-foreground" />
                </div>

                <h3 className="text-lg font-semibold">
                  No published grades yet
                </h3>

                <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                  Your transcript will appear here after the university
                  publishes your course grades.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {transcript.semesters.map(semester => (
                <Card key={semester.semester.id} className="overflow-hidden">
                  <CardHeader className="border-b bg-muted/20 p-5 sm:p-6">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-3">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border bg-background">
                          <CalendarDays className="size-5 text-primary" />
                        </div>

                        <div>
                          <CardTitle className="text-lg">
                            {semester.semester.name}
                          </CardTitle>

                          <p className="mt-1 text-sm text-muted-foreground">
                            Semester code: {semester.semester.code}
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            {semester.courses.length} course
                            {semester.courses.length === 1 ? '' : 's'} recorded
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 sm:min-w-64">
                        <div className="rounded-lg border bg-background p-3">
                          <p className="text-xs text-muted-foreground">
                            Semester GPA
                          </p>
                          <p
                            className={`mt-1 text-xl font-bold ${getGPAStyle(semester.semesterGPA)}`}
                          >
                            {formatGPA(semester.semesterGPA)}
                          </p>
                        </div>

                        <div className="rounded-lg border bg-background p-3">
                          <p className="text-xs text-muted-foreground">
                            Credits earned
                          </p>
                          <p className="mt-1 text-xl font-bold">
                            {semester.creditsEarned}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-0">
                    {semester.courses.length === 0 ? (
                      <div className="px-5 py-8 text-center text-sm text-muted-foreground">
                        No course records are available for this semester.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-175 text-sm">
                          <thead>
                            <tr className="border-b bg-muted/30 text-left text-muted-foreground">
                              <th className="px-5 py-4 font-medium">Course</th>
                              <th className="px-4 py-4 font-medium">Credits</th>
                              <th className="px-4 py-4 font-medium">
                                Final marks
                              </th>
                              <th className="px-4 py-4 font-medium">Grade</th>
                              <th className="px-4 py-4 font-medium">
                                Grade point
                              </th>
                              <th className="px-5 py-4 font-medium">Status</th>
                            </tr>
                          </thead>

                          <tbody>
                            {semester.courses.map(course => (
                              <tr
                                key={course.id}
                                className="border-b transition-colors last:border-0 hover:bg-muted/30"
                              >
                                <td className="px-5 py-4">
                                  <p className="font-semibold">
                                    {course.course.name}
                                  </p>
                                  <p className="mt-1 text-xs text-muted-foreground">
                                    {course.course.code} · Section{' '}
                                    {course.section.code}
                                  </p>
                                </td>

                                <td className="px-4 py-4 tabular-nums">
                                  {course.course.credits}
                                </td>

                                <td className="px-4 py-4 font-medium tabular-nums">
                                  {Number(course.finalMarks).toFixed(2)}%
                                </td>

                                <td className="px-4 py-4">
                                  <span className="inline-flex min-w-10 items-center justify-center rounded-md border bg-muted/40 px-2.5 py-1 font-semibold">
                                    {course.grade}
                                  </span>
                                </td>

                                <td className="px-4 py-4 tabular-nums">
                                  {formatGPA(course.gradePoint)}
                                </td>

                                <td className="px-5 py-4">
                                  {course.isPassed ? (
                                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
                                      <CheckCircle2 className="size-3.5" />
                                      Passed
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-destructive/20 bg-destructive/5 px-2.5 py-1 text-xs font-medium text-destructive">
                                      <XCircle className="size-3.5" />
                                      Failed
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        <p className="pb-2 text-center text-xs text-muted-foreground">
          This transcript reflects the academic records currently published by
          your university.
        </p>
      </div>

      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }

          nav,
          aside,
          header,
          button,
          [data-sidebar],
          [role='navigation'] {
            display: none !important;
          }

          main {
            max-width: none !important;
            padding: 0 !important;
          }

          main > div {
            gap: 16px !important;
          }

          section,
          article,
          [data-slot='card'] {
            break-inside: avoid;
            box-shadow: none !important;
          }

          .overflow-x-auto {
            overflow: visible !important;
          }

          table {
            min-width: 0 !important;
            width: 100% !important;
            font-size: 9pt !important;
          }

          th,
          td {
            padding: 6px !important;
          }
        }
      `}</style>
    </main>
  );
}
