import { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShieldCheck, Mail, ArrowLeft, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

export type CandidateOtpModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialEmail?: string;
  onSendOtp: (email: string) => Promise<void>;
  onVerifyOtp: (email: string, otp: string) => Promise<void>;
  isLoading?: boolean;
  externalError?: string;
};

export function CandidateOtpModal({
  open,
  onOpenChange,
  initialEmail = '',
  onSendOtp,
  onVerifyOtp,
  isLoading = false,
  externalError = '',
}: CandidateOtpModalProps) {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState(initialEmail);
  const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(''));
  const [localError, setLocalError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (open) {
      setLocalError('');
      setSuccessMessage('');
      if (initialEmail) {
        setEmail(initialEmail);
      }
    }
  }, [open, initialEmail]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const validateEmail = (val: string) => {
    return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(val.trim());
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    setSuccessMessage('');

    if (!email.trim()) {
      setLocalError('Please enter your email address.');
      return;
    }
    if (!validateEmail(email)) {
      setLocalError('Please enter a valid email address.');
      return;
    }

    try {
      await onSendOtp(email.trim().toLowerCase());
      setStep('otp');
      setResendCooldown(60);
      setSuccessMessage(`We've sent a 6-digit verification code to ${email.trim().toLowerCase()}`);
      setTimeout(() => {
        otpInputsRef.current[0]?.focus();
      }, 100);
    } catch (err: any) {
      setLocalError(err.message || 'Unable to send the verification code. Please try again.');
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    const newOtp = [...otpValues];

    if (cleanValue.length > 1) {
      // Handle pasted code
      const pasted = cleanValue.slice(0, 6).split('');
      pasted.forEach((char, i) => {
        newOtp[i] = char;
      });
      setOtpValues(newOtp);
      const nextIndex = Math.min(pasted.length, 5);
      otpInputsRef.current[nextIndex]?.focus();
      return;
    }

    newOtp[index] = cleanValue;
    setOtpValues(newOtp);

    if (cleanValue && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    setSuccessMessage('');

    const otpCode = otpValues.join('');
    if (otpCode.length < 6) {
      setLocalError('Please enter the complete 6-digit verification code.');
      return;
    }

    try {
      await onVerifyOtp(email.trim().toLowerCase(), otpCode);
      onOpenChange(false);
      setStep('email');
      setOtpValues(Array(6).fill(''));
    } catch (err: any) {
      setLocalError(err.message || 'Invalid verification code. Please check your email and try again.');
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0 || isLoading) return;
    setLocalError('');
    setSuccessMessage('');

    try {
      await onSendOtp(email.trim().toLowerCase());
      setResendCooldown(60);
      setSuccessMessage('A fresh 6-digit verification code has been sent to your email.');
    } catch (err: any) {
      setLocalError(err.message || 'Unable to resend verification code.');
    }
  };

  const handleBackToEmail = () => {
    setLocalError('');
    setSuccessMessage('');
    setOtpValues(Array(6).fill(''));
    setStep('email');
  };

  const activeError = localError || externalError;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-slate-200 bg-white p-6 sm:p-8 shadow-xl rounded-3xl">
        <DialogHeader className="space-y-3 text-left">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
            <ShieldCheck className="h-5 w-5" />
          </div>

          <div>
            <DialogTitle className="text-2xl font-semibold text-slate-900">
              {step === 'email' ? 'Start your application' : 'Verify your email'}
            </DialogTitle>
            <DialogDescription className="mt-1 text-sm text-slate-600">
              {step === 'email'
                ? 'Enter your email to securely continue with your job application.'
                : "We've sent a 6-digit verification code to your email address."}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="mt-4 space-y-4">
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

          {/* STEP 1: EMAIL STEP */}
          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-4" noValidate>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700" htmlFor="otp-email-input">
                  Email address
                </label>
                <div className="relative">
                  <Input
                    id="otp-email-input"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 min-h-[44px] rounded-2xl border-slate-200 bg-slate-50 pl-10 text-slate-900"
                    autoComplete="email"
                    disabled={isLoading}
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                </div>
              </div>

              <Button
                type="submit"
                className="h-12 min-h-[44px] w-full rounded-2xl font-semibold shadow-sm"
                disabled={isLoading}
              >
                {isLoading ? 'Sending Code...' : 'Continue'}
              </Button>
            </form>
          )}

          {/* STEP 2: VERIFY OTP STEP */}
          {step === 'otp' && (
            <form onSubmit={handleVerifySubmit} className="space-y-5" noValidate>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Verification code
                </label>
                <div className="flex justify-between gap-2">
                  {otpValues.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => (otpInputsRef.current[idx] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className="h-12 w-12 min-h-[44px] min-w-[44px] rounded-2xl border border-slate-200 bg-slate-50 text-center text-lg font-bold text-slate-900 transition-all focus:border-slate-900 focus:bg-white focus:outline-none shadow-sm"
                      disabled={isLoading}
                    />
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                className="h-12 min-h-[44px] w-full rounded-2xl font-semibold shadow-sm"
                disabled={isLoading || otpValues.join('').length < 6}
              >
                {isLoading ? 'Verifying...' : 'Verify & Continue'}
              </Button>

              <div className="flex items-center justify-between pt-1 text-xs">
                <button
                  type="button"
                  onClick={handleBackToEmail}
                  className="flex items-center gap-1 font-semibold text-slate-600 hover:text-slate-900"
                  disabled={isLoading}
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Change email
                </button>

                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={resendCooldown > 0 || isLoading}
                  className={`flex items-center gap-1 font-semibold ${
                    resendCooldown > 0 ? 'text-slate-400 cursor-not-allowed' : 'text-slate-900 hover:underline'
                  }`}
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
                </button>
              </div>
            </form>
          )}

          <p className="text-center text-xs leading-5 text-slate-500 pt-2">
            By continuing you agree to our{' '}
            <span className="font-medium text-slate-700">Privacy Policy</span> and{' '}
            <span className="font-medium text-slate-700">Terms of Service</span>.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
