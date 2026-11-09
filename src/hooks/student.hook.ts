import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllStudents,
  getMyStudentProfile,
  updateMyStudentProfile,
  updateMyStudentProfilePhoto,
} from "@/api/student.api";

export function useMyStudentProfile() {
  return useQuery({
    queryKey: ["student-profile"],
    queryFn: getMyStudentProfile,
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export function useUpdateMyStudentProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMyStudentProfile,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["student-profile"],
      });
    },
  });
}

export function useUpdateMyStudentProfilePhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMyStudentProfilePhoto,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["student-profile"],
      });
    },
  });
}

export function useAllStudents() {
  return useQuery({
    queryKey: ["admin-students"],
    queryFn: getAllStudents,
    retry: false,
    refetchOnWindowFocus: false,
  });
}
