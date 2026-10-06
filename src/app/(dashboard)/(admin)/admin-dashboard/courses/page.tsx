'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import CourseForm from '@/components/admin/course-form';
import { useCourses, useDeleteCourse } from '@/hooks/course.hook';
import { useDepartments } from '@/hooks/department.hook';
import { usePrograms } from '@/hooks/program.hook';
import type { Course } from '@/types/course.type';

export default function AdminCoursesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const deleteCourseMutation = useDeleteCourse();

  const searchTerm = searchParams.get('searchTerm') ?? '';
  const departmentId = searchParams.get('departmentId') ?? '';
  const programId = searchParams.get('programId') ?? '';
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;

  const { data, isLoading, isError } = useCourses({
    searchTerm: searchTerm || undefined,
    departmentId: departmentId || undefined,
    programId: programId || undefined,
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

  const { data: programResponse } = usePrograms({
    departmentId: departmentId || undefined,
    page: 1,
    limit: 100,
    sortBy: 'name',
    sortOrder: 'asc',
  });

  const courses = data?.data ?? [];
  const meta = data?.meta;
  const departments = departmentResponse?.data ?? [];
  const programs = programResponse?.data ?? [];

  const updateFilters = (updates: {
    searchTerm?: string;
    departmentId?: string;
    programId?: string;
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
        params.delete('programId');
      }
    }

    if (updates.programId !== undefined) {
      if (updates.programId) {
        params.set('programId', updates.programId);
      } else {
        params.delete('programId');
      }
    }

    params.set('page', '1');
    router.push(`/admin-dashboard/courses?${params.toString()}`);
  };

  const handleEditSuccess = () => {
    setEditingCourse(null);
  };

  const handleDelete = (course: Course) => {
    toast.warning(`Delete "${course.name}"?`, {
      description: 'This action will delete the course.',
      action: {
        label: 'Delete',
        onClick: () => {
          deleteCourseMutation.mutate(course.id, {
            onSuccess: () => {
              toast.success('Course deleted successfully!');
            },
            onError: () => {
              toast.error('Failed to delete course.');
            },
          });
        },
      },
    });
  };

  return (
    <main className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Courses</h1>
        <p className="text-muted-foreground">
          Manage university academic courses.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <input
          type="search"
          defaultValue={searchTerm}
          onChange={event =>
            updateFilters({
              searchTerm: event.target.value,
            })
          }
          placeholder="Search courses..."
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

        <select
          value={programId}
          onChange={event =>
            updateFilters({
              programId: event.target.value,
            })
          }
          disabled={!departmentId}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">
            {departmentId ? 'All Programs' : 'Select department first'}
          </option>

          {programs.map(program => (
            <option key={program.id} value={program.id}>
              {program.name} ({program.code})
            </option>
          ))}
        </select>
      </div>

      <CourseForm course={editingCourse} onSuccess={handleEditSuccess} />

      {isLoading && (
        <div className="rounded-lg border p-6">Loading courses...</div>
      )}

      {isError && (
        <div className="rounded-lg border p-6 text-destructive">
          Failed to load courses.
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
                  <th className="px-4 py-3 text-left font-medium">Program</th>
                  <th className="px-4 py-3 text-left font-medium">Credits</th>
                  <th className="px-4 py-3 text-left font-medium">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>

              <tbody>
                {courses.map(course => {
                  const department = departments.find(
                    item => item.id === course.departmentId,
                  );

                  const program = programs.find(
                    item => item.id === course.programId,
                  );

                  return (
                    <tr key={course.id} className="border-b last:border-0">
                      <td className="px-4 py-3 font-medium">{course.name}</td>
                      <td className="px-4 py-3">{course.code}</td>
                      <td className="px-4 py-3">{department?.name ?? '—'}</td>
                      <td className="px-4 py-3">{program?.name ?? '—'}</td>
                      <td className="px-4 py-3">{course.credits}</td>
                      <td className="px-4 py-3">{course.description || '—'}</td>
                      <td className="px-4 py-3">
                        {course.isActive ? 'Active' : 'Inactive'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingCourse(course)}
                            className="rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-muted"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(course)}
                            disabled={deleteCourseMutation.isPending}
                            className="rounded-md border border-destructive px-3 py-1.5 text-sm font-medium text-destructive hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {courses.length === 0 && (
              <div className="p-6 text-center text-sm text-muted-foreground">
                No courses found.
              </div>
            )}
          </div>

          {meta && (
            <div className="text-sm text-muted-foreground">
              Page {meta.page} of {meta.totalPages} · Total courses:{' '}
              {meta.total}
            </div>
          )}
        </>
      )}
    </main>
  );
}
