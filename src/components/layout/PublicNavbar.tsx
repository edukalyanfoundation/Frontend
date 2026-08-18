import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  ChevronRight,
  User,
  LogOut,
  Shield,
  LogIn,
  Eye,
  EyeOff,
  KeyRound,
  AlertCircle,
  CheckCircle2,
  Circle,
  Lock,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/stores/authStore';
import { useNotificationStore } from '@/stores/notificationStore';
import { ugcRegistrationService } from '@/services/ugcRegistrationService';
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

  // Instant Forgot Password / Recovery States
  const [forgotStep, setForgotStep] = useState<'verify' | 'new_password' | 'success'>('verify');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotVerificationField, setForgotVerificationField] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotShowNewPassword, setForgotShowNewPassword] = useState(false);
  const [forgotCandidateName, setForgotCandidateName] = useState('');
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [forgotSubmitting, setForgotSubmitting] = useState(false);

  const [signInError, setSignInError] = useState<string | null>(null);

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

  // Live Password Criteria & Strength Evaluation for New Password
  const newPasswordCriteria = useMemo(() => {
    const pwd = forgotNewPassword || '';
    return {
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd),
    };
  }, [forgotNewPassword]);

  const isNewPasswordValid = useMemo(() => {
    return (
      newPasswordCriteria.length &&
      newPasswordCriteria.uppercase &&
      newPasswordCriteria.lowercase &&
      newPasswordCriteria.number &&
      newPasswordCriteria.special
    );
  }, [newPasswordCriteria]);

  const newPasswordMetCount = useMemo(() => {
    return Object.values(newPasswordCriteria).filter(Boolean).length;
  }, [newPasswordCriteria]);

  const handleVerifyIdentitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim() || !forgotVerificationField.trim()) {
      setForgotError('Please enter both your registered email and mobile/roll number.');
      return;
    }

    setForgotSubmitting(true);
    setForgotError(null);

    try {
      const res = await ugcRegistrationService.verifyStudentIdentityAndResetPassword(
        forgotEmail,
        forgotVerificationField,
        'dummy_check_temp'
      );

      if (!res.success && res.message.includes('Security Verification Failed')) {
        setForgotError(res.message);
        return;
      }
      if (!res.success && res.message.includes('No student registration record')) {
        setForgotError(res.message);
        return;
      }

      setForgotCandidateName(res.candidateName || 'Student');
      setForgotStep('new_password');
      setForgotError(null);
      addToast({
        type: 'success',
        title: 'Identity Verified',
        message: 'Security credentials verified! Please enter your new password.',
      });
    } catch (err: any) {
      setForgotError(err.message || 'Identity verification failed.');
    } finally {
      setForgotSubmitting(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isNewPasswordValid) {
      setForgotError('Please satisfy all 5 password security instructions before updating.');
      return;
    }

    setForgotSubmitting(true);
    setForgotError(null);

    try {
      const res = await ugcRegistrationService.verifyStudentIdentityAndResetPassword(
        forgotEmail,
        forgotVerificationField,
        forgotNewPassword
      );

      if (res.success) {
        setForgotStep('success');
        addToast({
          type: 'success',
          title: 'Password Updated Successfully',
          message: 'Your new password is now active. You can now sign in.',
        });
      } else {
        setForgotError(res.message);
      }
    } catch (err: any) {
      setForgotError(err.message || 'Failed to update password.');
    } finally {
      setForgotSubmitting(false);
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
              className="rounded-full font-extrabold px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all text-xs gap-1.5 border-0 cursor-pointer"
              onClick={() => {
                setSignInMode('signin');
                setForgotStep('verify');
                setForgotError(null);
                setIsSignInModalOpen(true);
              }}
            >
              <LogIn className="h-4 w-4" /> Sign In
            </Button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="flex lg:hidden p-2 rounded-full border border-slate-700 bg-slate-800/80 text-white cursor-pointer" onClick={() => setIsMenuOpen(!isMenuOpen)}>
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
                  className="w-full rounded-2xl font-bold border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs cursor-pointer"
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
                className="w-full rounded-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs py-2.5 border-0 shadow-lg shadow-indigo-500/20 cursor-pointer"
                onClick={() => {
                  setIsMenuOpen(false);
                  setSignInMode('signin');
                  setForgotStep('verify');
                  setForgotError(null);
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
                        onClick={() => {
                          setSignInMode('forgot');
                          setForgotStep('verify');
                          setForgotError(null);
                          if (signInEmail) setForgotEmail(signInEmail);
                        }}
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
                        className="font-extrabold text-primary hover:underline ml-1 cursor-pointer"
                      >
                        Register Now
                      </button>
                    </p>
                  </div>
                </form>
              </div>
            ) : (
              /* Instant Identity Verification & Password Recovery View */
              <div className="space-y-6">
                {forgotStep === 'verify' && (
                  <>
                    <div className="text-center space-y-1.5">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-500 shadow-lg mx-auto">
                        <KeyRound className="h-6 w-6" />
                      </div>
                      <h3 className="text-2xl font-extrabold text-foreground">Recover Password</h3>
                      <p className="text-xs text-muted-foreground">
                        Step 1 of 2: Verify your registered student identity to instantly reset your password
                      </p>
                    </div>

                    {forgotError && (
                      <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-start gap-2 animate-in fade-in duration-200">
                        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                        <span>{forgotError}</span>
                      </div>
                    )}

                    <form onSubmit={handleVerifyIdentitySubmit} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">Registered Email ID *</label>
                        <Input
                          required
                          type="email"
                          placeholder="e.g. praveerkishore45@gmail.com"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          className="rounded-2xl text-xs py-2.5 font-semibold text-foreground bg-background"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">
                          Registered Mobile Number OR University Roll Number *
                        </label>
                        <Input
                          required
                          type="text"
                          placeholder="Enter your registered mobile or roll number"
                          value={forgotVerificationField}
                          onChange={(e) => setForgotVerificationField(e.target.value)}
                          className="rounded-2xl text-xs py-2.5 font-semibold text-foreground bg-background"
                        />
                        <p className="text-[10px] text-muted-foreground">
                          Matches the details provided during your student registration
                        </p>
                      </div>

                      <Button
                        type="submit"
                        disabled={forgotSubmitting}
                        className="w-full rounded-2xl font-extrabold py-3 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md text-xs sm:text-sm cursor-pointer"
                      >
                        {forgotSubmitting ? 'Verifying Identity...' : 'Verify Student Identity →'}
                      </Button>

                      <div className="text-center pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSignInMode('signin');
                            setForgotError(null);
                          }}
                          className="text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          ← Return to Sign In
                        </button>
                      </div>
                    </form>
                  </>
                )}

                {forgotStep === 'new_password' && (
                  <>
                    <div className="text-center space-y-1.5">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 shadow-lg mx-auto">
                        <ShieldCheck className="h-6 w-6" />
                      </div>
                      <h3 className="text-2xl font-extrabold text-foreground">Set New Password</h3>
                      <p className="text-xs text-muted-foreground">
                        Step 2 of 2: Identity verified for <strong className="text-foreground">{forgotCandidateName}</strong>. Enter your new password below.
                      </p>
                    </div>

                    {forgotError && (
                      <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-start gap-2 animate-in fade-in duration-200">
                        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                        <span>{forgotError}</span>
                      </div>
                    )}

                    <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                      <div className="space-y-3 p-4 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-md shadow-lg">
                        <div className="flex items-center justify-between">
                          <label className="font-bold text-foreground flex items-center gap-1.5 text-xs">
                            <Lock className="h-3.5 w-3.5 text-indigo-400" /> New Account Password *
                          </label>
                          {newPasswordMetCount > 0 && (
                            <span
                              className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                                newPasswordMetCount === 5
                                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                  : newPasswordMetCount >= 3
                                  ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                                  : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                              }`}
                            >
                              {newPasswordMetCount === 5 ? '🟢 Strong' : newPasswordMetCount >= 3 ? '🟡 Medium' : '🔴 Weak'} ({newPasswordMetCount}/5)
                            </span>
                          )}
                        </div>

                        <div className="relative">
                          <Input
                            required
                            type={forgotShowNewPassword ? 'text' : 'password'}
                            placeholder="Create a strong password..."
                            value={forgotNewPassword}
                            onChange={(e) => setForgotNewPassword(e.target.value)}
                            className="rounded-2xl text-xs py-2.5 pr-10 font-semibold text-foreground bg-background"
                          />
                          <button
                            type="button"
                            onClick={() => setForgotShowNewPassword(!forgotShowNewPassword)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 hover:text-indigo-200 transition-all z-20 cursor-pointer flex items-center justify-center"
                            title={forgotShowNewPassword ? 'Hide Password' : 'Show Password'}
                          >
                            {forgotShowNewPassword ? <EyeOff className="h-4 w-4 shrink-0" /> : <Eye className="h-4 w-4 shrink-0" />}
                          </button>
                        </div>

                        {/* Password Requirements */}
                        <div className="pt-2 space-y-1.5 border-t border-slate-800 text-[11px]">
                          <div className={`flex items-center gap-1.5 ${newPasswordCriteria.length ? 'text-emerald-400 line-through opacity-80' : 'text-slate-400'}`}>
                            {newPasswordCriteria.length ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> : <Circle className="h-3.5 w-3.5 shrink-0" />}
                            <span>At least 8 characters</span>
                          </div>
                          <div className={`flex items-center gap-1.5 ${newPasswordCriteria.uppercase ? 'text-emerald-400 line-through opacity-80' : 'text-slate-400'}`}>
                            {newPasswordCriteria.uppercase ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> : <Circle className="h-3.5 w-3.5 shrink-0" />}
                            <span>Contains uppercase letter (A-Z)</span>
                          </div>
                          <div className={`flex items-center gap-1.5 ${newPasswordCriteria.lowercase ? 'text-emerald-400 line-through opacity-80' : 'text-slate-400'}`}>
                            {newPasswordCriteria.lowercase ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> : <Circle className="h-3.5 w-3.5 shrink-0" />}
                            <span>Contains lowercase letter (a-z)</span>
                          </div>
                          <div className={`flex items-center gap-1.5 ${newPasswordCriteria.number ? 'text-emerald-400 line-through opacity-80' : 'text-slate-400'}`}>
                            {newPasswordCriteria.number ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> : <Circle className="h-3.5 w-3.5 shrink-0" />}
                            <span>Contains number (0-9)</span>
                          </div>
                          <div className={`flex items-center gap-1.5 ${newPasswordCriteria.special ? 'text-emerald-400 line-through opacity-80' : 'text-slate-400'}`}>
                            {newPasswordCriteria.special ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> : <Circle className="h-3.5 w-3.5 shrink-0" />}
                            <span>Contains special character (!@#$%^&*...)</span>
                          </div>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={forgotSubmitting}
                        className="w-full rounded-2xl font-extrabold py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 shadow-md text-xs sm:text-sm cursor-pointer"
                      >
                        {forgotSubmitting ? 'Updating Password...' : 'Save & Update Password'}
                      </Button>

                      <div className="text-center pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setForgotStep('verify');
                            setForgotError(null);
                          }}
                          className="text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          ← Back to Verification
                        </button>
                      </div>
                    </form>
                  </>
                )}

                {forgotStep === 'success' && (
                  <div className="text-center space-y-4 py-4 animate-in fade-in duration-300">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border-2 border-emerald-400/40 shadow-xl shadow-emerald-500/20 mx-auto">
                      <CheckCircle2 className="h-9 w-9" />
                    </div>

                    <h4 className="text-xl font-extrabold text-foreground">Password Reset Successfully!</h4>

                    <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                      Your account password for <strong>{forgotEmail}</strong> has been securely updated. You can now sign in immediately with your new password.
                    </p>

                    <Button
                      onClick={() => {
                        setSignInMode('signin');
                        setSignInEmail(forgotEmail);
                        setSignInPassword('');
                        setForgotStep('verify');
                        setForgotError(null);
                        setSignInError(null);
                      }}
                      className="w-full rounded-2xl font-extrabold py-3 bg-primary text-primary-foreground text-xs sm:text-sm shadow-md cursor-pointer"
                    >
                      Sign In with New Password →
                    </Button>
                  </div>
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
