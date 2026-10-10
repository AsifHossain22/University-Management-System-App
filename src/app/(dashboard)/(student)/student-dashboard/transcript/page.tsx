'use client';

import { useEffect } from 'react';
import {
  BookOpen,
  CheckCircle2,
  GraduationCap,
  TrendingUp,
  XCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { useMyTranscript } from '@/hooks/transcript.hook';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getApiErrorMessage } from '@/lib/api-error';

function formatGPA(value: number) {
  return Number(value).toFixed(2);
}

export default function StudentTranscriptPage() {
  const { data, isLoading, isError, error } = useMyTranscript();
  const transcript = data?.data;

  useEffect(() => {
    if (isError) {
      toast.error(getApiErrorMessage(error));
    }
  }, [isError, error]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 animate-pulse rounded bg-muted" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(item => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-xl bg-muted"
            />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <p className="font-medium">Unable to load transcript</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!transcript) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">
          No transcript data is available yet.
        </CardContent>
      </Card>
    );
  }

  const allCourses = transcript.semesters.flatMap(semester => semester.courses);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Academic Transcript
          </h1>
          <p className="text-muted-foreground">
            {transcript.student.firstName} {transcript.student.lastName}
            {' · '}
            Student ID: {transcript.student.studentId}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Cumulative GPA (CGPA)
              </CardTitle>
              <GraduationCap className="size-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {formatGPA(transcript.cumulativeGPA)}
              </div>
              <p className="text-xs text-muted-foreground">Out of 4.00</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Credits Earned
              </CardTitle>
              <BookOpen className="size-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {transcript.totalCreditsEarned}
              </div>
              <p className="text-xs text-muted-foreground">
                Successfully completed credits
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Published Courses
              </CardTitle>
              <TrendingUp className="size-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{allCourses.length}</div>
              <p className="text-xs text-muted-foreground">
                Courses with published grades
              </p>
            </CardContent>
          </Card>
        </div>

        {transcript.semesters.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <GraduationCap className="mx-auto mb-3 size-10 text-muted-foreground" />
              <h2 className="font-semibold">No published grades yet</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Your transcript will appear here after the university publishes
                your course grades.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {transcript.semesters.map(semester => (
              <Card key={semester.semester.id}>
                <CardHeader>
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                      <CardTitle>{semester.semester.name}</CardTitle>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Semester code: {semester.semester.code}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <span>
                        GPA: <strong>{formatGPA(semester.semesterGPA)}</strong>
                      </span>
                      <span>
                        Credits earned:{' '}
                        <strong>{semester.creditsEarned}</strong>
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[650px] text-sm">
                      <thead>
                        <tr className="border-b text-left text-muted-foreground">
                          <th className="px-3 py-3 font-medium">Course</th>
                          <th className="px-3 py-3 font-medium">Credits</th>
                          <th className="px-3 py-3 font-medium">Final marks</th>
                          <th className="px-3 py-3 font-medium">Grade</th>
                          <th className="px-3 py-3 font-medium">Grade point</th>
                          <th className="px-3 py-3 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {semester.courses.map(course => (
                          <tr
                            key={course.id}
                            className="border-b last:border-0"
                          >
                            <td className="px-3 py-4">
                              <p className="font-medium">
                                {course.course.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {course.course.code} · Section{' '}
                                {course.section.code}
                              </p>
                            </td>
                            <td className="px-3 py-4">
                              {course.course.credits}
                            </td>
                            <td className="px-3 py-4">
                              {course.finalMarks.toFixed(2)}%
                            </td>
                            <td className="px-3 py-4 font-semibold">
                              {course.grade}
                            </td>
                            <td className="px-3 py-4">
                              {formatGPA(course.gradePoint)}
                            </td>
                            <td className="px-3 py-4">
                              {course.isPassed ? (
                                <span className="inline-flex items-center gap-1 text-green-600">
                                  <CheckCircle2 className="size-4" />
                                  Passed
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-destructive">
                                  <XCircle className="size-4" />
                                  Failed
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
