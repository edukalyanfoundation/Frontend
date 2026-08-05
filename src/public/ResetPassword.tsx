import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Card } from '@edukalyan/ui';
import { Lock } from 'lucide-react';
import { useNotificationStore } from '../stores/notificationStore';
import { supabase } from '../lib/supabase';

export const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToast } = useNotificationStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      addToast({ type: 'warning', title: 'Mismatch', message: 'Passwords do not match.' });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      addToast({ type: 'success', title: 'Password Updated', message: 'Your password has been successfully reset.' });
      navigate('/login');
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
            <Lock className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Set New Password</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Choose a new secure password for your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="New Password"
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="h-4 w-4" />}
            required
          />

          <Input
            label="Confirm New Password"
            type="password"
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            leftIcon={<Lock className="h-4 w-4" />}
            required
          />

          <Button type="submit" variant="primary" className="w-full py-2.5" isLoading={loading}>
            Update Password
          </Button>
        </form>
      </Card>
    </div>
  );
};
