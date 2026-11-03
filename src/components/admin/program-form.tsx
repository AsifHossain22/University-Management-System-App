'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, Loader2, Plus, RotateCcw } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { useCreateProgram } from '@/hooks/program.hook';
import { useDepartments } from '@/hooks/department.hook';

const programFormSchema = z.object({
  name: z.string().trim().min(1, 'Program name is required'),
  code: z.string().trim().min(1, 'Program code is required'),
  description: z.string().optional(),
  departmentId: z.string().min(1, 'Department is required'),
});

type ProgramFormValues = z.infer<typeof programFormSchema>;

const inputClassName =
  'mt-2 h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-60';

const labelClassName = 'text-sm font-medium text-foreground';

export default function ProgramForm() {
  const createProgramMutation = useCreateProgram();

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
    formState: { errors },
  } = useForm<ProgramFormValues>({
    resolver: zodResolver(programFormSchema),
    defaultValues: {
      name: '',
      code: '',
      description: '',
      departmentId: '',
    },
  });

  const onSubmit = (values: ProgramFormValues) => {
    createProgramMutation.mutate(values, {
      onSuccess: () => {
        toast.success('Program created successfully!');
        reset();
      },
      onError: () => {
        toast.error('Failed to create program.');
      },
    });
  };

  const isSubmitting = createProgramMutation.isPending;
  const isSubmitDisabled =
    isSubmitting || isDepartmentsLoading || departments.length === 0;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
    >
      <div className="flex items-center gap-3 border-b border-border px-5 py-4 sm:px-6">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Building2 className="size-5" />
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground">
            Create New Program
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Add an academic program and assign it to a department.
          </p>
        </div>
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-1">
            <label htmlFor="program-name" className={labelClassName}>
              Program Name <span className="text-destructive">*</span>
            </label>

            <input
              id="program-name"
              {...register('name')}
              disabled={isSubmitting}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'program-name-error' : undefined}
              className={inputClassName}
              placeholder="Bachelor of Science in Computer Science"
            />

            {errors.name && (
              <p
                id="program-name-error"
                className="text-xs text-destructive"
                role="alert"
              >
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="program-code" className={labelClassName}>
              Program Code <span className="text-destructive">*</span>
            </label>

            <input
              id="program-code"
              {...register('code')}
              disabled={isSubmitting}
              aria-invalid={!!errors.code}
              aria-describedby={errors.code ? 'program-code-error' : undefined}
              className={`${inputClassName} uppercase`}
              placeholder="BSC-CS"
            />

            {errors.code && (
              <p
                id="program-code-error"
                className="text-xs text-destructive"
                role="alert"
              >
                {errors.code.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="program-department" className={labelClassName}>
            Department <span className="text-destructive">*</span>
          </label>

          <select
            id="program-department"
            {...register('departmentId')}
            disabled={isDepartmentsLoading || isSubmitting}
            aria-invalid={!!errors.departmentId}
            aria-describedby={
              errors.departmentId ? 'program-department-error' : undefined
            }
            className={inputClassName}
          >
            <option value="">
              {isDepartmentsLoading
                ? 'Loading departments...'
                : departments.length === 0
                  ? 'No departments available'
                  : 'Select a department'}
            </option>

            {departments.map(department => (
              <option key={department.id} value={department.id}>
                {department.name} ({department.code})
              </option>
            ))}
          </select>

          {errors.departmentId && (
            <p
              id="program-department-error"
              className="text-xs text-destructive"
              role="alert"
            >
              {errors.departmentId.message}
            </p>
          )}

          {!isDepartmentsLoading && departments.length === 0 && (
            <p className="text-xs text-muted-foreground">
              Create a department before adding an academic program.
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="program-description" className={labelClassName}>
            Description{' '}
            <span className="font-normal text-muted-foreground">
              (Optional)
            </span>
          </label>

          <textarea
            id="program-description"
            {...register('description')}
            disabled={isSubmitting}
            rows={4}
            className="mt-2 w-full resize-y rounded-xl border border-input bg-background px-3.5 py-3 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-60"
            placeholder="Briefly describe the program, its academic focus, and learning objectives..."
          />
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            Fields marked with * are required.
          </p>

          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => reset()}
              disabled={isSubmitting}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RotateCcw className="size-4" />
              Reset
            </button>

            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="size-4" />
                  Create Program
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
