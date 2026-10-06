'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded-lg border p-6"
    >
      <div>
        <label htmlFor="department-name" className="text-sm font-medium">
          Department Name
        </label>

        <input
          id="department-name"
          {...register('name')}
          className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          placeholder="Computer Science"
        />

        {errors.name && (
          <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="department-code" className="text-sm font-medium">
          Department Code
        </label>

        <input
          id="department-code"
          {...register('code')}
          className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm uppercase outline-none focus:ring-2 focus:ring-ring"
          placeholder="CSE"
        />

        {errors.code && (
          <p className="mt-1 text-sm text-destructive">{errors.code.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="department-description" className="text-sm font-medium">
          Description
        </label>

        <textarea
          id="department-description"
          {...register('description')}
          className="mt-1 min-h-24 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          placeholder="Department description"
        />
      </div>

      <button
        type="submit"
        disabled={createDepartmentMutation.isPending}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
      >
        {createDepartmentMutation.isPending
          ? 'Creating...'
          : 'Create Department'}
      </button>
    </form>
  );
}
