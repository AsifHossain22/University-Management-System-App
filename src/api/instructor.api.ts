import apiClient from '@/lib/apiClient';
import type { ApiResponse } from '@/types/auth.type';
import {
  InstructorProfile,
  UpdateInstructorProfilePayload,
} from '@/types/instructor.type';

export interface Instructor {
  id: string;
  instructorId: string;
  instructorEmail: string;
  specialization: string | null;
  qualification: string | null;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

// GetMyInstructorProfile
export function getMyInstructorProfile() {
  return apiClient<ApiResponse<InstructorProfile>>('/instructors/profile');
}

// UpdateMyInstructorProfile
export function updateMyInstructorProfile(
  payload: UpdateInstructorProfilePayload,
) {
  return apiClient<ApiResponse<InstructorProfile>>('/instructors/profile', {
    method: 'PATCH',
    body: payload,
  });
}

// UpdateMyInstructorProfilePhoto
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

// GetAllInstructors
export function getInstructors(searchTerm?: string) {
  return apiClient<ApiResponse<Instructor[]>>('/instructors', {
    query: searchTerm ? { searchTerm } : undefined,
  });
}
