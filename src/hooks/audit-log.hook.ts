import { useQuery } from '@tanstack/react-query';
import { getAuditLogById, getAuditLogs } from '@/api/audit-log.api';
import type { AuditLogQuery } from '@/types/audit-log.type';
import { getAccessToken } from '@/lib/auth-storage';

export function useAuditLogs(query?: AuditLogQuery) {
  return useQuery({
    queryKey: ['audit-logs', query],
    queryFn: () => getAuditLogs(query),
    enabled: Boolean(getAccessToken()),
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export function useAuditLogById(auditLogId: string) {
  return useQuery({
    queryKey: ['audit-log', auditLogId],
    queryFn: () => getAuditLogById(auditLogId),
    enabled: Boolean(getAccessToken()) && Boolean(auditLogId),
    retry: false,
    refetchOnWindowFocus: false,
  });
}
