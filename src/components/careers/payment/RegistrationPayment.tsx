import { ArrowLeft, BadgeCheck, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type RegistrationPaymentProps = {
  onPay: () => void;
  onBack: () => void;
};

export function RegistrationPayment({ onPay, onBack }: RegistrationPaymentProps) {
  return (
    <Card className="border-slate-200 bg-white/90 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.35)]">
      <CardHeader className="space-y-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <CardTitle className="text-2xl font-semibold text-slate-900">Registration fee</CardTitle>
          <CardDescription className="mt-2 text-sm text-slate-600">
            Complete the secured verification payment to proceed.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-slate-500">Registration fee</p>
          <p className="mt-3 text-5xl font-semibold text-slate-900">₹499</p>
          <p className="mt-2 text-sm text-slate-500">Secure one-time payment for processing and verification.</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-center gap-2 text-emerald-700">
            <BadgeCheck className="h-4 w-4" />
            <span className="text-sm font-semibold">Protected & encrypted checkout</span>
          </div>
        </div>
        <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-slate-900" />
            <span>Priority application review</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-slate-900" />
            <span>Receipt and status tracking</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-slate-900" />
            <span>Candidate dashboard access</span>
          </div>
        </div>
        <div className="text-sm leading-6 text-slate-500">
          This fee covers application processing and candidate verification. No payment guarantees employment or interview selection.
        </div>
        <Button onClick={onPay} className="h-12 w-full rounded-2xl">
          Pay with Razorpay
        </Button>
        <Button variant="ghost" onClick={onBack} className="h-11 w-full rounded-2xl text-slate-600">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </CardContent>
    </Card>
  );
}
