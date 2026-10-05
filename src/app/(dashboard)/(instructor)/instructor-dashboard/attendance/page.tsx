'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useAttendances, useUpdateAttendance } from '@/hooks/attendance.hook';
import type { AttendanceStatus } from '@/api/attendance.api';

const attendanceStatuses: AttendanceStatus[] = [
  'PRESENT',
  'ABSENT',
  'LATE',
  'EXCUSED',
];

export default function InstructorAttendancePage() {
  const [status, setStatus] = useState<AttendanceStatus | undefined>();
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading, isError } = useAttendances({
    page: 1,
    limit: 20,
    status,
    searchTerm: searchTerm.trim() || undefined,
  });

  const updateAttendanceMutation = useUpdateAttendance();

  const attendances = data?.data?.data ?? [];

  const handleUpdateStatus = async (
    attendanceId: string,
    newStatus: AttendanceStatus,
  ) => {
    try {
      await updateAttendanceMutation.mutateAsync({
        attendanceId,
        payload: {
          status: newStatus,
        },
      });

      toast.success('Attendance updated successfully!');
    } catch {
      toast.error('Failed to update attendance.');
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <p>Loading attendance records...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <p>Failed to load attendance records.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Attendance</h1>
        <p className="text-muted-foreground">
          View and update attendance records for your assigned courses.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          placeholder="Search student..."
          value={searchTerm}
          onChange={event => setSearchTerm(event.target.value)}
          className="h-10 rounded-md border px-3 text-sm outline-none focus:ring-2"
        />

        <select
          value={status ?? ''}
          onChange={event =>
            setStatus(
              event.target.value
                ? (event.target.value as AttendanceStatus)
                : undefined,
            )
          }
          className="h-10 rounded-md border px-3 text-sm"
        >
          <option value="">All statuses</option>

          {attendanceStatuses.map(attendanceStatus => (
            <option key={attendanceStatus} value={attendanceStatus}>
              {attendanceStatus}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left">Student</th>
              <th className="px-4 py-3 text-left">Student ID</th>
              <th className="px-4 py-3 text-left">Course</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {attendances.map(attendance => (
              <tr key={attendance.id} className="border-b last:border-b-0">
                <td className="px-4 py-3">
                  {attendance.registration.student.user.firstName}{' '}
                  {attendance.registration.student.user.lastName}
                </td>

                <td className="px-4 py-3">
                  {attendance.registration.student.studentId}
                </td>

                <td className="px-4 py-3">
                  {attendance.registration.section.course.code} -{' '}
                  {attendance.registration.section.course.name}
                </td>

                <td className="px-4 py-3">
                  {new Date(attendance.date).toLocaleDateString()}
                </td>

                <td className="px-4 py-3">
                  <select
                    value={attendance.status}
                    disabled={updateAttendanceMutation.isPending}
                    onChange={event =>
                      handleUpdateStatus(
                        attendance.id,
                        event.target.value as AttendanceStatus,
                      )
                    }
                    className="rounded-md border px-2 py-1 text-sm"
                  >
                    {attendanceStatuses.map(attendanceStatus => (
                      <option key={attendanceStatus} value={attendanceStatus}>
                        {attendanceStatus}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}

            {attendances.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No attendance records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
