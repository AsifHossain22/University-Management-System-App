import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type CreatePaymentPayload,
  createPayment,
  getMyPayments,
} from "@/api/payment.api";

export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePaymentPayload) => createPayment(payload),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["student-fees"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["student-payments"],
        }),
      ]);
    },
  });
}

export function useMyPayments() {
  return useQuery({
    queryKey: ["student-payments"],
    queryFn: getMyPayments,
    retry: false,
    refetchOnWindowFocus: false,
  });
}
