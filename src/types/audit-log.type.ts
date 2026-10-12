export type AuditLogQuery = {
  page?: number;
  limit?: number;
  action?: string;
  entity?: string;
  entityId?: string;
  userId?: string;
  searchTerm?: string;
};

export type AuditLogUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
};

export type AuditLog = {
  id: string;
  userId: string;
  action: string;
  entity: string;
  entityId: string | null;
  description: string | null;
  metadata: unknown;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  user: AuditLogUser | null;
};

export type AuditLogMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PaginatedAuditLogs = {
  meta: AuditLogMeta;
  data: AuditLog[];
};
