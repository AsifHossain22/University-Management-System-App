'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createFee, getAllFees, type CreateFeePayload } from '@/api/fee.api';
import apiClient from '@/lib/apiClient';
import type { ApiResponse } from '@/types/auth.type';

interface AdminStudent {
  id: string;
  studentId: string;
  studentEmail: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface AdminFee {
  id: string;
  title: string;
  description: string | null;
  amount: number;
  dueDate: string;
  status: string;
  isActive: boolean;
  student: {
    studentId: string;
    studentEmail: string;
    user: {
      firstName: string;
      lastName: string;
    };
  };
}

interface FeeListResponse {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: AdminFee[];
}

const initialForm = {
  studentId: '',
  title: '',
  description: '',
  amount: '',
  dueDate: '',
};

export default function AdminFeesPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(initialForm);

  const studentsQuery = useQuery({
    queryKey: ['admin-students'],
    queryFn: async () => {
      const response =
        await apiClient<ApiResponse<AdminStudent[]>>('/students');
      return response.data;
    },
  });

  const feesQuery = useQuery({
    queryKey: ['admin-fees'],
    queryFn: async () => {
      const response = await getAllFees({ page: 1, limit: 100 });
      return response.data as FeeListResponse;
    },
  });

  const createFeeMutation = useMutation({
    mutationFn: (payload: CreateFeePayload) => createFee(payload),
    onSuccess: () => {
      toast.success('Fee created successfully!');
      setForm(initialForm);
      queryClient.invalidateQueries({ queryKey: ['admin-fees'] });
      queryClient.invalidateQueries({ queryKey: ['student-profile'] });
    },
    onError: error => {
      const message =
        error instanceof Error ? error.message : 'Failed to create fee.';
      toast.error(message);
    },
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !form.studentId ||
      !form.title.trim() ||
      !form.amount ||
      !form.dueDate
    ) {
      toast.error('Please complete all required fields.');
      return;
    }

    const amount = Number(form.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error('Enter an amount greater than zero.');
      return;
    }

    createFeeMutation.mutate({
      studentId: form.studentId,
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      amount,
      dueDate: new Date(`${form.dueDate}T23:59:59`).toISOString(),
    });
  }

  const students = studentsQuery.data ?? [];
  const fees = feesQuery.data?.data ?? [];

  return (
    <main className="space-y-6 p-6">
      {' '}
      <div>
        {' '}
        <h1 className="text-2xl font-bold">Fee Management</h1>{' '}
        <p className="text-muted-foreground">
          Create and manage student fees and payment records.{' '}
        </p>{' '}
      </div>
      <section className="rounded-xl border p-5">
        <h2 className="mb-4 text-lg font-semibold">Create a fee</h2>

        {studentsQuery.isLoading ? (
          <p>Loading students...</p>
        ) : studentsQuery.isError ? (
          <div className="space-y-2">
            <p className="text-sm text-destructive">Could not load students.</p>
            <button
              type="button"
              className="rounded-md border px-3 py-2 text-sm"
              onClick={() => studentsQuery.refetch()}
            >
              Retry
            </button>
          </div>
        ) : students.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No students are available to assign a fee to.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label htmlFor="studentId" className="text-sm font-medium">
                Student *
              </label>
              <select
                id="studentId"
                required
                value={form.studentId}
                onChange={event =>
                  setForm({ ...form, studentId: event.target.value })
                }
                className="w-full rounded-md border bg-background px-3 py-2"
              >
                <option value="">Select a student</option>
                {students.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.user.firstName} {student.user.lastName} —{' '}
                    {student.studentId}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="title" className="text-sm font-medium">
                Fee title *
              </label>
              <input
                id="title"
                required
                maxLength={200}
                value={form.title}
                onChange={event =>
                  setForm({ ...form, title: event.target.value })
                }
                placeholder="e.g. Semester Tuition Fee"
                className="w-full rounded-md border bg-background px-3 py-2"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="amount" className="text-sm font-medium">
                Amount *
              </label>
              <input
                id="amount"
                type="number"
                required
                min="0.01"
                step="0.01"
                value={form.amount}
                onChange={event =>
                  setForm({ ...form, amount: event.target.value })
                }
                placeholder="e.g. 5000"
                className="w-full rounded-md border bg-background px-3 py-2"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="dueDate" className="text-sm font-medium">
                Due date *
              </label>
              <input
                id="dueDate"
                type="date"
                required
                value={form.dueDate}
                onChange={event =>
                  setForm({ ...form, dueDate: event.target.value })
                }
                className="w-full rounded-md border bg-background px-3 py-2"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                maxLength={1000}
                value={form.description}
                onChange={event =>
                  setForm({ ...form, description: event.target.value })
                }
                placeholder="Optional fee details"
                className="w-full rounded-md border bg-background px-3 py-2"
              />
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={createFeeMutation.isPending}
                className="rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground disabled:opacity-50"
              >
                {createFeeMutation.isPending ? 'Creating...' : 'Create fee'}
              </button>
            </div>
          </form>
        )}
      </section>
      <section className="rounded-xl border p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Existing fees</h2>
          <button
            type="button"
            onClick={() => feesQuery.refetch()}
            className="rounded-md border px-3 py-2 text-sm"
          >
            Refresh
          </button>
        </div>

        {feesQuery.isLoading ? (
          <p>Loading fees...</p>
        ) : feesQuery.isError ? (
          <p className="text-sm text-destructive">
            Could not load fees. Try refreshing.
          </p>
        ) : fees.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No fees found. Create your first fee above.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="px-3 py-3">Student</th>
                  <th className="px-3 py-3">Fee</th>
                  <th className="px-3 py-3">Amount</th>
                  <th className="px-3 py-3">Due date</th>
                  <th className="px-3 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {fees.map(fee => (
                  <tr key={fee.id} className="border-b last:border-0">
                    <td className="px-3 py-3">
                      {fee.student.user.firstName} {fee.student.user.lastName}
                      <p className="text-xs text-muted-foreground">
                        {fee.student.studentEmail}
                      </p>
                    </td>
                    <td className="px-3 py-3">
                      <p className="font-medium">{fee.title}</p>
                      {fee.description && (
                        <p className="text-xs text-muted-foreground">
                          {fee.description}
                        </p>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      {new Intl.NumberFormat('en-BD', {
                        style: 'currency',
                        currency: 'BDT',
                      }).format(fee.amount)}
                    </td>
                    <td className="px-3 py-3">
                      {new Date(fee.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-3">
                      <span className="rounded-full border px-2 py-1 text-xs">
                        {fee.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
