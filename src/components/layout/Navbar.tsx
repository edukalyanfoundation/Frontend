import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import { Avatar, Badge, Button } from '@edukalyan/ui';
import {
  Sun,
  Moon,
  Bell,
  LogOut,
  User,
  Shield,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

import logoImg from '@/assets/logo.png';

export const Navbar: React.FC = () => {
  const { user, profile, role, isAuthenticated, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5 group">
            <img src={logoImg} alt="Edukalyan Logo" className="h-11 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105" />
            <div className="flex flex-col">
              <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors">
                Edukalyan
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-indigo-500">
                Foundation
              </span>
            </div>
          </Link>

          {isAuthenticated && (
            <Badge variant={role === 'admin' ? 'danger' : 'info'} size="sm" className="hidden sm:inline-flex ml-2">
              <Shield className="h-3 w-3 mr-1" />
              {role.toUpperCase()}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-3">

          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-slate-700" />}
          </button>

          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard/notifications"
                className="relative rounded-lg p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
              </Link>

              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 rounded-full p-1 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
                >
                  <Avatar
                    src={profile?.avatar_url}
                    fallback={(profile?.first_name?.[0] || user?.email?.[0] || 'U').toUpperCase()}
                    size="sm"
                  />
                  <span className="hidden md:inline-block text-xs font-semibold max-w-[120px] truncate">
                    {profile?.first_name || user?.email?.split('@')[0]}
                  </span>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </button>

                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-150"
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {profile?.first_name} {profile?.last_name}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {user?.email || profile?.email}
                      </p>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <User className="h-4 w-4 text-slate-400" />
                        Dashboard
                      </Link>
                      <Link
                        to="/dashboard/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Sparkles className="h-4 w-4 text-slate-400" />
                        Profile Settings
                      </Link>
                      {role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors font-semibold"
                        >
                          <Shield className="h-4 w-4" />
                          Admin Console
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
