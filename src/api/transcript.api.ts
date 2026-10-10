import apiClient from '@/lib/apiClient';
import type { ApiResponse } from '@/types/auth.type';

export interface TranscriptCourseGrade {
  id: string;
  finalMarks: number;
  grade: string;
  gradePoint: number;
  isPassed: boolean;
  publishedAt: string;
  course: {
    id: string;
    name: string;
    code: string;
    credits: number;
  };
  section: {
    id: string;
    name: string;
    code: string;
  };
  semester: {
    id: string;
    name: string;
    code: string;
  };
}

export interface SemesterTranscript {
  semester: {
    id: string;
    name: string;
    code: string;
  };
  semesterGPA: number;
  creditsEarned: number;
  courses: TranscriptCourseGrade[];
}

export interface StudentTranscript {
  student: {
    studentId: string;
    firstName: string;
    lastName: string;
  };
  semesters: SemesterTranscript[];
  cumulativeGPA: number;
  totalCreditsEarned: number;
}

export type StudentTranscriptResponse = ApiResponse<StudentTranscript>;

// GetMyTranscript
export function getMyTranscript() {
  return apiClient<StudentTranscriptResponse>('/course-grades/my-transcript');
}
