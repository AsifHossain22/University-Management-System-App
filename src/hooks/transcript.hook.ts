import { useQuery } from '@tanstack/react-query';
import { getMyTranscript } from '@/api/transcript.api';
import { getAccessToken } from '@/lib/auth-storage';

// GetMyTranscript
export function useMyTranscript() {
  return useQuery({
    queryKey: ['student-transcript'],
    queryFn: getMyTranscript,
    enabled: Boolean(getAccessToken()),
    retry: false,
    refetchOnWindowFocus: false,
  });
}
