import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useNotificationStore } from '../stores/notificationStore';
import { Button, Input, Card } from '@edukalyan/ui';
import { Mail, Lock, LogIn, Github, Chrome, ShieldAlert } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const { login, isLoading, error, setDemoUser } = useAuthStore();
  const { addToast } = useNotificationStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      addToast({ type: 'warning', title: 'Validation Error', message: 'Please enter both email and password.' });
      return;
    }

    const success = await login(email, password);
    if (success) {
      addToast({ type: 'success', title: 'Welcome Back!', message: 'Signed in successfully.' });
      navigate('/dashboard');
    }
  };

  const handleDemoLogin = (role: 'admin' | 'user') => {
    setDemoUser(role);
    addToast({
      type: 'info',
      title: 'Demo Session Active',
      message: `Signed in as Demo ${role.toUpperCase()}.`,
    });
    navigate(role === 'admin' ? '/admin' : '/dashboard');
  };

  return (
    <div className="flex min-h-[75vh] items-center justify-center py-6">
      <Card glass className="w-full max-w-md p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30">
            <LogIn className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Sign In to Edukalyan</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Enter your credentials to access your portal</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

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

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="h-4 w-4" />}
            required
          />

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              Remember me
            </label>
            <Link to="/forgot-password" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
              Forgot Password?
            </Link>
          </div>

          <Button type="submit" variant="primary" className="w-full py-2.5" isLoading={isLoading}>
            Sign In
          </Button>
        </form>

        {/* OAuth Dividers */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 font-semibold">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" size="sm" onClick={() => handleDemoLogin('user')} className="gap-2">
            <Chrome className="h-4 w-4 text-rose-500" /> Google OAuth
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleDemoLogin('admin')} className="gap-2">
            <Github className="h-4 w-4" /> GitHub OAuth
          </Button>
        </div>


        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
            Create an Account
          </Link>
        </p>
      </Card>
    </div>
  );
};
