'use client';

import { useState } from 'react';
import { CalendarDays, Search } from 'lucide-react';
import { useExams } from '@/hooks/exam.hook';
import type { ExamType } from '@/types/exam.type';

const examTypes: ExamType[] = [
  'MIDTERM',
  'FINAL',
  'QUIZ',
  'ASSIGNMENT',
  'PRESENTATION',
];

export default function InstructorExamsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [type, setType] = useState<ExamType | undefined>();

  const { data, isLoading, isError } = useExams({
    page: 1,
    limit: 100,
    searchTerm: searchTerm.trim() || undefined,
    type,
    sortBy: 'examDate',
    sortOrder: 'asc',
  });

  const exams = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="p-6">
        <p>Loading exams...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <p className="text-destructive">Failed to load exams.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Exams</h1>
        <p className="text-muted-foreground">
          View exams scheduled for your assigned sections.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <input
            type="text"
            placeholder="Search exams..."
            value={searchTerm}
            onChange={event => setSearchTerm(event.target.value)}
            className="h-10 w-full rounded-md border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2"
          />
        </div>

        <select
          value={type ?? ''}
          onChange={event =>
            setType(
              event.target.value ? (event.target.value as ExamType) : undefined,
            )
          }
          className="h-10 rounded-md border bg-background px-3 text-sm"
        >
          <option value="">All exam types</option>

          {examTypes.map(examType => (
            <option key={examType} value={examType}>
              {examType}
            </option>
          ))}
        </select>
      </div>

      {/* ExamCount */}
      <div className="text-sm text-muted-foreground">
        {data?.meta?.total ?? exams.length} exam(s) found
      </div>

      {/* ExamsTable */}
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left">Exam</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Section</th>
              <th className="px-4 py-3 text-left">Exam Date</th>
              <th className="px-4 py-3 text-left">Total Marks</th>
              <th className="px-4 py-3 text-left">Passing Marks</th>
              <th className="px-4 py-3 text-left">Weight</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {exams.map(exam => (
              <tr key={exam.id} className="border-b last:border-b-0">
                <td className="px-4 py-3 font-medium">{exam.title}</td>

                <td className="px-4 py-3">{exam.type}</td>

                <td className="px-4 py-3">
                  {exam.section?.code ?? 'N/A'}
                  {exam.section?.name ? ` - ${exam.section.name}` : ''}
                </td>

                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays className="size-4 text-muted-foreground" />
                    {new Date(exam.examDate).toLocaleDateString()}
                  </span>
                </td>

                <td className="px-4 py-3">{exam.totalMarks}</td>

                <td className="px-4 py-3">{exam.passingMarks}</td>

                <td className="px-4 py-3">{exam.weight}%</td>

                <td className="px-4 py-3">
                  <span
                    className={
                      exam.isActive
                        ? 'rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-700'
                        : 'rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground'
                    }
                  >
                    {exam.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}

            {exams.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No exams found for your assigned sections.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
