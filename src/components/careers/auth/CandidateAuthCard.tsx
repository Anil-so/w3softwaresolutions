import { useState } from 'react';
import { ShieldCheck, Eye, EyeOff, KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export type AuthMode = 'signin' | 'signup' | 'forgot' | 'reset-password';

export type CandidateAuthCardProps = {
  initialMode?: AuthMode;
  initialEmail?: string;
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (fullName: string, email: string, password: string) => Promise<void>;
  onForgotPassword: (email: string) => Promise<void>;
  onResetPassword: (newPassword: string) => Promise<void>;
  isLoading?: boolean;
  externalError?: string;
};

export function CandidateAuthCard({
  initialMode = 'signin',
  initialEmail = '',
  onSignIn,
  onSignUp,
  onForgotPassword,
  onResetPassword,
  isLoading = false,
  externalError = '',
}: CandidateAuthCardProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);

  // Form states
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Local feedback / messaging
  const [localError, setLocalError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const clearMessages = () => {
    setLocalError('');
    setSuccessMessage('');
  };

  const handleModeSwitch = (newMode: AuthMode) => {
    clearMessages();
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setMode(newMode);
  };

  const validateEmail = (val: string) => {
    return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(val.trim());
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!email.trim()) {
      setLocalError('Please enter your email address.');
      return;
    }
    if (!validateEmail(email)) {
      setLocalError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setLocalError('Please enter your password.');
      return;
    }

    try {
      await onSignIn(email.trim().toLowerCase(), password);
    } catch (err: any) {
      setLocalError(err.message || 'Failed to sign in.');
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!fullName.trim()) {
      setLocalError('Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      setLocalError('Please enter your email address.');
      return;
    }
    if (!validateEmail(email)) {
      setLocalError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setLocalError('Please enter a password.');
      return;
    }
    if (password.length < 8) {
      setLocalError('Password must contain at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }

    try {
      await onSignUp(fullName.trim(), email.trim().toLowerCase(), password);
    } catch (err: any) {
      setLocalError(err.message || 'Failed to create candidate account.');
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!email.trim()) {
      setLocalError('Please enter your email address.');
      return;
    }
    if (!validateEmail(email)) {
      setLocalError('Please enter a valid email address.');
      return;
    }

    try {
      await onForgotPassword(email.trim().toLowerCase());
      setSuccessMessage('Check your email for a password reset link.');
    } catch (err: any) {
      setLocalError(err.message || 'Failed to send password reset email.');
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!password) {
      setLocalError('Please enter a new password.');
      return;
    }
    if (password.length < 8) {
      setLocalError('Password must contain at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }

    try {
      await onResetPassword(password);
      setSuccessMessage('Your password has been updated. You can now sign in with your new password.');
      setTimeout(() => {
        handleModeSwitch('signin');
      }, 2500);
    } catch (err: any) {
      setLocalError(err.message || 'Failed to update password.');
    }
  };

  const activeError = localError || externalError;

  return (
    <Card className="border-slate-200 bg-white/95 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.35)] transition-all">
      <CardHeader className="space-y-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
          {mode === 'forgot' || mode === 'reset-password' ? (
            <KeyRound className="h-5 w-5" />
          ) : (
            <ShieldCheck className="h-5 w-5" />
          )}
        </div>
        <div>
          <CardTitle className="text-2xl font-semibold text-slate-900">
            {mode === 'forgot'
              ? 'Reset your password'
              : mode === 'reset-password'
              ? 'Set new password'
              : 'Continue your application'}
          </CardTitle>
          <CardDescription className="mt-2 text-sm text-slate-600">
            {mode === 'forgot'
              ? 'Enter your account email to receive a password reset link.'
              : mode === 'reset-password'
              ? 'Enter a new password for your candidate account.'
              : 'Sign in to continue your application, or create a candidate account to get started.'}
          </CardDescription>
        </div>

        {/* Tab Selection for Sign In / Create Account */}
        {(mode === 'signin' || mode === 'signup') && (
          <div className="mt-4 flex rounded-2xl border border-slate-200 bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => handleModeSwitch('signin')}
              className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all ${
                mode === 'signin'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => handleModeSwitch('signup')}
              className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all ${
                mode === 'signup'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Create Account
            </button>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-5">
        {activeError ? (
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <div className="flex-1">{activeError}</div>
          </div>
        ) : null}

        {successMessage ? (
          <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5 text-sm text-emerald-800">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            <div className="flex-1 font-medium">{successMessage}</div>
          </div>
        ) : null}

        {/* SIGN IN FORM */}
        {mode === 'signin' && (
          <form onSubmit={handleSignInSubmit} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700" htmlFor="signin-email">
                Email address
              </label>
              <Input
                id="signin-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-2xl border-slate-200 bg-slate-50 text-slate-900"
                autoComplete="email"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700" htmlFor="signin-password">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => handleModeSwitch('forgot')}
                  className="text-xs font-semibold text-slate-900 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="signin-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-2xl border-slate-200 bg-slate-50 pr-11 text-slate-900"
                  autoComplete="current-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="h-12 w-full rounded-2xl font-semibold shadow-sm"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>

            <div className="pt-2 text-center text-xs text-slate-600">
              New candidate?{' '}
              <button
                type="button"
                onClick={() => handleModeSwitch('signup')}
                className="font-semibold text-slate-900 underline hover:text-slate-700"
              >
                Create a candidate account
              </button>
            </div>
          </form>
        )}

        {/* CREATE ACCOUNT FORM */}
        {mode === 'signup' && (
          <form onSubmit={handleSignUpSubmit} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700" htmlFor="signup-fullname">
                Full name
              </label>
              <Input
                id="signup-fullname"
                type="text"
                placeholder="Jane Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-12 rounded-2xl border-slate-200 bg-slate-50 text-slate-900"
                autoComplete="name"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700" htmlFor="signup-email">
                Email address
              </label>
              <Input
                id="signup-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-2xl border-slate-200 bg-slate-50 text-slate-900"
                autoComplete="email"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700" htmlFor="signup-password">
                Password
              </label>
              <div className="relative">
                <Input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-2xl border-slate-200 bg-slate-50 pr-11 text-slate-900"
                  autoComplete="new-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <p className="text-xs text-slate-500">Use at least 8 characters.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700" htmlFor="signup-confirmpassword">
                Confirm password
              </label>
              <div className="relative">
                <Input
                  id="signup-confirmpassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-12 rounded-2xl border-slate-200 bg-slate-50 pr-11 text-slate-900"
                  autoComplete="new-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label="Toggle confirm password visibility"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="h-12 w-full rounded-2xl font-semibold shadow-sm"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Candidate Account'}
            </Button>

            <div className="pt-2 text-center text-xs text-slate-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => handleModeSwitch('signin')}
                className="font-semibold text-slate-900 underline hover:text-slate-700"
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {/* FORGOT PASSWORD FORM */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700" htmlFor="forgot-email">
                Email address
              </label>
              <Input
                id="forgot-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-2xl border-slate-200 bg-slate-50 text-slate-900"
                autoComplete="email"
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="h-12 w-full rounded-2xl font-semibold shadow-sm"
              disabled={isLoading}
            >
              {isLoading ? 'Sending Link...' : 'Send Reset Link'}
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={() => handleModeSwitch('signin')}
              className="h-11 w-full rounded-2xl text-slate-600"
              disabled={isLoading}
            >
              Back to Sign In
            </Button>
          </form>
        )}

        {/* RESET PASSWORD FORM */}
        {mode === 'reset-password' && (
          <form onSubmit={handleResetSubmit} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700" htmlFor="reset-password">
                New password
              </label>
              <div className="relative">
                <Input
                  id="reset-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-2xl border-slate-200 bg-slate-50 pr-11 text-slate-900"
                  autoComplete="new-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <p className="text-xs text-slate-500">Use at least 8 characters.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700" htmlFor="reset-confirmpassword">
                Confirm new password
              </label>
              <div className="relative">
                <Input
                  id="reset-confirmpassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-12 rounded-2xl border-slate-200 bg-slate-50 pr-11 text-slate-900"
                  autoComplete="new-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label="Toggle confirm password visibility"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="h-12 w-full rounded-2xl font-semibold shadow-sm"
              disabled={isLoading}
            >
              {isLoading ? 'Updating Password...' : 'Update Password'}
            </Button>
          </form>
        )}

        <p className="text-center text-xs leading-5 text-slate-500">
          By continuing you agree to our{' '}
          <span className="font-medium text-slate-700">Privacy Policy</span> and{' '}
          <span className="font-medium text-slate-700">Terms of Service</span>.
        </p>
      </CardContent>
    </Card>
  );
}
