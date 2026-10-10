import apiClient from '@/lib/apiClient';
import type { ApiResponse } from '@/types/auth.type';
import type {
  CreateExamPayload,
  Exam,
  ExamListResponse,
  ExamQuery,
  UpdateExamPayload,
} from '@/types/exam.type';

// GetExams
export function getExams(query?: ExamQuery) {
  return apiClient<ExamListResponse>('/exams', {
    query,
  });
}

// GetExamById
export function getExamById(examId: string) {
  return apiClient<ApiResponse<Exam>>(`/exams/${examId}`);
}

// CreateExam
export function createExam(payload: CreateExamPayload) {
  return apiClient<ApiResponse<Exam>>('/exams', {
    method: 'POST',
    body: payload,
  });
}

// UpdateExam
export function updateExam(examId: string, payload: UpdateExamPayload) {
  return apiClient<ApiResponse<Exam>>(`/exams/${examId}`, {
    method: 'PATCH',
    body: payload,
  });
}

// DeleteExam
export function deleteExam(examId: string) {
  return apiClient<ApiResponse<Exam>>(`/exams/${examId}`, {
    method: 'DELETE',
  });
}
