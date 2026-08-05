import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card } from '@edukalyan/ui';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex min-h-[70vh] items-center justify-center py-6">
      <Card glass className="w-full max-w-md p-8 text-center space-y-6 shadow-2xl">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-500/10 text-indigo-500 shadow-inner">
          <FileQuestion className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">404 Page Not Found</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            The requested page path does not exist or has been moved.
          </p>
        </div>

        <Link to="/" className="inline-block">
          <Button variant="primary" size="md">
            <ArrowLeft className="h-4 w-4" /> Return to Home
          </Button>
        </Link>
      </Card>
    </div>
  );
};
