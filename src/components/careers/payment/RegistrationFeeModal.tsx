import { ShieldCheck, ArrowRight, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type RegistrationFeeModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId?: string;
  amount?: number;
  payeeName?: string;
  onProceed: () => void;
  isLoading?: boolean;
};

export function RegistrationFeeModal({
  open,
  onOpenChange,
  orderId = '1024',
  amount = 1,
  payeeName = 'W3 Software Solutions',
  onProceed,
  isLoading = false,
}: RegistrationFeeModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-3xl border-slate-200 bg-white p-6 shadow-2xl">
        <DialogHeader className="space-y-3 text-center sm:text-left">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 sm:mx-0">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <DialogTitle className="text-2xl font-bold text-slate-900">
              Registration Fee
            </DialogTitle>
            <DialogDescription className="mt-1.5 text-sm text-slate-600 leading-relaxed">
              A one-time registration fee of ₹{amount.toFixed(amount % 1 === 0 ? 0 : 2)} is required to complete your application.
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Separately Displayed Specs */}
        <div className="my-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 space-y-3 text-sm">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
            <span className="text-slate-500 font-medium">Payee</span>
            <span className="font-semibold text-slate-900 flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5 text-slate-500" />
              {payeeName}
            </span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
            <span className="text-slate-500 font-medium">Amount</span>
            <span className="text-lg font-bold text-slate-900">₹{amount.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
            <span className="text-slate-500 font-medium">Purpose</span>
            <span className="font-semibold text-slate-800">Application Registration</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-medium">Order ID</span>
            <span className="font-mono text-xs font-bold text-slate-700 bg-slate-200/70 px-2 py-0.5 rounded-md">
              #{orderId}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="space-y-2 pt-2">
          <Button
            type="button"
            onClick={onProceed}
            disabled={isLoading}
            className="h-12 w-full rounded-2xl text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md flex items-center justify-center gap-2"
          >
            {isLoading ? 'Generating UPI Details...' : 'Proceed to UPI Payment'}
            {!isLoading && <ArrowRight className="h-4 w-4" />}
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="w-full rounded-2xl h-10 text-xs text-slate-500 hover:text-slate-900"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
