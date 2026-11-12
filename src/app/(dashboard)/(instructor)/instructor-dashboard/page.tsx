'use client';

import {
  BookOpen,
  Briefcase,
  CalendarDays,
  Clock3,
  Mail,
  MapPin,
  Phone,
  UserRound,
} from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InstructorProfileForm } from '@/components/dashboard/instructor-profile-form';
import { InstructorProfilePhoto } from '@/components/dashboard/instructor-profile-photo';
import { useExams } from '@/hooks/exam.hook';
import { useMyInstructorProfile } from '@/hooks/instructor.hook';
import { getApiErrorMessage } from '@/lib/api-error';
import type { Exam } from '@/types/exam.type';

function getExamDateKey(value: string) {
  const dateOnly = value.match(/^\d{4}-\d{2}-\d{2}/)?.[0];

  if (dateOnly) {
    return dateOnly;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function formatExamDate(value: string) {
  const dateKey = getExamDateKey(value);

  if (!dateKey) {
    return 'Date unavailable';
  }

  const date = new Date(`${dateKey}T12:00:00`);

  return new Intl.DateTimeFormat(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function ExamList({
  exams,
  isLoading,
  isError,
  emptyMessage,
}: {
  exams: Exam[];
  isLoading: boolean;
  isError: boolean;
  emptyMessage: string;
}) {
  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading exams...</p>;
  }

  if (isError) {
    return (
      <p className="text-sm text-destructive">
        Failed to load exams. Please try again later.
      </p>
    );
  }

  if (exams.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyMessage}</p>;
  }

  return (
    <div className="space-y-4">
      {exams.map(exam => (
        <div key={exam.id} className="rounded-lg border p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 space-y-2">
              <h3 className="font-semibold">{exam.title}</h3>

              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                  {exam.type}
                </span>

                <span className="text-xs text-muted-foreground">
                  {exam.section?.name ?? 'Section unavailable'}
                  {exam.section?.code ? ` (${exam.section.code})` : ''}
                </span>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="size-4" />
              <span>{formatExamDate(exam.examDate)}</span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span>Total marks: {exam.totalMarks}</span>

            <span>Passing marks: {exam.passingMarks}</span>

            <span>Weight: {exam.weight}%</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function InstructorDashboardPage() {
  const { data, isLoading, isError, error } = useMyInstructorProfile();

  const {
    data: examsResponse,
    isLoading: isExamsLoading,
    isError: isExamsError,
  } = useExams({
    page: 1,
    limit: 100,
    sortBy: 'examDate',
    sortOrder: 'asc',
  });

  useEffect(() => {
    if (isError) {
      toast.error(getApiErrorMessage(error));
    }
  }, [isError, error]);

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-muted-foreground">Loading your profile...</p>
      </main>
    );
  }

  if (isError || !data?.data) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-destructive">
          Failed to load your instructor profile!
        </p>
      </main>
    );
  }

  const instructor = data.data;
  const fullName = `${instructor.user.firstName} ${instructor.user.lastName}`;

  const exams = examsResponse?.data ?? [];

  const todayKey = getExamDateKey(new Date().toISOString());

  const upcomingExams = exams
    .filter(exam => {
      const dateKey = getExamDateKey(exam.examDate);
      return dateKey && dateKey >= todayKey;
    })
    .sort((a, b) =>
      getExamDateKey(a.examDate).localeCompare(getExamDateKey(b.examDate)),
    )
    .slice(0, 5);

  const recentExams = exams
    .filter(exam => {
      const dateKey = getExamDateKey(exam.examDate);
      return dateKey && dateKey < todayKey;
    })
    .sort((a, b) =>
      getExamDateKey(b.examDate).localeCompare(getExamDateKey(a.examDate)),
    )
    .slice(0, 5);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Welcome */}
        <div>
          <p className="text-sm font-medium text-primary">
            Instructor Dashboard
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
            Welcome, {instructor.user.firstName}!
          </h1>

          <p className="mt-2 text-muted-foreground">
            Here is an overview of your teaching activities and instructor
            profile.
          </p>
        </div>

        {/* ExamOverview */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Exam Overview
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Keep track of your upcoming and recent exams.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* UpcomingExams */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="size-5 text-primary" />
                  Upcoming Exams
                </CardTitle>
              </CardHeader>

              <CardContent>
                <ExamList
                  exams={upcomingExams}
                  isLoading={isExamsLoading}
                  isError={isExamsError}
                  emptyMessage="You don't have any upcoming exams."
                />
              </CardContent>
            </Card>

            {/* RecentExams */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock3 className="size-5 text-primary" />
                  Recent Exams
                </CardTitle>
              </CardHeader>

              <CardContent>
                <ExamList
                  exams={recentExams}
                  isLoading={isExamsLoading}
                  isError={isExamsError}
                  emptyMessage="You don't have any recent exams."
                />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ProfileOverview */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Overview</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <InstructorProfilePhoto instructor={instructor} />

              <div className="space-y-1">
                <h2 className="text-xl font-semibold">{fullName}</h2>

                <p className="text-sm text-muted-foreground">
                  Instructor ID: {instructor.instructorId}
                </p>

                <p className="text-sm text-muted-foreground">
                  {instructor.specialization ?? 'Specialization not provided'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ProfessionalInformation */}
        <Card>
          <CardHeader>
            <CardTitle>Professional Information</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <Briefcase className="mt-0.5 size-5 shrink-0 text-primary" />

                <div>
                  <p className="text-sm font-medium">Specialization</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {instructor.specialization ?? 'Not provided'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Briefcase className="mt-0.5 size-5 shrink-0 text-primary" />

                <div>
                  <p className="text-sm font-medium">Qualification</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {instructor.qualification ?? 'Not provided'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Briefcase className="mt-0.5 size-5 shrink-0 text-primary" />

                <div>
                  <p className="text-sm font-medium">Experience</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {instructor.experienceYears !== null
                      ? `${instructor.experienceYears} years`
                      : 'Not provided'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:col-span-2">
                <UserRound className="mt-0.5 size-5 shrink-0 text-primary" />

                <div>
                  <p className="text-sm font-medium">Bio</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {instructor.bio ?? 'Not provided'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ContactInformation */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 size-5 shrink-0 text-primary" />

                <div className="min-w-0">
                  <p className="text-sm font-medium">Email</p>
                  <p className="mt-1 wrap-break-word text-sm text-muted-foreground">
                    {instructor.user.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 size-5 shrink-0 text-primary" />

                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {instructor.phone ?? 'Not provided'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:col-span-2">
                <MapPin className="mt-0.5 size-5 shrink-0 text-primary" />

                <div>
                  <p className="text-sm font-medium">Address</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {instructor.address ?? 'Not provided'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AccountInformation */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-start gap-3">
              <UserRound className="mt-0.5 size-5 shrink-0 text-primary" />

              <div>
                <p className="text-sm font-medium">Role</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {instructor.user.role}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile */}
        <InstructorProfileForm instructor={instructor} />
      </div>
    </main>
  );
}
