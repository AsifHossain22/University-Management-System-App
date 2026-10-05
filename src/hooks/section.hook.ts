import { useQuery } from '@tanstack/react-query';
import {
  getSectionById,
  getSections,
  type SectionQuery,
} from '@/api/section.api';
import { getAccessToken } from '@/lib/auth-storage';

export function useSections(query?: SectionQuery) {
  return useQuery({
    queryKey: ['sections', query],
    queryFn: () => getSections(query),
    enabled: Boolean(getAccessToken()),
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export function useSectionById(sectionId: string) {
  return useQuery({
    queryKey: ['section', sectionId],
    queryFn: () => getSectionById(sectionId),
    enabled: Boolean(getAccessToken()) && Boolean(sectionId),
    retry: false,
    refetchOnWindowFocus: false,
  });
}
