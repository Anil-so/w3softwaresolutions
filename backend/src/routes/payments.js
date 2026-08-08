const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { supabase } = require('../config/supabase');
const authenticateToken = require('../middleware/auth');
const { asyncHandler } = require('../utils/asyncHandler');
const { AppError } = require('../utils/appError');

const router = express.Router();

const razorpay = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  : null;

router.post('/create-order', authenticateToken, asyncHandler(async (req, res) => {
  if (!razorpay) {
    throw new AppError(500, 'Razorpay credentials are not configured.');
  }

  const { amount = 500, currency = 'INR', receipt = `app-${Date.now()}` } = req.body || {};

  const options = {
    amount: Number(amount) * 100,
    currency,
    receipt,
    notes: {
      applicantId: req.user.sub,
    },
  };

  const order = await razorpay.orders.create(options);
  res.json({ success: true, order });
}));

router.post('/verify', authenticateToken, asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new AppError(400, 'Missing Razorpay verification fields.');
  }

  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    throw new AppError(400, 'Invalid Razorpay signature.');
  }

  const { error: insertError } = await supabase.from('payments').insert([
    {
      applicant_id: req.user.sub,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount: 500,
      currency: 'INR',
      status: 'captured',
    },
  ]);

  if (insertError) {
    throw insertError;
  }

  res.json({ success: true, message: 'Payment verified successfully.' });
}));

module.exports = router;
