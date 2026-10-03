import apiClient from '@/lib/apiClient';
import type { ApiResponse } from '@/types/auth.type';
import type {
  StudentProfile,
  UpdateStudentProfilePayload,
} from '@/types/student.type';

export function getMyStudentProfile() {
  return apiClient<ApiResponse<StudentProfile>>('/students/profile');
}

export function updateMyStudentProfile(payload: UpdateStudentProfilePayload) {
  return apiClient<ApiResponse<StudentProfile>>('/students/profile', {
    method: 'PATCH',
    body: payload,
  });
}
