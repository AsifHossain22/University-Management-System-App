import { useQuery } from "@tanstack/react-query";
import { getMyTranscript } from "@/api/transcript.api";

// GetMyTranscript
export function useMyTranscript() {
  return useQuery({
    queryKey: ["student-transcript"],
    queryFn: getMyTranscript,
    retry: false,
    refetchOnWindowFocus: false,
  });
}
