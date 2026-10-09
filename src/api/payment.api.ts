import apiClient from '@/lib/apiClient';
import type { ApiResponse } from '@/types/auth.type';

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
    status: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED';
    merchantInvoiceNumber: string;
  };
  paymentUrl: string;
}

export function createPayment(payload: CreatePaymentPayload) {
  return apiClient<ApiResponse<CreatePaymentResponse>>('/payments', {
    method: 'POST',
    body: payload,
  });
}
