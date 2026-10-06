import apiClient from '@/lib/apiClient';
import type { ApiResponse } from '@/types/auth.type';
import type {
  CreateProgramPayload,
  Program,
  ProgramMeta,
  ProgramQuery,
  UpdateProgramPayload,
} from '@/types/program.type';

export function getPrograms(query?: ProgramQuery) {
  return apiClient<
    ApiResponse<Program[]> & {
      meta: ProgramMeta;
    }
  >('/programs', {
    query,
  });
}

export function getProgramById(programId: string) {
  return apiClient<ApiResponse<Program>>(`/programs/${programId}`);
}

export function createProgram(payload: CreateProgramPayload) {
  return apiClient<ApiResponse<Program>>('/programs', {
    method: 'POST',
    body: payload,
  });
}

export function updateProgram(
  programId: string,
  payload: UpdateProgramPayload,
) {
  return apiClient<ApiResponse<Program>>(`/programs/${programId}`, {
    method: 'PATCH',
    body: payload,
  });
}

export function deleteProgram(programId: string) {
  return apiClient<ApiResponse<Program>>(`/programs/${programId}`, {
    method: 'DELETE',
  });
}
