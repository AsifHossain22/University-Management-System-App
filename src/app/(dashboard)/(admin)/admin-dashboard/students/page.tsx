'use client';

import { useMemo, useState } from 'react';
import { useAllStudents } from '@/hooks/student.hook';

export default function AdminStudentsPage() {
  const { data, isLoading, isError, refetch, isFetching } = useAllStudents();

  const [searchTerm, setSearchTerm] = useState('');

  const students = data?.data ?? [];

  const filteredStudents = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) return students;

    return students.filter(student => {
      const fullName =
        `${student.user.firstName} ${student.user.lastName}`.toLowerCase();

      return (
        fullName.includes(search) ||
        student.studentId.toLowerCase().includes(search) ||
        student.studentEmail.toLowerCase().includes(search) ||
        student.user.email.toLowerCase().includes(search)
      );
    });
  }, [students, searchTerm]);

  return (
    <main className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Student Management
        </h1>
        <p className="text-muted-foreground">
          View registered students and search their academic records.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border p-5">
          <p className="text-sm text-muted-foreground">Total students</p>
          <p className="mt-2 text-2xl font-bold">
            {isLoading ? '—' : students.length}
          </p>
        </div>

        <div className="rounded-lg border p-5">
          <p className="text-sm text-muted-foreground">Search results</p>
          <p className="mt-2 text-2xl font-bold">
            {isLoading ? '—' : filteredStudents.length}
          </p>
        </div>
      </div>

      <div>
        <label
          htmlFor="student-search"
          className="mb-2 block text-sm font-medium"
        >
          Search students
        </label>

        <input
          id="student-search"
          type="search"
          value={searchTerm}
          onChange={event => setSearchTerm(event.target.value)}
          placeholder="Search by name, student ID, or email..."
          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {isLoading && (
        <div className="space-y-3 rounded-lg border p-6">
          <p className="text-sm text-muted-foreground">Loading students...</p>
          <div className="h-10 animate-pulse rounded bg-muted" />
          <div className="h-10 animate-pulse rounded bg-muted" />
          <div className="h-10 animate-pulse rounded bg-muted" />
        </div>
      )}

      {isError && (
        <div className="space-y-3 rounded-lg border p-6">
          <p className="text-sm text-destructive">
            Failed to load students. Please try again.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
          >
            {isFetching ? 'Retrying...' : 'Retry'}
          </button>
        </div>
      )}

      {!isLoading && !isError && (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Student ID</th>
                <th className="px-4 py-3 text-left font-medium">
                  Student name
                </th>
                <th className="px-4 py-3 text-left font-medium">Email</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.map(student => (
                <tr key={student.id} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium">{student.studentId}</td>
                  <td className="px-4 py-3">
                    {student.user.firstName} {student.user.lastName}
                  </td>
                  <td className="px-4 py-3">
                    {student.studentEmail || student.user.email}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredStudents.length === 0 && (
            <div className="p-6 text-center text-sm text-muted-foreground">
              {students.length === 0
                ? 'No students found.'
                : 'No students match your search.'}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
