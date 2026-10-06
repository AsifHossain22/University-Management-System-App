import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createDepartment,
  deleteDepartment,
  getDepartmentById,
  getDepartments,
  updateDepartment,
} from '@/api/department.api';
import type {
  CreateDepartmentPayload,
  DepartmentQuery,
  UpdateDepartmentPayload,
} from '@/types/department.type';
import { getAccessToken } from '@/lib/auth-storage';

export function useDepartments(query?: DepartmentQuery) {
  return useQuery({
    queryKey: ['departments', query],
    queryFn: () => getDepartments(query),
    enabled: Boolean(getAccessToken()),
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export function useDepartmentById(departmentId: string) {
  return useQuery({
    queryKey: ['department', departmentId],
    queryFn: () => getDepartmentById(departmentId),
    enabled: Boolean(getAccessToken()) && Boolean(departmentId),
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export function useCreateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateDepartmentPayload) => createDepartment(payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['departments'],
      });

      await queryClient.refetchQueries({
        queryKey: ['departments'],
      });
    },
  });
}

export function useUpdateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      departmentId,
      payload,
    }: {
      departmentId: string;
      payload: UpdateDepartmentPayload;
    }) => updateDepartment(departmentId, payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['departments'],
      });
    },
  });
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDepartment,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['departments'],
      });
    },
  });
}
