import { useQuery } from "@tanstack/react-query";
import { getAuditLogById, getAuditLogs } from "@/api/audit-log.api";
import type { AuditLogQuery } from "@/types/audit-log.type";

export function useAuditLogs(query?: AuditLogQuery) {
  return useQuery({
    queryKey: ["audit-logs", query],
    queryFn: () => getAuditLogs(query),
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export function useAuditLogById(auditLogId: string) {
  return useQuery({
    queryKey: ["audit-log", auditLogId],
    queryFn: () => getAuditLogById(auditLogId),
    enabled: Boolean(auditLogId),
    retry: false,
    refetchOnWindowFocus: false,
  });
}
