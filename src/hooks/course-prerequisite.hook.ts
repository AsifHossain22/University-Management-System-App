import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createCoursePrerequisite,
  deleteCoursePrerequisite,
  getCoursePrerequisites,
  getCoursePrerequisitesByCourse,
} from '@/api/course-prerequisite.api';
import { getAccessToken } from '@/lib/auth-storage';
import type {
  CoursePrerequisiteQuery,
  CreateCoursePrerequisitePayload,
} from '@/types/course-prerequisite.type';

// GetCoursePrerequisites
export function useCoursePrerequisites(query?: CoursePrerequisiteQuery) {
  return useQuery({
    queryKey: ['course-prerequisites', query],
    queryFn: () => getCoursePrerequisites(query),
    enabled: Boolean(getAccessToken()),
    retry: false,
    refetchOnWindowFocus: false,
  });
}

// GetCoursePrerequisitesByCourse
export function useCoursePrerequisitesByCourse(courseId: string) {
  return useQuery({
    queryKey: ['course-prerequisites-by-course', courseId],
    queryFn: () => getCoursePrerequisitesByCourse(courseId),
    enabled: Boolean(getAccessToken()) && Boolean(courseId),
    retry: false,
    refetchOnWindowFocus: false,
  });
}

// CreateCoursePrerequisite
export function useCreateCoursePrerequisite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCoursePrerequisitePayload) =>
      createCoursePrerequisite(payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['course-prerequisites'],
      });

      await queryClient.refetchQueries({
        queryKey: ['course-prerequisites'],
      });
    },
  });
}

// DeleteCoursePrerequisite
export function useDeleteCoursePrerequisite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCoursePrerequisite,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['course-prerequisites'],
      });
    },
  });
}
