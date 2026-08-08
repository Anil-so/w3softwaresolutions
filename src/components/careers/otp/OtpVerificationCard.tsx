import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, RefreshCw, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type OtpVerificationCardProps = {
  email: string;
  onVerify: (otp: string) => void;
  onChangeEmail: () => void;
  onResend: () => void;
};

const otpLength = 6;

export function OtpVerificationCard({ email, onVerify, onChangeEmail, onResend }: OtpVerificationCardProps) {
  const [otp, setOtp] = useState<string[]>(Array(otpLength).fill(''));
  const [secondsLeft, setSecondsLeft] = useState(60);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = window.setInterval(() => setSecondsLeft((prev) => prev - 1), 1000);
    return () => window.clearInterval(timer);
  }, [secondsLeft]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (value: string, index: number) => {
    if (!/\d?/.test(value)) return;
    const nextOtp = [...otp];
    nextOtp[index] = value;
    setOtp(nextOtp);

    if (value && index < otpLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === 'Backspace' && !otp[index] && index > 0) {
      const nextOtp = [...otp];
      nextOtp[index - 1] = '';
      setOtp(nextOtp);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, otpLength);
    if (!pasted) return;

    const nextOtp = Array(otpLength).fill('');
    pasted.split('').forEach((digit, index) => {
      nextOtp[index] = digit;
    });

    setOtp(nextOtp);
  };

  const handleVerify = () => {
    const code = otp.join('');
    if (code.length === otpLength) {
      onVerify(code);
    }
  };

  return (
    <Card className="border-slate-200 bg-white/90 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.35)]">
      <CardHeader className="space-y-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <CardTitle className="text-2xl font-semibold text-slate-900">Verify your email</CardTitle>
          <CardDescription className="mt-2 text-sm text-slate-600">
            Enter the 6-digit verification code sent to {email}.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(element) => {
                inputRefs.current[index] = element;
              }}
              value={digit}
              onChange={(event) => handleChange(event.target.value, index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              onPaste={handlePaste}
              maxLength={1}
              className="h-12 w-11 rounded-2xl border border-slate-200 bg-slate-50 text-center text-lg font-semibold text-slate-900 outline-none ring-0 focus:border-slate-900"
            />
          ))}
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
          <div className="flex items-center justify-between">
            <span>Code expires in</span>
            <span className="font-semibold text-slate-900">{secondsLeft}s</span>
          </div>
        </div>
        <Button onClick={handleVerify} className="h-12 w-full rounded-2xl">
          Verify code
        </Button>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Button variant="ghost" onClick={onChangeEmail} className="rounded-2xl text-slate-600">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Change email
          </Button>
          <Button variant="outline" onClick={onResend} disabled={secondsLeft > 0} className="rounded-2xl">
            <RefreshCw className="mr-2 h-4 w-4" />
            {secondsLeft > 0 ? `Resend in ${secondsLeft}s` : 'Resend OTP'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
