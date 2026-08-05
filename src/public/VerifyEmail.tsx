import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card } from '@edukalyan/ui';
import { MailCheck, ArrowRight } from 'lucide-react';

export const VerifyEmail: React.FC = () => {
  return (
    <div className="flex min-h-[70vh] items-center justify-center py-6">
      <Card glass className="w-full max-w-md p-8 text-center space-y-6 shadow-2xl">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-500 shadow-inner">
          <MailCheck className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Check Your Inbox</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            We have sent a verification link to your email address. Please click the link to confirm your account and complete setup.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <Link to="/login">
            <Button variant="primary" size="md" className="w-full">
              Proceed to Sign In <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};
