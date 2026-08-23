const express = require('express');
const crypto = require('crypto');
const { supabase } = require('../config/supabase');
const authenticateToken = require('../middleware/auth');
const { asyncHandler } = require('../utils/asyncHandler');
const { AppError } = require('../utils/appError');

const router = express.Router();

// POST /api/payments/create-upi-order
router.post('/create-upi-order', authenticateToken, asyncHandler(async (req, res) => {
  const payeeUpiId = process.env.COMPANY_UPI_ID || process.env.NEXT_PUBLIC_COMPANY_UPI_ID || process.env.VITE_COMPANY_UPI_ID || 'khadoliyavikash-1@okhdfcbank';
  const payeeName = process.env.COMPANY_NAME || process.env.NEXT_PUBLIC_COMPANY_NAME || process.env.VITE_COMPANY_NAME || 'W3 Software Solutions';

  // Server-side test mode configuration
  const isTestMode = process.env.UPI_TEST_MODE !== 'false';
  const defaultFee = isTestMode ? 1.00 : 49.00;
  const configuredFee = process.env.UPI_REGISTRATION_FEE;
  const amount = configuredFee ? Number(configuredFee) : defaultFee;

  const { applicant_id } = req.body || {};
  let targetApplicantId = applicant_id;
  let applicationRef = '1024';

  if (!targetApplicantId && req.user) {
    const { data: applicant } = await supabase
      .from('applicants')
      .select('id, application_number, payment_status')
      .or(`user_id.eq.${req.user.id},email.eq.${req.user.email}`)
      .maybeSingle();

    if (applicant) {
      targetApplicantId = applicant.id;
      applicationRef = applicant.application_number || applicant.id.slice(0, 8);
      if (applicant.payment_status === 'verified') {
        return res.status(400).json({ success: false, error: 'Payment already verified.', already_paid: true });
      }
    }
  }

  if (!targetApplicantId) {
    throw new AppError(404, 'Associated applicant record not found.');
  }

  const currency = 'INR';
  const note = `Registration Fee - Order #${applicationRef}`;

  // Idempotency: Check existing pending payment to prevent duplicate orders
  const { data: existingPayment } = await supabase
    .from('payments')
    .select('id, transaction_reference, amount, status')
    .eq('applicant_id', targetApplicantId)
    .eq('status', 'PENDING')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  let transactionRef = `TR_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

  if (existingPayment && existingPayment.transaction_reference) {
    transactionRef = existingPayment.transaction_reference;
  } else {
    // Insert pending payment record
    const { error: insertErr } = await supabase
      .from('payments')
      .insert([{
        applicant_id: targetApplicantId,
        amount,
        currency,
        payment_method: 'upi_intent',
        status: 'PENDING',
        transaction_reference: transactionRef,
        payment_note: note,
        created_by: req.user.id,
      }]);

    if (insertErr) {
      console.error('[payments/create-upi-order] Insert error:', insertErr);
    }
  }

  const upiParams = new URLSearchParams({
    pa: payeeUpiId,
    pn: payeeName,
    am: amount.toFixed(2),
    cu: currency,
    tn: note,
    tr: transactionRef,
  });
  const upiUri = `upi://pay?${upiParams.toString()}`;

  res.json({
    success: true,
    transaction_reference: transactionRef,
    upi_uri: upiUri,
    amount,
    currency,
    payee_vpa: payeeUpiId,
    payee_name: payeeName,
    note,
    test_mode: isTestMode,
  });
}));

// GET /api/payments/status/:transactionRef
router.get('/status/:transactionRef', authenticateToken, asyncHandler(async (req, res) => {
  const { transactionRef } = req.params;

  const { data: payment, error } = await supabase
    .from('payments')
    .select('*, applicants(id, payment_status)')
    .eq('transaction_reference', transactionRef)
    .maybeSingle();

  if (error || !payment) {
    throw new AppError(404, 'Payment record not found.');
  }

  const isPaid = payment.status === 'PAID' || payment.status === 'paid' || payment.status === 'captured';

  res.json({
    success: true,
    status: isPaid ? 'PAID' : payment.status || 'PENDING',
    transaction_reference: payment.transaction_reference,
    amount: payment.amount,
    currency: payment.currency,
    created_at: payment.created_at,
    verified_at: payment.verified_at,
    message: isPaid
      ? 'Payment is verified.'
      : 'Payment submitted. Verification is pending.',
  });
}));

// POST /api/webhooks/upi - Interface for future PSP/Bank signature-verified webhook
router.post('/webhooks/upi', asyncHandler(async (req, res) => {
  const webhookSecret = process.env.UPI_WEBHOOK_SECRET;
  const signature = req.headers['x-upi-signature'] || req.headers['x-webhook-signature'];

  // REJECT UNTRUSTED REQUESTS: Signature check
  if (!webhookSecret || !signature) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized webhook request. Valid provider signature required.',
    });
  }

  const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex');

  if (signature !== expectedSignature) {
    return res.status(403).json({
      success: false,
      error: 'Forbidden. Invalid webhook signature verification failed.',
    });
  }

  const payload = req.body || {};
  const { transaction_reference, amount, upi_reference } = payload;

  if (!transaction_reference || !amount) {
    return res.status(400).json({ success: false, error: 'Invalid payload structure.' });
  }

  const { data: payment, error: fetchErr } = await supabase
    .from('payments')
    .select('id, amount, status, applicant_id')
    .eq('transaction_reference', transaction_reference)
    .maybeSingle();

  if (fetchErr || !payment) {
    return res.status(404).json({ success: false, error: 'Matching transaction reference not found.' });
  }

  // Amount mismatch verification
  if (Number(payment.amount) !== Number(amount)) {
    return res.status(400).json({ success: false, error: 'Amount mismatch verification failed.' });
  }

  // Duplicate webhook protection
  if (payment.status === 'PAID' || payment.status === 'captured') {
    return res.json({ success: true, message: 'Transaction already reconciled.' });
  }

  const nowIso = new Date().toISOString();

  // Atomic update to PAID
  await supabase
    .from('payments')
    .update({
      status: 'PAID',
      upi_reference: upi_reference || null,
      verified_at: nowIso,
      updated_at: nowIso,
    })
    .eq('id', payment.id);

  await supabase
    .from('applicants')
    .update({
      payment_status: 'verified',
      application_status: 'submitted',
      updated_at: nowIso,
    })
    .eq('id', payment.applicant_id);

  return res.json({ success: true, message: 'Payment successfully verified via signed webhook.' });
}));

module.exports = router;
