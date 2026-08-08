import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { requestAdminPasswordReset, resetAdminPassword, signInAdmin } from './auth';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [mode, setMode] = useState<'login' | 'forgot'>('login');
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setNotice('');

    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    const authenticated = await signInAdmin(email, password);
    if (authenticated) {
      navigate('/admin/dashboard');
      return;
    }

    setError('Invalid email or password.');
  };

  const handleForgotPassword = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setNotice('');

    if (!email) {
      setError('Enter the admin email address.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const canReset = await requestAdminPasswordReset(email);
    if (!canReset) {
      setError('Only the main admin account can reset the password.');
      return;
    }

    const reset = await resetAdminPassword(email, newPassword);
    if (reset) {
      setNotice('Password updated successfully. You can sign in now.');
      setMode('login');
      setPassword(newPassword);
      setNewPassword('');
      setConfirmPassword('');
      return;
    }

    setError('Password reset failed.');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <Card className="w-full max-w-md border-slate-200 shadow-lg">
        <CardHeader className="space-y-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-white">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-2xl">Admin access</CardTitle>
            <CardDescription>Secure sign-in for recruitment operations.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {mode === 'login' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="email">Email</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input id="email" type="email" placeholder="admin@w3solutions.com" value={email} onChange={(event) => setEmail(event.target.value)} className="pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="password">Password</label>
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(event) => setPassword(event.target.value)} />
              </div>
              {error ? <p className="text-sm text-red-600">{error}</p> : null}
              {notice ? <p className="text-sm text-emerald-600">{notice}</p> : null}
              <Button type="submit" className="w-full">Sign in</Button>
              <button type="button" className="text-sm font-medium text-slate-600 underline" onClick={() => { setMode('forgot'); setError(''); setNotice(''); }}>
                Forgot password?
              </button>
            </form>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="resetEmail">Email</label>
                <Input id="resetEmail" type="email" placeholder="admin@w3solutions.com" value={email} onChange={(event) => setEmail(event.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="newPassword">New password</label>
                <Input id="newPassword" type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="confirmPassword">Confirm password</label>
                <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
              </div>
              {error ? <p className="text-sm text-red-600">{error}</p> : null}
              {notice ? <p className="text-sm text-emerald-600">{notice}</p> : null}
              <Button type="submit" className="w-full">Reset password</Button>
              <button type="button" className="text-sm font-medium text-slate-600 underline" onClick={() => { setMode('login'); setError(''); setNotice(''); }}>
                Back to sign in
              </button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
