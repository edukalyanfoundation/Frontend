import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

export const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, role, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-rose-500" />
      </div>
    );
  }

  if (!isAuthenticated || role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};
