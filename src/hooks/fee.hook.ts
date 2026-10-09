import { useQuery } from '@tanstack/react-query';
import { getMyFees, type FeeQuery } from '@/api/fee.api';
import { getAccessToken } from '@/lib/auth-storage';

export function useMyFees(query: FeeQuery = {}) {
  return useQuery({
    queryKey: ['student-fees', query],
    queryFn: () => getMyFees(query),
    enabled: Boolean(getAccessToken()),
    retry: false,
    refetchOnWindowFocus: false,
  });
}
