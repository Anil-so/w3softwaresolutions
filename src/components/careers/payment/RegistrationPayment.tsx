import { useState, useEffect } from 'react';
import { ArrowLeft, ShieldCheck, AlertCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Link } from 'react-router-dom';
import { UpiPaymentButton } from './UpiPaymentButton';
import { PaymentQrCode } from './PaymentQrCode';
import { PaymentStatus } from './PaymentStatus';
import { RegistrationFeeModal } from './RegistrationFeeModal';
import { isMobileBrowser } from '@/lib/upi/generateUpiIntent';
import { captureUpiCallbackParams } from '@/lib/upi/upiDiagnosticLogger';

type RegistrationPaymentProps = {
  onPay: () => void;
  onBack: () => void;
  isLoading?: boolean;
  errorMessage?: string;
  orderData?: {
    transaction_reference: string;
    upi_uri: string;
    amount: number;
    payee_vpa: string;
    payee_name: string;
    note: string;
    application_number?: string;
  } | null;
  onCheckStatus?: () => void;
  isCheckingStatus?: boolean;
  paymentStatus?: string;
  onGoToDashboard?: () => void;
  orderReferenceId?: string;
};

export function RegistrationPayment({
  onPay,
  onBack,
  isLoading = false,
  errorMessage,
  orderData,
  onCheckStatus,
  isCheckingStatus = false,
  paymentStatus = 'PENDING',
  onGoToDashboard,
  orderReferenceId = '1024',
}: RegistrationPaymentProps) {
  const [declarationChecked, setDeclarationChecked] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const isMobile = isMobileBrowser();

  const currentAmount = orderData?.amount ?? 1.00;

  useEffect(() => {
    // Development research diagnostic capture
    const params = captureUpiCallbackParams();
    if (params) {
      console.log('[RegistrationPayment Research Diagnostic] Return callback captured:', params);
    }
  }, []);

  const handleProceedFromModal = () => {
    setIsConfirmModalOpen(false);
    onPay();
  };

  return (
    <>
      <Card className="border-slate-200 bg-white/90 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.35)]">
        <CardHeader className="space-y-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-2xl font-semibold text-slate-900">Application Processing Fee</CardTitle>
            <CardDescription className="mt-2 text-sm text-slate-600">
              W3 Software Solutions • Direct UPI Payment Portal
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

          {/* Registration Fee Summary Specs */}
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-center space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Registration Fee</p>
            <p className="text-4xl font-extrabold text-slate-900">₹{currentAmount.toFixed(2)}</p>
            <div className="inline-flex items-center gap-3 pt-1 text-xs text-slate-600 font-medium">
              <span>Purpose: Application Registration</span>
              <span>•</span>
              <span className="font-mono bg-slate-200/80 px-2 py-0.5 rounded-md">Order ID: #{orderReferenceId}</span>
            </div>
          </div>

          {/* Order Details & UPI App Triggers once initiated */}
          {orderData ? (
            <div className="space-y-5 pt-2 border-t border-slate-100">
              {/* App Buttons (Google Pay, PhonePe, Paytm, BHIM, Other UPI Apps) */}
              <UpiPaymentButton
                payeeUpiId={orderData.payee_vpa}
                payeeName={orderData.payee_name}
                amount={orderData.amount}
                transactionRef={orderData.transaction_reference}
                note={orderData.note}
              />

              {/* Desktop Fallback (No large QR code image) */}
              {!isMobile && (
                <PaymentQrCode
                  payeeUpiId={orderData.payee_vpa}
                  payeeName={orderData.payee_name}
                  amount={orderData.amount}
                  transactionRef={orderData.transaction_reference}
                  note={orderData.note}
                  upiUri={orderData.upi_uri}
                />
              )}

              {/* Verification Status Notice */}
              <PaymentStatus
                status={paymentStatus}
                transactionRef={orderData.transaction_reference}
                onCheckStatus={onCheckStatus}
                onContinue={onGoToDashboard}
                isChecking={isCheckingStatus}
              />
            </div>
          ) : (
            <>
              {/* Payment Specification Box */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm space-y-2 shadow-sm">
                <p className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-2">Payment Details</p>
                <div className="flex justify-between text-slate-600">
                  <span>Application Processing Fee</span>
                  <span className="font-medium text-slate-900">₹{currentAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Purpose</span>
                  <span className="font-medium text-slate-900">Application Registration</span>
                </div>
                <div className="border-t border-slate-100 pt-2 flex justify-between font-semibold text-slate-900">
                  <span>Total Payable</span>
                  <span>₹{currentAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Fee Notice */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm space-y-3">
                <div className="flex items-center gap-2 font-semibold text-slate-900">
                  <Info className="h-4 w-4 text-slate-700" />
                  <span>Why is there a fee?</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">
                  This fee covers application processing and candidate verification.
                </p>
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">
                  <strong>Important:</strong> Payment of this fee does not guarantee selection or employment. Candidates are evaluated based on qualifications and role requirements.
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
                  I understand that the ₹{currentAmount.toFixed(0)} fee is for application processing and candidate verification and does not guarantee interview or employment.
                </label>
              </div>

              {/* Open Pre-payment Confirmation Modal */}
              <Button
                onClick={() => setIsConfirmModalOpen(true)}
                className="h-12 w-full rounded-2xl text-base font-semibold"
                disabled={isLoading || !declarationChecked}
              >
                {isLoading ? 'Generating UPI Details...' : `Pay Now — ₹${currentAmount.toFixed(0)}`}
              </Button>
            </>
          )}

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

      {/* Pre-payment Confirmation Modal */}
      <RegistrationFeeModal
        open={isConfirmModalOpen}
        onOpenChange={setIsConfirmModalOpen}
        orderId={orderReferenceId}
        amount={currentAmount}
        onProceed={handleProceedFromModal}
        isLoading={isLoading}
      />
    </>
  );
}
