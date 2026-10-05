import apiClient from '@/lib/apiClient';
import type { ApiResponse } from '@/types/auth.type';

export interface SectionQuery {
  searchTerm?: string;
  courseId?: string;
  semesterId?: string;
  instructorId?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface Section {
  id: string;
  name: string;
  code: string;
  capacity: number;
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
  instructor: {
    id: string;
    instructorId: string;
    user: {
      firstName: string;
      lastName: string;
    };
  } | null;
}

export interface SectionMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface SectionListResponse {
  meta: SectionMeta;
  data: Section[];
}

export function getSections(query?: SectionQuery) {
  return apiClient<ApiResponse<SectionListResponse>>('/sections', {
    query,
  });
}

export function getSectionById(sectionId: string) {
  return apiClient<ApiResponse<Section>>(`/sections/${sectionId}`);
}
