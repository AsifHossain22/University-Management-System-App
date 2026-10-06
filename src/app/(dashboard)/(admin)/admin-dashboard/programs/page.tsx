'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import ProgramForm from '@/components/admin/program-form';
import { useDepartments } from '@/hooks/department.hook';
import { usePrograms } from '@/hooks/program.hook';

export default function AdminProgramsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const searchTerm = searchParams.get('searchTerm') ?? '';
  const departmentId = searchParams.get('departmentId') ?? '';
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;

  const { data, isLoading, isError } = usePrograms({
    searchTerm: searchTerm || undefined,
    departmentId: departmentId || undefined,
    page,
    limit,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const { data: departmentResponse } = useDepartments({
    page: 1,
    limit: 100,
    sortBy: 'name',
    sortOrder: 'asc',
  });

  const programs = data?.data ?? [];
  const meta = data?.meta;
  const departments = departmentResponse?.data ?? [];

  const updateFilters = (updates: {
    searchTerm?: string;
    departmentId?: string;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (updates.searchTerm !== undefined) {
      if (updates.searchTerm.trim()) {
        params.set('searchTerm', updates.searchTerm);
      } else {
        params.delete('searchTerm');
      }
    }

    if (updates.departmentId !== undefined) {
      if (updates.departmentId) {
        params.set('departmentId', updates.departmentId);
      } else {
        params.delete('departmentId');
      }
    }

    params.set('page', '1');

    router.push(`/admin-dashboard/programs?${params.toString()}`);
  };

  return (
    <main className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Programs</h1>
        <p className="text-muted-foreground">
          Manage university academic programs.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <input
          type="search"
          defaultValue={searchTerm}
          onChange={event =>
            updateFilters({
              searchTerm: event.target.value,
            })
          }
          placeholder="Search programs..."
          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        />

        <select
          value={departmentId}
          onChange={event =>
            updateFilters({
              departmentId: event.target.value,
            })
          }
          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">All Departments</option>

          {departments.map(department => (
            <option key={department.id} value={department.id}>
              {department.name} ({department.code})
            </option>
          ))}
        </select>
      </div>

      <ProgramForm />

      {isLoading && (
        <div className="rounded-lg border p-6">Loading programs...</div>
      )}

      {isError && (
        <div className="rounded-lg border p-6 text-destructive">
          Failed to load programs.
        </div>
      )}

      {!isLoading && !isError && (
        <>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Name</th>
                  <th className="px-4 py-3 text-left font-medium">Code</th>
                  <th className="px-4 py-3 text-left font-medium">
                    Department
                  </th>
                  <th className="px-4 py-3 text-left font-medium">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                </tr>
              </thead>

              <tbody>
                {programs.map(program => {
                  const department = departments.find(
                    item => item.id === program.departmentId,
                  );

                  return (
                    <tr key={program.id} className="border-b last:border-0">
                      <td className="px-4 py-3 font-medium">{program.name}</td>

                      <td className="px-4 py-3">{program.code}</td>

                      <td className="px-4 py-3">{department?.name ?? '—'}</td>

                      <td className="px-4 py-3">
                        {program.description || '—'}
                      </td>

                      <td className="px-4 py-3">
                        {program.isActive ? 'Active' : 'Inactive'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {programs.length === 0 && (
              <div className="p-6 text-center text-sm text-muted-foreground">
                No programs found.
              </div>
            )}
          </div>

          {meta && (
            <div className="text-sm text-muted-foreground">
              Page {meta.page} of {meta.totalPages} · Total programs:{' '}
              {meta.total}
            </div>
          )}
        </>
      )}
    </main>
  );
}
