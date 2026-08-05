import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card } from '@edukalyan/ui';
import { LogIn } from 'lucide-react';

export const UnauthorizedPage: React.FC = () => {
  return (
    <div className="flex min-h-[70vh] items-center justify-center py-6">
      <Card glass className="w-full max-w-md p-8 text-center space-y-6 shadow-2xl">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-500/10 text-amber-500 shadow-inner">
          <LogIn className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">401 Authentication Required</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            You must be signed in with a valid session to view this resource.
          </p>
        </div>

        <Link to="/login" className="inline-block">
          <Button variant="primary" size="md">
            Sign In to Continue
          </Button>
        </Link>
      </Card>
    </div>
  );
};
