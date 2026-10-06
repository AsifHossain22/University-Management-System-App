'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useUpdateMe } from '@/hooks/auth.hook';
import type { User } from '@/types/auth.type';

const adminProfileFormSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),
});

type AdminProfileFormValues = z.infer<typeof adminProfileFormSchema>;

interface AdminProfileFormProps {
  user: User;
}

export function AdminProfileForm({ user }: AdminProfileFormProps) {
  const updateMeMutation = useUpdateMe();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdminProfileFormValues>({
    resolver: zodResolver(adminProfileFormSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });

  useEffect(() => {
    reset({
      firstName: user.firstName,
      lastName: user.lastName,
    });
  }, [user, reset]);

  const onSubmit = (values: AdminProfileFormValues) => {
    updateMeMutation.mutate(values, {
      onSuccess: () => {
        toast.success('Profile updated successfully!');
      },
      onError: () => {
        toast.error('Failed to update profile.');
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded-lg border p-6"
    >
      <div>
        <label htmlFor="admin-first-name" className="text-sm font-medium">
          First Name
        </label>

        <input
          id="admin-first-name"
          {...register('firstName')}
          className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        />

        {errors.firstName && (
          <p className="mt-1 text-sm text-destructive">
            {errors.firstName.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="admin-last-name" className="text-sm font-medium">
          Last Name
        </label>

        <input
          id="admin-last-name"
          {...register('lastName')}
          className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        />

        {errors.lastName && (
          <p className="mt-1 text-sm text-destructive">
            {errors.lastName.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={updateMeMutation.isPending}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
      >
        {updateMeMutation.isPending ? 'Updating...' : 'Update Profile'}
      </button>
    </form>
  );
}
