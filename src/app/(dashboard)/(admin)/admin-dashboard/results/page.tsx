'use client';

import { useMemo, useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  ClipboardList,
  LoaderCircle,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRegisteredStudentsBySection } from '@/hooks/course-registration.hook';
import { useSections, usePublishSectionGrades } from '@/hooks/section.hook';
import {
  useCreateResult,
  useDeleteResult,
  useResults,
  useUpdateResult,
} from '@/hooks/result.hook';
import { useExams } from '@/hooks/exam.hook';
import type { StudentResult, CreateResultPayload } from '@/api/result.api';
import type { RegisteredStudent } from '@/api/course-registration.api';
import { getApiErrorMessage } from '@/lib/api-error';

function getErrorMessage(error: unknown) {
  return getApiErrorMessage(error);
}

function formatDate(value: string) {
  if (!value) return '—';

  return new Intl.DateTimeFormat('en', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

function getStudentName(result: StudentResult) {
  const { firstName, lastName } = result.registration.student.user;
  return `${firstName} ${lastName}`.trim();
}

function getRegisteredStudentName(registration: RegisteredStudent) {
  const { firstName, lastName } = registration.student.user;
  return `${firstName} ${lastName}`.trim();
}

const AdminDashboardResultPage = () => {
  const [sectionId, setSectionId] = useState('');
  const [examId, setExamId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [registrationId, setRegistrationId] = useState('');
  const [obtainedMarks, setObtainedMarks] = useState('');
  const [remarks, setRemarks] = useState('');
  const [editingResult, setEditingResult] = useState<StudentResult | null>(
    null,
  );

  const sectionsQuery = useSections({
    page: 1,
    limit: 100,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const sections = sectionsQuery.data?.data?.data ?? [];

  const examsQuery = useExams({
    sectionId: sectionId || undefined,
    page: 1,
    limit: 100,
    sortBy: 'examDate',
    sortOrder: 'asc',
  });

  const exams = examsQuery.data?.data ?? [];
  const selectedExam = exams.find(exam => exam.id === examId);

  const registrationsQuery = useRegisteredStudentsBySection(sectionId);
  const registrations = registrationsQuery.data?.data ?? [];

  const resultsQuery = useResults({
    sectionId: sectionId || undefined,
    examId: examId || undefined,
    page: 1,
    limit: 100,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const results = resultsQuery.data?.data ?? [];

  const createResultMutation = useCreateResult();
  const updateResultMutation = useUpdateResult();
  const deleteResultMutation = useDeleteResult();
  const publishGradesMutation = usePublishSectionGrades();

  const isSaving =
    createResultMutation.isPending || updateResultMutation.isPending;

  // Exclude students who already have a result for the selected exam.
  const availableRegistrations = useMemo(() => {
    const existingRegistrationIds = new Set(
      results.map(result => result.registration.id),
    );

    return registrations.filter(
      registration => !existingRegistrationIds.has(registration.id),
    );
  }, [registrations, results]);

  const filteredResults = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) return results;

    return results.filter(result => {
      const studentName = getStudentName(result).toLowerCase();
      const studentId = result.registration.student.studentId.toLowerCase();

      return (
        studentName.includes(normalizedSearch) ||
        studentId.includes(normalizedSearch) ||
        result.registration.student.studentEmail
          .toLowerCase()
          .includes(normalizedSearch)
      );
    });
  }, [results, searchTerm]);

  const resetForm = () => {
    setRegistrationId('');
    setObtainedMarks('');
    setRemarks('');
    setEditingResult(null);
  };

  const handleSectionChange = (value: string) => {
    setSectionId(value);
    setExamId('');
    resetForm();
  };

  const handleExamChange = (value: string) => {
    setExamId(value);
    resetForm();
  };

  const handleEdit = (result: StudentResult) => {
    setEditingResult(result);
    setRegistrationId(result.registration.id);
    setObtainedMarks(String(result.obtainedMarks));
    setRemarks(result.remarks ?? '');

    document
      .getElementById('result-entry-form')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!sectionId || !examId) {
      toast.error('Please select a section and an exam.');
      return;
    }

    if (!editingResult && !registrationId) {
      toast.error('Please select a registered student.');
      return;
    }

    const marks = Number(obtainedMarks);

    if (obtainedMarks.trim() === '' || !Number.isFinite(marks) || marks < 0) {
      toast.error('Please enter a valid, non-negative mark.');
      return;
    }

    if (selectedExam && marks > selectedExam.totalMarks) {
      toast.error(`Marks cannot exceed ${selectedExam.totalMarks}.`);
      return;
    }

    try {
      if (editingResult) {
        await updateResultMutation.mutateAsync({
          resultId: editingResult.id,
          payload: {
            obtainedMarks: marks,
            remarks: remarks.trim() || undefined,
          },
        });

        toast.success('Result updated successfully.');
      } else {
        const payload: CreateResultPayload = {
          registrationId,
          examId,
          obtainedMarks: marks,
          remarks: remarks.trim() || undefined,
        };

        await createResultMutation.mutateAsync(payload);
        toast.success('Result created successfully.');
      }

      resetForm();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleDelete = async (result: StudentResult) => {
    const confirmed = window.confirm(
      `Delete the result for ${getStudentName(result)}?`,
    );

    if (!confirmed) return;

    try {
      await deleteResultMutation.mutateAsync(result.id);
      toast.success('Result deleted successfully.');

      if (editingResult?.id === result.id) {
        resetForm();
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handlePublishGrades = async () => {
    if (!sectionId) {
      toast.error('Please select a section first.');
      return;
    }

    const selectedSection = sections.find(section => section.id === sectionId);

    const confirmed = window.confirm(
      `Publish grades for ${selectedSection?.course.name ?? 'this course'} — ${selectedSection?.name ?? 'this section'}?`,
    );

    if (!confirmed) return;

    try {
      await publishGradesMutation.mutateAsync(sectionId);
      toast.success('Section grades published successfully.');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleRefresh = async () => {
    try {
      await Promise.all([
        sectionsQuery.refetch(),
        examsQuery.refetch(),
        resultsQuery.refetch(),
        ...(sectionId ? [registrationsQuery.refetch()] : []),
      ]);
      toast.success('Results refreshed successfully.');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const isLoading =
    sectionsQuery.isLoading ||
    (Boolean(sectionId) && examsQuery.isLoading) ||
    (Boolean(sectionId) && registrationsQuery.isLoading) ||
    (Boolean(sectionId && examId) && resultsQuery.isLoading);

  return (
    <main className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Results Management
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage examination results and publish section grades.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <RefreshCw
            className={`mr-2 size-4 ${isLoading ? 'animate-spin' : ''}`}
          />
          Refresh
        </Button>
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-3">
              <BookOpen className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Available sections
              </p>
              <p className="text-2xl font-bold">{sections.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-3">
              <ClipboardList className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Results found</p>
              <p className="text-2xl font-bold">{results.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-3">
              <CheckCircle2 className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Selected exam</p>
              <p className="text-lg font-bold">
                {selectedExam ? selectedExam.totalMarks : '—'}
                {selectedExam ? ' marks' : ''}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border bg-card p-4 sm:p-6">
        <div>
          <h2 className="text-lg font-semibold">Select section and exam</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose which examination results you want to manage.
          </p>
        </div>

        {sectionsQuery.isError && (
          <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            {getErrorMessage(sectionsQuery.error)}
          </p>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="section-select" className="text-sm font-medium">
              Section
            </label>
            <select
              id="section-select"
              value={sectionId}
              onChange={event => handleSectionChange(event.target.value)}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            >
              <option value="">Select a section</option>
              {sections.map(section => (
                <option key={section.id} value={section.id}>
                  {section.course.code} — {section.name} ({section.code})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="exam-select" className="text-sm font-medium">
              Examination
            </label>
            <select
              id="exam-select"
              value={examId}
              onChange={event => handleExamChange(event.target.value)}
              disabled={!sectionId || examsQuery.isLoading}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">
                {!sectionId
                  ? 'Select a section first'
                  : examsQuery.isLoading
                    ? 'Loading exams...'
                    : 'Select an exam'}
              </option>
              {exams.map(exam => (
                <option key={exam.id} value={exam.id}>
                  {exam.title} — {exam.totalMarks} marks
                </option>
              ))}
            </select>
          </div>
        </div>

        {sectionId && examsQuery.isError && (
          <p className="text-sm text-destructive">
            {getErrorMessage(examsQuery.error)}
          </p>
        )}

        {sectionId && registrationsQuery.isError && (
          <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            Failed to load registered students:{' '}
            {getErrorMessage(registrationsQuery.error)}
          </p>
        )}

        {sectionId && !examsQuery.isLoading && exams.length === 0 && (
          <p className="rounded-lg border p-4 text-sm text-muted-foreground">
            No exams were found for this section. Create an exam before entering
            results.
          </p>
        )}
      </section>

      {sectionId && examId && (
        <>
          <section
            id="result-entry-form"
            className="space-y-4 rounded-xl border bg-card p-4 sm:p-6"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold">
                  {editingResult ? 'Edit result' : 'Enter result'}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {editingResult
                    ? 'Update the marks or remarks for this result.'
                    : 'Select an enrolled student, then enter their examination marks.'}
                </p>
              </div>

              {editingResult && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel editing
                </Button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!editingResult && (
                <div className="space-y-2">
                  <label
                    htmlFor="registration-id"
                    className="text-sm font-medium"
                  >
                    Registered student
                  </label>

                  <select
                    id="registration-id"
                    value={registrationId}
                    onChange={event => setRegistrationId(event.target.value)}
                    disabled={
                      registrationsQuery.isLoading ||
                      registrationsQuery.isError ||
                      availableRegistrations.length === 0
                    }
                    required
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">
                      {registrationsQuery.isLoading
                        ? 'Loading registered students...'
                        : registrationsQuery.isError
                          ? 'Could not load students'
                          : availableRegistrations.length === 0
                            ? registrations.length > 0
                              ? 'All registered students already have results'
                              : 'No registered students in this section'
                            : 'Select a student'}
                    </option>

                    {availableRegistrations.map(registration => (
                      <option key={registration.id} value={registration.id}>
                        {getRegisteredStudentName(registration)} —{' '}
                        {registration.student.studentId}
                      </option>
                    ))}
                  </select>

                  {registrationsQuery.isError && (
                    <p className="text-sm text-destructive">
                      {getErrorMessage(registrationsQuery.error)}
                    </p>
                  )}

                  {!registrationsQuery.isLoading &&
                    !registrationsQuery.isError &&
                    registrations.length === 0 && (
                      <p className="text-xs text-muted-foreground">
                        No students with an active registration were found for
                        this section.
                      </p>
                    )}

                  {availableRegistrations.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      <Users className="mr-1 inline size-3.5" />
                      {availableRegistrations.length} student
                      {availableRegistrations.length === 1 ? '' : 's'} without a
                      result for this exam.
                    </p>
                  )}
                </div>
              )}

              {editingResult && (
                <div className="rounded-lg border bg-muted/30 p-3 text-sm">
                  <p className="font-medium">{getStudentName(editingResult)}</p>
                  <p className="text-muted-foreground">
                    Student ID: {editingResult.registration.student.studentId}
                  </p>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="obtained-marks"
                    className="text-sm font-medium"
                  >
                    Obtained marks (out of {selectedExam?.totalMarks ?? '—'})
                  </label>
                  <Input
                    id="obtained-marks"
                    type="number"
                    min="0"
                    max={selectedExam?.totalMarks}
                    step="any"
                    value={obtainedMarks}
                    onChange={event => setObtainedMarks(event.target.value)}
                    placeholder="e.g. 85"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="remarks" className="text-sm font-medium">
                    Remarks (optional)
                  </label>
                  <Input
                    id="remarks"
                    value={remarks}
                    onChange={event => setRemarks(event.target.value)}
                    maxLength={500}
                    placeholder="Optional feedback"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={
                  isSaving ||
                  (!editingResult &&
                    (registrationsQuery.isLoading ||
                      availableRegistrations.length === 0))
                }
              >
                {isSaving ? (
                  <LoaderCircle className="mr-2 size-4 animate-spin" />
                ) : editingResult ? (
                  <Pencil className="mr-2 size-4" />
                ) : (
                  <Plus className="mr-2 size-4" />
                )}
                {isSaving
                  ? 'Saving...'
                  : editingResult
                    ? 'Update result'
                    : 'Create result'}
              </Button>
            </form>
          </section>

          <section className="space-y-4 rounded-xl border bg-card p-4 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold">Exam results</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {selectedExam?.title ?? 'Selected exam'}
                  {' · '}
                  {filteredResults.length} result
                  {filteredResults.length === 1 ? '' : 's'}
                </p>
              </div>

              <Button
                type="button"
                onClick={handlePublishGrades}
                disabled={publishGradesMutation.isPending}
              >
                {publishGradesMutation.isPending ? (
                  <LoaderCircle className="mr-2 size-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="mr-2 size-4" />
                )}
                {publishGradesMutation.isPending
                  ? 'Publishing...'
                  : 'Publish section grades'}
              </Button>
            </div>

            <div className="relative">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={event => setSearchTerm(event.target.value)}
                placeholder="Search by student name, ID, or email"
                className="pl-9"
              />
            </div>

            {resultsQuery.isError && (
              <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                {getErrorMessage(resultsQuery.error)}
              </p>
            )}

            {resultsQuery.isLoading ? (
              <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
                <LoaderCircle className="size-5 animate-spin" />
                Loading results...
              </div>
            ) : filteredResults.length === 0 ? (
              <div className="rounded-lg border border-dashed py-12 text-center">
                <ClipboardList className="mx-auto mb-3 size-8 text-muted-foreground" />
                <p className="font-medium">No results found</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Create a result above, or try another search.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 font-medium">Student</th>
                      <th className="px-4 py-3 font-medium">Student ID</th>
                      <th className="px-4 py-3 font-medium">Marks</th>
                      <th className="px-4 py-3 font-medium">Remarks</th>
                      <th className="px-4 py-3 font-medium">Updated</th>
                      <th className="px-4 py-3 text-right font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y">
                    {filteredResults.map(result => (
                      <tr key={result.id} className="hover:bg-muted/30">
                        <td className="px-4 py-3">
                          <p className="font-medium">
                            {getStudentName(result)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {result.registration.student.studentEmail}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          {result.registration.student.studentId}
                        </td>
                        <td className="px-4 py-3 font-semibold">
                          {result.obtainedMarks} / {result.exam.totalMarks}
                        </td>
                        <td className="max-w-48 truncate px-4 py-3">
                          {result.remarks || '—'}
                        </td>
                        <td className="px-4 py-3">
                          {formatDate(result.updatedAt)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(result)}
                              aria-label={`Edit result for ${getStudentName(result)}`}
                            >
                              <Pencil className="size-4" />
                            </Button>

                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              disabled={deleteResultMutation.isPending}
                              onClick={() => handleDelete(result)}
                              aria-label={`Delete result for ${getStudentName(result)}`}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}

      {!sectionId && (
        <section className="rounded-xl border border-dashed p-10 text-center">
          <BookOpen className="mx-auto mb-3 size-9 text-muted-foreground" />
          <h2 className="font-semibold">Choose a section to get started</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Select a section and exam above to manage results and publish
            grades.
          </p>
        </section>
      )}
    </main>
  );
};

export default AdminDashboardResultPage;
