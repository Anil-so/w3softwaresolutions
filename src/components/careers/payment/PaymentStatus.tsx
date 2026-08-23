import { Clock, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

type PaymentStatusProps = {
  status: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED' | string;
  transactionRef?: string;
  message?: string;
  onCheckStatus?: () => void;
  onContinue?: () => void;
  isChecking?: boolean;
};

export function PaymentStatus({
  status,
  transactionRef,
  message,
  onCheckStatus,
  onContinue,
  isChecking = false,
}: PaymentStatusProps) {
  const isPaid = status === 'PAID' || status === 'paid' || status === 'captured';
  const isFailed = status === 'FAILED' || status === 'failed' || status === 'CANCELLED';

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5 text-center">
      {isPaid ? (
        <div className="space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Payment Verified</h3>
            <p className="mt-1 text-sm text-slate-600">
              Your application fee payment has been confirmed and verified on server.
            </p>
          </div>
          {transactionRef && (
            <div className="inline-block rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-mono text-slate-700">
              Ref ID: {transactionRef}
            </div>
          )}
          {onContinue && (
            <Button onClick={onContinue} className="w-full rounded-2xl h-12 text-base font-semibold">
              Go to Candidate Dashboard
            </Button>
          )}
        </div>
      ) : isFailed ? (
        <div className="space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Payment Unsuccessful</h3>
            <p className="mt-1 text-sm text-slate-600">
              {message || 'Payment attempt failed or was cancelled. Please try again.'}
            </p>
          </div>
          {onCheckStatus && (
            <Button onClick={onCheckStatus} disabled={isChecking} variant="outline" className="w-full rounded-2xl h-11">
              {isChecking ? 'Checking...' : 'Try Again'}
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-600 animate-pulse">
            <Clock className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Payment Verification Pending</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
              Once you complete the transfer in your UPI app, please click <strong className="text-slate-900">Check Payment Status</strong> below.
            </p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-xs text-amber-900 text-left space-y-1">
            <strong className="block font-semibold">Status Notice:</strong>
            <p className="leading-normal text-amber-800">
              Payment verification pending. Your registration will be confirmed after payment verification.
            </p>
          </div>

          {transactionRef && (
            <div className="inline-block rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-mono text-slate-700">
              Order Ref: {transactionRef}
            </div>
          )}

          {onCheckStatus && (
            <Button
              onClick={onCheckStatus}
              disabled={isChecking}
              className="w-full rounded-2xl h-12 text-base font-semibold flex items-center justify-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />
              {isChecking ? 'Checking Server Status...' : 'Check Payment Status'}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
