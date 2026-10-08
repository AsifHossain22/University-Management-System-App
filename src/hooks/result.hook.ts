import { useQuery } from '@tanstack/react-query';
import { getResultById, getResults, type ResultQuery } from '@/api/result.api';
import { getAccessToken } from '@/lib/auth-storage';

// GetResults
export function useResults(query?: ResultQuery) {
  return useQuery({
    queryKey: ['results', query],
    queryFn: () => getResults(query),
    enabled: Boolean(getAccessToken()),
    retry: false,
    refetchOnWindowFocus: false,
  });
}

// GetResultById
export function useResultById(resultId: string) {
  return useQuery({
    queryKey: ['result', resultId],
    queryFn: () => getResultById(resultId),
    enabled: Boolean(getAccessToken()) && Boolean(resultId),
    retry: false,
    refetchOnWindowFocus: false,
  });
}
