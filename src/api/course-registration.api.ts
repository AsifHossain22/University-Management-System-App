import apiClient from '@/lib/apiClient';
import type { ApiResponse } from '@/types/auth.type';

export type CourseRegistrationStatus =
  | 'REGISTERED'
  | 'DROPPED'
  | 'COMPLETED'
  | 'CANCELLED';

export interface CourseRegistrationQuery {
  page?: number;
  limit?: number;
  status?: CourseRegistrationStatus;
  searchTerm?: string;
}

export interface CreateCourseRegistrationPayload {
  sectionId: string;
}

export interface CourseRegistration {
  id: string;
  status: CourseRegistrationStatus;
  registeredAt: string;
  droppedAt: string | null;
  section: {
    id: string;
    name: string;
    code: string;
    capacity: number;
    course: {
      id: string;
      name: string;
      code: string;
      credits: number;
    };
    semester: {
      id: string;
      name: string;
      code: string;
      startDate: string;
      endDate: string;
    };
    instructor: {
      instructorId: string;
      user: {
        firstName: string;
        lastName: string;
      };
    } | null;
  };
}

export interface RegisteredStudent {
  id: string;
  status: CourseRegistrationStatus;
  registeredAt: string;
  student: {
    id: string;
    studentId: string;
    studentEmail: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
}

export interface CourseRegistrationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CourseRegistrationListResponse {
  meta: CourseRegistrationMeta;
  data: CourseRegistration[];
}

export function getMyCourseRegistrations(query?: CourseRegistrationQuery) {
  return apiClient<ApiResponse<CourseRegistrationListResponse>>(
    '/course-registrations',
    {
      query,
    },
  );
}

export function registerCourse(payload: CreateCourseRegistrationPayload) {
  return apiClient<ApiResponse<CourseRegistration>>('/course-registrations', {
    method: 'POST',
    body: payload,
  });
}

export function dropCourseRegistration(registrationId: string) {
  return apiClient<ApiResponse<CourseRegistration>>(
    `/course-registrations/${registrationId}/drop`,
    {
      method: 'PATCH',
    },
  );
}

export function getRegisteredStudentsBySection(sectionId: string) {
  return apiClient<ApiResponse<RegisteredStudent[]>>(
    `/course-registrations/sections/${sectionId}`,
  );
}
