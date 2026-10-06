'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import DepartmentForm from '@/components/admin/department-form';
import { useDepartments } from '@/hooks/department.hook';

export default function AdminDepartmentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const searchTerm = searchParams.get('searchTerm') ?? '';
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;

  const { data, isLoading, isError } = useDepartments({
    searchTerm: searchTerm || undefined,
    page,
    limit,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const departments = data?.data ?? [];
  const meta = data?.meta;

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value.trim()) {
      params.set('searchTerm', value);
    } else {
      params.delete('searchTerm');
    }

    params.set('page', '1');

    router.push(`/admin-dashboard/departments?${params.toString()}`);
  };

  return (
    <main className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Departments</h1>
        <p className="text-muted-foreground">Manage university departments.</p>
      </div>

      <div className="max-w-md">
        <input
          type="search"
          defaultValue={searchTerm}
          onChange={event => handleSearch(event.target.value)}
          placeholder="Search departments..."
          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <DepartmentForm />

      {isLoading && (
        <div className="rounded-lg border p-6">Loading departments...</div>
      )}

      {isError && (
        <div className="rounded-lg border p-6 text-destructive">
          Failed to load departments.
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
                    Description
                  </th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                </tr>
              </thead>

              <tbody>
                {departments.map(department => (
                  <tr key={department.id} className="border-b last:border-0">
                    <td className="px-4 py-3 font-medium">{department.name}</td>

                    <td className="px-4 py-3">{department.code}</td>

                    <td className="px-4 py-3">
                      {department.description || '—'}
                    </td>

                    <td className="px-4 py-3">
                      {department.isActive ? 'Active' : 'Inactive'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {departments.length === 0 && (
              <div className="p-6 text-center text-sm text-muted-foreground">
                No departments found.
              </div>
            )}
          </div>

          {meta && (
            <div className="text-sm text-muted-foreground">
              Page {meta.page} of {meta.totalPages} · Total departments:{' '}
              {meta.total}
            </div>
          )}
        </>
      )}
    </main>
  );
}
