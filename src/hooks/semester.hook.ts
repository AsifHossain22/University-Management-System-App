import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createSemester,
  deleteSemester,
  getSemesterById,
  getSemesters,
  updateSemester,
} from '@/api/semester.api';
import { getAccessToken } from '@/lib/auth-storage';
import type {
  CreateSemesterPayload,
  SemesterQuery,
  UpdateSemesterPayload,
} from '@/types/semester.type';

// GetSemesters
export function useSemesters(query?: SemesterQuery) {
  return useQuery({
    queryKey: ['semesters', query],
    queryFn: () => getSemesters(query),
    enabled: Boolean(getAccessToken()),
    retry: false,
    refetchOnWindowFocus: false,
  });
}

// GetSemesterById
export function useSemesterById(semesterId: string) {
  return useQuery({
    queryKey: ['semester', semesterId],
    queryFn: () => getSemesterById(semesterId),
    enabled: Boolean(getAccessToken()) && Boolean(semesterId),
    retry: false,
    refetchOnWindowFocus: false,
  });
}

// CreateSemester
export function useCreateSemester() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSemesterPayload) => createSemester(payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['semesters'],
      });

      await queryClient.refetchQueries({
        queryKey: ['semesters'],
      });
    },
  });
}

// UpdateSemester
export function useUpdateSemester() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      semesterId,
      payload,
    }: {
      semesterId: string;
      payload: UpdateSemesterPayload;
    }) => updateSemester(semesterId, payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['semesters'],
      });
    },
  });
}

// DeleteSemester
export function useDeleteSemester() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSemester,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['semesters'],
      });
    },
  });
}
