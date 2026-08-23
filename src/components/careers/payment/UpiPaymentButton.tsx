import { useState } from 'react';
import { Smartphone, ExternalLink, AlertCircle, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SUPPORTED_UPI_APPS, generateUpiIntentUri, isMobileBrowser } from '@/lib/upi/generateUpiIntent';

type UpiPaymentButtonProps = {
  payeeUpiId: string;
  payeeName: string;
  amount: number;
  transactionRef: string;
  note: string;
  onPaymentInitiated?: () => void;
  disabled?: boolean;
};

export function UpiPaymentButton({
  payeeUpiId,
  payeeName,
  amount,
  transactionRef,
  note,
  onPaymentInitiated,
  disabled = false,
}: UpiPaymentButtonProps) {
  const [appError, setAppError] = useState<string | null>(null);

  const upiUri = generateUpiIntentUri({
    payeeUpiId,
    payeeName,
    amount,
    transactionRef,
    note,
  });

  const handleLaunchApp = (schemeUrl: string) => {
    setAppError(null);
    if (onPaymentInitiated) onPaymentInitiated();

    try {
      window.location.href = schemeUrl;
    } catch (err) {
      console.error('Failed to open UPI app:', err);
      setAppError('Unable to open selected UPI app. Please try "Other UPI Apps" or copy the UPI ID.');
    }
  };

  return (
    <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-indigo-600" />
          Pay securely using UPI
        </h3>
        <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
          ₹{amount.toFixed(2)}
        </span>
      </div>

      {appError ? (
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
          <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
          <span>{appError}</span>
        </div>
      ) : null}

      {/* Grid of Standard UPI Apps */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {SUPPORTED_UPI_APPS.filter((a) => a.id !== 'generic').map((app) => (
          <Button
            key={app.id}
            type="button"
            variant="outline"
            disabled={disabled}
            onClick={() => handleLaunchApp(app.getSchemeUrl(upiUri))}
            className="h-11 rounded-2xl text-xs font-semibold border-slate-200 hover:bg-slate-50 hover:text-slate-900 flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>{app.name}</span>
            <ExternalLink className="h-3 w-3 text-slate-400" />
          </Button>
        ))}
      </div>

      {/* Generic UPI App / Other UPI Apps Button */}
      <Button
        type="button"
        onClick={() => handleLaunchApp(upiUri)}
        disabled={disabled}
        className="h-12 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-md transition-all duration-200 flex items-center justify-center gap-2"
      >
        <Smartphone className="h-4 w-4" />
        Other UPI Apps (Default UPI)
      </Button>
    </div>
  );
}
