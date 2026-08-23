import { useState } from 'react';
import { Smartphone, ExternalLink, AlertCircle, CheckCircle2 } from 'lucide-react';
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
      console.error('Failed to open UPI intent:', err);
      setAppError('Unable to open UPI app automatically. Please use the QR code or copy the UPI ID below.');
    }
  };

  return (
    <div className="space-y-4">
      {appError ? (
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
          <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
          <span>{appError}</span>
        </div>
      ) : null}

      {/* Primary Mobile Launch Button */}
      <Button
        type="button"
        onClick={() => handleLaunchApp(upiUri)}
        disabled={disabled}
        className="h-13 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-base shadow-md transition-all duration-200 flex items-center justify-center gap-2"
      >
        <Smartphone className="h-5 w-5" />
        Pay ₹{amount.toFixed(0)} with UPI
      </Button>

      {/* Specific UPI App Options for Mobile */}
      {isMobileBrowser() && (
        <div className="space-y-2 pt-1">
          <p className="text-xs font-medium text-slate-500 text-center uppercase tracking-wider">
            Or select your preferred app:
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {SUPPORTED_UPI_APPS.filter((a) => a.id !== 'generic').map((app) => (
              <Button
                key={app.id}
                type="button"
                variant="outline"
                disabled={disabled}
                onClick={() => handleLaunchApp(app.getSchemeUrl(upiUri))}
                className="h-10 rounded-xl text-xs font-medium border-slate-200 hover:bg-slate-50 hover:text-slate-900 flex items-center justify-center gap-1.5"
              >
                <span>{app.name}</span>
                <ExternalLink className="h-3 w-3 text-slate-400" />
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
