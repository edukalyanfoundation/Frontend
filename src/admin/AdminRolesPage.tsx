import React from 'react';
import { Card, Badge } from '@edukalyan/ui';
import { Shield, CheckCircle2, XCircle } from 'lucide-react';

export const AdminRolesPage: React.FC = () => {
  const roles = [
    {
      id: '1',
      name: 'admin',
      description: 'System Administrator with full access to all resources and RLS bypass policies.',
      permissions: ['users.read', 'users.write', 'users.delete', 'content.read', 'content.write', 'settings.manage', 'audit.read'],
    },
    {
      id: '2',
      name: 'user',
      description: 'Standard authenticated platform user restricted to owned profile data.',
      permissions: ['content.read', 'content.write'],
    },
  ];

  const allPermissions = [
    'users.read',
    'users.write',
    'users.delete',
    'content.read',
    'content.write',
    'settings.manage',
    'audit.read',
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Roles & Permissions Matrix</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Manage role definitions and permissions mapping</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roles.map((role) => (
          <Card key={role.id} glass className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-indigo-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white capitalize">{role.name}</h3>
              </div>
              <Badge variant={role.name === 'admin' ? 'danger' : 'info'}>{role.name.toUpperCase()}</Badge>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{role.description}</p>

            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Assigned Permissions</h4>
              <div className="space-y-1.5">
                {allPermissions.map((perm) => {
                  const hasPerm = role.permissions.includes(perm);
                  return (
                    <div key={perm} className="flex items-center justify-between text-xs py-1 px-2 rounded bg-slate-50 dark:bg-slate-800/60">
                      <span className="font-mono">{perm}</span>
                      {hasPerm ? (
                        <span className="flex items-center gap-1 text-emerald-500 font-semibold">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Granted
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-slate-400">
                          <XCircle className="h-3.5 w-3.5" /> Denied
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
