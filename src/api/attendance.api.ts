import apiClient from '@/lib/apiClient';
import type { ApiResponse } from '@/types/auth.type';

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

export interface AttendanceQuery {
  page?: number;
  limit?: number;
  status?: AttendanceStatus;
  date?: string;
  searchTerm?: string;
}

export interface CreateAttendancePayload {
  registrationId: string;
  date: string;
  status: AttendanceStatus;
  remarks?: string;
}

export interface UpdateAttendancePayload {
  status?: AttendanceStatus;
  remarks?: string;
}

export interface Attendance {
  id: string;
  date: string;
  status: AttendanceStatus;
  remarks: string | null;
  markedAt: string;
  createdAt: string;
  updatedAt?: string;
  registration: {
    student: {
      studentId: string;
      user: {
        firstName: string;
        lastName: string;
        email: string;
      };
    };
    section: {
      id: string;
      name: string;
      code: string;
      course: {
        name: string;
        code: string;
      };
    };
  };
}

export interface AttendanceMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AttendanceListResponse {
  data: Attendance[];
  meta: AttendanceMeta;
}

export function createAttendance(payload: CreateAttendancePayload) {
  return apiClient<ApiResponse<Attendance>>('/attendances', {
    method: 'POST',
    body: payload,
  });
}

export function getAttendances(query?: AttendanceQuery) {
  return apiClient<ApiResponse<AttendanceListResponse>>('/attendances', {
    query,
  });
}

export function updateAttendance(
  attendanceId: string,
  payload: UpdateAttendancePayload,
) {
  return apiClient<ApiResponse<Attendance>>(`/attendances/${attendanceId}`, {
    method: 'PATCH',
    body: payload,
  });
}
