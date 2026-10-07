import apiClient from '@/lib/apiClient';
import type { ApiResponse } from '@/types/auth.type';
import type {
  CoursePrerequisite,
  CoursePrerequisiteMeta,
  CoursePrerequisiteQuery,
  CreateCoursePrerequisitePayload,
} from '@/types/course-prerequisite.type';

// GetCoursePrerequisites
export function getCoursePrerequisites(query?: CoursePrerequisiteQuery) {
  return apiClient<
    ApiResponse<{
      data: CoursePrerequisite[];
      meta: CoursePrerequisiteMeta;
    }>
  >('/course-prerequisites', {
    query,
  });
}

// GetCoursePrerequisitesByCourse
export function getCoursePrerequisitesByCourse(courseId: string) {
  return apiClient<ApiResponse<CoursePrerequisite[]>>(
    `/course-prerequisites/course/${courseId}`,
  );
}

// CreateCoursePrerequisite
export function createCoursePrerequisite(
  payload: CreateCoursePrerequisitePayload,
) {
  return apiClient<ApiResponse<CoursePrerequisite>>('/course-prerequisites', {
    method: 'POST',
    body: payload,
  });
}

// DeleteCoursePrerequisite
export function deleteCoursePrerequisite(coursePrerequisiteId: string) {
  return apiClient<ApiResponse<CoursePrerequisite>>(
    `/course-prerequisites/${coursePrerequisiteId}`,
    {
      method: 'DELETE',
    },
  );
}
