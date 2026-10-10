'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createExam,
  deleteExam,
  getExamById,
  getExams,
  updateExam,
} from '@/api/exam.api';
import type {
  CreateExamPayload,
  ExamQuery,
  UpdateExamPayload,
} from '@/types/exam.type';
import { getAccessToken } from '@/lib/auth-storage';

// GetExams
export function useExams(query?: ExamQuery) {
  return useQuery({
    queryKey: ['exams', query],
    queryFn: () => getExams(query),
    enabled: Boolean(getAccessToken()),
    retry: false,
    refetchOnWindowFocus: false,
  });
}

// GetExamById
export function useExamById(examId: string) {
  return useQuery({
    queryKey: ['exam', examId],
    queryFn: () => getExamById(examId),
    enabled: Boolean(examId && getAccessToken()),
    retry: false,
    refetchOnWindowFocus: false,
  });
}

// CreateExam
export function useCreateExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateExamPayload) => createExam(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['exams'],
      });
    },
  });
}

// UpdateExam
export function useUpdateExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      examId,
      payload,
    }: {
      examId: string;
      payload: UpdateExamPayload;
    }) => updateExam(examId, payload),

    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['exams'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['exam', variables.examId],
        }),
      ]);
    },
  });
}

// DeleteExam
export function useDeleteExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (examId: string) => deleteExam(examId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['exams'],
      });
    },
  });
}
