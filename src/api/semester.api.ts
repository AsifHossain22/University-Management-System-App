import apiClient from '@/lib/apiClient';
import type { ApiResponse } from '@/types/auth.type';

import type {
  CreateSemesterPayload,
  Semester,
  SemesterMeta,
  SemesterQuery,
  UpdateSemesterPayload,
} from '@/types/semester.type';

// GetSemesters
export function getSemesters(query?: SemesterQuery) {
  return apiClient<
    ApiResponse<{
      data: Semester[];
      meta: SemesterMeta;
    }>
  >('/semesters', {
    query,
  });
}

// GetSemesterById
export function getSemesterById(semesterId: string) {
  return apiClient<ApiResponse<Semester>>(`/semesters/${semesterId}`);
}

// CreateSemester
export function createSemester(payload: CreateSemesterPayload) {
  return apiClient<ApiResponse<Semester>>('/semesters', {
    method: 'POST',
    body: payload,
  });
}

// UpdateSemester
export function updateSemester(
  semesterId: string,
  payload: UpdateSemesterPayload,
) {
  return apiClient<ApiResponse<Semester>>(`/semesters/${semesterId}`, {
    method: 'PATCH',
    body: payload,
  });
}

// DeleteSemester
export function deleteSemester(semesterId: string) {
  return apiClient<ApiResponse<Semester>>(`/semesters/${semesterId}`, {
    method: 'DELETE',
  });
}
