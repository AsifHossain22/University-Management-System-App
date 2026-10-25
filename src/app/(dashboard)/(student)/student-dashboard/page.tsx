'use client';

import {
  ArrowRight,
  BookOpen,
  CalendarCheck,
  CreditCard,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { StudentProfileForm } from '@/components/dashboard/student-profile-form';
import { StudentProfilePhoto } from '@/components/dashboard/student-profile-photo';
import { Card, CardContent } from '@/components/ui/card';
import { useMyStudentProfile } from '@/hooks/student.hook';
import { getApiErrorMessage } from '@/lib/api-error';

const quickLinks = [
  {
    title: 'Course Registration',
    description: 'Explore and manage your course registrations.',
    href: '/student-dashboard/course-registration',
    icon: BookOpen,
  },
  {
    title: 'Attendance',
    description: 'Review your attendance information.',
    href: '/student-dashboard/attendance',
    icon: CalendarCheck,
  },
  {
    title: 'Academic Results',
    description: 'View your available academic results.',
    href: '/student-dashboard/results',
    icon: GraduationCap,
  },
  {
    title: 'Fees & Payments',
    description: 'Review your fees and payment information.',
    href: '/student-dashboard/fees',
    icon: CreditCard,
  },
];

export default function StudentDashboardPage() {
  const { data, isLoading, isError, error } = useMyStudentProfile();

  useEffect(() => {
    if (isError) {
      toast.error(getApiErrorMessage(error));
    }
  }, [isError, error]);

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="h-4 w-32 animate-pulse rounded bg-muted" />
          <div className="h-10 w-72 max-w-full animate-pulse rounded bg-muted" />
          <div className="h-5 w-96 max-w-full animate-pulse rounded bg-muted" />
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="h-56 animate-pulse rounded-xl bg-muted lg:col-span-2" />
            <div className="h-56 animate-pulse rounded-xl bg-muted" />
          </div>
          <div className="h-64 animate-pulse rounded-xl bg-muted" />
        </div>
      </main>
    );
  }

  if (isError || !data?.data) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="flex flex-col items-center px-6 py-12 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10">
              <UserRound className="size-7 text-destructive" />
            </div>
            <h1 className="mt-4 text-xl font-semibold">
              Unable to load your dashboard
            </h1>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              We couldn’t retrieve your student profile. Please refresh the page
              and try again.
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  const student = data.data;
  const fullName = `${student.user.firstName} ${student.user.lastName}`.trim();

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="space-y-8">
        {/* WelcomeHeader */}
        <section className="relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
          <div className="pointer-events-none absolute -right-16 -top-20 size-64 rounded-full bg-primary/5 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground">
                <GraduationCap className="size-4 text-primary" />
                Student portal
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Welcome back, {student.user.firstName}!
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
                Manage your student profile, access academic resources and keep
                track of your university activities from one place.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3 rounded-xl border bg-background/80 p-4">
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
                <ShieldCheck className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">Student account</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {student.user.role}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* StudentProfile */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Your profile
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Your personal information and contact details.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="overflow-hidden lg:col-span-2">
              <div className="h-1.5 bg-primary" />
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                  <div className="flex shrink-0 justify-center sm:justify-start">
                    <StudentProfilePhoto student={student} />
                  </div>

                  <div className="min-w-0 flex-1 text-center sm:text-left">
                    <p className="text-sm font-medium text-primary">
                      Student profile
                    </p>
                    <h2 className="mt-1 wrap-break-word text-2xl font-bold tracking-tight">
                      {fullName}
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Your university identity and personal profile.
                    </p>

                    <div className="mt-4 inline-flex max-w-full items-center gap-2 rounded-lg bg-muted px-3 py-2">
                      <GraduationCap className="size-4 shrink-0 text-primary" />
                      <span className="text-xs text-muted-foreground">
                        Student ID
                      </span>
                      <span className="break-all text-sm font-semibold">
                        {student.studentId}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex h-full flex-col p-6">
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
                  <UserRound className="size-5 text-primary" />
                </div>

                <h3 className="mt-4 font-semibold">Account information</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your current account role and portal access.
                </p>

                <div className="mt-5 border-t pt-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Account role
                  </p>
                  <p className="mt-2 text-sm font-semibold">
                    {student.user.role}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ContactInformation */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Contact information
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Contact details associated with your student profile.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardContent className="flex items-start gap-4 p-5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Mail className="size-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium">Email address</p>
                  <p className="mt-2 break-all text-sm text-muted-foreground">
                    {student.user.email}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-start gap-4 p-5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Phone className="size-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium">Phone number</p>
                  <p className="mt-2 wrap-break-word text-sm text-muted-foreground">
                    {student.phone || 'Not provided'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="sm:col-span-2 lg:col-span-1">
              <CardContent className="flex items-start gap-4 p-5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <MapPin className="size-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium">Address</p>
                  <p className="mt-2 wrap-break-word text-sm text-muted-foreground">
                    {student.address || 'Not provided'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* QuickAccess */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Quick access
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Jump directly to your student services.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {quickLinks.map(item => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <Card className="h-full transition-colors duration-200 group-hover:border-primary/40 group-hover:bg-accent/40">
                    <CardContent className="flex h-full flex-col p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/15">
                          <Icon className="size-5 text-primary" />
                        </div>
                        <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                      </div>

                      <h3 className="mt-5 font-semibold">{item.title}</h3>
                      <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
            <GraduationCap className="size-5 shrink-0 text-primary" />
            <span>Need your complete academic record?</span>
            <Link
              href="/student-dashboard/transcript"
              className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
            >
              View transcript
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </section>

        {/* EditProfile */}
        <section className="space-y-4" id="edit-profile">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Manage your profile
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Update your information using the existing profile form.
            </p>
          </div>

          <StudentProfileForm student={student} />
        </section>
      </div>
    </main>
  );
}
