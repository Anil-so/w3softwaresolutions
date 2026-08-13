import { useState } from 'react';
import { ArrowLeft, BadgeCheck, ShieldCheck, Sparkles, AlertCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Link } from 'react-router-dom';

type RegistrationPaymentProps = {
  onPay: () => void;
  onBack: () => void;
  isLoading?: boolean;
  errorMessage?: string;
};

export function RegistrationPayment({ onPay, onBack, isLoading = false, errorMessage }: RegistrationPaymentProps) {
  const [declarationChecked, setDeclarationChecked] = useState(false);

  return (
    <Card className="border-slate-200 bg-white/90 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.35)]">
      <CardHeader className="space-y-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <CardTitle className="text-2xl font-semibold text-slate-900">Application Processing Fee</CardTitle>
          <CardDescription className="mt-2 text-sm text-slate-600">
            W3 Software Solutions • Candidate Verification Payment
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {errorMessage ? (
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <div className="flex-1">{errorMessage}</div>
          </div>
        ) : null}

        {/* Fee Box */}
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-slate-500">Application Processing Fee</p>
          <p className="mt-3 text-5xl font-semibold text-slate-900">₹49</p>
          <p className="mt-2 text-sm text-slate-600">One-time application processing and candidate verification fee.</p>
        </div>

        {/* Payment Summary */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm space-y-2">
          <p className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-2">Payment Summary</p>
          <div className="flex justify-between text-slate-600">
            <span>Application Processing Fee</span>
            <span className="font-medium text-slate-900">₹49</span>
          </div>
          <div className="border-t border-slate-100 pt-2 flex justify-between font-semibold text-slate-900">
            <span>Total Payable</span>
            <span>₹49</span>
          </div>
        </div>

        {/* Why is there a fee section */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm space-y-3">
          <div className="flex items-center gap-2 font-semibold text-slate-900">
            <Info className="h-4 w-4 text-slate-700" />
            <span>Why is there a fee?</span>
          </div>
          <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">
            This one-time fee covers application processing, candidate verification and administrative costs associated with reviewing your application.
          </p>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">
            <strong>Important:</strong> Payment of this fee does not guarantee an interview, selection, employment, salary or job offer. Candidates are evaluated based on their qualifications, skills and role requirements.
          </div>
        </div>

        {/* Feature List */}
        <div className="grid gap-2.5 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-slate-900" />
            <span>Application verification & processing</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-slate-900" />
            <span>Official candidate reference number</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-slate-900" />
            <span>Applicant dashboard access</span>
          </div>
        </div>

        {/* Declaration Checkbox */}
        <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <Checkbox
            id="fee-declaration"
            checked={declarationChecked}
            onCheckedChange={(checked) => setDeclarationChecked(Boolean(checked))}
            className="mt-0.5"
          />
          <label htmlFor="fee-declaration" className="text-xs sm:text-sm leading-5 text-slate-700 cursor-pointer select-none">
            I understand that the ₹49 fee is for application processing and candidate verification and does not guarantee interview, selection or employment.
          </label>
        </div>

        {/* Pay Button */}
        <Button
          onClick={onPay}
          className="h-12 w-full rounded-2xl text-base font-semibold"
          disabled={isLoading || !declarationChecked}
        >
          {isLoading ? 'Opening Razorpay...' : 'Pay Now — ₹49'}
        </Button>

        {/* Policy Links */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-1">
          <Link to="/privacy-policy" target="_blank" className="hover:text-slate-900 underline">Privacy Policy</Link>
          <span>•</span>
          <Link to="/terms-of-service" target="_blank" className="hover:text-slate-900 underline">Terms of Service</Link>
          <span>•</span>
          <Link to="/refund-policy" target="_blank" className="hover:text-slate-900 underline">Refund & Cancellation Policy</Link>
        </div>

        <Button variant="ghost" onClick={onBack} className="h-11 w-full rounded-2xl text-slate-600" disabled={isLoading}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </CardContent>
    </Card>
  );
}
