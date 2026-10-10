'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  useCreateExam,
  useDeleteExam,
  useExams,
  useUpdateExam,
} from '@/hooks/exam.hook';
import { useSections } from '@/hooks/section.hook';
import type { Exam, ExamType } from '@/types/exam.type';

const EXAM_TYPES: ExamType[] = [
  'MIDTERM',
  'FINAL',
  'QUIZ',
  'ASSIGNMENT',
  'PRESENTATION',
];

const EMPTY_FORM = {
  sectionId: '',
  title: '',
  type: 'MIDTERM' as ExamType,
  examDate: '',
  totalMarks: '100',
  passingMarks: '40',
  weight: '100',
};

type ExamFormState = typeof EMPTY_FORM;

export default function ExamManagementPage() {
  const [sectionId, setSectionId] = useState('');
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [form, setForm] = useState<ExamFormState>(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);

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

  const createExamMutation = useCreateExam();
  const updateExamMutation = useUpdateExam();
  const deleteExamMutation = useDeleteExam();

  const activeWeightTotal = useMemo(
    () =>
      exams
        .filter(exam => exam.isActive && !exam.deletedAt)
        .reduce((total, exam) => total + exam.weight, 0),
    [exams],
  );

  const weightsAreValid = Math.abs(activeWeightTotal - 100) <= 0.01;

  const isSaving = createExamMutation.isPending || updateExamMutation.isPending;

  function resetForm() {
    setForm({
      ...EMPTY_FORM,
      sectionId,
    });
    setEditingExam(null);
    setShowForm(false);
  }

  function openCreateForm() {
    setEditingExam(null);
    setForm({
      ...EMPTY_FORM,
      sectionId,
    });
    setShowForm(true);
  }

  function openEditForm(exam: Exam) {
    setEditingExam(exam);
    setForm({
      sectionId: exam.sectionId,
      title: exam.title,
      type: exam.type,
      examDate: exam.examDate.slice(0, 10),
      totalMarks: String(exam.totalMarks),
      passingMarks: String(exam.passingMarks),
      weight: String(exam.weight),
    });
    setShowForm(true);
  }

  function updateField<K extends keyof ExamFormState>(
    field: K,
    value: ExamFormState[K],
  ) {
    setForm(previous => ({
      ...previous,
      [field]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.sectionId) {
      toast.error('Please select a section.');
      return;
    }

    const totalMarks = Number(form.totalMarks);
    const passingMarks = Number(form.passingMarks);
    const weight = Number(form.weight);

    if (
      !Number.isFinite(totalMarks) ||
      !Number.isFinite(passingMarks) ||
      !Number.isFinite(weight) ||
      totalMarks <= 0 ||
      passingMarks <= 0 ||
      passingMarks > totalMarks ||
      weight <= 0 ||
      weight > 100
    ) {
      toast.error(
        'Check the marks and weight. Passing marks cannot exceed total marks.',
      );
      return;
    }

    const payload = {
      sectionId: form.sectionId,
      title: form.title.trim(),
      type: form.type,
      examDate: new Date(`${form.examDate}T12:00:00`).toISOString(),
      totalMarks,
      passingMarks,
      weight,
    };

    if (!payload.title || !form.examDate) {
      toast.error('Please complete all required fields.');
      return;
    }

    try {
      if (editingExam) {
        await updateExamMutation.mutateAsync({
          examId: editingExam.id,
          payload: {
            title: payload.title,
            type: payload.type,
            examDate: payload.examDate,
            totalMarks: payload.totalMarks,
            passingMarks: payload.passingMarks,
            weight: payload.weight,
          },
        });

        toast.success('Exam updated successfully.');
      } else {
        await createExamMutation.mutateAsync(payload);
        toast.success('Exam created successfully.');
      }

      resetForm();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Unable to save the exam.'));
    }
  }

  async function handleToggleActive(exam: Exam) {
    try {
      await updateExamMutation.mutateAsync({
        examId: exam.id,
        payload: {
          isActive: !exam.isActive,
        },
      });

      toast.success(
        exam.isActive
          ? 'Exam deactivated successfully.'
          : 'Exam activated successfully.',
      );
    } catch (error) {
      toast.error(getErrorMessage(error, 'Unable to update the exam.'));
    }
  }

  async function handleDelete(exam: Exam) {
    const confirmed = window.confirm(
      `Delete "${exam.title}"? This will soft-delete the exam.`,
    );

    if (!confirmed) return;

    try {
      await deleteExamMutation.mutateAsync(exam.id);
      toast.success('Exam deleted successfully.');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Unable to delete the exam.'));
    }
  }

  return (
    <main className="space-y-6 p-4 sm:p-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Exam Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create exams and manage exam weights for each section.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          disabled={!sectionId}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          Create Exam
        </button>
      </header>

      <section className="rounded-lg border bg-card p-4">
        <label htmlFor="section" className="mb-2 block text-sm font-medium">
          Select Section
        </label>

        <select
          id="section"
          value={sectionId}
          onChange={event => {
            setSectionId(event.target.value);
            setShowForm(false);
            setEditingExam(null);
            setForm(EMPTY_FORM);
          }}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm sm:max-w-lg"
        >
          <option value="">Choose a section</option>
          {sections.map(section => (
            <option key={section.id} value={section.id}>
              {section.name} ({section.code})
            </option>
          ))}
        </select>

        {sectionsQuery.isLoading && (
          <p className="mt-2 text-sm text-muted-foreground">
            Loading sections...
          </p>
        )}

        {sectionsQuery.isError && (
          <p className="mt-2 text-sm text-destructive">
            Unable to load sections. Please refresh the page.
          </p>
        )}
      </section>

      {showForm && (
        <section className="rounded-lg border bg-card p-4 sm:p-6">
          <h2 className="mb-4 text-lg font-semibold">
            {editingExam ? 'Edit Exam' : 'Create Exam'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-1">
                <label htmlFor="exam-title" className="text-sm font-medium">
                  Exam Title
                </label>
                <input
                  id="exam-title"
                  required
                  maxLength={150}
                  value={form.title}
                  onChange={event => updateField('title', event.target.value)}
                  placeholder="e.g. Midterm Examination"
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="exam-type" className="text-sm font-medium">
                  Exam Type
                </label>
                <select
                  id="exam-type"
                  value={form.type}
                  onChange={event =>
                    updateField('type', event.target.value as ExamType)
                  }
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                >
                  {EXAM_TYPES.map(type => (
                    <option key={type} value={type}>
                      {formatLabel(type)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label htmlFor="exam-date" className="text-sm font-medium">
                  Exam Date
                </label>
                <input
                  id="exam-date"
                  required
                  type="date"
                  value={form.examDate}
                  onChange={event =>
                    updateField('examDate', event.target.value)
                  }
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="total-marks" className="text-sm font-medium">
                  Total Marks
                </label>
                <input
                  id="total-marks"
                  required
                  type="number"
                  min="0.01"
                  step="any"
                  value={form.totalMarks}
                  onChange={event =>
                    updateField('totalMarks', event.target.value)
                  }
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="passing-marks" className="text-sm font-medium">
                  Passing Marks
                </label>
                <input
                  id="passing-marks"
                  required
                  type="number"
                  min="0.01"
                  step="any"
                  value={form.passingMarks}
                  onChange={event =>
                    updateField('passingMarks', event.target.value)
                  }
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="exam-weight" className="text-sm font-medium">
                  Weight (%)
                </label>
                <input
                  id="exam-weight"
                  required
                  type="number"
                  min="0.01"
                  max="100"
                  step="any"
                  value={form.weight}
                  onChange={event => updateField('weight', event.target.value)}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
              >
                {isSaving
                  ? 'Saving...'
                  : editingExam
                    ? 'Save Changes'
                    : 'Create Exam'}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="rounded-md border px-4 py-2 text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {sectionId && (
        <>
          <section className="rounded-lg border bg-card p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold">Active Exam Weights</h2>
                <p className="text-sm text-muted-foreground">
                  Active exams must total exactly 100% before grades can be
                  published.
                </p>
              </div>

              <p
                className={`text-lg font-bold ${
                  weightsAreValid ? 'text-green-600' : 'text-destructive'
                }`}
              >
                {activeWeightTotal.toFixed(2)}%
              </p>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full ${
                  weightsAreValid ? 'bg-green-600' : 'bg-primary'
                }`}
                style={{
                  width: `${Math.min(activeWeightTotal, 100)}%`,
                }}
              />
            </div>

            <p className="mt-2 text-xs text-muted-foreground">
              {weightsAreValid
                ? 'Weight total is valid.'
                : `Adjust active exam weights by ${(100 - activeWeightTotal).toFixed(2)} percentage points.`}
            </p>
          </section>

          <section className="overflow-hidden rounded-lg border bg-card">
            <div className="border-b p-4">
              <h2 className="font-semibold">Exams</h2>
            </div>

            {examsQuery.isLoading ? (
              <p className="p-6 text-sm text-muted-foreground">
                Loading exams...
              </p>
            ) : examsQuery.isError ? (
              <p className="p-6 text-sm text-destructive">
                Unable to load exams. Please try again.
              </p>
            ) : exams.length === 0 ? (
              <p className="p-6 text-sm text-muted-foreground">
                No exams found for this section. Create the first exam above.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] text-left text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 font-medium">Exam</th>
                      <th className="px-4 py-3 font-medium">Type</th>
                      <th className="px-4 py-3 font-medium">Date</th>
                      <th className="px-4 py-3 font-medium">Marks</th>
                      <th className="px-4 py-3 font-medium">Weight</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y">
                    {exams.map(exam => (
                      <tr key={exam.id}>
                        <td className="px-4 py-3 font-medium">{exam.title}</td>
                        <td className="px-4 py-3">{formatLabel(exam.type)}</td>
                        <td className="px-4 py-3">
                          {new Date(exam.examDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          {exam.passingMarks} / {exam.totalMarks}
                        </td>
                        <td className="px-4 py-3">{exam.weight}%</td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-medium ${
                              exam.isActive
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            {exam.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => openEditForm(exam)}
                              className="rounded-md border px-3 py-1.5 text-xs font-medium"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => handleToggleActive(exam)}
                              disabled={updateExamMutation.isPending}
                              className="rounded-md border px-3 py-1.5 text-xs font-medium disabled:opacity-50"
                            >
                              {exam.isActive ? 'Deactivate' : 'Activate'}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(exam)}
                              disabled={deleteExamMutation.isPending}
                              className="rounded-md border border-destructive px-3 py-1.5 text-xs font-medium text-destructive disabled:opacity-50"
                            >
                              Delete
                            </button>
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

      {!sectionId && !sectionsQuery.isLoading && (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="font-medium">Select a section to manage exams.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Exams and their weights are configured separately for each section.
          </p>
        </div>
      )}
    </main>
  );
}

function formatLabel(value: string) {
  return value
    .toLowerCase()
    .replaceAll('_', ' ')
    .replace(/\b\w/g, character => character.toUpperCase());
}

function getErrorMessage(error: unknown, fallback: string) {
  if (typeof error === 'object' && error !== null && 'data' in error) {
    const data = (error as { data?: { message?: string } }).data;

    if (data?.message) return data.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
