import { useState } from 'react';
import { Copy, Check, QrCode, Building2, ShieldCheck } from 'lucide-react';
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
  upiUri,
}: PaymentQrCodeProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyUpiId = async () => {
    try {
      await navigator.clipboard.writeText(payeeUpiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiUri)}`;

  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-5 space-y-4 text-center">
      <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
        <QrCode className="h-4 w-4 text-indigo-600" />
        <span>Scan QR Code to Pay via Any UPI App</span>
      </div>

      {/* QR Code Container */}
      <div className="mx-auto flex h-52 w-52 items-center justify-center rounded-2xl border border-slate-200 bg-white p-3 shadow-inner">
        <img
          src={qrImageUrl}
          alt="UPI Payment QR Code"
          className="h-44 w-44 rounded-lg object-contain"
          loading="eager"
        />
      </div>

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
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
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
    </div>
  );
}
