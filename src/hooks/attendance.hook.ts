import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createAttendance,
  getAttendances,
  getMyAttendance,
  updateAttendance,
  type AttendanceQuery,
  type CreateAttendancePayload,
  type UpdateAttendancePayload,
} from '@/api/attendance.api';
import { getAccessToken } from '@/lib/auth-storage';

// GetAttendances - INSTRUCTOR
export function useAttendances(query?: AttendanceQuery) {
  return useQuery({
    queryKey: ['attendances', query],
    queryFn: () => getAttendances(query),
    enabled: Boolean(getAccessToken()),
    retry: false,
    refetchOnWindowFocus: false,
  });
}

// GetMyAttendance - STUDENT
export function useMyAttendance(query?: AttendanceQuery) {
  return useQuery({
    queryKey: ['my-attendance', query],
    queryFn: () => getMyAttendance(query),
    enabled: Boolean(getAccessToken()),
    retry: false,
    refetchOnWindowFocus: false,
  });
}

// CreateAttendance - INSTRUCTOR
export function useCreateAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAttendancePayload) => createAttendance(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['attendances'],
      });

      await queryClient.invalidateQueries({
        queryKey: ['my-attendance'],
      });
    },
  });
}

// UpdateAttendance - INSTRUCTOR
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

      await queryClient.invalidateQueries({
        queryKey: ['my-attendance'],
      });
    },
  });
}
