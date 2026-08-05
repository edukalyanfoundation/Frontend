import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card } from '@edukalyan/ui';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

export const ForbiddenPage: React.FC = () => {
  const { setDemoUser } = useAuthStore();

  return (
    <div className="flex min-h-[70vh] items-center justify-center py-6">
      <Card glass className="w-full max-w-md p-8 text-center space-y-6 shadow-2xl border-rose-500/30">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-rose-500/10 text-rose-500 shadow-inner">
          <ShieldAlert className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">403 Access Forbidden</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            You do not have the required role or permissions (`admin`) to access this administration route.
          </p>
        </div>

        <div className="pt-2 space-y-3">
          <Link to="/dashboard" className="inline-block w-full">
            <Button variant="primary" size="md" className="w-full">
              <ArrowLeft className="h-4 w-4" /> Return to User Dashboard
            </Button>
          </Link>

          <button
            onClick={() => setDemoUser('admin')}
            className="text-xs font-bold text-rose-500 hover:underline inline-block"
          >
            Switch to Demo Admin Role for Testing
          </button>
        </div>
      </Card>
    </div>
  );
};
