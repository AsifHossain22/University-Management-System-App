import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getInstructors,
  getMyInstructorProfile,
  updateMyInstructorProfile,
  updateMyInstructorProfilePhoto,
} from '@/api/instructor.api';
import { getAccessToken } from '@/lib/auth-storage';

export function useMyInstructorProfile() {
  return useQuery({
    queryKey: ['instructor-profile'],
    queryFn: getMyInstructorProfile,
    enabled: Boolean(getAccessToken()),
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export function useUpdateMyInstructorProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMyInstructorProfile,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['instructor-profile'],
      });
    },
  });
}

export function useUpdateMyInstructorProfilePhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMyInstructorProfilePhoto,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['instructor-profile'],
      });
    },
  });
}

// GetAllInstructors
export function useInstructors(searchTerm?: string) {
  return useQuery({
    queryKey: ['instructors', searchTerm],
    queryFn: () => getInstructors(searchTerm),
    enabled: Boolean(getAccessToken()),
    retry: false,
    refetchOnWindowFocus: false,
  });
}
