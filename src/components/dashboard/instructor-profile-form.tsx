'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useUpdateMyInstructorProfile } from '@/hooks/instructor.hook';
import { getApiErrorMessage } from '@/lib/api-error';
import type { InstructorProfile } from '@/types/instructor.type';

const instructorProfileFormSchema = z.object({
  specialization: z.string().trim().min(1, 'Specialization cannot be empty'),

  qualification: z.string().trim().min(1, 'Qualification cannot be empty'),

  experienceYears: z.coerce
    .number()
    .int('Experience years must be a whole number')
    .min(0, 'Experience years cannot be negative'),

  bio: z.string().trim().min(1, 'Bio cannot be empty'),

  phone: z
    .string()
    .trim()
    .min(7, 'Phone number must be at least 7 characters')
    .max(20, 'Phone number cannot exceed 20 characters'),

  address: z.string().trim().min(1, 'Address cannot be empty'),
});

type InstructorProfileFormValues = z.infer<typeof instructorProfileFormSchema>;

type InstructorProfileFormProps = {
  instructor: InstructorProfile;
};

export function InstructorProfileForm({
  instructor,
}: InstructorProfileFormProps) {
  const updateProfile = useUpdateMyInstructorProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<InstructorProfileFormValues>({
    resolver: zodResolver(instructorProfileFormSchema),

    defaultValues: {
      specialization: instructor.specialization ?? '',
      qualification: instructor.qualification ?? '',
      experienceYears: instructor.experienceYears ?? 0,
      bio: instructor.bio ?? '',
      phone: instructor.phone ?? '',
      address: instructor.address ?? '',
    },
  });

  const onSubmit = (values: InstructorProfileFormValues) => {
    updateProfile.mutate(values, {
      onSuccess: response => {
        const updatedInstructor = response.data;

        toast.success('Profile updated successfully.');

        reset({
          specialization: updatedInstructor.specialization ?? '',
          qualification: updatedInstructor.qualification ?? '',
          experienceYears: updatedInstructor.experienceYears ?? 0,
          bio: updatedInstructor.bio ?? '',
          phone: updatedInstructor.phone ?? '',
          address: updatedInstructor.address ?? '',
        });
      },

      onError: error => {
        toast.error(getApiErrorMessage(error));
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>

        <CardDescription>
          Update your professional and contact information.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Specialization */}
            <div className="space-y-2">
              <label htmlFor="specialization" className="text-sm font-medium">
                Specialization
              </label>

              <Input
                id="specialization"
                {...register('specialization')}
                disabled={updateProfile.isPending}
              />

              {errors.specialization && (
                <p className="text-sm text-destructive">
                  {errors.specialization.message}
                </p>
              )}
            </div>

            {/* Qualification */}
            <div className="space-y-2">
              <label htmlFor="qualification" className="text-sm font-medium">
                Qualification
              </label>

              <Input
                id="qualification"
                {...register('qualification')}
                disabled={updateProfile.isPending}
              />

              {errors.qualification && (
                <p className="text-sm text-destructive">
                  {errors.qualification.message}
                </p>
              )}
            </div>

            {/* Experience Years */}
            <div className="space-y-2">
              <label htmlFor="experienceYears" className="text-sm font-medium">
                Experience Years
              </label>

              <Input
                id="experienceYears"
                type="number"
                min={0}
                {...register('experienceYears', {
                  valueAsNumber: true,
                })}
                disabled={updateProfile.isPending}
              />

              {errors.experienceYears && (
                <p className="text-sm text-destructive">
                  {errors.experienceYears.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Phone
              </label>

              <Input
                id="phone"
                type="tel"
                {...register('phone')}
                disabled={updateProfile.isPending}
              />

              {errors.phone && (
                <p className="text-sm text-destructive">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Email - ReadOnly */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>

              <Input id="email" value={instructor.user.email} disabled />
            </div>

            {/* Instructor ID - ReadOnly */}
            <div className="space-y-2">
              <label htmlFor="instructorId" className="text-sm font-medium">
                Instructor ID
              </label>

              <Input
                id="instructorId"
                value={instructor.instructorId}
                disabled
              />
            </div>

            {/* Address */}
            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="address" className="text-sm font-medium">
                Address
              </label>

              <Input
                id="address"
                {...register('address')}
                disabled={updateProfile.isPending}
              />

              {errors.address && (
                <p className="text-sm text-destructive">
                  {errors.address.message}
                </p>
              )}
            </div>

            {/* Bio */}
            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="bio" className="text-sm font-medium">
                Bio
              </label>

              <Input
                id="bio"
                {...register('bio')}
                disabled={updateProfile.isPending}
              />

              {errors.bio && (
                <p className="text-sm text-destructive">{errors.bio.message}</p>
              )}
            </div>
          </div>

          <Button type="submit" disabled={!isDirty || updateProfile.isPending}>
            {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
