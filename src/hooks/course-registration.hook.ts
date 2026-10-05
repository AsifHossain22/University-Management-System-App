import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  dropCourseRegistration,
  getMyCourseRegistrations,
  registerCourse,
} from '@/api/course-registration.api';
import type {
  CourseRegistrationQuery,
  CreateCourseRegistrationPayload,
} from '@/api/course-registration.api';
import { getAccessToken } from '@/lib/auth-storage';

export function useMyCourseRegistrations(query?: CourseRegistrationQuery) {
  return useQuery({
    queryKey: ['course-registrations', query],
    queryFn: () => getMyCourseRegistrations(query),
    enabled: Boolean(getAccessToken()),
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export function useRegisterCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCourseRegistrationPayload) =>
      registerCourse(payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['course-registrations'],
      });
    },
  });
}

export function useDropCourseRegistration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: dropCourseRegistration,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['course-registrations'],
      });
    },
  });
}
