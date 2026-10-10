'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import SectionForm from '@/components/admin/section-form';
import {
  useDeleteSection,
  usePublishSectionGrades,
  useSections,
} from '@/hooks/section.hook';
import { useCourses } from '@/hooks/course.hook';
import { useSemesters } from '@/hooks/semester.hook';
import type { Section } from '@/types/section.type';

export default function AdminSectionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [editingSection, setEditingSection] = useState<Section | null>(null);

  const deleteSectionMutation = useDeleteSection();
  const publishGradesMutation = usePublishSectionGrades();

  const searchTerm = searchParams.get('searchTerm') ?? '';
  const courseId = searchParams.get('courseId') ?? '';
  const semesterId = searchParams.get('semesterId') ?? '';
  const instructorId = searchParams.get('instructorId') ?? '';
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;

  const { data, isLoading, isError } = useSections({
    searchTerm: searchTerm || undefined,
    courseId: courseId || undefined,
    semesterId: semesterId || undefined,
    instructorId: instructorId || undefined,
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

  const { data: semesterResponse } = useSemesters({
    page: 1,
    limit: 100,
    sortBy: 'startDate',
    sortOrder: 'desc',
  });

  const sections = data?.data?.data ?? [];
  const meta = data?.data?.meta;

  const courses = courseResponse?.data ?? [];
  const semesters = semesterResponse?.data?.data ?? [];

  const updateFilters = (updates: {
    searchTerm?: string;
    courseId?: string;
    semesterId?: string;
    instructorId?: string;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (updates.searchTerm !== undefined) {
      if (updates.searchTerm.trim()) {
        params.set('searchTerm', updates.searchTerm);
      } else {
        params.delete('searchTerm');
      }
    }

    if (updates.courseId !== undefined) {
      if (updates.courseId) {
        params.set('courseId', updates.courseId);
      } else {
        params.delete('courseId');
      }
    }

    if (updates.semesterId !== undefined) {
      if (updates.semesterId) {
        params.set('semesterId', updates.semesterId);
      } else {
        params.delete('semesterId');
      }
    }

    if (updates.instructorId !== undefined) {
      if (updates.instructorId) {
        params.set('instructorId', updates.instructorId);
      } else {
        params.delete('instructorId');
      }
    }

    params.set('page', '1');
    router.push(`/admin-dashboard/sections?${params.toString()}`);
  };

  const handleEditSuccess = () => {
    setEditingSection(null);
  };

  const handleDelete = (section: Section) => {
    toast.warning(`Delete "${section.name}"?`, {
      description: 'This action will delete the section.',
      action: {
        label: 'Delete',
        onClick: () => {
          deleteSectionMutation.mutate(section.id, {
            onSuccess: () => {
              toast.success('Section deleted successfully!');
            },
            onError: () => {
              toast.error('Failed to delete section.');
            },
          });
        },
      },
    });
  };

  const handlePublishGrades = (section: Section) => {
    toast.warning(`Publish grades for "${section.name}"?`, {
      description:
        'This will calculate and publish grades for eligible students in this section. Make sure all exam results are complete.',
      action: {
        label: 'Publish Grades',
        onClick: () => {
          publishGradesMutation.mutate(section.id, {
            onSuccess: response => {
              toast.success(
                response.message || 'Grades published successfully!',
              );
            },
            onError: (error: Error) => {
              toast.error('Failed to publish grades.', {
                description:
                  error.message || 'Please check the section and exam results.',
              });
            },
          });
        },
      },
    });
  };

  return (
    <main className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Sections</h1>
        <p className="text-muted-foreground">
          Manage university course sections and publish final grades.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <input
          type="search"
          defaultValue={searchTerm}
          onChange={event =>
            updateFilters({
              searchTerm: event.target.value,
            })
          }
          placeholder="Search sections..."
          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        />

        <select
          value={courseId}
          onChange={event =>
            updateFilters({
              courseId: event.target.value,
            })
          }
          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">All Courses</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>
              {course.name} ({course.code})
            </option>
          ))}
        </select>

        <select
          value={semesterId}
          onChange={event =>
            updateFilters({
              semesterId: event.target.value,
            })
          }
          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">All Semesters</option>
          {semesters.map(semester => (
            <option key={semester.id} value={semester.id}>
              {semester.name} ({semester.code})
            </option>
          ))}
        </select>

        <input
          type="text"
          value={instructorId}
          onChange={event =>
            updateFilters({
              instructorId: event.target.value,
            })
          }
          placeholder="Instructor profile ID"
          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <SectionForm section={editingSection} onSuccess={handleEditSuccess} />

      {isLoading && (
        <div className="rounded-lg border p-6">Loading sections...</div>
      )}

      {isError && (
        <div className="rounded-lg border p-6 text-destructive">
          Failed to load sections.
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
                  <th className="px-4 py-3 text-left font-medium">Course</th>
                  <th className="px-4 py-3 text-left font-medium">Semester</th>
                  <th className="px-4 py-3 text-left font-medium">
                    Instructor
                  </th>
                  <th className="px-4 py-3 text-left font-medium">Capacity</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>

              <tbody>
                {sections.map(section => (
                  <tr key={section.id} className="border-b last:border-0">
                    <td className="px-4 py-3 font-medium">{section.name}</td>
                    <td className="px-4 py-3">{section.code}</td>
                    <td className="px-4 py-3">
                      {section.course.name} ({section.course.code})
                    </td>
                    <td className="px-4 py-3">
                      {section.semester.name} ({section.semester.code})
                    </td>
                    <td className="px-4 py-3">
                      {section.instructor.user.firstName}{' '}
                      {section.instructor.user.lastName}
                    </td>
                    <td className="px-4 py-3">{section.capacity}</td>
                    <td className="px-4 py-3">
                      {section.isActive ? 'Active' : 'Inactive'}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingSection(section)}
                          className="rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-muted"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handlePublishGrades(section)}
                          disabled={
                            !section.isActive || publishGradesMutation.isPending
                          }
                          className="rounded-md border border-primary px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {publishGradesMutation.isPending
                            ? 'Publishing...'
                            : 'Publish Grades'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(section)}
                          disabled={deleteSectionMutation.isPending}
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

            {sections.length === 0 && (
              <div className="p-6 text-center text-sm text-muted-foreground">
                No sections found.
              </div>
            )}
          </div>

          {meta && (
            <div className="text-sm text-muted-foreground">
              Page {meta.page} of {meta.totalPages} · Total sections:{' '}
              {meta.total}
            </div>
          )}
        </>
      )}
    </main>
  );
}
