import React, { useEffect, useState } from 'react';
import { Table, Badge } from '@edukalyan/ui';
import { api } from '@/services/api';
import { SettingRow } from '@edukalyan/types';

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SettingRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getSettings().then((data: SettingRow[]) => {
      setSettings(data);
      setLoading(false);
    });
  }, []);

  const columns = [
    {
      key: 'key',
      header: 'Setting Key',
      render: (s: SettingRow) => <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{s.key}</span>,
    },
    {
      key: 'value',
      header: 'Configuration Value',
      render: (s: SettingRow) => <span className="font-mono text-xs text-indigo-500">{JSON.stringify(s.value)}</span>,
    },
    {
      key: 'description',
      header: 'Description',
      render: (s: SettingRow) => <span className="text-xs text-slate-500">{s.description}</span>,
    },
    {
      key: 'is_public',
      header: 'Scope',
      render: (s: SettingRow) => (
        <Badge variant={s.is_public ? 'info' : 'warning'} size="sm">
          {s.is_public ? 'PUBLIC' : 'PRIVATE (ADMIN)'}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">System Configuration Settings</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Manage platform-wide variables, maintenance mode, and upload parameters</p>
      </div>

      <Table columns={columns} data={settings} keyExtractor={(s) => s.key} isLoading={loading} />
    </div>
  );
};
