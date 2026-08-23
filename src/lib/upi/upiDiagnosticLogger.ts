/**
 * Safe development-only diagnostic tool to inspect and log non-sensitive UPI return payloads
 * when a user returns from a UPI Intent app back to the web browser.
 */

export type UpiCallbackParams = {
  txnId?: string;
  responseCode?: string;
  approvalRefNo?: string;
  status?: string;
  txnRef?: string;
  rawQuery?: string;
  timestamp: string;
};

export function captureUpiCallbackParams(): UpiCallbackParams | null {
  if (typeof window === 'undefined') return null;

  const urlParams = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));

  const txnId = urlParams.get('txnId') || urlParams.get('txnid') || hashParams.get('txnId') || hashParams.get('txnid') || undefined;
  const responseCode = urlParams.get('responseCode') || urlParams.get('rescode') || hashParams.get('responseCode') || undefined;
  const approvalRefNo = urlParams.get('ApprovalRefNo') || urlParams.get('approvalRefNo') || hashParams.get('ApprovalRefNo') || undefined;
  const status = urlParams.get('Status') || urlParams.get('status') || hashParams.get('Status') || undefined;
  const txnRef = urlParams.get('txnRef') || urlParams.get('tr') || hashParams.get('txnRef') || hashParams.get('tr') || undefined;

  const rawQuery = window.location.search || window.location.hash || '';

  if (!txnId && !status && !txnRef && !rawQuery) {
    return null;
  }

  const payload: UpiCallbackParams = {
    txnId,
    responseCode,
    approvalRefNo,
    status,
    txnRef,
    rawQuery,
    timestamp: new Date().toISOString(),
  };

  console.log('[UPI Diagnostic Logger] Return payload captured:', payload);
  return payload;
}
