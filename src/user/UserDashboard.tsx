import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Card, Badge, Button, Avatar } from '@edukalyan/ui';
import { User, Settings, Bell, Activity, ArrowUpRight, CheckCircle2, Clock } from 'lucide-react';
import { formatDate } from '@edukalyan/utils';

export const UserDashboard: React.FC = () => {
  const { profile, role } = useAuthStore();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar
              src={profile?.avatar_url}
              fallback={(profile?.first_name?.[0] || 'U').toUpperCase()}
              size="xl"
              className="ring-4 ring-white/20"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Welcome back, {profile?.first_name || 'User'}!
                </h1>
                <Badge variant="info" size="sm" className="bg-white/20 text-white border-transparent">
                  {role.toUpperCase()}
                </Badge>
              </div>
              <p className="text-xs text-indigo-100 mt-1">
                Account Status: <span className="font-bold uppercase tracking-wider text-emerald-300">Active</span> • Last login: {formatDate(profile?.last_login || new Date().toISOString())}
              </p>
            </div>
          </div>

          <Link to="/dashboard/profile">
            <Button variant="secondary" size="sm" className="bg-white/10 hover:bg-white/20 text-white border-transparent">
              Edit Profile <ArrowUpRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card glass className="p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
            <User className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Role Privilege</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white capitalize">{role}</p>
          </div>
        </Card>

        <Card glass className="p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Security Status</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">Protected (RLS)</p>
          </div>
        </Card>

        <Card glass className="p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Unread Notifications</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">1 New</p>
          </div>
        </Card>

        <Card glass className="p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Session Active</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">Persistent JWT</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card glass className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <User className="h-4 w-4 text-indigo-500" /> Manage Profile & Avatar
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Update your personal details, phone number, timezone preferences, and upload an avatar image.
          </p>
          <Link to="/dashboard/profile" className="inline-block">
            <Button variant="outline" size="sm">Go to Profile</Button>
          </Link>
        </Card>

        <Card glass className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="h-4 w-4 text-purple-500" /> Account Preferences
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Configure security options, change password, toggle email alerts, and view active sessions.
          </p>
          <Link to="/dashboard/settings" className="inline-block">
            <Button variant="outline" size="sm">Go to Settings</Button>
          </Link>
        </Card>

        <Card glass className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-500" /> Activity History
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Inspect your recent account login events, security audits, and system notification log.
          </p>
          <Link to="/dashboard/activity" className="inline-block">
            <Button variant="outline" size="sm">View History</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
};
