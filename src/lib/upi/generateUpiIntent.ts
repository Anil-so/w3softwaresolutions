export type UpiIntentParams = {
  payeeUpiId: string;
  payeeName?: string;
  amount: number;
  transactionRef: string;
  note: string;
};

export type UpiAppConfig = {
  id: string;
  name: string;
  icon: string;
  getSchemeUrl: (upiUri: string) => string;
};

/**
 * Generates standard UPI deep-link URI compatible with Indian UPI apps
 * Format: upi://pay?pa=...&pn=...&am=...&cu=INR&tn=...&tr=...
 */
export function generateUpiIntentUri(params: UpiIntentParams): string {
  const { payeeUpiId, payeeName, amount, transactionRef, note } = params;

  if (!payeeUpiId) {
    throw new Error('Company UPI ID is missing.');
  }

  const cleanPayeeUpiId = payeeUpiId.trim();
  const cleanPayeeName = (payeeName && payeeName.trim()) ? payeeName.trim() : 'Vikash Saini';
  const cleanAmount = Number(amount).toFixed(2);
  const cleanNote = note ? note.trim() : 'Registration Fee';
  const cleanTxRef = transactionRef ? transactionRef.trim() : `TR_${Date.now()}`;

  const searchParams = new URLSearchParams({
    pa: cleanPayeeUpiId,
    pn: cleanPayeeName,
    am: cleanAmount,
    cu: 'INR',
    tn: cleanNote,
    tr: cleanTxRef,
  });

  return `upi://pay?${searchParams.toString()}`;
}

/**
 * Detects if current environment is a mobile browser
 */
export function isMobileBrowser(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera || '';
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
}

/**
 * Common UPI Apps and custom scheme mappings
 */
export const SUPPORTED_UPI_APPS: UpiAppConfig[] = [
  {
    id: 'generic',
    name: 'Default UPI App',
    icon: 'Smartphone',
    getSchemeUrl: (upiUri) => upiUri,
  },
  {
    id: 'gpay',
    name: 'Google Pay',
    icon: 'gpay',
    getSchemeUrl: (upiUri) => upiUri.replace('upi://pay', 'gpay://upi/pay'),
  },
  {
    id: 'phonepe',
    name: 'PhonePe',
    icon: 'phonepe',
    getSchemeUrl: (upiUri) => upiUri.replace('upi://pay', 'phonepe://pay'),
  },
  {
    id: 'paytm',
    name: 'Paytm',
    icon: 'paytm',
    getSchemeUrl: (upiUri) => upiUri.replace('upi://pay', 'paytmmp://pay'),
  },
  {
    id: 'bhim',
    name: 'BHIM',
    icon: 'bhim',
    getSchemeUrl: (upiUri) => upiUri.replace('upi://pay', 'bhim://pay'),
  },
];
