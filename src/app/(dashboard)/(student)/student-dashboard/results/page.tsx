'use client';

import {
  BookOpen,
  CalendarDays,
  ClipboardList,
  GraduationCap,
  Search,
} from 'lucide-react';
import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useResults } from '@/hooks/result.hook';
import { getApiErrorMessage } from '@/lib/api-error';

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(value));
}

export default function StudentResultsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const limit = 10;
  const searchTerm = searchParams.get('searchTerm') ?? '';

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
    const params = new URLSearchParams(searchParams.toString());

    if (value.trim()) {
      params.set('searchTerm', value.trim());
    } else {
      params.delete('searchTerm');
    }
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  }

  function changePage(nextPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(nextPage));
    router.push(`${pathname}?${params.toString()}`);
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
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <div>
          <p className="text-sm font-medium text-primary">Student Dashboard</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
            My Results
          </h1>
          <p className="mt-2 text-muted-foreground">
            Review your exam results, obtained marks, and course performance.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Results
              </CardTitle>
              <ClipboardList className="size-5 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {isLoading ? '—' : totalResults}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Results matching your search
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Marks on This Page
              </CardTitle>
              <GraduationCap className="size-5 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {isLoading ? '—' : totalObtainedMarks}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Sum of obtained marks on this page
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                key={searchTerm}
                defaultValue={searchTerm}
                placeholder="Search by course, exam, student ID, or remarks..."
                className="pl-9"
                onKeyDown={event => {
                  if (event.key === 'Enter') {
                    updateSearch(event.currentTarget.value);
                  }
                }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Press Enter to apply your search.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Result History</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map(item => (
                  <div
                    key={item}
                    className="h-24 animate-pulse rounded-md bg-muted"
                  />
                ))}
              </div>
            ) : isError ? (
              <div className="rounded-lg border border-destructive/30 p-6 text-center">
                <p className="font-medium text-destructive">
                  Failed to load results.
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Please try again in a moment.
                </p>
              </div>
            ) : results.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-center">
                <ClipboardList className="mb-4 size-10 text-muted-foreground" />
                <h2 className="text-lg font-semibold">No results found</h2>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  Your published exam results will appear here when they are
                  available.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {results.map(result => (
                    <div
                      key={result.id}
                      className="rounded-lg border p-4 transition-colors hover:bg-muted/30"
                    >
                      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                        <div className="min-w-0 space-y-2">
                          <h2 className="font-semibold">
                            {result.exam.section.course.name}
                          </h2>

                          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                              <BookOpen className="size-4" />
                              {result.exam.section.course.code}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <ClipboardList className="size-4" />
                              {result.exam.title}
                            </span>
                          </div>

                          <p className="text-sm text-muted-foreground">
                            Section: {result.exam.section.name} (
                            {result.exam.section.code})
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Exam type: {result.exam.type.replaceAll('_', ' ')}
                          </p>
                        </div>

                        <div className="shrink-0 rounded-lg bg-muted/50 p-4 sm:text-right">
                          <p className="text-xs font-medium text-muted-foreground">
                            Obtained Marks
                          </p>
                          <p className="mt-1 text-2xl font-bold">
                            {result.obtainedMarks} / {result.exam.totalMarks}
                          </p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {result.exam.totalMarks > 0
                              ? `${((result.obtainedMarks / result.exam.totalMarks) * 100).toFixed(1)}%`
                              : '—'}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-2 border-t pt-4 text-sm text-muted-foreground">
                        <CalendarDays className="size-4" />
                        <span>
                          Exam date: {formatDate(result.exam.examDate)}
                        </span>
                      </div>

                      {result.remarks && (
                        <div className="mt-3 rounded-md bg-muted/50 p-3">
                          <p className="text-xs font-medium text-muted-foreground">
                            Remarks
                          </p>
                          <p className="mt-1 text-sm">{result.remarks}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-muted-foreground">
                    Page {page} of {totalPages || 1} · {totalResults} results
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
