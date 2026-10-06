'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useCreateProgram } from '@/hooks/program.hook';
import { useDepartments } from '@/hooks/department.hook';

const programFormSchema = z.object({
  name: z.string().trim().min(1, 'Program name is required'),
  code: z.string().trim().min(1, 'Program code is required'),
  description: z.string().optional(),
  departmentId: z.string().min(1, 'Department is required'),
});

type ProgramFormValues = z.infer<typeof programFormSchema>;

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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded-lg border p-6"
    >
      <div>
        <label htmlFor="program-name" className="text-sm font-medium">
          Program Name
        </label>

        <input
          id="program-name"
          {...register('name')}
          className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          placeholder="Bachelor of Science in Computer Science"
        />

        {errors.name && (
          <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="program-code" className="text-sm font-medium">
          Program Code
        </label>

        <input
          id="program-code"
          {...register('code')}
          className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm uppercase outline-none focus:ring-2 focus:ring-ring"
          placeholder="BSC-CS"
        />

        {errors.code && (
          <p className="mt-1 text-sm text-destructive">{errors.code.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="program-department" className="text-sm font-medium">
          Department
        </label>

        <select
          id="program-department"
          {...register('departmentId')}
          disabled={isDepartmentsLoading}
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
        <label htmlFor="program-description" className="text-sm font-medium">
          Description
        </label>

        <textarea
          id="program-description"
          {...register('description')}
          className="mt-1 min-h-24 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          placeholder="Program description"
        />
      </div>

      <button
        type="submit"
        disabled={
          createProgramMutation.isPending ||
          isDepartmentsLoading ||
          departments.length === 0
        }
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
      >
        {createProgramMutation.isPending ? 'Creating...' : 'Create Program'}
      </button>
    </form>
  );
}
