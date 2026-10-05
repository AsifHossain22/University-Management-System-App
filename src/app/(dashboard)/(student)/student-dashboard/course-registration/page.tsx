'use client';

import { BookOpen, Search, Trash2 } from 'lucide-react';
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
  const [searchTerm, setSearchTerm] = useState('');

  const { data: sectionsResponse, isLoading: sectionsLoading } = useSections({
    searchTerm: searchTerm || undefined,
    isActive: true,
    page: 1,
    limit: 10,
  });

  const { data: registrationsResponse, isLoading: registrationsLoading } =
    useMyCourseRegistrations({
      page: 1,
      limit: 100,
    });

  const { mutate: registerCourse, isPending: registrationPending } =
    useRegisterCourse();

  const { mutate: dropCourse, isPending: dropPending } =
    useDropCourseRegistration();

  const sections = sectionsResponse?.data?.data ?? [];
  const registrations = registrationsResponse?.data?.data ?? [];

  const registeredSectionIds = new Set(
    registrations
      .filter(registration => registration.status === 'REGISTERED')
      .map(registration => registration.section.id),
  );

  const handleRegister = (sectionId: string) => {
    registerCourse(
      { sectionId },
      {
        onSuccess: () => {
          toast.success('Course registered successfully!');
        },
        onError: error => {
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
            <div className="relative max-w-md">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={event => setSearchTerm(event.target.value)}
                placeholder="Search by course or section..."
                className="pl-9"
              />
            </div>

            {sectionsLoading ? (
              <p className="text-sm text-muted-foreground">
                Loading available sections...
              </p>
            ) : sections.length === 0 ? (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <BookOpen className="mx-auto size-8 text-muted-foreground" />
                <p className="mt-3 font-medium">No sections found</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try a different search term.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {sections.map(section => {
                  const alreadyRegistered = registeredSectionIds.has(
                    section.id,
                  );

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
                          disabled={alreadyRegistered || registrationPending}
                          onClick={() => handleRegister(section.id)}
                        >
                          {alreadyRegistered
                            ? 'Already Registered'
                            : registrationPending
                              ? 'Registering...'
                              : 'Register Course'}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

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
