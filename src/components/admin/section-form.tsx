'use client';

import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { useCreateSection, useUpdateSection } from '@/hooks/section.hook';
import { useCourses } from '@/hooks/course.hook';
import { useSemesters } from '@/hooks/semester.hook';
import { useInstructors } from '@/hooks/instructor.hook';
import type { Section } from '@/types/section.type';

const sectionFormSchema = z.object({
  name: z.string().trim().min(1, 'Section name is required'),
  code: z.string().trim().min(1, 'Section code is required'),
  courseId: z.string().min(1, 'Course is required'),
  semesterId: z.string().min(1, 'Semester is required'),
  instructorId: z.string().min(1, 'Instructor is required'),
  capacity: z
    .number()
    .int('Capacity must be a whole number')
    .positive('Capacity must be greater than 0'),
});

interface SectionFormProps {
  section?: Section | null;
  onSuccess?: () => void;
}

export default function SectionForm({ section, onSuccess }: SectionFormProps) {
  const isEditMode = Boolean(section);

  const createSectionMutation = useCreateSection();
  const updateSectionMutation = useUpdateSection();

  const { data: courseResponse, isLoading: isCoursesLoading } = useCourses({
    page: 1,
    limit: 100,
    sortBy: 'name',
    sortOrder: 'asc',
  });

  const { data: semesterResponse, isLoading: isSemestersLoading } =
    useSemesters({
      page: 1,
      limit: 100,
      sortBy: 'startDate',
      sortOrder: 'desc',
    });

  const { data: instructorResponse, isLoading: isInstructorsLoading } =
    useInstructors();

  const courses = courseResponse?.data ?? [];
  const semesters = semesterResponse?.data?.data ?? [];
  const instructors = instructorResponse?.data ?? [];

  const form = useForm({
    defaultValues: {
      name: section?.name ?? '',
      code: section?.code ?? '',
      courseId: section?.courseId ?? '',
      semesterId: section?.semesterId ?? '',
      instructorId: section?.instructorId ?? '',
      capacity: section?.capacity ?? 30,
    },

    validators: {
      onSubmit: sectionFormSchema,
    },

    onSubmit: async ({ value }) => {
      if (section) {
        updateSectionMutation.mutate(
          {
            sectionId: section.id,
            payload: value,
          },
          {
            onSuccess: () => {
              toast.success('Section updated successfully!');
              onSuccess?.();
            },
            onError: () => {
              toast.error('Failed to update section.');
            },
          },
        );

        return;
      }

      createSectionMutation.mutate(value, {
        onSuccess: () => {
          toast.success('Section created successfully!');
          form.reset();
          onSuccess?.();
        },
        onError: () => {
          toast.error('Failed to create section.');
        },
      });
    },
  });

  const isPending =
    createSectionMutation.isPending || updateSectionMutation.isPending;

  return (
    <div className="rounded-lg border p-4 md:p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">
          {isEditMode ? 'Edit Section' : 'Add Section'}
        </h2>

        <p className="text-sm text-muted-foreground">
          {isEditMode
            ? 'Update the section information.'
            : 'Create a new course section.'}
        </p>
      </div>

      <form
        onSubmit={event => {
          event.preventDefault();
          event.stopPropagation();
          form.handleSubmit();
        }}
        noValidate
        className="grid gap-4 md:grid-cols-2"
      >
        <form.Field name="name">
          {field => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <div className="space-y-2">
                <label htmlFor={field.name} className="text-sm font-medium">
                  Section Name
                </label>

                <input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={event => field.handleChange(event.target.value)}
                  placeholder="Section A"
                  aria-invalid={isInvalid}
                  disabled={isPending}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />

                {isInvalid && (
                  <p className="text-sm text-destructive">
                    {field.state.meta.errors[0]?.message}
                  </p>
                )}
              </div>
            );
          }}
        </form.Field>

        <form.Field name="code">
          {field => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <div className="space-y-2">
                <label htmlFor={field.name} className="text-sm font-medium">
                  Section Code
                </label>

                <input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={event => field.handleChange(event.target.value)}
                  placeholder="SEC-A"
                  aria-invalid={isInvalid}
                  disabled={isPending}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />

                {isInvalid && (
                  <p className="text-sm text-destructive">
                    {field.state.meta.errors[0]?.message}
                  </p>
                )}
              </div>
            );
          }}
        </form.Field>

        <form.Field name="courseId">
          {field => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <div className="space-y-2">
                <label htmlFor={field.name} className="text-sm font-medium">
                  Course
                </label>

                <select
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={event => field.handleChange(event.target.value)}
                  disabled={isPending || isCoursesLoading}
                  aria-invalid={isInvalid}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">
                    {isCoursesLoading ? 'Loading courses...' : 'Select course'}
                  </option>

                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.name} ({course.code})
                    </option>
                  ))}
                </select>

                {isInvalid && (
                  <p className="text-sm text-destructive">
                    {field.state.meta.errors[0]?.message}
                  </p>
                )}
              </div>
            );
          }}
        </form.Field>

        <form.Field name="semesterId">
          {field => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <div className="space-y-2">
                <label htmlFor={field.name} className="text-sm font-medium">
                  Semester
                </label>

                <select
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={event => field.handleChange(event.target.value)}
                  disabled={isPending || isSemestersLoading}
                  aria-invalid={isInvalid}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">
                    {isSemestersLoading
                      ? 'Loading semesters...'
                      : 'Select semester'}
                  </option>

                  {semesters.map(semester => (
                    <option key={semester.id} value={semester.id}>
                      {semester.name} ({semester.code})
                    </option>
                  ))}
                </select>

                {isInvalid && (
                  <p className="text-sm text-destructive">
                    {field.state.meta.errors[0]?.message}
                  </p>
                )}
              </div>
            );
          }}
        </form.Field>

        <form.Field name="instructorId">
          {field => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <div className="space-y-2">
                <label htmlFor={field.name} className="text-sm font-medium">
                  Instructor
                </label>

                <select
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={event => field.handleChange(event.target.value)}
                  disabled={isPending || isInstructorsLoading}
                  aria-invalid={isInvalid}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">
                    {isInstructorsLoading
                      ? 'Loading instructors...'
                      : 'Select instructor'}
                  </option>

                  {instructors.map(instructor => (
                    <option key={instructor.id} value={instructor.id}>
                      {instructor.user.firstName} {instructor.user.lastName} (
                      {instructor.instructorId})
                    </option>
                  ))}
                </select>

                {isInvalid && (
                  <p className="text-sm text-destructive">
                    {field.state.meta.errors[0]?.message}
                  </p>
                )}
              </div>
            );
          }}
        </form.Field>

        <form.Field name="capacity">
          {field => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <div className="space-y-2">
                <label htmlFor={field.name} className="text-sm font-medium">
                  Capacity
                </label>

                <input
                  id={field.name}
                  name={field.name}
                  type="number"
                  min={1}
                  step={1}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={event =>
                    field.handleChange(Number(event.target.value))
                  }
                  aria-invalid={isInvalid}
                  disabled={isPending}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />

                {isInvalid && (
                  <p className="text-sm text-destructive">
                    {field.state.meta.errors[0]?.message}
                  </p>
                )}
              </div>
            );
          }}
        </form.Field>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={
              isPending ||
              isCoursesLoading ||
              isSemestersLoading ||
              isInstructorsLoading
            }
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending
              ? isEditMode
                ? 'Updating...'
                : 'Creating...'
              : isEditMode
                ? 'Update Section'
                : 'Add Section'}
          </button>
        </div>
      </form>
    </div>
  );
}
