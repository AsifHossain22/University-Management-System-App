'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import SemesterForm from '@/components/admin/semester-form';
import { useDeleteSemester, useSemesters } from '@/hooks/semester.hook';
import type { Semester } from '@/types/semester.type';

export default function AdminSemestersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [editingSemester, setEditingSemester] = useState<Semester | null>(null);

  const deleteSemesterMutation = useDeleteSemester();

  const searchTerm = searchParams.get('searchTerm') ?? '';
  const isActiveParam = searchParams.get('isActive');
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;

  const isActive =
    isActiveParam === null ? undefined : isActiveParam === 'true';

  const { data, isLoading, isError } = useSemesters({
    searchTerm: searchTerm || undefined,
    isActive,
    page,
    limit,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const semesters = data?.data?.data ?? [];
  const meta = data?.data?.meta;

  const updateFilters = (updates: {
    searchTerm?: string;
    isActive?: string;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (updates.searchTerm !== undefined) {
      if (updates.searchTerm.trim()) {
        params.set('searchTerm', updates.searchTerm);
      } else {
        params.delete('searchTerm');
      }
    }

    if (updates.isActive !== undefined) {
      if (updates.isActive) {
        params.set('isActive', updates.isActive);
      } else {
        params.delete('isActive');
      }
    }
    params.set('page', '1');
    router.push(`/admin-dashboard/semesters?${params.toString()}`);
  };

  const handleEditSuccess = () => {
    setEditingSemester(null);
  };

  const handleDelete = (semester: Semester) => {
    toast.warning(`Delete "${semester.name}"?`, {
      description: 'This action will deactivate the semester.',
      action: {
        label: 'Delete',
        onClick: () => {
          deleteSemesterMutation.mutate(semester.id, {
            onSuccess: () => {
              toast.success('Semester deleted successfully!');
            },
            onError: () => {
              toast.error('Failed to delete semester.');
            },
          });
        },
      },
    });
  };

  return (
    <main className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Semesters</h1>
        <p className="text-muted-foreground">
          Manage university academic semesters.
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
          placeholder="Search semesters..."
          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        />

        <select
          value={isActiveParam ?? ''}
          onChange={event =>
            updateFilters({
              isActive: event.target.value,
            })
          }
          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">All Semesters</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      <SemesterForm semester={editingSemester} onSuccess={handleEditSuccess} />

      {isLoading && (
        <div className="rounded-lg border p-6">Loading semesters...</div>
      )}

      {isError && (
        <div className="rounded-lg border p-6 text-destructive">
          Failed to load semesters.
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
                    Start Date
                  </th>
                  <th className="px-4 py-3 text-left font-medium">End Date</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>

              <tbody>
                {semesters.map(semester => (
                  <tr key={semester.id} className="border-b last:border-0">
                    <td className="px-4 py-3 font-medium">{semester.name}</td>
                    <td className="px-4 py-3">{semester.code}</td>
                    <td className="px-4 py-3">
                      {new Date(semester.startDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      {new Date(semester.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      {semester.isActive ? 'Active' : 'Inactive'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingSemester(semester)}
                          className="rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-muted"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(semester)}
                          disabled={deleteSemesterMutation.isPending}
                          className="rounded-md border border-destructive px-3 py-1.5 text-sm font-medium text-destructive hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {semesters.length === 0 && (
              <div className="p-6 text-center text-sm text-muted-foreground">
                No semesters found.
              </div>
            )}
          </div>

          {meta && (
            <div className="text-sm text-muted-foreground">
              Page {meta.page} of {meta.totalPages} · Total semesters:{' '}
              {meta.total}
            </div>
          )}
        </>
      )}
    </main>
  );
}
