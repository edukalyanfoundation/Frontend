import React from 'react';
import { Badge, Table } from '@edukalyan/ui';
import { HardDrive } from 'lucide-react';

export const AdminStoragePage: React.FC = () => {
  const buckets = [
    { id: 'images', name: 'images', isPublic: true, limit: '10 MB', mime: 'JPEG, PNG, WebP, SVG', count: 24 },
    { id: 'public-assets', name: 'public-assets', isPublic: true, limit: '20 MB', mime: 'Any Public', count: 12 },
    { id: 'avatars', name: 'avatars', isPublic: false, limit: '5 MB', mime: 'JPEG, PNG, WebP', count: 8 },
    { id: 'documents', name: 'documents', isPublic: false, limit: '20 MB', mime: 'PDF, DOCX, TXT, CSV', count: 14 },
    { id: 'uploads', name: 'uploads', isPublic: false, limit: '50 MB', mime: 'Private User Assets', count: 6 },
    { id: 'admin-assets', name: 'admin-assets', isPublic: false, limit: '50 MB', mime: 'Admin Files', count: 3 },
  ];

  const columns = [
    {
      key: 'name',
      header: 'Bucket Name',
      render: (b: any) => (
        <div className="flex items-center gap-2">
          <HardDrive className="h-4 w-4 text-indigo-500" />
          <span className="font-bold text-slate-900 dark:text-slate-100">{b.name}</span>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Visibility & Security',
      render: (b: any) => (
        <Badge variant={b.isPublic ? 'info' : 'danger'} size="sm">
          {b.isPublic ? 'PUBLIC (CDN)' : 'PRIVATE (RLS SIGNED URL)'}
        </Badge>
      ),
    },
    {
      key: 'limit',
      header: 'Size Limit',
      render: (b: any) => <span className="text-xs font-mono">{b.limit}</span>,
    },
    {
      key: 'mime',
      header: 'Allowed MIME Types',
      render: (b: any) => <span className="text-xs text-slate-500">{b.mime}</span>,
    },
    {
      key: 'count',
      header: 'Stored Objects',
      render: (b: any) => <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{b.count} Files</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Storage Buckets Overview</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Configure public & private storage bucket policies and inspect file limits</p>
      </div>

      <Table columns={columns} data={buckets} keyExtractor={(b) => b.id} />
    </div>
  );
};
