'use client';

import { Briefcase, Mail, MapPin, Phone, UserRound } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InstructorProfileForm } from '@/components/dashboard/instructor-profile-form';
import { InstructorProfilePhoto } from '@/components/dashboard/instructor-profile-photo';
import { useMyInstructorProfile } from '@/hooks/instructor.hook';
import { getApiErrorMessage } from '@/lib/api-error';

export default function InstructorDashboardPage() {
  const { data, isLoading, isError, error } = useMyInstructorProfile();

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
            Here is an overview of your instructor profile.
          </p>
        </div>

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
              {/* Specialization */}
              <div className="flex items-start gap-3">
                <Briefcase className="mt-0.5 size-5 shrink-0 text-primary" />

                <div>
                  <p className="text-sm font-medium">Specialization</p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {instructor.specialization ?? 'Not provided'}
                  </p>
                </div>
              </div>

              {/* Qualification */}
              <div className="flex items-start gap-3">
                <Briefcase className="mt-0.5 size-5 shrink-0 text-primary" />

                <div>
                  <p className="text-sm font-medium">Qualification</p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {instructor.qualification ?? 'Not provided'}
                  </p>
                </div>
              </div>

              {/* Experience */}
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

              {/* Bio */}
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
              {/* Email */}
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 size-5 shrink-0 text-primary" />

                <div className="min-w-0">
                  <p className="text-sm font-medium">Email</p>

                  <p className="mt-1 wrap-break-word text-sm text-muted-foreground">
                    {instructor.user.email}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 size-5 shrink-0 text-primary" />

                <div>
                  <p className="text-sm font-medium">Phone</p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {instructor.phone ?? 'Not provided'}
                  </p>
                </div>
              </div>

              {/* Address */}
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

        {/* EditProfile */}
        <InstructorProfileForm instructor={instructor} />
      </div>
    </main>
  );
}
