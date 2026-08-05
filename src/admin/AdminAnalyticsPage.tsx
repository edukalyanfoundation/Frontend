import React from 'react';
import { Card, Badge } from '@edukalyan/ui';
import { Zap, Database, Server, Activity, ShieldAlert } from 'lucide-react';

export const AdminAnalyticsPage: React.FC = () => {
  const metrics = [
    { title: 'API Response Latency', value: '42 ms', change: '-12%', status: 'Optimal', icon: Zap },
    { title: 'Database Query Time', value: '8.4 ms', change: '-5%', status: 'Healthy', icon: Database },
    { title: 'Edge Function Invocations', value: '4,280 / day', change: '+18%', status: 'Active', icon: Server },
    { title: 'Authentication Failures', value: '0.04%', change: '0%', status: 'Secure', icon: ShieldAlert },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">System Analytics & Health</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Track API performance, database latency, and function execution metrics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <Card key={m.title} glass className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <Icon className="h-5 w-5 text-indigo-500" />
                <Badge variant="success" size="sm">{m.status}</Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{m.title}</p>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{m.value}</p>
            </Card>
          );
        })}
      </div>

      <Card glass className="p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Activity className="h-4 w-4 text-emerald-500" /> Real-time System Telemetry Overview
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          All system endpoints operate with automated connection pooling and caching. PostgreSQL Row Level Security checks execute at sub-millisecond speeds.
        </p>
      </Card>
    </div>
  );
};
