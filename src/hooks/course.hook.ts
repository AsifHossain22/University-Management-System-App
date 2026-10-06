import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createCourse,
  deleteCourse,
  getCourseById,
  getCourses,
  updateCourse,
} from '@/api/course.api';
import { getAccessToken } from '@/lib/auth-storage';
import type {
  CourseQuery,
  CreateCoursePayload,
  UpdateCoursePayload,
} from '@/types/course.type';

// GetCourses
export function useCourses(query?: CourseQuery) {
  return useQuery({
    queryKey: ['courses', query],
    queryFn: () => getCourses(query),
    enabled: Boolean(getAccessToken()),
    retry: false,
    refetchOnWindowFocus: false,
  });
}

// GetCourseById
export function useCourseById(courseId: string) {
  return useQuery({
    queryKey: ['course', courseId],
    queryFn: () => getCourseById(courseId),
    enabled: Boolean(getAccessToken()) && Boolean(courseId),
    retry: false,
    refetchOnWindowFocus: false,
  });
}

// CreateCourse
export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCoursePayload) => createCourse(payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['courses'],
      });

      await queryClient.refetchQueries({
        queryKey: ['courses'],
      });
    },
  });
}

// UpdateCourse
export function useUpdateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      payload,
    }: {
      courseId: string;
      payload: UpdateCoursePayload;
    }) => updateCourse(courseId, payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['courses'],
      });
    },
  });
}

// DeleteCourse
export function useDeleteCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCourse,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['courses'],
      });
    },
  });
}
