import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPayment, type CreatePaymentPayload } from '@/api/payment.api';

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
