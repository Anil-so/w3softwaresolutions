const express = require('express');
const { supabase } = require('../config/supabase');
const authenticateToken = require('../middleware/auth');
const { asyncHandler } = require('../utils/asyncHandler');
const { AppError } = require('../utils/appError');

const router = express.Router();

// POST /api/payments/create-upi-order
router.post('/create-upi-order', authenticateToken, asyncHandler(async (req, res) => {
  const payeeUpiId = process.env.COMPANY_UPI_ID || process.env.NEXT_PUBLIC_COMPANY_UPI_ID || process.env.VITE_COMPANY_UPI_ID || 'khadoliyavikash-1@okhdfcbank';
  const payeeName = process.env.COMPANY_NAME || process.env.NEXT_PUBLIC_COMPANY_NAME || process.env.VITE_COMPANY_NAME || 'W3 Software Solutions';

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

  const amount = 49.00;
  const currency = 'INR';
  const note = `Registration Fee - Order #${applicationRef}`;

  // Check existing pending payment to prevent duplicate orders
  const { data: existingPayment } = await supabase
    .from('payments')
    .select('id, transaction_reference, status')
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
      : 'Payment verification pending. Your registration will be confirmed after payment verification.',
  });
}));

module.exports = router;
