import apiClient from '@/lib/apiClient';
import type { ApiResponse } from '@/types/auth.type';
import type {
  ApplyAsInstructorPayload,
  ApplyAsInstructorResponse,
  VerifyInstructorEmailPayload,
  VerifyInstructorEmailResponse,
} from '@/types/instructor-application.type';

export function applyAsInstructor(payload: ApplyAsInstructorPayload) {
  const formData = new FormData();

  formData.append('firstName', payload.firstName);
  formData.append('lastName', payload.lastName);
  formData.append('email', payload.email);
  formData.append('password', payload.password);
  formData.append('specialization', payload.specialization);
  formData.append('qualification', payload.qualification);
  formData.append('experienceYears', String(payload.experienceYears));

  if (payload.bio) {
    formData.append('bio', payload.bio);
  }

  if (payload.departmentId) {
    formData.append('departmentId', payload.departmentId);
  }

  if (payload.profilePhoto) {
    formData.append('profilePhoto', payload.profilePhoto);
  }

  if (payload.cv) {
    formData.append('cv', payload.cv);
  }

  payload.supportingDocuments?.forEach(file => {
    formData.append('supportingDocuments', file);
  });

  return apiClient<ApiResponse<ApplyAsInstructorResponse>>(
    '/instructor-applications/apply',
    {
      method: 'POST',
      body: formData,
    },
  );
}

export function verifyInstructorEmail(payload: VerifyInstructorEmailPayload) {
  return apiClient<ApiResponse<VerifyInstructorEmailResponse>>(
    '/instructor-applications/verify-email',
    {
      method: 'POST',
      body: payload,
    },
  );
}
