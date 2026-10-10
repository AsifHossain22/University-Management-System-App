import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createResult,
  deleteResult,
  getResultById,
  getResults,
  updateResult,
} from '@/api/result.api';
import type {
  CreateResultPayload,
  ResultQuery,
  UpdateResultPayload,
} from '@/api/result.api';
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

// CreateResult
export function useCreateResult() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateResultPayload) => createResult(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['results'],
      });

      await queryClient.invalidateQueries({
        queryKey: ['student-transcript'],
      });
    },
  });
}

// UpdateResult
export function useUpdateResult() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      resultId,
      payload,
    }: {
      resultId: string;
      payload: UpdateResultPayload;
    }) => updateResult(resultId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['results'],
      });

      await queryClient.invalidateQueries({
        queryKey: ['student-transcript'],
      });
    },
  });
}

// DeleteResult
export function useDeleteResult() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (resultId: string) => deleteResult(resultId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['results'],
      });

      await queryClient.invalidateQueries({
        queryKey: ['student-transcript'],
      });
    },
  });
}
