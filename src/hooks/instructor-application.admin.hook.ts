import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getInstructorApplications,
  reviewInstructorApplication,
  type InstructorApplicationQuery,
} from '@/api/instructor-application.admin.api';

export const instructorApplicationAdminKeys = {
  all: ['admin-instructor-applications'] as const,
  list: (query: InstructorApplicationQuery) =>
    [...instructorApplicationAdminKeys.all, query] as const,
};

export function useInstructorApplications(
  query: InstructorApplicationQuery = {},
) {
  return useQuery({
    queryKey: instructorApplicationAdminKeys.list(query),
    queryFn: () => getInstructorApplications(query),
    retry: false,
  });
}

export function useReviewInstructorApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      applicationId,
      status,
      rejectionReason,
    }: {
      applicationId: string;
      status: 'APPROVED' | 'REJECTED';
      rejectionReason?: string;
    }) =>
      reviewInstructorApplication(applicationId, {
        status,
        ...(rejectionReason !== undefined && { rejectionReason }),
      }),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: instructorApplicationAdminKeys.all,
      });
    },
  });
}
