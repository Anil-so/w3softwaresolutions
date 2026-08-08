import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type EmailAuthCardProps = {
  email: string;
  onEmailChange: (value: string) => void;
  onContinue: () => void;
  onBack: () => void;
  isLoading?: boolean;
};

export function EmailAuthCard({ email, onEmailChange, onContinue, onBack, isLoading = false }: EmailAuthCardProps) {
  return (
    <Card className="border-slate-200 bg-white/90 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.35)]">
      <CardHeader className="space-y-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <CardTitle className="text-2xl font-semibold text-slate-900">Continue your application</CardTitle>
          <CardDescription className="mt-2 text-sm text-slate-600">
            Use your email to begin the secure verification flow.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="applicant-email">Email address</label>
          <Input
            id="applicant-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            className="h-12 rounded-2xl border-slate-200 bg-slate-50"
          />
        </div>
        <div className="space-y-3">
          <Button onClick={onContinue} className="h-12 w-full rounded-2xl" disabled={isLoading}>
            {isLoading ? 'Preparing...' : 'Continue'}
          </Button>
          <Button variant="ghost" onClick={onBack} className="h-11 w-full rounded-2xl text-slate-600">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to jobs
          </Button>
        </div>
        <p className="text-center text-xs leading-6 text-slate-500">
          By continuing you agree to our{' '}<span className="font-medium text-slate-700">Privacy Policy</span> and{' '}<span className="font-medium text-slate-700">Terms</span>.
        </p>
      </CardContent>
    </Card>
  );
}
