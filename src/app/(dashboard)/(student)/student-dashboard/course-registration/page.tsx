'use client';

import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
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

  // RegistrationLoadingState
  const [registeringSectionId, setRegisteringSectionId] = useState<
    string | null
  >(null);

  // URLSearchParams
  const searchTerm = searchParams.get('searchTerm') ?? '';
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 6;

  // GetSections
  const { data: sectionsResponse, isLoading: sectionsLoading } = useSections({
    searchTerm: searchTerm || undefined,
    isActive: true,
    page,
    limit,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  // GetMyRegistrations
  const { data: registrationsResponse, isLoading: registrationsLoading } =
    useMyCourseRegistrations({
      page: 1,
      limit: 100,
    });

  // RegisterCourse
  const { mutate: registerCourse } = useRegisterCourse();

  // DropCourse
  const { mutate: dropCourse, isPending: dropPending } =
    useDropCourseRegistration();

  const sections = sectionsResponse?.data?.data ?? [];
  const sectionsMeta = sectionsResponse?.data?.meta;
  const registrations = registrationsResponse?.data?.data ?? [];

  // RegisteredSectionIds
  const registeredSectionIds = new Set(
    registrations
      .filter(registration => registration.status === 'REGISTERED')
      .map(registration => registration.section.id),
  );

  // UpdateSearch
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

  // PreviousPage
  const handlePreviousPage = () => {
    if (page <= 1) return;

    const params = new URLSearchParams(searchParams.toString());

    params.set('page', String(page - 1));

    router.push(`/student-dashboard/course-registration?${params.toString()}`);
  };

  // NextPage
  const handleNextPage = () => {
    if (!sectionsMeta || page >= sectionsMeta.totalPages) return;

    const params = new URLSearchParams(searchParams.toString());

    params.set('page', String(page + 1));

    router.push(`/student-dashboard/course-registration?${params.toString()}`);
  };

  // Register
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

  // Drop
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
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <div>
          <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
            Course Registration
          </h1>
          <p className="mt-2 text-muted-foreground">
            Browse available sections and manage your course registrations.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Available Sections</CardTitle>
            <CardDescription>
              Search for courses and register for an available section.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={searchTerm}
                onChange={event => handleSearch(event.target.value)}
                placeholder="Search by course or section..."
                className="pl-9"
              />
            </div>

            {/* AvailableSections */}
            {sectionsLoading ? (
              <div className="rounded-lg border p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Loading available sections...
                </p>
              </div>
            ) : sections.length === 0 ? (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <BookOpen className="mx-auto size-8 text-muted-foreground" />
                <p className="mt-3 font-medium">No sections found</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try a different search term.
                </p>
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
                      <Card key={section.id} size="sm">
                        <CardHeader>
                          <CardTitle>
                            {section.course.code} - {section.course.name}
                          </CardTitle>

                          <CardDescription>
                            Section {section.code} · {section.name}
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          <div className="grid gap-2 text-sm">
                            <p>
                              <span className="font-medium">Credits:</span>{' '}
                              {section.course.credits}
                            </p>
                            <p>
                              <span className="font-medium">Semester:</span>{' '}
                              {section.semester.name}
                            </p>
                            <p>
                              <span className="font-medium">Instructor:</span>{' '}
                              {section.instructor
                                ? `${section.instructor.user.firstName} ${section.instructor.user.lastName}`
                                : 'Not assigned'}
                            </p>
                            <p>
                              <span className="font-medium">Capacity:</span>{' '}
                              {section.capacity}
                            </p>
                          </div>

                          <Button
                            className="w-full"
                            disabled={alreadyRegistered || isRegistering}
                            onClick={() => handleRegister(section.id)}
                          >
                            {alreadyRegistered
                              ? 'Already Registered'
                              : isRegistering
                                ? 'Registering...'
                                : 'Register Course'}
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Pagination */}
                {sectionsMeta && sectionsMeta.totalPages > 1 && (
                  <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-muted-foreground">
                      Page {sectionsMeta.page} of {sectionsMeta.totalPages} ·
                      Total sections: {sectionsMeta.total}
                    </p>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page <= 1 || sectionsLoading}
                        onClick={handlePreviousPage}
                      >
                        <ChevronLeft />
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
                        <ChevronRight />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* MyRegistrations */}
        <Card>
          <CardHeader>
            <CardTitle>My Registered Courses</CardTitle>
            <CardDescription>
              View the courses you have registered for.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {registrationsLoading ? (
              <p className="text-sm text-muted-foreground">
                Loading your registrations...
              </p>
            ) : registrations.length === 0 ? (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <BookOpen className="mx-auto size-8 text-muted-foreground" />
                <p className="mt-3 font-medium">
                  No course registrations found
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Register for a course from the available sections above.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {registrations.map(registration => {
                  const isRegistered = registration.status === 'REGISTERED';

                  return (
                    <div
                      key={registration.id}
                      className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">
                          {registration.section.course.code} -{' '}
                          {registration.section.course.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Section {registration.section.code} ·{' '}
                          {registration.section.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Semester: {registration.section.semester.name}
                        </p>
                        <p className="text-sm">
                          Status:{' '}
                          <span className="font-medium">
                            {registration.status}
                          </span>
                        </p>
                      </div>

                      {isRegistered && (
                        <Button
                          variant="destructive"
                          disabled={dropPending}
                          onClick={() => handleDrop(registration.id)}
                        >
                          <Trash2 />
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
      </div>
    </main>
  );
}
