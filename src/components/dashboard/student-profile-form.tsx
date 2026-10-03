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
import { useUpdateMyStudentProfile } from '@/hooks/student.hook';
import { getApiErrorMessage } from '@/lib/api-error';
import type { StudentProfile } from '@/types/student.type';

const studentProfileFormSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required'),

  lastName: z.string().trim().min(1, 'Last name is required'),

  phone: z
    .string()
    .trim()
    .min(7, 'Phone number must be at least 7 characters')
    .max(20, 'Phone number cannot exceed 20 characters'),

  address: z.string().trim().min(1, 'Address is required'),
});

type StudentProfileFormValues = z.infer<typeof studentProfileFormSchema>;

type StudentProfileFormProps = {
  student: StudentProfile;
};

export function StudentProfileForm({ student }: StudentProfileFormProps) {
  const updateProfile = useUpdateMyStudentProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<StudentProfileFormValues>({
    resolver: zodResolver(studentProfileFormSchema),

    defaultValues: {
      firstName: student.user.firstName,
      lastName: student.user.lastName,
      phone: student.phone ?? '',
      address: student.address ?? '',
    },
  });

  const onSubmit = (values: StudentProfileFormValues) => {
    updateProfile.mutate(values, {
      onSuccess: response => {
        const updatedStudent = response.data;

        toast.success('Profile updated successfully.');

        reset({
          firstName: updatedStudent.user.firstName,
          lastName: updatedStudent.user.lastName,
          phone: updatedStudent.phone ?? '',
          address: updatedStudent.address ?? '',
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

        <CardDescription>Update your personal information.</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            {/* FirstName */}
            <div className="space-y-2">
              <label htmlFor="firstName" className="text-sm font-medium">
                First Name
              </label>

              <Input
                id="firstName"
                {...register('firstName')}
                disabled={updateProfile.isPending}
              />

              {errors.firstName && (
                <p className="text-sm text-destructive">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            {/* LastName */}
            <div className="space-y-2">
              <label htmlFor="lastName" className="text-sm font-medium">
                Last Name
              </label>

              <Input
                id="lastName"
                {...register('lastName')}
                disabled={updateProfile.isPending}
              />

              {errors.lastName && (
                <p className="text-sm text-destructive">
                  {errors.lastName.message}
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

              <Input id="email" value={student.user.email} disabled />
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
          </div>

          <Button type="submit" disabled={!isDirty || updateProfile.isPending}>
            {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
