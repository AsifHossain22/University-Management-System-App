import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createPayment,
  getMyPayments,
  type CreatePaymentPayload,
} from '@/api/payment.api';
import { getAccessToken } from '@/lib/auth-storage';

export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePaymentPayload) => createPayment(payload),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['student-fees'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['student-payments'],
        }),
      ]);
    },
  });
}

export function useMyPayments() {
  return useQuery({
    queryKey: ['student-payments'],
    queryFn: getMyPayments,
    enabled: Boolean(getAccessToken()),
    retry: false,
    refetchOnWindowFocus: false,
  });
}
