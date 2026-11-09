import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createSection,
  deleteSection,
  getSectionById,
  getSections,
  publishSectionGrades,
  updateSection,
} from "@/api/section.api";
import type {
  CreateSectionPayload,
  SectionQuery,
  UpdateSectionPayload,
} from "@/types/section.type";

// GetSections
export function useSections(query?: SectionQuery) {
  return useQuery({
    queryKey: ["sections", query],
    queryFn: () => getSections(query),
    retry: false,
    refetchOnWindowFocus: false,
  });
}

// GetSectionById
export function useSectionById(sectionId: string) {
  return useQuery({
    queryKey: ["section", sectionId],
    queryFn: () => getSectionById(sectionId),
    enabled: Boolean(sectionId),
    retry: false,
    refetchOnWindowFocus: false,
  });
}

// CreateSection
export function useCreateSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSectionPayload) => createSection(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["sections"],
      });

      await queryClient.refetchQueries({
        queryKey: ["sections"],
      });
    },
  });
}

// UpdateSection
export function useUpdateSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sectionId,
      payload,
    }: {
      sectionId: string;
      payload: UpdateSectionPayload;
    }) => updateSection(sectionId, payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["sections"],
      });
    },
  });
}

// DeleteSection
export function useDeleteSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSection,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["sections"],
      });
    },
  });
}

// PublishSectionGrades
export function usePublishSectionGrades() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: publishSectionGrades,

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["sections"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["student-transcript"],
        }),
      ]);
    },
  });
}
