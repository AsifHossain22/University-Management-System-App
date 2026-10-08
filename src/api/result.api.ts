import apiClient from '@/lib/apiClient';
import type { ApiResponse } from '@/types/auth.type';

export type ExamType =
  | 'QUIZ'
  | 'MIDTERM'
  | 'FINAL'
  | 'ASSIGNMENT'
  | 'PRESENTATION'
  | 'PROJECT'
  | 'LAB'
  | 'OTHER';

export interface ResultQuery {
  searchTerm?: string;
  registrationId?: string;
  examId?: string;
  studentId?: string;
  sectionId?: string;
  page?: number;
  limit?: number;
  sortBy?: 'obtainedMarks' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface ResultMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface StudentResult {
  id: string;
  obtainedMarks: number;
  remarks: string | null;
  createdAt: string;
  updatedAt: string;
  exam: {
    id: string;
    title: string;
    type: ExamType;
    examDate: string;
    totalMarks: number;
    weight: number;
    section: {
      id: string;
      name: string;
      code: string;
      course: {
        id: string;
        name: string;
        code: string;
      };
    };
  };
  registration: {
    id: string;
    status: string;
    student: {
      id: string;
      studentId: string;
      studentEmail: string;
      user: {
        firstName: string;
        lastName: string;
      };
    };
  };
}

export type StudentResultsResponse = ApiResponse<StudentResult[]> & {
  meta: ResultMeta;
};

// GetResults
export function getResults(query?: ResultQuery) {
  return apiClient<StudentResultsResponse>('/results', {
    query,
  });
}

// GetResultById
export function getResultById(resultId: string) {
  return apiClient<ApiResponse<StudentResult>>(`/results/${resultId}`);
}
