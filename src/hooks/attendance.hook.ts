import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createAttendance,
  getAttendances,
  updateAttendance,
  type AttendanceQuery,
  type CreateAttendancePayload,
  type UpdateAttendancePayload,
} from '@/api/attendance.api';
import { getAccessToken } from '@/lib/auth-storage';

export function useAttendances(query?: AttendanceQuery) {
  return useQuery({
    queryKey: ['attendances', query],
    queryFn: () => getAttendances(query),
    enabled: Boolean(getAccessToken()),
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export function useCreateAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAttendancePayload) => createAttendance(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['attendances'],
      });
    },
  });
}

export function useUpdateAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      attendanceId,
      payload,
    }: {
      attendanceId: string;
      payload: UpdateAttendancePayload;
    }) => updateAttendance(attendanceId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['attendances'],
      });
    },
  });
}
