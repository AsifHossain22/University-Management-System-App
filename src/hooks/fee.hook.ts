import { useQuery } from "@tanstack/react-query";
import { type FeeQuery, getFeeById, getMyFees } from "@/api/fee.api";

export function useMyFees(query: FeeQuery = {}) {
  return useQuery({
    queryKey: ["student-fees", query],
    queryFn: () => getMyFees(query),
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export function useFeeDetails(feeId: string | null) {
  return useQuery({
    queryKey: ["fee-details", feeId],
    queryFn: () => {
      if (!feeId) {
        throw new Error("Fee ID is required.");
      }

      return getFeeById(feeId);
    },
    enabled: Boolean(feeId),
    retry: false,
    refetchOnWindowFocus: false,
  });
}
