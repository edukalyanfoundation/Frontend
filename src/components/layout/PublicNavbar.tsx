import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronRight, User, LogOut, Shield, LogIn, Eye, EyeOff, KeyRound, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/stores/authStore';
import { useNotificationStore } from '@/stores/notificationStore';
import { sendPasswordResetEmail } from '@/services/emailService';
import { supabase } from '@/lib/supabase';
import logoImg from '@/assets/logo.png';

interface PublicNavbarProps {
  onOpenRegistration?: () => void;
}

export const PublicNavbar: React.FC<PublicNavbarProps> = ({ onOpenRegistration }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [signInMode, setSignInMode] = useState<'signin' | 'forgot'>('signin');

  useEffect(() => {
    if (isSignInModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSignInModalOpen]);

  // Sign In Form States
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [signingIn, setSigningIn] = useState(false);

  // Forgot Password States
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);
  const [sendingReset, setSendingReset] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const { isAuthenticated, profile, user, login, logout, role } = useAuthStore();
  const { addToast } = useNotificationStore();

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Courses', href: '/courses' },
    { label: 'About Us', href: '/about' },
    { label: 'Blog & Insights', href: '/blog' },
    { label: 'Verify Certificate', href: '/verify-certificate' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleStartJourney = () => {
    if (onOpenRegistration) {
      onOpenRegistration();
    } else {
      window.location.href = '/register';
    }
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInEmail || !signInPassword) {
      addToast({ type: 'warning', title: 'Validation Error', message: 'Please enter both Email and Password.' });
      return;
    }

    setSigningIn(true);
    setSignInError(null);
    try {
      const success = await login(signInEmail, signInPassword);
      if (success) {
        setSignInError(null);
        addToast({ type: 'success', title: 'Signed In Successfully', message: `Welcome back to Edukalyan!` });
        setIsSignInModalOpen(false);
        navigate('/dashboard/profile');
      } else {
        const storeError = useAuthStore.getState().error || 'Invalid registration email or password.';
        setSignInError(storeError);
        addToast({
          type: 'error',
          title: 'Sign In Failed',
          message: storeError,
        });
      }
    } catch (err: any) {
      const errMsg = err.message || 'Account not found. Please register first.';
      setSignInError(errMsg);
      addToast({ type: 'error', title: 'Sign In Error', message: errMsg });
    } finally {
      setSigningIn(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      addToast({ type: 'warning', title: 'Validation Error', message: 'Please enter your registered email address.' });
      return;
    }

    setSendingReset(true);
    try {
      await sendPasswordResetEmail(forgotEmail);
      await supabase.auth.resetPasswordForEmail(forgotEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      setForgotSubmitted(true);
      addToast({
        type: 'success',
        title: 'Password Recovery Email Sent',
        message: `Password reset instructions sent to ${forgotEmail}`,
      });
    } catch {
      addToast({ type: 'error', title: 'Error', message: 'Failed to send password recovery email.' });
    } finally {
      setSendingReset(false);
    }
  };

  const displayName = profile
    ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email
    : user?.email || 'Student User';

  return (
    <header className="sticky top-3 z-50 px-3 sm:px-6 w-full max-w-7xl mx-auto transition-all duration-300">
      {/* Floating Pill Capsule Bar */}
      <div className="rounded-full border border-slate-700/80 bg-slate-900/90 backdrop-blur-xl shadow-2xl px-4 sm:px-6 py-2 flex items-center justify-between">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center space-x-2.5">
          <img src={logoImg} alt="Edukalyan Foundation Logo" className="h-9 sm:h-11 w-auto object-contain" />
          <div className="flex flex-col">
            <span className="font-black text-lg sm:text-xl tracking-tight leading-none text-white">Edukalyan</span>
            <span className="text-[9px] text-indigo-400 font-extrabold tracking-wider uppercase">Foundation</span>
          </div>
        </Link>

        {/* Middle: Navigation Links */}
        {!location.pathname.startsWith('/admin') ? (
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                  isActive(link.href)
                    ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white font-extrabold shadow-md shadow-indigo-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        ) : (
          <div className="hidden lg:flex items-center gap-2">
            <div className="px-4 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-black flex items-center gap-1.5 shadow-sm">
              <Shield className="h-4 w-4" /> Admin Control Desk
            </div>
          </div>
        )}

        {/* Right: Auth / Action Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-bold text-white hover:bg-indigo-500/20 transition-all shadow-xs"
              >
                <div className="h-7 w-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-extrabold text-xs">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold leading-tight text-white max-w-[120px] truncate">{displayName}</span>
                  <span className="text-[9px] text-slate-400 truncate max-w-[120px]">{profile?.email || user?.email}</span>
                </div>
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-800 bg-slate-900/95 p-2 shadow-2xl z-50 space-y-1 backdrop-blur-xl">
                  <div className="px-3 py-2 border-b border-slate-800">
                    <p className="text-xs font-bold text-white truncate">{displayName}</p>
                    <p className="text-[10px] text-slate-400 truncate">{profile?.email || user?.email}</p>
                  </div>
                  <Link
                    to="/dashboard/profile"
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition-colors"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    <User className="h-4 w-4 text-indigo-400" /> Profile Page
                  </Link>
                  {role === 'admin' && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-indigo-400 hover:bg-slate-800 transition-colors"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <Shield className="h-4 w-4" /> Admin Console
                    </Link>
                  )}
                  <button
                    onClick={async () => {
                      setIsProfileDropdownOpen(false);
                      await logout();
                      navigate('/');
                    }}
                    className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button
              size="sm"
              className="rounded-full font-extrabold px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all text-xs gap-1.5 border-0"
              onClick={() => {
                setSignInMode('signin');
                setForgotSubmitted(false);
                setIsSignInModalOpen(true);
              }}
            >
              <LogIn className="h-4 w-4" /> Sign In
            </Button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="flex lg:hidden p-2 rounded-full border border-slate-700 bg-slate-800/80 text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="lg:hidden mt-2.5 rounded-[24px] border border-slate-800 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-2xl space-y-3 text-white">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`flex items-center justify-between rounded-2xl px-4 py-2.5 text-xs font-bold transition-all ${
                  isActive(link.href)
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold shadow-md shadow-indigo-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
            ))}
          </nav>
          <div className="pt-3 border-t border-slate-800/80 space-y-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard/profile"
                  className="flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold bg-indigo-500/15 border border-indigo-500/30 text-indigo-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-4 w-4 text-indigo-400" /> Profile Page ({displayName})
                </Link>
                {role === 'admin' && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold bg-purple-500/15 border border-purple-500/30 text-purple-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Shield className="h-4 w-4 text-purple-400" /> Admin Console
                  </Link>
                )}
                <Button
                  variant="outline"
                  className="w-full rounded-2xl font-bold border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs"
                  onClick={async () => {
                    setIsMenuOpen(false);
                    await logout();
                    navigate('/');
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" /> Sign Out
                </Button>
              </>
            ) : (
              <Button
                className="w-full rounded-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs py-2.5 border-0 shadow-lg shadow-indigo-500/20"
                onClick={() => {
                  setIsMenuOpen(false);
                  setSignInMode('signin');
                  setForgotSubmitted(false);
                  setIsSignInModalOpen(true);
                }}
              >
                <LogIn className="h-4 w-4 mr-2" /> Sign In / Register
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Interactive Sign In & Forgot Password Modal Window Popup */}
      {isSignInModalOpen && createPortal(
        <div
          data-lenis-prevent
          onWheel={(e) => e.stopPropagation()}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto overscroll-contain"
        >
          <div
            data-lenis-prevent
            onWheel={(e) => e.stopPropagation()}
            className="w-full max-w-md max-h-[90vh] overflow-y-auto my-auto rounded-3xl bg-card border border-muted p-6 sm:p-8 space-y-6 shadow-2xl relative overscroll-contain"
          >
            <button
              onClick={() => setIsSignInModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-accent text-muted-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {signInMode === 'signin' ? (
              /* Sign In View */
              <div className="space-y-6">
                <div className="text-center space-y-1.5">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30 mx-auto">
                    <LogIn className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-foreground">Sign In to Student Portal</h3>
                  <p className="text-xs text-muted-foreground">
                    Enter your registration email and password to access your profile
                  </p>
                </div>

                <form onSubmit={handleSignInSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Registration Email ID *</label>
                    <Input
                      required
                      type="email"
                      placeholder="Enter your registered email"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      className="rounded-2xl text-xs py-2.5 font-semibold text-foreground bg-background"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-foreground">Password *</label>
                      <button
                        type="button"
                        onClick={() => setSignInMode('forgot')}
                        className="text-xs font-bold text-primary hover:underline"
                      >
                        Forgot Password?
                      </button>
                    </div>

                    <div className="relative">
                      <Input
                        required
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        className="rounded-2xl text-xs py-2.5 pr-10 font-semibold text-foreground bg-background"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 hover:text-indigo-200 transition-all z-20 cursor-pointer flex items-center justify-center"
                        title={showPassword ? 'Hide Password' : 'Show Password'}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4 shrink-0" /> : <Eye className="h-4 w-4 shrink-0" />}
                      </button>
                    </div>
                  </div>

                  {signInError && (
                    <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-start gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-400" />
                      <span>{signInError}</span>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={signingIn}
                    className="w-full rounded-2xl font-extrabold py-3 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md text-xs sm:text-sm mt-2"
                  >
                    {signingIn ? 'Signing In...' : 'Sign In to Student Portal'}
                  </Button>

                  <div className="pt-3 text-center border-t border-muted">
                    <p className="text-xs text-muted-foreground">
                      Don't have an account yet?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setIsSignInModalOpen(false);
                          handleStartJourney();
                        }}
                        className="font-extrabold text-primary hover:underline ml-1"
                      >
                        Register Now
                      </button>
                    </p>
                  </div>
                </form>
              </div>
            ) : (
              /* Forgot Password View */
              <div className="space-y-6">
                <div className="text-center space-y-1.5">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-600 shadow-lg mx-auto">
                    <KeyRound className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-foreground">Recover Password</h3>
                  <p className="text-xs text-muted-foreground">
                    Enter your registered email ID to receive password recovery instructions
                  </p>
                </div>

                {forgotSubmitted ? (
                  <div className="text-center space-y-4 py-4">
                    <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-semibold">
                      Password recovery instructions have been sent to <strong>{forgotEmail}</strong>.
                    </div>
                    <Button
                      onClick={() => setSignInMode('signin')}
                      className="w-full rounded-2xl font-bold bg-primary text-primary-foreground text-xs"
                    >
                      Return to Sign In
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Registration Email ID *</label>
                      <Input
                        required
                        type="email"
                        placeholder="Enter your registered email address"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="rounded-2xl text-xs py-2.5 font-semibold text-foreground bg-background"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={sendingReset}
                      className="w-full rounded-2xl font-extrabold py-3 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md text-xs sm:text-sm"
                    >
                      {sendingReset ? 'Sending Recovery Email...' : 'Send Password Recovery Email'}
                    </Button>

                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => setSignInMode('signin')}
                        className="text-xs font-bold text-muted-foreground hover:text-foreground"
                      >
                        Back to Sign In
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </header>
  );
};
