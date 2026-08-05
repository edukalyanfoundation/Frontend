import React, { useState } from 'react';
import { Card, Button, Input } from '@edukalyan/ui';
import { Lock, Bell, Shield, Key } from 'lucide-react';
import { useNotificationStore } from '@/stores/notificationStore';

export const SettingsPage: React.FC = () => {
  const { addToast } = useNotificationStore();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [updating, setUpdating] = useState(false);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      addToast({ type: 'warning', title: 'Validation Error', message: 'Please enter all password fields.' });
      return;
    }
    setUpdating(true);
    setTimeout(() => {
      setUpdating(false);
      setCurrentPassword('');
      setNewPassword('');
      addToast({ type: 'success', title: 'Password Updated', message: 'Your password has been changed.' });
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Account Preferences & Security</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Configure security settings, multi-factor auth, and notification preferences</p>
      </div>

      <Card glass className="p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Lock className="h-4 w-4 text-indigo-500" /> Password & Security
        </h3>

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          <Input
            label="Current Password"
            type="password"
            placeholder="••••••••"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <Input
            label="New Password"
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Button type="submit" variant="primary" size="sm" isLoading={updating}>
            <Key className="h-3.5 w-3.5" /> Update Password
          </Button>
        </form>
      </Card>

      <Card glass className="p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Shield className="h-4 w-4 text-purple-500" /> Multi-Factor Authentication (MFA)
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">Enforce Authenticator App (TOTP)</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Add an extra layer of security during sign in.</p>
          </div>
          <button
            onClick={() => {
              setMfaEnabled(!mfaEnabled);
              addToast({ type: 'info', title: 'MFA Status Changed', message: `MFA is now ${!mfaEnabled ? 'Enabled' : 'Disabled'}.` });
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mfaEnabled ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            {mfaEnabled ? 'Enabled' : 'Disabled'}
          </button>
        </div>
      </Card>

      <Card glass className="p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Bell className="h-4 w-4 text-amber-500" /> Notification Channels
        </h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">Email Notifications</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Receive transactional updates via email.</p>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">Security Audit Alerts</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Get notified of new logins from unfamiliar IP addresses.</p>
            </div>
            <input
              type="checkbox"
              checked={securityAlerts}
              onChange={(e) => setSecurityAlerts(e.target.checked)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
            />
          </label>
        </div>
      </Card>
    </div>
  );
};
