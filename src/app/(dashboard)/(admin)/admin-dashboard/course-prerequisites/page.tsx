'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import CoursePrerequisiteForm from '@/components/admin/course-prerequisite-form';
import {
  useCoursePrerequisites,
  useDeleteCoursePrerequisite,
} from '@/hooks/course-prerequisite.hook';
import { useCourses } from '@/hooks/course.hook';
import type { CoursePrerequisite } from '@/types/course-prerequisite.type';

export default function AdminCoursePrerequisitesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const deleteCoursePrerequisiteMutation = useDeleteCoursePrerequisite();

  const courseId = searchParams.get('courseId') ?? '';
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;

  const { data, isLoading, isError } = useCoursePrerequisites({
    courseId: courseId || undefined,
    page,
    limit,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const { data: courseResponse } = useCourses({
    page: 1,
    limit: 100,
    sortBy: 'name',
    sortOrder: 'asc',
  });

  const prerequisites = data?.data?.data ?? [];
  const meta = data?.data?.meta;
  const courses = courseResponse?.data ?? [];

  const updateCourseFilter = (selectedCourseId: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (selectedCourseId) {
      params.set('courseId', selectedCourseId);
    } else {
      params.delete('courseId');
    }
    params.set('page', '1');
    router.push(`/admin-dashboard/course-prerequisites?${params.toString()}`);
  };

  const handleDelete = (prerequisite: CoursePrerequisite) => {
    toast.warning(`Delete prerequisite for "${prerequisite.course.name}"?`, {
      description: `"${prerequisite.prerequisite.name}" will no longer be required.`,
      action: {
        label: 'Delete',
        onClick: () => {
          deleteCoursePrerequisiteMutation.mutate(prerequisite.id, {
            onSuccess: () => {
              toast.success('Course prerequisite deleted successfully!');
            },
            onError: () => {
              toast.error('Failed to delete course prerequisite.');
            },
          });
        },
      },
    });
  };

  return (
    <main className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Course Prerequisites
        </h1>
        <p className="text-muted-foreground">
          Manage prerequisite relationships between university courses.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <select
          value={courseId}
          onChange={event => updateCourseFilter(event.target.value)}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">All Courses</option>

          {courses.map(course => (
            <option key={course.id} value={course.id}>
              {course.name} ({course.code})
            </option>
          ))}
        </select>
      </div>

      <CoursePrerequisiteForm />

      {isLoading && (
        <div className="rounded-lg border p-6">
          Loading course prerequisites...
        </div>
      )}

      {isError && (
        <div className="rounded-lg border p-6 text-destructive">
          Failed to load course prerequisites.
        </div>
      )}

      {!isLoading && !isError && (
        <>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Course</th>
                  <th className="px-4 py-3 text-left font-medium">
                    Course Code
                  </th>
                  <th className="px-4 py-3 text-left font-medium">
                    Prerequisite
                  </th>
                  <th className="px-4 py-3 text-left font-medium">
                    Prerequisite Code
                  </th>
                  <th className="px-4 py-3 text-left font-medium">Credits</th>
                  <th className="px-4 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>

              <tbody>
                {prerequisites.map(prerequisite => (
                  <tr key={prerequisite.id} className="border-b last:border-0">
                    <td className="px-4 py-3 font-medium">
                      {prerequisite.course.name}
                    </td>
                    <td className="px-4 py-3">{prerequisite.course.code}</td>
                    <td className="px-4 py-3">
                      {prerequisite.prerequisite.name}
                    </td>
                    <td className="px-4 py-3">
                      {prerequisite.prerequisite.code}
                    </td>
                    <td className="px-4 py-3">
                      {prerequisite.prerequisite.credits}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleDelete(prerequisite)}
                        disabled={deleteCoursePrerequisiteMutation.isPending}
                        className="rounded-md border border-destructive px-3 py-1.5 text-sm font-medium text-destructive hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {prerequisites.length === 0 && (
              <div className="p-6 text-center text-sm text-muted-foreground">
                No course prerequisites found.
              </div>
            )}
          </div>

          {meta && (
            <div className="text-sm text-muted-foreground">
              Page {meta.page} of {meta.totalPages} · Total prerequisites:{' '}
              {meta.total}
            </div>
          )}
        </>
      )}
    </main>
  );
}
