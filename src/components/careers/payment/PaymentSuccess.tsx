import { Download, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type PaymentSuccessProps = {
  referenceNumber: string;
  onGoToDashboard: () => void;
};

export function PaymentSuccess({ referenceNumber, onGoToDashboard }: PaymentSuccessProps) {
  return (
    <Card className="border-slate-200 bg-white/90 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.35)]">
      <CardHeader className="space-y-3 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <Sparkles className="h-7 w-7" />
        </div>
        <div>
          <CardTitle className="text-2xl font-semibold text-slate-900">Payment Successful</CardTitle>
          <CardDescription className="mt-2 text-sm text-slate-600">
            Your application processing payment has been received. Your application will be reviewed according to the role requirements.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-emerald-700">Candidate Reference Number</p>
          <p className="mt-3 text-2xl font-semibold text-slate-900">{referenceNumber}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 leading-relaxed">
          Your application is now under review. Candidates are evaluated based on qualifications, experience, and role suitability.
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button variant="outline" onClick={onGoToDashboard} className="h-12 w-full rounded-2xl">
            Go to Candidate Dashboard
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
