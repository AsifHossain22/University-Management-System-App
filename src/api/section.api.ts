import apiClient from '@/lib/apiClient';
import type { ApiResponse } from '@/types/auth.type';
import type {
  CreateSectionPayload,
  Section,
  SectionMeta,
  SectionQuery,
  UpdateSectionPayload,
} from '@/types/section.type';

// GetSections
export function getSections(query?: SectionQuery) {
  return apiClient<
    ApiResponse<{
      data: Section[];
      meta: SectionMeta;
    }>
  >('/sections', {
    query,
  });
}

// GetSectionById
export function getSectionById(sectionId: string) {
  return apiClient<ApiResponse<Section>>(`/sections/${sectionId}`);
}

// CreateSection
export function createSection(payload: CreateSectionPayload) {
  return apiClient<ApiResponse<Section>>('/sections', {
    method: 'POST',
    body: payload,
  });
}

// UpdateSection
export function updateSection(
  sectionId: string,
  payload: UpdateSectionPayload,
) {
  return apiClient<ApiResponse<Section>>(`/sections/${sectionId}`, {
    method: 'PATCH',
    body: payload,
  });
}

// DeleteSection
export function deleteSection(sectionId: string) {
  return apiClient<ApiResponse<Section>>(`/sections/${sectionId}`, {
    method: 'DELETE',
  });
}
