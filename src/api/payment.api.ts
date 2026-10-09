import apiClient from '@/lib/apiClient';
import type { ApiResponse } from '@/types/auth.type';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED';

export interface CreatePaymentPayload {
  feeId: string;
  amount: number;
}

export interface CreatePaymentResponse {
  payment: {
    id: string;
    feeId: string;
    amount: number;
    currency: string;
    status: PaymentStatus;
    merchantInvoiceNumber: string;
  };
  paymentUrl: string;
}

export interface StudentPayment {
  id: string;
  feeId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: PaymentStatus;
  bkashTrxId: string | null;
  merchantInvoiceNumber: string;
  invoiceNumber: string | null;
  invoiceUrl: string | null;
  paidAt: string | null;
  failedAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  fee: {
    title: string;
  };
}

export function createPayment(payload: CreatePaymentPayload) {
  return apiClient<ApiResponse<CreatePaymentResponse>>('/payments', {
    method: 'POST',
    body: payload,
  });
}

export function getMyPayments() {
  return apiClient<ApiResponse<StudentPayment[]>>('/payments/my-payments');
}
