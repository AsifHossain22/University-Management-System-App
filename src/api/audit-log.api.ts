import apiClient from '@/lib/apiClient';
import type { ApiResponse } from '@/types/auth.type';
import type {
  AuditLog,
  AuditLogQuery,
  PaginatedAuditLogs,
} from '@/types/audit-log.type';

export function getAuditLogs(query?: AuditLogQuery) {
  return apiClient<ApiResponse<PaginatedAuditLogs>>('/audit-logs', {
    query,
  });
}

export function getAuditLogById(auditLogId: string) {
  return apiClient<ApiResponse<AuditLog>>(`/audit-logs/${auditLogId}`);
}
