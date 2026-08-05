import React, { useEffect, useState } from 'react';
import { Table, Button, Modal } from '@edukalyan/ui';
import { Eye, Terminal } from 'lucide-react';
import { api } from '@/services/api';
import { AuditLogRow } from '@edukalyan/types';
import { formatDate } from '@edukalyan/utils';

export const AdminAuditPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<AuditLogRow | null>(null);

  useEffect(() => {
    api.getAuditLogs().then((data: AuditLogRow[]) => {
      setLogs(data);
      setLoading(false);
    });
  }, []);

  const columns = [
    {
      key: 'action',
      header: 'Action Event',
      render: (l: AuditLogRow) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-slate-100">{l.action}</span>
          <p className="text-[11px] text-slate-400">Resource: {l.resource}</p>
        </div>
      ),
    },
    {
      key: 'actor',
      header: 'Actor Email',
      render: (l: AuditLogRow) => <span className="text-xs font-mono text-indigo-500">{l.actor_email || 'System Trigger'}</span>,
    },
    {
      key: 'ip',
      header: 'IP Address',
      render: (l: AuditLogRow) => <span className="text-xs font-mono">{l.ip_address || '127.0.0.1'}</span>,
    },
    {
      key: 'created_at',
      header: 'Timestamp',
      render: (l: AuditLogRow) => <span className="text-xs text-slate-500">{formatDate(l.created_at)}</span>,
    },
    {
      key: 'inspect',
      header: 'Inspect Payload',
      render: (l: AuditLogRow) => (
        <Button variant="outline" size="sm" onClick={() => setSelectedLog(l)}>
          <Eye className="h-3.5 w-3.5" /> View JSON Diff
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">System Audit Logs</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Automated PostgreSQL audit trigger log trail recording all security mutations</p>
      </div>

      <Table columns={columns} data={logs} keyExtractor={(l) => l.id} isLoading={loading} />

      <Modal
        isOpen={!!selectedLog}
        onClose={() => setSelectedLog(null)}
        title={`Audit Event Payload Inspector: ${selectedLog?.action}`}
        description={`Recorded at ${formatDate(selectedLog?.created_at)}`}
        maxWidth="lg"
      >
        <div className="space-y-4 py-2">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-500 mb-1 flex items-center gap-1">
              <Terminal className="h-3.5 w-3.5" /> Old Values (Before Mutation)
            </h4>
            <pre className="p-3 rounded-lg bg-slate-950 text-slate-300 font-mono text-xs overflow-x-auto max-h-40">
              {JSON.stringify(selectedLog?.old_values || { notice: 'No previous state (Insert)' }, null, 2)}
            </pre>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-500 mb-1 flex items-center gap-1">
              <Terminal className="h-3.5 w-3.5" /> New Values (After Mutation)
            </h4>
            <pre className="p-3 rounded-lg bg-slate-950 text-slate-300 font-mono text-xs overflow-x-auto max-h-40">
              {JSON.stringify(selectedLog?.new_values || { notice: 'Deleted entity' }, null, 2)}
            </pre>
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="outline" size="sm" onClick={() => setSelectedLog(null)}>
              Close Inspector
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
