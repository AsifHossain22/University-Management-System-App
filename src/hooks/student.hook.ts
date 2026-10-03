import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getMyStudentProfile, updateMyStudentProfile } from '@/api/student.api';
import { getAccessToken } from '@/lib/auth-storage';

export function useMyStudentProfile() {
  return useQuery({
    queryKey: ['student-profile'],
    queryFn: getMyStudentProfile,
    enabled: Boolean(getAccessToken()),
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
        queryKey: ['student-profile'],
      });
    },
  });
}
