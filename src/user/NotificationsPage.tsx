import React, { useState } from 'react';
import { Card, Button, Tabs } from '@edukalyan/ui';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, CheckCheck } from 'lucide-react';
import { formatDate } from '@edukalyan/utils';
import { useNotificationStore } from '@/stores/notificationStore';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  is_read: boolean;
  created_at: string;
}

export const NotificationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const { addToast } = useNotificationStore();

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      title: 'Welcome to Edukalyan!',
      message: 'Your account has been successfully set up with role-based access controls.',
      type: 'success',
      is_read: false,
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: '2',
      title: 'Security Audit Notice',
      message: 'A new session was initiated from your local IP address.',
      type: 'info',
      is_read: true,
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: '3',
      title: 'Storage Policy Update',
      message: 'Row level security policy on uploads bucket was updated by admin.',
      type: 'warning',
      is_read: false,
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
  ]);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    addToast({ type: 'info', title: 'Notifications Updated', message: 'All notifications marked as read.' });
  };

  const toggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: !n.is_read } : n))
    );
  };

  const filtered = notifications.filter((n) => {
    if (activeTab === 'unread') return !n.is_read;
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />;
      default:
        return <Info className="h-5 w-5 text-sky-500 shrink-0" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Notifications</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">View platform announcements and system alerts</p>
        </div>
        <Button variant="outline" size="sm" onClick={markAllAsRead}>
          <CheckCheck className="h-4 w-4" /> Mark All as Read
        </Button>
      </div>

      <Tabs
        tabs={[
          { id: 'all', label: 'All Notifications', badge: notifications.length },
          { id: 'unread', label: 'Unread', badge: notifications.filter((n) => !n.is_read).length },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card glass className="p-8 text-center text-slate-400 italic">
            No notifications in this view.
          </Card>
        ) : (
          filtered.map((item) => (
            <Card
              key={item.id}
              glass
              className={`p-4 flex items-start gap-4 transition-all ${
                !item.is_read ? 'border-l-4 border-l-indigo-500 bg-indigo-500/5' : ''
              }`}
            >
              {getIcon(item.type)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{item.title}</h4>
                  <span className="text-[11px] text-slate-400">{formatDate(item.created_at)}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{item.message}</p>
              </div>
              <button
                onClick={() => toggleRead(item.id)}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline shrink-0"
              >
                {item.is_read ? 'Mark Unread' : 'Mark Read'}
              </button>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
