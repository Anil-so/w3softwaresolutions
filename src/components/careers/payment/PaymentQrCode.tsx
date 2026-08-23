import { useState } from 'react';
import { Copy, Check, Building2, Smartphone, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

type PaymentQrCodeProps = {
  payeeUpiId: string;
  payeeName: string;
  amount: number;
  transactionRef: string;
  note: string;
  upiUri: string;
};

export function PaymentQrCode({
  payeeUpiId,
  payeeName,
  amount,
  transactionRef,
  note,
}: PaymentQrCodeProps) {
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyUpiId = async () => {
    try {
      await navigator.clipboard.writeText(payeeUpiId);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2500);
    } catch (err) {
      console.error('Copy UPI failed:', err);
    }
  };

  const handleCopyPageLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (err) {
      console.error('Copy link failed:', err);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-5 space-y-4 text-center">
      {/* Desktop Notice */}
      <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-700">
        <Smartphone className="h-4 w-4 text-indigo-600" />
        <span>UPI payment is available on your mobile device.</span>
      </div>

      <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
        Please launch this page on your smartphone to pay via Google Pay, PhonePe, Paytm or BHIM, or transfer to the UPI ID below.
      </p>

      {/* Payment Details Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3 text-left text-xs text-slate-600 shadow-sm">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <span className="text-slate-500 font-medium">Payee Name</span>
          <span className="font-semibold text-slate-900 flex items-center gap-1">
            <Building2 className="h-3.5 w-3.5 text-slate-500" />
            {payeeName}
          </span>
        </div>

        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <span className="text-slate-500 font-medium">UPI ID</span>
          <div className="flex items-center gap-1.5 font-mono text-slate-900 font-semibold bg-slate-100 px-2 py-1 rounded-md">
            <span>{payeeUpiId}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleCopyUpiId}
              className="h-6 w-6 rounded-md hover:bg-slate-200 text-slate-600"
              title="Copy UPI ID"
            >
              {copiedUpi ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <span className="text-slate-500 font-medium">Amount</span>
          <span className="font-bold text-slate-900 text-sm">₹{amount.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-slate-500 font-medium">Order Ref</span>
          <span className="font-mono text-slate-700">{transactionRef}</span>
        </div>
      </div>

      {/* Desktop Fallback Actions */}
      <div className="flex flex-col sm:flex-row gap-2 pt-1">
        <Button
          type="button"
          variant="outline"
          onClick={handleCopyUpiId}
          className="flex-1 rounded-xl text-xs h-10 border-slate-200"
        >
          {copiedUpi ? <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-600" /> : <Copy className="mr-1.5 h-3.5 w-3.5 text-slate-500" />}
          {copiedUpi ? 'UPI ID Copied!' : 'Copy UPI ID'}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={handleCopyPageLink}
          className="flex-1 rounded-xl text-xs h-10 border-slate-200"
        >
          {copiedLink ? <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-600" /> : <Share2 className="mr-1.5 h-3.5 w-3.5 text-slate-500" />}
          {copiedLink ? 'Link Copied!' : 'Open page on phone'}
        </Button>
      </div>
    </div>
  );
}
