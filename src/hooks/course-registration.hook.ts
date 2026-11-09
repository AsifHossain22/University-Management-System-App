import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CourseRegistrationQuery,
  CreateCourseRegistrationPayload,
} from "@/api/course-registration.api";
import {
  dropCourseRegistration,
  getMyCourseRegistrations,
  getRegisteredStudentsBySection,
  registerCourse,
} from "@/api/course-registration.api";

// GetMyCourseRegistrations
export function useMyCourseRegistrations(query?: CourseRegistrationQuery) {
  return useQuery({
    queryKey: ["course-registrations", query],
    queryFn: () => getMyCourseRegistrations(query),
    retry: false,
    refetchOnWindowFocus: false,
  });
}

// GetRegisteredStudentsBySection
export function useRegisteredStudentsBySection(sectionId: string) {
  return useQuery({
    queryKey: ["section-registrations", sectionId],
    queryFn: () => getRegisteredStudentsBySection(sectionId),
    enabled: Boolean(sectionId),
    retry: false,
    refetchOnWindowFocus: false,
  });
}

// RegisterCourse
export function useRegisterCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCourseRegistrationPayload) =>
      registerCourse(payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["course-registrations"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["section-registrations"],
      });
    },
  });
}

// DropCourseRegistration
export function useDropCourseRegistration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: dropCourseRegistration,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["course-registrations"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["section-registrations"],
      });
    },
  });
}
