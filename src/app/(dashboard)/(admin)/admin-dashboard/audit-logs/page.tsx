'use client';

import { useState } from 'react';
import { useAuditLogs } from '@/hooks/audit-log.hook';
import type { AuditLogQuery } from '@/types/audit-log.type';

export default function AuditLogsPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [action, setAction] = useState('');
  const [entity, setEntity] = useState('');

  const query: AuditLogQuery = {
    page,
    limit: 10,
    ...(searchTerm.trim() && { searchTerm: searchTerm.trim() }),
    ...(action && { action }),
    ...(entity && { entity }),
  };

  const { data, isPending, isError, error } = useAuditLogs(query);

  const result = data?.data;
  const logs = result?.data ?? [];
  const meta = result?.meta;

  function resetFilters() {
    setPage(1);
    setSearchTerm('');
    setAction('');
    setEntity('');
  }

  return (
    <main className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Audit Logs</h1>
        <p className="text-muted-foreground">
          Review recorded administrative and system activities.
        </p>
      </div>

      <section className="space-y-4 rounded-lg border p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <input
            className="h-10 rounded-md border bg-background px-3 text-sm"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={event => {
              setSearchTerm(event.target.value);
              setPage(1);
            }}
          />

          <input
            className="h-10 rounded-md border bg-background px-3 text-sm"
            placeholder="Filter by action"
            value={action}
            onChange={event => {
              setAction(event.target.value);
              setPage(1);
            }}
          />

          <input
            className="h-10 rounded-md border bg-background px-3 text-sm"
            placeholder="Filter by entity"
            value={entity}
            onChange={event => {
              setEntity(event.target.value);
              setPage(1);
            }}
          />
        </div>

        <button
          type="button"
          className="rounded-md border px-3 py-2 text-sm hover:bg-muted"
          onClick={resetFilters}
        >
          Clear filters
        </button>
      </section>

      {isPending && <p>Loading audit logs...</p>}

      {isError && (
        <p className="text-sm text-destructive">
          Failed to load audit logs: {error.message}
        </p>
      )}

      {!isPending && !isError && (
        <>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">User</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Entity</th>
                  <th className="p-3">Description</th>
                </tr>
              </thead>

              <tbody>
                {logs.map(log => (
                  <tr key={log.id} className="border-t align-top">
                    <td className="whitespace-nowrap p-3">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="p-3">
                      {log.user
                        ? `${log.user.firstName} ${log.user.lastName}`
                        : 'System / unknown user'}
                    </td>
                    <td className="p-3">{log.action}</td>
                    <td className="p-3">
                      <div>{log.entity}</div>
                      {log.entityId && (
                        <div
                          className="max-w-48 truncate text-xs text-muted-foreground"
                          title={log.entityId}
                        >
                          {log.entityId}
                        </div>
                      )}
                    </td>
                    <td className="min-w-48 p-3">{log.description ?? '—'}</td>
                  </tr>
                ))}

                {logs.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-8 text-center text-muted-foreground"
                    >
                      No audit logs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {meta
                ? `Page ${meta.page} of ${meta.totalPages} · ${meta.total} records`
                : `${logs.length} records`}
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                className="rounded-md border px-3 py-2 text-sm disabled:opacity-50"
                disabled={!meta || page <= 1}
                onClick={() => setPage(current => Math.max(1, current - 1))}
              >
                Previous
              </button>

              <button
                type="button"
                className="rounded-md border px-3 py-2 text-sm disabled:opacity-50"
                disabled={!meta || page >= meta.totalPages}
                onClick={() => setPage(current => current + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
