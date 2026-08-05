import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input, Card } from '@edukalyan/ui';
import { Mail, KeyRound, ArrowLeft } from 'lucide-react';
import { useNotificationStore } from '../stores/notificationStore';
import { supabase } from '../lib/supabase';

import { sendPasswordResetEmail } from '../services/emailService';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addToast } = useNotificationStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendPasswordResetEmail(email);
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      setSubmitted(true);
      addToast({ type: 'success', title: 'Email Sent', message: 'Password recovery instructions dispatched.' });
    } catch (err: any) {
      addToast({ type: 'error', title: 'Error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center py-6">
      <Card glass className="w-full max-w-md p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30">
            <KeyRound className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Reset Password</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Enter your email to receive recovery instructions</p>
        </div>

        {submitted ? (
          <div className="text-center space-y-4 py-4">
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              We have sent password reset instructions to <strong>{email}</strong>.
            </p>
            <Link to="/login">
              <Button variant="outline" size="sm" className="w-full">
                Return to Sign In
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="user@edukalyan.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="h-4 w-4" />}
              required
            />

            <Button type="submit" variant="primary" className="w-full py-2.5" isLoading={loading}>
              Send Reset Link
            </Button>
          </form>
        )}

        <div className="text-center">
          <Link to="/login" className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
          </Link>
        </div>
      </Card>
    </div>
  );
};
