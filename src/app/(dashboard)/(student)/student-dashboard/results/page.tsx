'use client';

import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  GraduationCap,
  Search,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useResults } from '@/hooks/result.hook';
import { getApiErrorMessage } from '@/lib/api-error';

function formatDate(value: string) {
  if (!value) {
    return 'Date unavailable';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Date unavailable';
  }

  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

function formatExamType(value: string) {
  return value
    .toLowerCase()
    .replaceAll('_', ' ')
    .replace(/\b\w/g, character => character.toUpperCase());
}

function getPercentage(obtainedMarks: number, totalMarks: number) {
  if (totalMarks <= 0) {
    return null;
  }

  return (obtainedMarks / totalMarks) * 100;
}

function getPerformanceStyle(percentage: number | null) {
  if (percentage === null) {
    return {
      label: 'Not available',
      className: 'bg-muted text-muted-foreground',
    };
  }

  if (percentage >= 80) {
    return {
      label: 'Excellent',
      className:
        'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300',
    };
  }

  if (percentage >= 60) {
    return {
      label: 'Good',
      className:
        'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300',
    };
  }

  if (percentage >= 40) {
    return {
      label: 'Keep improving',
      className:
        'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300',
    };
  }

  return {
    label: 'Needs improvement',
    className:
      'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300',
  };
}

export default function StudentResultsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const limit = 10;
  const searchTerm = searchParams.get('searchTerm') ?? '';

  const [searchInput, setSearchInput] = useState(searchTerm);

  useEffect(() => {
    setSearchInput(searchTerm);
  }, [searchTerm]);

  const { data, isLoading, isError, error } = useResults({
    page,
    limit,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    ...(searchTerm && { searchTerm }),
  });

  useEffect(() => {
    if (isError) {
      toast.error(getApiErrorMessage(error));
    }
  }, [isError, error]);

  function updateSearch(value: string) {
    const normalizedValue = value.trim();
    const params = new URLSearchParams(searchParams.toString());

    if (normalizedValue) {
      params.set('searchTerm', normalizedValue);
    } else {
      params.delete('searchTerm');
    }

    params.delete('page');

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  function clearSearch() {
    setSearchInput('');
    updateSearch('');
  }

  function changePage(nextPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(nextPage));

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  const results = data?.data ?? [];
  const meta = data?.meta;
  const totalResults = meta?.total ?? 0;
  const totalPages = meta?.totalPages ?? 0;

  const totalObtainedMarks = results.reduce(
    (total, result) => total + result.obtainedMarks,
    0,
  );

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="space-y-8">
        {/* PageHeading */}
        <section className="relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
          <div className="pointer-events-none absolute -right-12 -top-16 size-56 rounded-full bg-primary/5 blur-3xl" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium">
                <GraduationCap className="size-4 text-primary" />
                Student Academic Portal
              </div>

              <div>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  My Results
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                  Track your exam performance, review obtained marks, and
                  explore your academic results in one place.
                </p>
              </div>
            </div>

            <div className="flex size-16 shrink-0 items-center justify-center self-start rounded-2xl bg-primary/10 sm:size-20 sm:self-center">
              <ClipboardList className="size-8 text-primary sm:size-10" />
            </div>
          </div>
        </section>

        {/* SummaryCards */}
        <section className="grid gap-4 sm:grid-cols-2">
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Results
              </CardTitle>
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                <ClipboardList className="size-5 text-primary" />
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-3xl font-bold tracking-tight">
                {isLoading ? '—' : totalResults}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchTerm
                  ? 'Results matching your search'
                  : 'Results available for your account'}
              </p>
            </CardContent>
          </Card>

          <Card className="transition-shadow hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Marks on This Page
              </CardTitle>
              <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10">
                <GraduationCap className="size-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-3xl font-bold tracking-tight">
                {isLoading ? '—' : totalObtainedMarks}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Combined obtained marks across the current page
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Search */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Search className="size-5 text-primary" />
              Find Your Results
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Search using the terms supported by your results API.
            </p>
          </CardHeader>

          <CardContent>
            <form
              className="flex flex-col gap-3 sm:flex-row"
              onSubmit={event => {
                event.preventDefault();
                updateSearch(searchInput);
              }}
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  value={searchInput}
                  onChange={event => setSearchInput(event.target.value)}
                  placeholder="Search courses, exams, or other result details..."
                  className="h-11 pl-9 pr-9"
                  aria-label="Search results"
                />

                {searchInput && (
                  <button
                    type="button"
                    onClick={() => setSearchInput('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label="Clear search input"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>

              <Button type="submit" className="h-11 gap-2">
                <Search className="size-4" />
                Search
              </Button>

              {searchTerm && (
                <Button
                  type="button"
                  variant="outline"
                  className="h-11"
                  onClick={clearSearch}
                >
                  Clear filters
                </Button>
              )}
            </form>

            <p className="mt-2 text-xs text-muted-foreground">
              Press Enter or select Search to apply your query.
            </p>
          </CardContent>
        </Card>

        {/* ResultsHistory */}
        <Card>
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-xl">Result History</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Your recorded exam results, sorted by most recently created.
              </p>
            </div>

            {!isLoading && !isError && results.length > 0 && (
              <div className="w-fit rounded-full bg-muted px-3 py-1 text-xs font-medium">
                {results.length} on this page
              </div>
            )}
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map(item => (
                  <div
                    key={item}
                    className="animate-pulse rounded-xl border p-5"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="h-5 w-2/3 rounded bg-muted" />
                        <div className="h-4 w-1/2 rounded bg-muted" />
                        <div className="h-4 w-1/3 rounded bg-muted" />
                      </div>
                      <div className="h-24 w-full rounded-lg bg-muted sm:w-44" />
                    </div>
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center rounded-xl border border-destructive/30 bg-destructive/5 px-6 py-12 text-center">
                <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10">
                  <AlertCircle className="size-6 text-destructive" />
                </div>

                <h2 className="text-lg font-semibold">
                  Unable to load results
                </h2>

                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  {getApiErrorMessage(error) ||
                    'Something went wrong while retrieving your results.'}
                </p>

                <Button
                  variant="outline"
                  className="mt-5"
                  onClick={() => window.location.reload()}
                >
                  Try again
                </Button>
              </div>
            ) : results.length === 0 ? (
              <div className="flex flex-col items-center rounded-xl border border-dashed px-6 py-14 text-center">
                <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-muted">
                  {searchTerm ? (
                    <Search className="size-7 text-muted-foreground" />
                  ) : (
                    <ClipboardList className="size-7 text-muted-foreground" />
                  )}
                </div>

                <h2 className="text-lg font-semibold">
                  {searchTerm ? 'No matching results' : 'No results available'}
                </h2>

                <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                  {searchTerm
                    ? 'Try a different search term or clear your search to view all available results.'
                    : 'Your published exam results will appear here when they are available.'}
                </p>

                {searchTerm && (
                  <Button
                    variant="outline"
                    className="mt-5"
                    onClick={clearSearch}
                  >
                    Clear search
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {results.map(result => {
                    const percentage = getPercentage(
                      result.obtainedMarks,
                      result.exam.totalMarks,
                    );

                    const performance = getPerformanceStyle(percentage);

                    return (
                      <article
                        key={result.id}
                        className="group rounded-xl border p-4 transition-all hover:border-primary/30 hover:shadow-md sm:p-5"
                      >
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                          {/* CourseAndExamDetails */}
                          <div className="min-w-0 flex-1 space-y-4">
                            <div className="flex items-start gap-3">
                              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                                <BookOpen className="size-5 text-primary" />
                              </div>

                              <div className="min-w-0 flex-1">
                                <h2 className="wrap-break-word text-base font-semibold sm:text-lg">
                                  {result.exam.section.course.name}
                                </h2>

                                <p className="mt-1 text-sm text-muted-foreground">
                                  Course code:{' '}
                                  <span className="font-medium text-foreground">
                                    {result.exam.section.course.code}
                                  </span>
                                </p>
                              </div>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                              <div className="flex items-start gap-3 rounded-lg bg-muted/40 p-3">
                                <ClipboardList className="mt-0.5 size-4 shrink-0 text-primary" />

                                <div className="min-w-0">
                                  <p className="text-xs text-muted-foreground">
                                    Exam
                                  </p>
                                  <p className="mt-1 wrap-break-word text-sm font-medium">
                                    {result.exam.title}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-start gap-3 rounded-lg bg-muted/40 p-3">
                                <GraduationCap className="mt-0.5 size-4 shrink-0 text-primary" />

                                <div className="min-w-0">
                                  <p className="text-xs text-muted-foreground">
                                    Section
                                  </p>
                                  <p className="mt-1 wrap-break-word text-sm font-medium">
                                    {result.exam.section.name} (
                                    {result.exam.section.code})
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                              <span className="inline-flex rounded-full border px-2.5 py-1 text-xs font-medium">
                                {formatExamType(result.exam.type)}
                              </span>

                              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                                <CalendarDays className="size-3.5" />
                                Exam date: {formatDate(result.exam.examDate)}
                              </span>
                            </div>
                          </div>

                          {/* MarksAndPerformance */}
                          <div className="w-full rounded-xl border bg-muted/20 p-4 lg:w-64 lg:shrink-0">
                            <p className="text-sm font-medium text-muted-foreground">
                              Obtained Marks
                            </p>

                            <div className="mt-2 flex items-baseline gap-2">
                              <span className="text-3xl font-bold tracking-tight">
                                {result.obtainedMarks}
                              </span>

                              <span className="text-sm text-muted-foreground">
                                / {result.exam.totalMarks}
                              </span>
                            </div>

                            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                              <span className="text-sm font-semibold">
                                {percentage === null
                                  ? '—'
                                  : `${percentage.toFixed(1)}%`}
                              </span>

                              <span
                                className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${performance.className}`}
                              >
                                {performance.label}
                              </span>
                            </div>

                            {percentage !== null && (
                              <div
                                className="mt-3 h-2 overflow-hidden rounded-full bg-muted"
                                role="progressbar"
                                aria-label="Exam marks percentage"
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-valuenow={Math.max(
                                  0,
                                  Math.min(100, percentage),
                                )}
                              >
                                <div
                                  className="h-full rounded-full bg-primary transition-all"
                                  style={{
                                    width: `${Math.max(0, Math.min(100, percentage))}%`,
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Remarks */}
                        {result.remarks && (
                          <div className="mt-5 flex items-start gap-3 rounded-lg border border-dashed p-3">
                            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

                            <div className="min-w-0">
                              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Instructor Remarks
                              </p>
                              <p className="mt-1 whitespace-pre-wrap wrap-break-word text-sm leading-6">
                                {result.remarks}
                              </p>
                            </div>
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>

                {/* Pagination */}
                <div className="mt-6 flex flex-col gap-4 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      Page {page} of {Math.max(1, totalPages)}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {totalResults} total result
                      {totalResults === 1 ? '' : 's'}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="gap-2"
                      disabled={page <= 1 || isLoading}
                      onClick={() => changePage(page - 1)}
                    >
                      <ArrowLeft className="size-4" />
                      Previous
                    </Button>

                    <Button
                      variant="outline"
                      className="gap-2"
                      disabled={
                        isLoading || totalPages === 0 || page >= totalPages
                      }
                      onClick={() => changePage(page + 1)}
                    >
                      Next
                      <ArrowRight className="size-4" />
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
