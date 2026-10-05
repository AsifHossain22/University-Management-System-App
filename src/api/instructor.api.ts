import apiClient from '@/lib/apiClient';
import type { ApiResponse } from '@/types/auth.type';
import {
  InstructorProfile,
  UpdateInstructorProfilePayload,
} from '@/types/instructor.type';

export function getMyInstructorProfile() {
  return apiClient<ApiResponse<InstructorProfile>>('/instructors/profile');
}

export function updateMyInstructorProfile(
  payload: UpdateInstructorProfilePayload,
) {
  return apiClient<ApiResponse<InstructorProfile>>('/instructors/profile', {
    method: 'PATCH',
    body: payload,
  });
}

export function updateMyInstructorProfilePhoto(file: File) {
  const formData = new FormData();

  formData.append('profilePhoto', file);

  return apiClient<ApiResponse<InstructorProfile>>(
    '/instructors/profile/photo',
    {
      method: 'PATCH',
      body: formData,
    },
  );
}
