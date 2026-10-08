'use client';

import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { useCreateCoursePrerequisite } from '@/hooks/course-prerequisite.hook';
import { useCourses } from '@/hooks/course.hook';

const coursePrerequisiteFormSchema = z
  .object({
    courseId: z.string().min(1, 'Course is required'),
    prerequisiteId: z.string().min(1, 'Prerequisite course is required'),
  })
  .refine(data => data.courseId !== data.prerequisiteId, {
    message: 'A course cannot be its own prerequisite',
    path: ['prerequisiteId'],
  });

interface CoursePrerequisiteFormProps {
  onSuccess?: () => void;
}

export default function CoursePrerequisiteForm({
  onSuccess,
}: CoursePrerequisiteFormProps) {
  const createCoursePrerequisiteMutation = useCreateCoursePrerequisite();

  const { data: courseResponse, isLoading: isCoursesLoading } = useCourses({
    page: 1,
    limit: 100,
    sortBy: 'name',
    sortOrder: 'asc',
  });

  const courses = courseResponse?.data ?? [];

  const form = useForm({
    defaultValues: {
      courseId: '',
      prerequisiteId: '',
    },

    validators: {
      onSubmit: coursePrerequisiteFormSchema,
    },

    onSubmit: async ({ value }) => {
      createCoursePrerequisiteMutation.mutate(value, {
        onSuccess: () => {
          toast.success('Course prerequisite added successfully!');
          form.reset();
          onSuccess?.();
        },
        onError: (error: { message?: string }) => {
          toast.error(error.message || 'Failed to add course prerequisite.');
        },
      });
    },
  });

  return (
    <div className="rounded-lg border p-4 md:p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Add Course Prerequisite</h2>
        <p className="text-sm text-muted-foreground">
          Define a prerequisite relationship between two courses.
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
                  onChange={event => {
                    const selectedCourseId = event.target.value;
                    field.handleChange(selectedCourseId);

                    if (
                      form.getFieldValue('prerequisiteId') === selectedCourseId
                    ) {
                      form.setFieldValue('prerequisiteId', '');
                    }
                  }}
                  disabled={
                    isCoursesLoading ||
                    createCoursePrerequisiteMutation.isPending
                  }
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

        <form.Field name="prerequisiteId">
          {field => {
            const selectedCourseId = form.getFieldValue('courseId');
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <div className="space-y-2">
                <label htmlFor={field.name} className="text-sm font-medium">
                  Prerequisite Course
                </label>

                <select
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={event => field.handleChange(event.target.value)}
                  disabled={
                    isCoursesLoading ||
                    createCoursePrerequisiteMutation.isPending
                  }
                  aria-invalid={isInvalid}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">
                    {isCoursesLoading
                      ? 'Loading courses...'
                      : 'Select prerequisite course'}
                  </option>

                  {courses
                    .filter(course => course.id !== selectedCourseId)
                    .map(course => (
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

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={
              isCoursesLoading || createCoursePrerequisiteMutation.isPending
            }
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {createCoursePrerequisiteMutation.isPending
              ? 'Adding...'
              : 'Add Prerequisite'}
          </button>
        </div>
      </form>
    </div>
  );
}
