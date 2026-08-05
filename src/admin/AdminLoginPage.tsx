import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, KeyRound } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setDemoUser } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Default hardcoded admin credentials
  const DEFAULT_ADMIN_USER = 'admin@edukalyan.org';
  const DEFAULT_ADMIN_PASS = 'admin123';

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const cleanInput = email.trim().toLowerCase();
    const cleanPass = password.trim();

    setTimeout(() => {
      // Validate hardcoded admin credentials
      if (
        (cleanInput === 'admin@edukalyan.org' || cleanInput === 'admin' || cleanInput === 'admin@edukalyan.com') &&
        (cleanPass === 'admin123' || cleanPass === 'admin@123' || cleanPass === 'AdminPassword@123')
      ) {
        // Authenticate as Admin
        setDemoUser('admin');
        setLoading(false);
        navigate('/admin', { replace: true });
      } else {
        setLoading(false);
        setError('Invalid Admin credentials. Please use the default credentials shown below.');
      }
    }, 400);
  };

  const handleAutoFill = () => {
    setEmail(DEFAULT_ADMIN_USER);
    setPassword(DEFAULT_ADMIN_PASS);
    setError('');
  };

  return (
    <div className="flex flex-col items-center justify-center py-6 relative z-10 overflow-hidden w-full">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-rose-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[250px] bg-indigo-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-rose-500/15 border border-rose-500/30 px-4 py-1.5 text-xs font-extrabold text-rose-400 backdrop-blur-md shadow-xs">
            <ShieldCheck className="h-4 w-4 text-rose-400" />
            <span>Restricted Access • Admin Security Portal</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Edukalyan <span className="bg-gradient-to-r from-rose-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent">Admin Console</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            Enter your default administrator credentials to sign into the system control panel.
          </p>
        </div>

        {/* Login Glassmorphic Card */}
        <div className="group relative rounded-3xl border border-slate-800/80 bg-slate-900/80 backdrop-blur-xl p-8 space-y-6 shadow-2xl overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500" />

          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-rose-400" /> Admin User ID / Email
              </label>
              <Input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@edukalyan.org"
                className="rounded-2xl bg-slate-800/60 border-slate-700/80 text-white placeholder:text-slate-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 py-3 text-sm"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-rose-400" /> Admin Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="rounded-2xl bg-slate-800/60 border-slate-700/80 text-white placeholder:text-slate-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 py-3 text-sm"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl py-3 text-sm font-extrabold gap-2 bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 text-white shadow-xl shadow-rose-500/20 mt-2"
            >
              {loading ? 'Authenticating...' : 'Sign In To Admin Dashboard'} <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </form>

          {/* Quick Credential Auto-Fill Helper */}
          <div className="pt-4 border-t border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <KeyRound className="h-3.5 w-3.5 text-rose-400" /> Default Credentials
              </span>
              <button
                type="button"
                onClick={handleAutoFill}
                className="text-xs font-bold text-rose-400 hover:text-rose-300 underline cursor-pointer"
              >
                Auto-fill
              </button>
            </div>
            <div className="font-mono text-slate-200 text-[11px] space-y-1">
              <div>User ID / Email: <span className="font-bold text-white">admin@edukalyan.org</span> (or <span className="text-white">admin</span>)</div>
              <div>Password: <span className="font-bold text-white">admin123</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
