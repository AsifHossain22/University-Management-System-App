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

// InstructorAttendanceListResponse
export interface AttendanceListResponse {
  data: Attendance[];
  meta: AttendanceMeta;
}

// StudentAttendance
export interface StudentAttendance {
  id: string;
  date: string;
  status: AttendanceStatus;
  remarks: string | null;
  markedAt: string;
  createdAt: string;
  registration: {
    status: 'REGISTERED' | 'DROPPED' | 'COMPLETED' | 'CANCELLED';
    section: {
      id: string;
      name: string;
      code: string;
      course: {
        id: string;
        name: string;
        code: string;
        credits: number;
      };
      semester: {
        id: string;
        name: string;
        code: string;
      };
    };
  };
}

// StudentAttendanceApiResponse
export type StudentAttendanceApiResponse = ApiResponse<StudentAttendance[]> & {
  meta: AttendanceMeta;
};

// CreateAttendance - INSTRUCTOR
export function createAttendance(payload: CreateAttendancePayload) {
  return apiClient<ApiResponse<Attendance>>('/attendances', {
    method: 'POST',
    body: payload,
  });
}

// GetAttendances - INSTRUCTOR
export function getAttendances(query?: AttendanceQuery) {
  return apiClient<ApiResponse<AttendanceListResponse>>('/attendances', {
    query,
  });
}

// UpdateAttendance - INSTRUCTOR
export function updateAttendance(
  attendanceId: string,
  payload: UpdateAttendancePayload,
) {
  return apiClient<ApiResponse<Attendance>>(`/attendances/${attendanceId}`, {
    method: 'PATCH',
    body: payload,
  });
}

// GetMyAttendance - STUDENT
export function getMyAttendance(query?: AttendanceQuery) {
  return apiClient<StudentAttendanceApiResponse>('/attendances/my-attendance', {
    query,
  });
}
