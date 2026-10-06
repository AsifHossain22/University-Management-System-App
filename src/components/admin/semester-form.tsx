'use client';

import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { useCreateSemester, useUpdateSemester } from '@/hooks/semester.hook';
import type { Semester } from '@/types/semester.type';

const semesterFormSchema = z
  .object({
    name: z.string().trim().min(1, 'Semester name is required'),
    code: z.string().trim().min(1, 'Semester code is required'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
  })
  .refine(data => data.startDate < data.endDate, {
    message: 'Start date must be earlier than end date',
    path: ['endDate'],
  });

interface SemesterFormProps {
  semester?: Semester | null;
  onSuccess?: () => void;
}

export default function SemesterForm({
  semester,
  onSuccess,
}: SemesterFormProps) {
  const isEditMode = Boolean(semester);

  const createSemesterMutation = useCreateSemester();
  const updateSemesterMutation = useUpdateSemester();

  const form = useForm({
    defaultValues: {
      name: semester?.name ?? '',
      code: semester?.code ?? '',
      startDate: semester?.startDate?.slice(0, 10) ?? '',
      endDate: semester?.endDate?.slice(0, 10) ?? '',
    },

    validators: {
      onSubmit: semesterFormSchema,
    },

    onSubmit: async ({ value }) => {
      if (semester) {
        updateSemesterMutation.mutate(
          {
            semesterId: semester.id,
            payload: value,
          },
          {
            onSuccess: () => {
              toast.success('Semester updated successfully!');
              onSuccess?.();
            },
            onError: () => {
              toast.error('Failed to update semester.');
            },
          },
        );

        return;
      }

      createSemesterMutation.mutate(value, {
        onSuccess: () => {
          toast.success('Semester created successfully!');
          form.reset();
          onSuccess?.();
        },
        onError: () => {
          toast.error('Failed to create semester.');
        },
      });
    },
  });

  const isPending =
    createSemesterMutation.isPending || updateSemesterMutation.isPending;

  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        event.stopPropagation();
        form.handleSubmit();
      }}
      noValidate
      className="space-y-4 rounded-lg border p-6"
    >
      <div>
        <h2 className="text-lg font-semibold">
          {isEditMode ? 'Edit Semester' : 'Create Semester'}
        </h2>

        <p className="text-sm text-muted-foreground">
          {isEditMode
            ? 'Update the semester information.'
            : 'Add a new academic semester.'}
        </p>
      </div>

      <form.Field name="name">
        {field => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;

          return (
            <div>
              <label htmlFor={field.name} className="text-sm font-medium">
                Semester Name
              </label>

              <input
                id={field.name}
                name={field.name}
                type="text"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={event => field.handleChange(event.target.value)}
                disabled={isPending}
                aria-invalid={isInvalid}
                placeholder="Fall 2026"
                className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />

              {isInvalid && (
                <p className="mt-1 text-sm text-destructive">
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
            <div>
              <label htmlFor={field.name} className="text-sm font-medium">
                Semester Code
              </label>

              <input
                id={field.name}
                name={field.name}
                type="text"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={event => field.handleChange(event.target.value)}
                disabled={isPending}
                aria-invalid={isInvalid}
                placeholder="FALL-2026"
                className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm uppercase outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />

              {isInvalid && (
                <p className="mt-1 text-sm text-destructive">
                  {field.state.meta.errors[0]?.message}
                </p>
              )}
            </div>
          );
        }}
      </form.Field>

      <div className="grid gap-4 md:grid-cols-2">
        <form.Field name="startDate">
          {field => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <div>
                <label htmlFor={field.name} className="text-sm font-medium">
                  Start Date
                </label>

                <input
                  id={field.name}
                  name={field.name}
                  type="date"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={event => field.handleChange(event.target.value)}
                  disabled={isPending}
                  aria-invalid={isInvalid}
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />

                {isInvalid && (
                  <p className="mt-1 text-sm text-destructive">
                    {field.state.meta.errors[0]?.message}
                  </p>
                )}
              </div>
            );
          }}
        </form.Field>

        <form.Field name="endDate">
          {field => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <div>
                <label htmlFor={field.name} className="text-sm font-medium">
                  End Date
                </label>

                <input
                  id={field.name}
                  name={field.name}
                  type="date"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={event => field.handleChange(event.target.value)}
                  disabled={isPending}
                  aria-invalid={isInvalid}
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />

                {isInvalid && (
                  <p className="mt-1 text-sm text-destructive">
                    {field.state.meta.errors[0]?.message}
                  </p>
                )}
              </div>
            );
          }}
        </form.Field>
      </div>

      <form.Subscribe selector={state => [state.canSubmit, state.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <button
            type="submit"
            disabled={!canSubmit || isPending || isSubmitting}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending || isSubmitting
              ? isEditMode
                ? 'Updating...'
                : 'Creating...'
              : isEditMode
                ? 'Update Semester'
                : 'Create Semester'}
          </button>
        )}
      </form.Subscribe>
    </form>
  );
}
