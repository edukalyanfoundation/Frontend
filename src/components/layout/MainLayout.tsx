import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { PublicNavbar } from './PublicNavbar';
import { PublicFooter } from './PublicFooter';
import { Sidebar } from './Sidebar';
import { useAuthStore } from '../../stores/authStore';
import { useNotificationStore } from '../../stores/notificationStore';
import { Toast } from '@edukalyan/ui';

export const MainLayout: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const { toasts, removeToast } = useNotificationStore();
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col justify-between bg-transparent text-foreground relative z-10 overflow-hidden selection:bg-indigo-500 selection:text-white">
      <PublicNavbar />

      {/* Ambient Backdrop Blur */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-500/15 blur-[150px] rounded-full pointer-events-none" />

      <div className={`flex-1 flex mx-auto w-full relative z-10 py-6 ${isAdminRoute ? 'max-w-7xl px-4 sm:px-6 lg:px-8' : 'max-w-7xl px-4 sm:px-6'}`}>
        {isAuthenticated && !isAdminRoute && <Sidebar />}
        <main className="flex-1 p-2 sm:p-4 lg:p-6 min-w-0 overflow-y-auto w-full">
          <Outlet />
        </main>
      </div>

      <PublicFooter />

      {/* Global Toast Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast {...toast} onDismiss={removeToast} />
          </div>
        ))}
      </div>
    </div>
  );
};
