import apiClient from '@/lib/apiClient';
import type { ApiResponse } from '@/types/auth.type';

export type FeeStatus =
  | 'UNPAID'
  | 'PARTIALLY_PAID'
  | 'PAID'
  | 'OVERDUE'
  | 'CANCELLED';

export interface StudentFee {
  id: string;
  title: string;
  description: string | null;
  amount: number;
  dueDate: string;
  status: FeeStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  totalPaid: number;
  outstandingAmount: number;
  payments: {
    id: string;
    amount: number;
    paidAt: string | null;
    bkashTrxId: string | null;
  }[];
}

export interface AdminFee {
  id: string;
  studentId: string;
  title: string;
  description: string | null;
  amount: number;
  dueDate: string;
  status: FeeStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  student: {
    studentId: string;
    studentEmail: string;
    user: {
      firstName: string;
      lastName: string;
    };
  };
}

export interface FeeQuery {
  page?: number;
  limit?: number;
  studentId?: string;
  status?: FeeStatus;
  searchTerm?: string;
  sortBy?: 'title' | 'amount' | 'dueDate' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedFees {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: StudentFee[];
}

export interface PaginatedAdminFees {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: AdminFee[];
}

export interface CreateFeePayload {
  title: string;
  description?: string;
  amount: number;
  dueDate: string;
  studentId: string;
}

export interface UpdateFeePayload {
  title?: string;
  description?: string;
  amount?: number;
  dueDate?: string;
  status?: FeeStatus;
  isActive?: boolean;
}

// Student - GetMyFees
export function getMyFees(query: FeeQuery = {}) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== '') {
      params.set(key, String(value));
    }
  }

  const search = params.toString();

  return apiClient<ApiResponse<PaginatedFees>>(
    `/fees/my-fees${search ? `?${search}` : ''}`,
  );
}

// Admin - GetAllFees
export function getAllFees(query: FeeQuery = {}) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== '') {
      params.set(key, String(value));
    }
  }

  const search = params.toString();

  return apiClient<ApiResponse<PaginatedAdminFees>>(
    `/fees${search ? `?${search}` : ''}`,
  );
}

// Admin - CreateFee
export function createFee(payload: CreateFeePayload) {
  return apiClient<ApiResponse<AdminFee>>('/fees', {
    method: 'POST',
    body: payload,
  });
}

// Admin - UpdateFee
export function updateFee(feeId: string, payload: UpdateFeePayload) {
  return apiClient<ApiResponse<AdminFee>>(`/fees/${feeId}`, {
    method: 'PATCH',
    body: payload,
  });
}

// Admin - SoftDeleteFee
export function deleteFee(feeId: string) {
  return apiClient<ApiResponse<null>>(`/fees/${feeId}`, {
    method: 'DELETE',
  });
}
