import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createProgram,
  deleteProgram,
  getProgramById,
  getPrograms,
  updateProgram,
} from '@/api/program.api';
import type {
  CreateProgramPayload,
  ProgramQuery,
  UpdateProgramPayload,
} from '@/types/program.type';
import { getAccessToken } from '@/lib/auth-storage';

export function usePrograms(query?: ProgramQuery) {
  return useQuery({
    queryKey: ['programs', query],
    queryFn: () => getPrograms(query),
    enabled: Boolean(getAccessToken()),
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export function useProgramById(programId: string) {
  return useQuery({
    queryKey: ['program', programId],
    queryFn: () => getProgramById(programId),
    enabled: Boolean(getAccessToken()) && Boolean(programId),
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export function useCreateProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProgramPayload) => createProgram(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['programs'],
      });

      await queryClient.refetchQueries({
        queryKey: ['programs'],
      });
    },
  });
}

export function useUpdateProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      programId,
      payload,
    }: {
      programId: string;
      payload: UpdateProgramPayload;
    }) => updateProgram(programId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['programs'],
      });
    },
  });
}

export function useDeleteProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProgram,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['programs'],
      });
    },
  });
}
