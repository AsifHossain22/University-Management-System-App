'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  createFee,
  getAllFees,
  updateFee,
  deleteFee,
  type CreateFeePayload,
  type UpdateFeePayload,
} from '@/api/fee.api';
import { useFeeDetails } from '@/hooks/fee.hook';
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

interface FeeFormState {
  studentId: string;
  title: string;
  description: string;
  amount: string;
  dueDate: string;
}

interface EditFeeFormState {
  title: string;
  description: string;
  amount: string;
  dueDate: string;
}

const initialForm: FeeFormState = {
  studentId: '',
  title: '',
  description: '',
  amount: '',
  dueDate: '',
};

const initialEditForm: EditFeeFormState = {
  title: '',
  description: '',
  amount: '',
  dueDate: '',
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
  }).format(amount);

function toDateInputValue(value: string | Date) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function toApiDate(value: string) {
  const [year, month, day] = value.split('-').map(Number);

  return new Date(year, month - 1, day, 23, 59, 59).toISOString();
}

export default function AdminFeesPage() {
  const queryClient = useQueryClient();

  const [form, setForm] = useState<FeeFormState>(initialForm);
  const [selectedFeeId, setSelectedFeeId] = useState<string | null>(null);

  const [editingFeeId, setEditingFeeId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditFeeFormState>(initialEditForm);

  // LoadStudents
  const studentsQuery = useQuery({
    queryKey: ['admin-students'],
    queryFn: async () => {
      const response =
        await apiClient<ApiResponse<AdminStudent[]>>('/students');

      return response.data;
    },
  });

  // LoadFees
  const feesQuery = useQuery({
    queryKey: ['admin-fees'],
    queryFn: async () => {
      const response = await getAllFees({ page: 1, limit: 100 });

      return response.data as FeeListResponse;
    },
  });

  // LoadSelectedFeeDetails
  const feeDetailsQuery = useFeeDetails(selectedFeeId);

  // CreateFee
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

  // UpdateFee
  const updateFeeMutation = useMutation({
    mutationFn: ({
      feeId,
      payload,
    }: {
      feeId: string;
      payload: UpdateFeePayload;
    }) => updateFee(feeId, payload),

    onSuccess: async () => {
      toast.success('Fee updated successfully!');

      setEditingFeeId(null);
      setEditForm(initialEditForm);

      await queryClient.invalidateQueries({
        queryKey: ['admin-fees'],
      });

      if (selectedFeeId) {
        await feeDetailsQuery.refetch();
      }
    },

    onError: error => {
      const message =
        error instanceof Error ? error.message : 'Failed to update fee.';

      toast.error(message);
    },
  });

  // DeleteFee
  const deleteFeeMutation = useMutation({
    mutationFn: (feeId: string) => deleteFee(feeId),

    onSuccess: async (_data, deletedFeeId) => {
      toast.success('Fee deleted successfully!');

      if (editingFeeId === deletedFeeId) {
        setEditingFeeId(null);
        setEditForm(initialEditForm);
      }

      if (selectedFeeId === deletedFeeId) {
        setSelectedFeeId(null);
      }

      await queryClient.invalidateQueries({
        queryKey: ['admin-fees'],
      });

      queryClient.invalidateQueries({
        queryKey: ['student-profile'],
      });
    },

    onError: error => {
      const message =
        error instanceof Error ? error.message : 'Failed to delete fee.';

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
      dueDate: toApiDate(form.dueDate),
    });
  }

  // OpenFeeDetails
  function handleViewDetails(feeId: string) {
    setSelectedFeeId(feeId);

    requestAnimationFrame(() => {
      document
        .getElementById('fee-details-panel')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  function handleCloseDetails() {
    setSelectedFeeId(null);
  }

  // OpenEditForm
  function handleStartEdit(fee: AdminFee) {
    if (fee.status.toUpperCase() === 'PAID') {
      toast.error('Paid fees cannot be edited.');
      return;
    }

    setEditingFeeId(fee.id);

    setEditForm({
      title: fee.title,
      description: fee.description ?? '',
      amount: String(fee.amount),
      dueDate: toDateInputValue(fee.dueDate),
    });

    requestAnimationFrame(() => {
      document
        .getElementById('edit-fee-panel')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  function handleCancelEdit() {
    setEditingFeeId(null);
    setEditForm(initialEditForm);
  }

  // SubmitEditForm
  function handleUpdateSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingFeeId) {
      toast.error('Select a fee to edit.');
      return;
    }

    const currentFee = fees.find(fee => fee.id === editingFeeId);

    if (currentFee?.status.toUpperCase() === 'PAID') {
      toast.error('Paid fees cannot be edited.');
      setEditingFeeId(null);
      setEditForm(initialEditForm);
      return;
    }

    if (!editForm.title.trim() || !editForm.amount || !editForm.dueDate) {
      toast.error('Please complete all required fields.');
      return;
    }

    const amount = Number(editForm.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error('Enter an amount greater than zero.');
      return;
    }

    const payload: UpdateFeePayload = {
      title: editForm.title.trim(),
      description: editForm.description.trim() || undefined,
      amount,
      dueDate: toApiDate(editForm.dueDate),
    };

    updateFeeMutation.mutate({
      feeId: editingFeeId,
      payload,
    });
  }

  // ConfirmDelete
  function handleDeleteFee(fee: AdminFee) {
    if (fee.status.toUpperCase() === 'PAID') {
      toast.error('Paid fees cannot be deleted.');
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${fee.title}" for ${fee.student.user.firstName} ${fee.student.user.lastName}?`,
    );

    if (!confirmed) {
      return;
    }

    deleteFeeMutation.mutate(fee.id);
  }

  const students = studentsQuery.data ?? [];
  const fees = feesQuery.data?.data ?? [];
  const selectedFee = feeDetailsQuery.data?.data;

  const isDeleting = deleteFeeMutation.isPending;
  const isEditing = updateFeeMutation.isPending;

  return (
    <main className="space-y-6 p-6">
      {/* PageHeading */}
      <div>
        <h1 className="text-2xl font-bold">Fee Management</h1>

        <p className="text-muted-foreground">
          Create and manage student fees and payment records.
        </p>
      </div>

      {/* CreateFee */}
      <section className="rounded-xl border p-5">
        <h2 className="mb-4 text-lg font-semibold">Create a fee</h2>

        {studentsQuery.isLoading ? (
          <p>Loading students...</p>
        ) : studentsQuery.isError ? (
          <div className="space-y-2">
            <p className="text-sm text-destructive">Could not load students.</p>

            <button
              type="button"
              onClick={() => studentsQuery.refetch()}
              className="rounded-md border px-3 py-2 text-sm"
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

      {/* EditFeeForm */}
      {editingFeeId && (
        <section
          id="edit-fee-panel"
          className="scroll-mt-6 rounded-xl border border-primary/30 p-5"
        >
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Edit fee</h2>

            <p className="text-sm text-muted-foreground">
              Update the fee details below. Payment status cannot be changed
              from this form.
            </p>
          </div>

          <form
            onSubmit={handleUpdateSubmit}
            className="grid gap-4 sm:grid-cols-2"
          >
            <div className="space-y-1">
              <label htmlFor="edit-title" className="text-sm font-medium">
                Fee title *
              </label>

              <input
                id="edit-title"
                required
                maxLength={200}
                value={editForm.title}
                onChange={event =>
                  setEditForm({ ...editForm, title: event.target.value })
                }
                className="w-full rounded-md border bg-background px-3 py-2"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="edit-amount" className="text-sm font-medium">
                Amount *
              </label>

              <input
                id="edit-amount"
                type="number"
                required
                min="0.01"
                step="0.01"
                value={editForm.amount}
                onChange={event =>
                  setEditForm({ ...editForm, amount: event.target.value })
                }
                className="w-full rounded-md border bg-background px-3 py-2"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="edit-due-date" className="text-sm font-medium">
                Due date *
              </label>

              <input
                id="edit-due-date"
                type="date"
                required
                value={editForm.dueDate}
                onChange={event =>
                  setEditForm({ ...editForm, dueDate: event.target.value })
                }
                className="w-full rounded-md border bg-background px-3 py-2"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label htmlFor="edit-description" className="text-sm font-medium">
                Description
              </label>

              <textarea
                id="edit-description"
                rows={3}
                maxLength={1000}
                value={editForm.description}
                onChange={event =>
                  setEditForm({
                    ...editForm,
                    description: event.target.value,
                  })
                }
                placeholder="Optional fee details"
                className="w-full rounded-md border bg-background px-3 py-2"
              />
            </div>

            <div className="flex flex-wrap gap-3 sm:col-span-2">
              <button
                type="submit"
                disabled={isEditing || isDeleting}
                className="rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground disabled:opacity-50"
              >
                {isEditing ? 'Saving...' : 'Save changes'}
              </button>

              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={isEditing}
                className="rounded-md border px-4 py-2 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {/* ExistingFees */}
      <section className="rounded-xl border p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Existing fees</h2>

          <button
            type="button"
            onClick={() => feesQuery.refetch()}
            disabled={feesQuery.isFetching}
            className="rounded-md border px-3 py-2 text-sm disabled:opacity-50"
          >
            {feesQuery.isFetching ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {feesQuery.isLoading ? (
          <p>Loading fees...</p>
        ) : feesQuery.isError ? (
          <div className="space-y-2">
            <p className="text-sm text-destructive">Could not load fees.</p>

            <button
              type="button"
              onClick={() => feesQuery.refetch()}
              className="rounded-md border px-3 py-2 text-sm"
            >
              Retry
            </button>
          </div>
        ) : fees.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No fees found. Create your first fee above.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-187.5 text-left text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="px-3 py-3">Student</th>
                  <th className="px-3 py-3">Fee</th>
                  <th className="px-3 py-3">Amount</th>
                  <th className="px-3 py-3">Due date</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {fees.map(fee => {
                  const isPaid = fee.status.toUpperCase() === 'PAID';

                  return (
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
                        {formatCurrency(fee.amount)}
                      </td>

                      <td className="px-3 py-3">
                        {new Date(fee.dueDate).toLocaleDateString()}
                      </td>

                      <td className="px-3 py-3">
                        <span className="rounded-full border px-2 py-1 text-xs">
                          {fee.status}
                        </span>
                      </td>

                      <td className="px-3 py-3">
                        <div className="flex flex-wrap gap-2 justify-end">
                          <button
                            type="button"
                            onClick={() => handleViewDetails(fee.id)}
                            className="whitespace-nowrap rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
                          >
                            {selectedFeeId === fee.id
                              ? 'Viewing Details'
                              : 'View Details'}
                          </button>

                          {!isPaid && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleStartEdit(fee)}
                                disabled={isEditing || isDeleting}
                                className="whitespace-nowrap rounded-md border border-primary/40 px-3 py-1.5 text-sm hover:bg-muted disabled:opacity-50"
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteFee(fee)}
                                disabled={isDeleting || isEditing}
                                className="whitespace-nowrap rounded-md border border-destructive/40 px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10 disabled:opacity-50"
                              >
                                {deleteFeeMutation.isPending &&
                                deleteFeeMutation.variables === fee.id
                                  ? 'Deleting...'
                                  : 'Delete'}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* FeeDetailsPanel */}
      <section
        id="fee-details-panel"
        className="scroll-mt-6 space-y-4 rounded-xl border p-5"
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Fee Details</h2>

            <p className="text-sm text-muted-foreground">
              {selectedFeeId
                ? `Selected fee ID: ${selectedFeeId}`
                : 'Select View Details for a fee to see its payment information.'}
            </p>
          </div>

          {selectedFeeId && (
            <button
              type="button"
              onClick={handleCloseDetails}
              className="rounded-md border px-3 py-2 text-sm"
            >
              Close
            </button>
          )}
        </div>

        {!selectedFeeId ? (
          <p className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
            No fee selected yet. Choose a fee from the table above.
          </p>
        ) : feeDetailsQuery.isLoading ? (
          <p className="rounded-lg bg-muted/50 p-4 text-sm">
            Loading fee details...
          </p>
        ) : feeDetailsQuery.isError ? (
          <div className="space-y-3 rounded-lg border border-destructive/30 p-4">
            <p className="text-sm text-destructive">
              Could not load fee details.
            </p>

            <button
              type="button"
              onClick={() => feeDetailsQuery.refetch()}
              className="rounded-md border px-3 py-2 text-sm"
            >
              Retry
            </button>
          </div>
        ) : selectedFee ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Student</p>

              <p className="font-medium">
                {selectedFee.student.user.firstName}{' '}
                {selectedFee.student.user.lastName}
              </p>

              <p className="break-all text-sm text-muted-foreground">
                {selectedFee.student.studentEmail}
              </p>

              <p className="mt-1 text-sm">
                Student ID: {selectedFee.student.studentId}
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Fee</p>

              <p className="font-medium">{selectedFee.title}</p>

              <p className="mt-1 text-sm text-muted-foreground">
                {selectedFee.description || 'No description'}
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Status</p>

              <p className="font-medium">{selectedFee.status}</p>

              <p className="mt-1 text-sm">
                Due date: {new Date(selectedFee.dueDate).toLocaleDateString()}
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Fee Amount</p>

              <p className="text-lg font-semibold">
                {formatCurrency(selectedFee.amount)}
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Total Paid</p>

              <p className="text-lg font-semibold">
                {formatCurrency(selectedFee.totalPaid)}
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">
                Outstanding Balance
              </p>

              <p className="text-lg font-semibold">
                {formatCurrency(selectedFee.outstandingAmount)}
              </p>
            </div>
          </div>
        ) : (
          <p className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
            No fee details were returned for this fee.
          </p>
        )}
      </section>
    </main>
  );
}
