const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { supabase } = require('../config/supabase');
const authenticateToken = require('../middleware/auth');
const { asyncHandler } = require('../utils/asyncHandler');
const { AppError } = require('../utils/appError');

const router = express.Router();

function safeCompare(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a, 'utf-8');
  const bufB = Buffer.from(b, 'utf-8');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

// POST /api/payments/create-order
router.post('/create-order', authenticateToken, asyncHandler(async (req, res) => {
  const razorpayKeyId = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID;
  const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!razorpayKeyId || !razorpayKeySecret) {
    throw new AppError(500, 'Razorpay credentials are not configured on server.');
  }

  const razorpay = new Razorpay({
    key_id: razorpayKeyId,
    key_secret: razorpayKeySecret,
  });

  const { applicant_id } = req.body || {};
  let targetApplicantId = applicant_id;

  if (!targetApplicantId && req.user) {
    const { data: applicant } = await supabase
      .from('applicants')
      .select('id')
      .or(`user_id.eq.${req.user.id},email.eq.${req.user.email}`)
      .maybeSingle();

    if (applicant) {
      targetApplicantId = applicant.id;
    }
  }

  const registrationFeePaise = 4900; // ₹49.00
  const currency = 'INR';

  const options = {
    amount: registrationFeePaise,
    currency,
    receipt: `rcpt_${targetApplicantId || req.user.id}_${Date.now()}`.slice(0, 40),
    notes: {
      userId: req.user.id,
      applicantId: targetApplicantId || '',
      email: req.user.email || '',
    },
  };

  const order = await razorpay.orders.create(options);

  res.json({
    success: true,
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId: razorpayKeyId,
  });
}));

// POST /api/payments/verify
router.post('/verify', authenticateToken, asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, applicant_id } = req.body || {};

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new AppError(400, 'Missing Razorpay verification payload.');
  }

  const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!razorpayKeySecret) {
    throw new AppError(500, 'Razorpay key secret is not configured.');
  }

  const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac('sha256', razorpayKeySecret)
    .update(payload)
    .digest('hex');

  if (!safeCompare(expectedSignature, razorpay_signature)) {
    throw new AppError(400, 'Invalid payment signature verification failed.');
  }

  let targetApplicantId = applicant_id;
  if (!targetApplicantId && req.user) {
    const { data: applicant } = await supabase
      .from('applicants')
      .select('id')
      .or(`user_id.eq.${req.user.id},email.eq.${req.user.email}`)
      .maybeSingle();

    if (applicant) {
      targetApplicantId = applicant.id;
    }
  }

  if (!targetApplicantId) {
    throw new AppError(404, 'Associated applicant record not found.');
  }

  const { data: existingPayment } = await supabase
    .from('payments')
    .select('id')
    .or(`razorpay_payment_id.eq.${razorpay_payment_id},razorpay_order_id.eq.${razorpay_order_id}`)
    .maybeSingle();

  if (!existingPayment) {
    const { error: insertError } = await supabase.from('payments').insert([
      {
        applicant_id: targetApplicantId,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        payment_method: 'razorpay',
        amount: 49.00,
        currency: 'INR',
        status: 'captured',
        payment_timestamp: new Date().toISOString(),
      },
    ]);

    if (insertError) {
      console.error('[payments/verify] Insert error:', insertError);
      throw new AppError(500, 'Failed to store payment record in database.');
    }
  }

  const { error: updateError } = await supabase
    .from('applicants')
    .update({
      payment_status: 'verified',
      application_status: 'submitted',
      updated_at: new Date().toISOString(),
    })
    .eq('id', targetApplicantId);

  if (updateError) {
    console.error('[payments/verify] Applicant update error:', updateError);
  }

  res.json({
    success: true,
    message: 'Payment verified successfully and application submitted.',
    paymentId: razorpay_payment_id,
    orderId: razorpay_order_id,
  });
}));

// POST /api/payments/webhook
router.post('/webhook', asyncHandler(async (req, res) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers['x-razorpay-signature'];

  if (!webhookSecret || !signature) {
    return res.status(400).json({ success: false, message: 'Missing webhook secret or signature.' });
  }

  const rawBody = req.rawBody || (typeof req.body === 'string' ? req.body : JSON.stringify(req.body));
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex');

  if (!safeCompare(expectedSignature, signature)) {
    return res.status(400).json({ success: false, message: 'Invalid webhook signature.' });
  }

  const event = req.body;
  if (event && (event.event === 'payment.captured' || event.event === 'order.paid')) {
    const paymentEntity = event.payload?.payment?.entity || {};
    const razorpay_order_id = paymentEntity.order_id;
    const razorpay_payment_id = paymentEntity.id;
    const applicantId = paymentEntity.notes?.applicantId;

    if (applicantId && razorpay_payment_id) {
      const { data: existingPayment } = await supabase
        .from('payments')
        .select('id')
        .eq('razorpay_payment_id', razorpay_payment_id)
        .maybeSingle();

      if (!existingPayment) {
        await supabase.from('payments').insert([
          {
            applicant_id: applicantId,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature: signature,
            payment_method: 'razorpay',
            amount: (paymentEntity.amount || 4900) / 100,
            currency: paymentEntity.currency || 'INR',
            status: 'captured',
            payment_timestamp: new Date().toISOString(),
          },
        ]);
      }

      await supabase
        .from('applicants')
        .update({
          payment_status: 'verified',
          application_status: 'submitted',
          updated_at: new Date().toISOString(),
        })
        .eq('id', applicantId);
    }
  }

  return res.json({ success: true });
}));

module.exports = router;
