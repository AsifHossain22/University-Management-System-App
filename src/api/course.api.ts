import apiClient from '@/lib/apiClient';
import type { ApiResponse } from '@/types/auth.type';
import type {
  Course,
  CourseDetail,
  CourseMeta,
  CourseQuery,
  CreateCoursePayload,
  UpdateCoursePayload,
} from '@/types/course.type';

// GetCourses
export function getCourses(query?: CourseQuery) {
  return apiClient<ApiResponse<Course[]> & { meta: CourseMeta }>('/courses', {
    query,
  });
}

// GetCourseById
export function getCourseById(courseId: string) {
  return apiClient<ApiResponse<CourseDetail>>(`/courses/${courseId}`);
}

// CreateCourse
export function createCourse(payload: CreateCoursePayload) {
  return apiClient<ApiResponse<Course>>('/courses', {
    method: 'POST',
    body: payload,
  });
}

// UpdateCourse
export function updateCourse(courseId: string, payload: UpdateCoursePayload) {
  return apiClient<ApiResponse<Course>>(`/courses/${courseId}`, {
    method: 'PATCH',
    body: payload,
  });
}

// DeleteCourse
export function deleteCourse(courseId: string) {
  return apiClient<ApiResponse<Course>>(`/courses/${courseId}`, {
    method: 'DELETE',
  });
}
