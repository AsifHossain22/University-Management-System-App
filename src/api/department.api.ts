import apiClient from '@/lib/apiClient';
import type { ApiResponse } from '@/types/auth.type';
import type {
  CreateDepartmentPayload,
  Department,
  DepartmentMeta,
  DepartmentQuery,
  UpdateDepartmentPayload,
} from '@/types/department.type';

export function getDepartments(query?: DepartmentQuery) {
  return apiClient<
    ApiResponse<Department[]> & {
      meta: DepartmentMeta;
    }
  >('/departments', {
    query,
  });
}

export function getDepartmentById(departmentId: string) {
  return apiClient<ApiResponse<Department>>(`/departments/${departmentId}`);
}

export function createDepartment(payload: CreateDepartmentPayload) {
  return apiClient<ApiResponse<Department>>('/departments', {
    method: 'POST',
    body: payload,
  });
}

export function updateDepartment(
  departmentId: string,
  payload: UpdateDepartmentPayload,
) {
  return apiClient<ApiResponse<Department>>(`/departments/${departmentId}`, {
    method: 'PATCH',
    body: payload,
  });
}

export function deleteDepartment(departmentId: string) {
  return apiClient<ApiResponse<Department>>(`/departments/${departmentId}`, {
    method: 'DELETE',
  });
}
