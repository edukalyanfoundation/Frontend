import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import {
  LayoutDashboard,
  User,
  Settings,
  Bell,
  Activity,
  Users,
  ShieldCheck,
  FileText,
  BarChart3,
  HardDrive,
  MessageSquare,
  Sliders,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { role } = useAuthStore();
  const isAdmin = role === 'admin';

  const userLinks = [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/dashboard/profile', label: 'My Profile', icon: User },
    { to: '/dashboard/settings', label: 'Preferences', icon: Settings },
    { to: '/dashboard/notifications', label: 'Notifications', icon: Bell },
    { to: '/dashboard/activity', label: 'Activity Logs', icon: Activity },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Admin Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/inquiries', label: 'Student Inquiries', icon: MessageSquare },
    { to: '/admin/ugc-registrations', label: 'Student Registrations', icon: FileText },
    { to: '/admin/users', label: 'User Management', icon: Users },
    { to: '/admin/roles', label: 'Roles & Permissions', icon: ShieldCheck },
    { to: '/admin/audit', label: 'System Audit Logs', icon: FileText },
    { to: '/admin/analytics', label: 'Analytics & Metrics', icon: BarChart3 },
    { to: '/admin/storage', label: 'Storage Overview', icon: HardDrive },
    { to: '/admin/settings', label: 'System Settings', icon: Sliders },
  ];

  return (
    <aside className="w-64 shrink-0 rounded-3xl border border-slate-800/80 bg-slate-900/80 backdrop-blur-xl p-4 my-2 shadow-2xl flex flex-col justify-between self-start">
      <div className="space-y-6">
        {/* User Portal Navigation */}
        <div>
          <h3 className="px-3 text-[11px] font-extrabold uppercase tracking-wider text-indigo-400 mb-2">
            User Portal
          </h3>
          <nav className="space-y-1">
            {userLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                    }`
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {link.label}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Admin Navigation */}
        {isAdmin && (
          <div>
            <div className="flex items-center justify-between px-3 mb-2">
              <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-rose-400">
                Administration
              </h3>
              <span className="px-2 py-0.5 text-[9px] font-black bg-rose-500/15 border border-rose-500/30 text-rose-400 rounded-full">
                SECURE
              </span>
            </div>
            <nav className="space-y-1">
              {adminLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.end}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 text-white shadow-lg shadow-rose-500/25'
                          : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                      }`
                    }
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {link.label}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        )}
      </div>

      {/* Footer Banner info */}
      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-3 text-center">
        <p className="text-[11px] font-bold text-white">Edukalyan Admin Desk</p>
        <p className="text-[10px] text-slate-400 mt-0.5">RLS & RBAC Protected</p>
      </div>
    </aside>
  );
};
