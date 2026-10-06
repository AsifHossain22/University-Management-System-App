'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useCreateCourse, useUpdateCourse } from '@/hooks/course.hook';
import { useDepartments } from '@/hooks/department.hook';
import { usePrograms } from '@/hooks/program.hook';
import type { Course } from '@/types/course.type';

const courseFormSchema = z.object({
  name: z.string().trim().min(1, 'Course name is required'),
  code: z.string().trim().min(1, 'Course code is required'),
  description: z.string().optional(),
  credits: z.coerce
    .number()
    .int('Course credits must be a whole number')
    .positive('Course credits must be greater than 0'),
  departmentId: z.string().min(1, 'Department is required'),
  programId: z.string().min(1, 'Program is required'),
});

type CourseFormValues = z.infer<typeof courseFormSchema>;

interface CourseFormProps {
  course?: Course | null;
  onSuccess?: () => void;
}

export default function CourseForm({ course, onSuccess }: CourseFormProps) {
  const isEditMode = Boolean(course);

  const createCourseMutation = useCreateCourse();
  const updateCourseMutation = useUpdateCourse();

  const { data: departmentResponse, isLoading: isDepartmentsLoading } =
    useDepartments({
      page: 1,
      limit: 100,
      sortBy: 'name',
      sortOrder: 'asc',
    });

  const departments = departmentResponse?.data ?? [];

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      name: '',
      code: '',
      description: '',
      credits: 3,
      departmentId: '',
      programId: '',
    },
  });

  const selectedDepartmentId = watch('departmentId');

  const { data: programResponse, isLoading: isProgramsLoading } = usePrograms({
    departmentId: selectedDepartmentId || undefined,
    page: 1,
    limit: 100,
    sortBy: 'name',
    sortOrder: 'asc',
  });

  const programs = programResponse?.data ?? [];

  // LoadCourseDataForEdit
  useEffect(() => {
    if (!course) {
      reset({
        name: '',
        code: '',
        description: '',
        credits: 3,
        departmentId: '',
        programId: '',
      });

      return;
    }

    reset({
      name: course.name,
      code: course.code,
      description: course.description ?? '',
      credits: course.credits,
      departmentId: course.departmentId,
      programId: course.programId,
    });
  }, [course, reset]);

  const onSubmit = (values: CourseFormValues) => {
    if (course) {
      updateCourseMutation.mutate(
        {
          courseId: course.id,
          payload: values,
        },
        {
          onSuccess: () => {
            toast.success('Course updated successfully!');
            onSuccess?.();
          },
          onError: () => {
            toast.error('Failed to update course.');
          },
        },
      );

      return;
    }

    createCourseMutation.mutate(values, {
      onSuccess: () => {
        toast.success('Course created successfully!');
        reset();
        onSuccess?.();
      },
      onError: () => {
        toast.error('Failed to create course.');
      },
    });
  };

  const isPending =
    createCourseMutation.isPending || updateCourseMutation.isPending;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded-lg border p-6"
    >
      <div>
        <h2 className="text-lg font-semibold">
          {isEditMode ? 'Edit Course' : 'Create Course'}
        </h2>

        <p className="text-sm text-muted-foreground">
          {isEditMode
            ? 'Update the course information.'
            : 'Add a new university course.'}
        </p>
      </div>

      <div>
        <label htmlFor="course-name" className="text-sm font-medium">
          Course Name
        </label>

        <input
          id="course-name"
          {...register('name')}
          className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          placeholder="Introduction to Programming"
        />

        {errors.name && (
          <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="course-code" className="text-sm font-medium">
          Course Code
        </label>

        <input
          id="course-code"
          {...register('code')}
          className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm uppercase outline-none focus:ring-2 focus:ring-ring"
          placeholder="CSE101"
        />

        {errors.code && (
          <p className="mt-1 text-sm text-destructive">{errors.code.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="course-department" className="text-sm font-medium">
          Department
        </label>

        <select
          id="course-department"
          {...register('departmentId', {
            onChange: () => {
              setValue('programId', '');
            },
          })}
          disabled={isDepartmentsLoading || isPending}
          className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">
            {isDepartmentsLoading
              ? 'Loading departments...'
              : 'Select a department'}
          </option>

          {departments.map(department => (
            <option key={department.id} value={department.id}>
              {department.name} ({department.code})
            </option>
          ))}
        </select>

        {errors.departmentId && (
          <p className="mt-1 text-sm text-destructive">
            {errors.departmentId.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="course-program" className="text-sm font-medium">
          Program
        </label>

        <select
          id="course-program"
          {...register('programId')}
          disabled={!selectedDepartmentId || isProgramsLoading || isPending}
          className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">
            {!selectedDepartmentId
              ? 'Select a department first'
              : isProgramsLoading
                ? 'Loading programs...'
                : 'Select a program'}
          </option>

          {programs.map(program => (
            <option key={program.id} value={program.id}>
              {program.name} ({program.code})
            </option>
          ))}
        </select>

        {errors.programId && (
          <p className="mt-1 text-sm text-destructive">
            {errors.programId.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="course-credits" className="text-sm font-medium">
          Credits
        </label>

        <input
          id="course-credits"
          type="number"
          min="1"
          {...register('credits')}
          disabled={isPending}
          className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="3"
        />

        {errors.credits && (
          <p className="mt-1 text-sm text-destructive">
            {errors.credits.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="course-description" className="text-sm font-medium">
          Description
        </label>

        <textarea
          id="course-description"
          {...register('description')}
          disabled={isPending}
          className="mt-1 min-h-24 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Course description"
        />
      </div>

      <button
        type="submit"
        disabled={
          isPending ||
          isDepartmentsLoading ||
          isProgramsLoading ||
          departments.length === 0 ||
          programs.length === 0
        }
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending
          ? isEditMode
            ? 'Updating...'
            : 'Creating...'
          : isEditMode
            ? 'Update Course'
            : 'Create Course'}
      </button>
    </form>
  );
}
