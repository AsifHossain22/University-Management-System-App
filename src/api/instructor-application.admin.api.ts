import apiClient from '@/lib/apiClient';
import type { ApiResponse } from '@/types/auth.type';

export type InstructorApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface InstructorApplication {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  specialization: string;
  qualification: string;
  experienceYears: number;
  bio: string | null;
  departmentId: string | null;
  profilePhotoUrl: string | null;
  cvUrl: string | null;
  supportingDocuments: unknown;
  emailVerifiedAt: string | null;
  status: InstructorApplicationStatus;
  rejectionReason: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  userId: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InstructorApplicationListResponse {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: InstructorApplication[];
}

export interface InstructorApplicationQuery {
  page?: number;
  limit?: number;
  status?: InstructorApplicationStatus;
  searchTerm?: string;
}

export interface ReviewInstructorApplicationPayload {
  status: 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
}

export interface ReviewInstructorApplicationResponse {
  user?: {
    id: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
  };
  instructorProfile?: {
    id: string;
    userId: string;
    instructorId: string;
    instructorEmail: string;
  };
  application: InstructorApplication;
}

export function getInstructorApplications(
  query: InstructorApplicationQuery = {},
) {
  return apiClient<ApiResponse<InstructorApplicationListResponse>>(
    '/instructor-applications',
    {
      method: 'GET',
      query,
    },
  );
}

export function reviewInstructorApplication(
  applicationId: string,
  payload: ReviewInstructorApplicationPayload,
) {
  return apiClient<ApiResponse<ReviewInstructorApplicationResponse>>(
    `/instructor-applications/${applicationId}/review`,
    {
      method: 'PATCH',
      body: payload,
    },
  );
}
