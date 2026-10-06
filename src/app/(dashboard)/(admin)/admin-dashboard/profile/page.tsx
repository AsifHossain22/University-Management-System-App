'use client';

import { Mail, ShieldCheck, UserRound } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { AdminProfileForm } from '@/components/dashboard/admin-profile-form';
import { AdminProfilePhoto } from '@/components/dashboard/admin-profile-photo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetMe } from '@/hooks/auth.hook';
import { getApiErrorMessage } from '@/lib/api-error';

export default function AdminProfilePage() {
  const { data, isLoading, isError, error } = useGetMe();

  useEffect(() => {
    if (isError) {
      toast.error(getApiErrorMessage(error));
    }
  }, [isError, error]);

  if (isLoading) {
    return (
      <main className="p-4 md:p-6">
        <div className="rounded-lg border p-6">Loading profile...</div>
      </main>
    );
  }

  if (isError || !data?.data) {
    return (
      <main className="p-4 md:p-6">
        <div className="rounded-lg border p-6 text-destructive">
          Failed to load profile.
        </div>
      </main>
    );
  }

  const admin = data.data;
  const fullName = `${admin.firstName} ${admin.lastName}`;

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Profile</h1>
          <p className="text-muted-foreground">
            View and manage your administrator profile.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserRound className="size-5" />
                Profile Overview
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <AdminProfilePhoto user={admin} />

              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">{fullName}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{admin.email}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="size-5" />
                Account Information
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <p className="font-medium">{admin.role}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-medium">
                  {admin.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="size-5" />
              Edit Profile
            </CardTitle>
          </CardHeader>

          <CardContent>
            <AdminProfileForm user={admin} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
