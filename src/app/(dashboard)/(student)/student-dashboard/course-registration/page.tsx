'use client';

import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  GraduationCap,
  Search,
  Trash2,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  useDropCourseRegistration,
  useMyCourseRegistrations,
  useRegisterCourse,
} from '@/hooks/course-registration.hook';
import { useSections } from '@/hooks/section.hook';
import { getApiErrorMessage } from '@/lib/api-error';

export default function CourseRegistrationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [registeringSectionId, setRegisteringSectionId] = useState<
    string | null
  >(null);

  const searchTerm = searchParams.get('searchTerm') ?? '';
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 6;

  const { data: sectionsResponse, isLoading: sectionsLoading } = useSections({
    searchTerm: searchTerm || undefined,
    isActive: true,
    page,
    limit,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const { data: registrationsResponse, isLoading: registrationsLoading } =
    useMyCourseRegistrations({
      page: 1,
      limit: 100,
    });

  const { mutate: registerCourse } = useRegisterCourse();

  const { mutate: dropCourse, isPending: dropPending } =
    useDropCourseRegistration();

  const sections = sectionsResponse?.data?.data ?? [];
  const sectionsMeta = sectionsResponse?.data?.meta;
  const registrations = registrationsResponse?.data?.data ?? [];

  const registeredSectionIds = new Set(
    registrations
      .filter(registration => registration.status === 'REGISTERED')
      .map(registration => registration.section.id),
  );

  const activeRegistrations = registrations.filter(
    registration => registration.status === 'REGISTERED',
  );

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value.trim()) {
      params.set('searchTerm', value);
    } else {
      params.delete('searchTerm');
    }

    params.set('page', '1');

    router.push(`/student-dashboard/course-registration?${params.toString()}`);
  };

  const handlePreviousPage = () => {
    if (page <= 1) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page - 1));

    router.push(`/student-dashboard/course-registration?${params.toString()}`);
  };

  const handleNextPage = () => {
    if (!sectionsMeta || page >= sectionsMeta.totalPages) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page + 1));

    router.push(`/student-dashboard/course-registration?${params.toString()}`);
  };

  const handleRegister = (sectionId: string) => {
    setRegisteringSectionId(sectionId);

    registerCourse(
      { sectionId },
      {
        onSuccess: () => {
          setRegisteringSectionId(null);
          toast.success('Course registered successfully!');
        },
        onError: error => {
          setRegisteringSectionId(null);
          toast.error(getApiErrorMessage(error));
        },
      },
    );
  };

  const handleDrop = (registrationId: string) => {
    dropCourse(registrationId, {
      onSuccess: () => {
        toast.success('Course dropped successfully!');
      },
      onError: error => {
        toast.error(getApiErrorMessage(error));
      },
    });
  };

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
                  Course Registration
                </h1>

                <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
                  Discover available course sections, manage your registrations
                  and keep track of your academic enrollment.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border bg-background p-4 sm:min-w-48">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CheckCircle2 className="size-5" />
              </div>

              <div>
                <p className="text-2xl font-bold">
                  {registrationsLoading ? '—' : activeRegistrations.length}
                </p>
                <p className="text-xs text-muted-foreground">
                  Active registrations
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* AvailableSections */}
        <section>
          <Card className="overflow-hidden">
            <CardHeader className="border-b bg-muted/20 px-5 py-5 sm:px-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BookOpen className="size-5 text-primary" />
                    Available Sections
                  </CardTitle>

                  <CardDescription>
                    Find a course section that fits your academic plan.
                  </CardDescription>
                </div>

                {sectionsMeta && (
                  <span className="w-fit rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                    {sectionsMeta.total} total sections
                  </span>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-6 p-5 sm:p-6">
              {/* Search */}
              <div className="space-y-2">
                <label htmlFor="course-search" className="text-sm font-medium">
                  Search courses
                </label>

                <div className="relative max-w-lg">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="course-search"
                    value={searchTerm}
                    onChange={event => handleSearch(event.target.value)}
                    placeholder="Search by course or section..."
                    className="h-11 pl-9"
                  />
                </div>

                <p className="text-xs text-muted-foreground">
                  Search using a course name, course code or section.
                </p>
              </div>

              {/* AvailableSections */}
              {sectionsLoading ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {Array.from({ length: 4 }, (_, index) => (
                    <div
                      key={index}
                      className="animate-pulse space-y-5 rounded-xl border p-5"
                    >
                      <div className="space-y-2">
                        <div className="h-5 w-2/3 rounded bg-muted" />
                        <div className="h-4 w-1/2 rounded bg-muted" />
                      </div>

                      <div className="space-y-3">
                        <div className="h-4 w-3/4 rounded bg-muted" />
                        <div className="h-4 w-2/3 rounded bg-muted" />
                        <div className="h-4 w-1/2 rounded bg-muted" />
                      </div>

                      <div className="h-10 rounded-lg bg-muted" />
                    </div>
                  ))}
                </div>
              ) : sections.length === 0 ? (
                <div className="rounded-xl border border-dashed px-5 py-12 text-center">
                  <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-muted">
                    <BookOpen className="size-7 text-muted-foreground" />
                  </div>

                  <h3 className="mt-4 font-semibold">No sections found</h3>

                  <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                    {searchTerm
                      ? 'No sections match your search. Try another course name or code.'
                      : 'There are currently no available sections to display.'}
                  </p>

                  {searchTerm && (
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => handleSearch('')}
                    >
                      Clear search
                    </Button>
                  )}
                </div>
              ) : (
                <>
                  <div className="grid gap-4 md:grid-cols-2">
                    {sections.map(section => {
                      const alreadyRegistered = registeredSectionIds.has(
                        section.id,
                      );

                      const isRegistering = registeringSectionId === section.id;

                      return (
                        <Card
                          key={section.id}
                          className="flex flex-col rounded-xl transition-shadow hover:shadow-md"
                        >
                          <CardHeader className="space-y-3 pb-3">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <BookOpen className="size-5" />
                              </div>

                              {alreadyRegistered ? (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-700 dark:text-green-400">
                                  <CheckCircle2 className="size-3.5" />
                                  Registered
                                </span>
                              ) : (
                                <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                                  Available
                                </span>
                              )}
                            </div>

                            <div className="space-y-1">
                              <CardTitle className="text-base leading-6">
                                {section.course.code} - {section.course.name}
                              </CardTitle>

                              <CardDescription>
                                Section {section.code} · {section.name}
                              </CardDescription>
                            </div>
                          </CardHeader>

                          <CardContent className="flex flex-1 flex-col gap-5 pt-2">
                            <div className="grid gap-3 rounded-lg bg-muted/30 p-3 text-sm">
                              <div className="flex items-start justify-between gap-4">
                                <span className="text-muted-foreground">
                                  Credits
                                </span>
                                <span className="text-right font-medium">
                                  {section.course.credits}
                                </span>
                              </div>

                              <div className="flex items-start justify-between gap-4">
                                <span className="text-muted-foreground">
                                  Semester
                                </span>
                                <span className="text-right font-medium">
                                  {section.semester.name}
                                </span>
                              </div>

                              <div className="flex items-start justify-between gap-4">
                                <span className="text-muted-foreground">
                                  Instructor
                                </span>
                                <span className="max-w-[65%] text-right font-medium">
                                  {section.instructor
                                    ? `${section.instructor.user.firstName} ${section.instructor.user.lastName}`
                                    : 'Not assigned'}
                                </span>
                              </div>

                              <div className="flex items-start justify-between gap-4">
                                <span className="text-muted-foreground">
                                  Capacity
                                </span>
                                <span className="text-right font-medium">
                                  {section.capacity}
                                </span>
                              </div>
                            </div>

                            <Button
                              className="mt-auto w-full"
                              disabled={alreadyRegistered || isRegistering}
                              onClick={() => handleRegister(section.id)}
                            >
                              {alreadyRegistered ? (
                                <>
                                  <CheckCircle2 className="size-4" />
                                  Already Registered
                                </>
                              ) : isRegistering ? (
                                <>
                                  <Clock3 className="size-4 animate-pulse" />
                                  Registering...
                                </>
                              ) : (
                                'Register Course'
                              )}
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  {/* Pagination */}
                  {sectionsMeta && sectionsMeta.totalPages > 1 && (
                    <div className="flex flex-col gap-4 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm text-muted-foreground">
                        Page {sectionsMeta.page} of {sectionsMeta.totalPages}
                        <span className="mx-2">·</span>
                        {sectionsMeta.total} total sections
                      </p>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={page <= 1 || sectionsLoading}
                          onClick={handlePreviousPage}
                        >
                          <ChevronLeft className="size-4" />
                          Previous
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          disabled={
                            page >= sectionsMeta.totalPages || sectionsLoading
                          }
                          onClick={handleNextPage}
                        >
                          Next
                          <ChevronRight className="size-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </section>

        {/* MyRegistrations */}
        <section>
          <Card className="overflow-hidden">
            <CardHeader className="border-b bg-muted/20 px-5 py-5 sm:px-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <GraduationCap className="size-5 text-primary" />
                    My Registered Courses
                  </CardTitle>

                  <CardDescription>
                    Review your course registrations and manage your current
                    enrollment.
                  </CardDescription>
                </div>

                {!registrationsLoading && (
                  <span className="w-fit rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                    {registrations.length} records
                  </span>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-5 sm:p-6">
              {registrationsLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 2 }, (_, index) => (
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
              ) : registrations.length === 0 ? (
                <div className="rounded-xl border border-dashed px-5 py-12 text-center">
                  <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-muted">
                    <GraduationCap className="size-7 text-muted-foreground" />
                  </div>

                  <h3 className="mt-4 font-semibold">
                    No course registrations yet
                  </h3>

                  <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                    Once you register for a course, its details and status will
                    appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {registrations.map(registration => {
                    const isRegistered = registration.status === 'REGISTERED';

                    return (
                      <div
                        key={registration.id}
                        className="flex flex-col gap-4 rounded-xl border p-4 transition-colors hover:bg-muted/20 sm:p-5 lg:flex-row lg:items-center lg:justify-between"
                      >
                        <div className="flex min-w-0 gap-3">
                          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <BookOpen className="size-5" />
                          </div>

                          <div className="min-w-0 space-y-1.5">
                            <h3 className="wrap-break-word font-semibold">
                              {registration.section.course.code} -{' '}
                              {registration.section.course.name}
                            </h3>

                            <p className="text-sm text-muted-foreground">
                              Section {registration.section.code} ·{' '}
                              {registration.section.name}
                            </p>

                            <p className="text-sm text-muted-foreground">
                              Semester: {registration.section.semester.name}
                            </p>

                            <div className="flex flex-wrap items-center gap-2 pt-1">
                              <span className="text-sm text-muted-foreground">
                                Status:
                              </span>

                              <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                                  isRegistered
                                    ? 'bg-green-500/10 text-green-700 dark:text-green-400'
                                    : 'bg-muted text-muted-foreground'
                                }`}
                              >
                                {isRegistered && (
                                  <CheckCircle2 className="size-3.5" />
                                )}
                                {registration.status}
                              </span>
                            </div>
                          </div>
                        </div>

                        {isRegistered && (
                          <Button
                            variant="outline"
                            className="shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive lg:self-center"
                            disabled={dropPending}
                            onClick={() => handleDrop(registration.id)}
                          >
                            <Trash2 className="size-4" />
                            {dropPending ? 'Dropping...' : 'Drop Course'}
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
