import React, { useState } from 'react';
import { Card, Input, Badge } from '@edukalyan/ui';
import { Search, Globe } from 'lucide-react';
import { formatDate } from '@edukalyan/utils';

export const ActivityPage: React.FC = () => {
  const [search, setSearch] = useState('');

  const activities = [
    {
      id: 'act_1',
      type: 'auth.login',
      description: 'Successful user authentication via password session',
      ip: '192.168.1.100',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
    },
    {
      id: 'act_2',
      type: 'profile.update',
      description: 'Updated user avatar and regional preferences',
      ip: '192.168.1.100',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'act_3',
      type: 'storage.upload',
      description: 'Uploaded image file to avatars storage bucket',
      ip: '192.168.1.100',
      timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
  ];

  const filtered = activities.filter(
    (a) =>
      a.description.toLowerCase().includes(search.toLowerCase()) ||
      a.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Activity History</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Track key user actions and security session history</p>
      </div>

      <div className="flex items-center gap-4">
        <Input
          placeholder="Search activity events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="h-4 w-4" />}
          className="max-w-md"
        />
      </div>

      <Card glass className="p-6 space-y-6">
        <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-800 space-y-6">
          {filtered.map((item) => (
            <div key={item.id} className="relative group">
              <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-indigo-600 ring-4 ring-white dark:ring-slate-900" />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="neutral" size="sm">{item.type}</Badge>
                  <span className="text-xs font-semibold text-slate-400">{formatDate(item.timestamp)}</span>
                </div>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{item.description}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Globe className="h-3 w-3" /> IP: {item.ip}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
