'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  LoaderCircle,
  Plus,
} from 'lucide-react';
import { useCreateDepartment } from '@/hooks/department.hook';

const departmentFormSchema = z.object({
  name: z.string().trim().min(1, 'Department name is required'),
  code: z.string().trim().min(1, 'Department code is required'),
  description: z.string().optional(),
});

type DepartmentFormValues = z.infer<typeof departmentFormSchema>;

export default function DepartmentForm() {
  const createDepartmentMutation = useCreateDepartment();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentFormSchema),
    defaultValues: {
      name: '',
      code: '',
      description: '',
    },
  });

  const onSubmit = (values: DepartmentFormValues) => {
    createDepartmentMutation.mutate(values, {
      onSuccess: () => {
        toast.success('Department created successfully!');
        reset();
      },
      onError: () => {
        toast.error('Failed to create department.');
      },
    });
  };

  const isSubmitting = createDepartmentMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        {/* DepartmentName */}
        <div className="space-y-2">
          <label htmlFor="department-name" className="text-sm font-medium">
            Department name <span className="text-destructive">*</span>
          </label>

          <input
            id="department-name"
            {...register('name')}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'department-name-error' : undefined}
            disabled={isSubmitting}
            className="h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-60"
            placeholder="e.g. Computer Science"
          />

          {errors.name && (
            <p
              id="department-name-error"
              className="flex items-center gap-1.5 text-sm text-destructive"
            >
              <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
              {errors.name.message}
            </p>
          )}
        </div>

        {/* DepartmentCode */}
        <div className="space-y-2">
          <label htmlFor="department-code" className="text-sm font-medium">
            Department code <span className="text-destructive">*</span>
          </label>

          <input
            id="department-code"
            {...register('code')}
            aria-invalid={Boolean(errors.code)}
            aria-describedby={errors.code ? 'department-code-error' : undefined}
            disabled={isSubmitting}
            className="h-11 w-full rounded-xl border border-input bg-background px-3.5 font-mono text-sm uppercase outline-none transition-colors placeholder:font-sans placeholder:normal-case placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-60"
            placeholder="e.g. CSE"
          />

          {errors.code && (
            <p
              id="department-code-error"
              className="flex items-center gap-1.5 text-sm text-destructive"
            >
              <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
              {errors.code.message}
            </p>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label htmlFor="department-description" className="text-sm font-medium">
          Description
          <span className="ml-2 text-xs font-normal text-muted-foreground">
            Optional
          </span>
        </label>

        <textarea
          id="department-description"
          {...register('description')}
          disabled={isSubmitting}
          rows={3}
          className="w-full resize-y rounded-xl border border-input bg-background px-3.5 py-3 text-sm leading-6 outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-60"
          placeholder="Briefly describe the department and its academic focus..."
        />
      </div>

      {/* FormActions */}
      <div className="flex flex-col gap-3 border-t border-border/70 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5 text-muted-foreground">
          Fields marked with <span className="text-destructive">*</span> are
          required.
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => reset()}
            disabled={isSubmitting}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border/70 bg-background px-4 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            Reset
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <LoaderCircle
                  className="size-4 animate-spin"
                  aria-hidden="true"
                />
                Creating department...
              </>
            ) : (
              <>
                <Plus className="size-4" aria-hidden="true" />
                Create department
              </>
            )}
          </button>
        </div>
      </div>

      {createDepartmentMutation.isSuccess && (
        <p
          className="flex items-center gap-2 text-sm text-success"
          role="status"
        >
          <CheckCircle2 className="size-4" aria-hidden="true" />
          Department created successfully.
        </p>
      )}
    </form>
  );
}
