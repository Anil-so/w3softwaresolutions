const express = require('express');
const { supabase } = require('../config/supabase');
const authenticateToken = require('../middleware/auth');
const { asyncHandler } = require('../utils/asyncHandler');
const { validate } = require('../middleware/validate');
const { submitApplicationSchema } = require('../validators/application.validator');

const router = express.Router();

router.post('/submit', authenticateToken, validate(submitApplicationSchema), asyncHandler(async (req, res) => {
  const payload = req.body || {};

  const { data: paymentRecord, error: paymentError } = await supabase
    .from('payments')
    .select('id')
    .eq('applicant_id', req.user.sub)
    .eq('status', 'captured')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (paymentError) {
    throw paymentError;
  }

  if (!paymentRecord) {
    return res.status(402).json({ success: false, message: 'Payment must be verified before submitting an application.' });
  }

  const { error: insertError } = await supabase.from('applications').insert([
    {
      applicant_id: req.user.sub,
      job_title: payload.jobTitle,
      full_name: payload.fullName || '',
      email: payload.email || '',
      phone: payload.phone || '',
      message: payload.message || '',
      resume_url: payload.resumeUrl || null,
      status: 'submitted',
    },
  ]);

  if (insertError) {
    throw insertError;
  }

  res.json({ success: true, message: 'Application submitted successfully.' });
}));

router.get('/me', authenticateToken, asyncHandler(async (req, res) => {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('applicant_id', req.user.sub)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  res.json({ success: true, applications: data || [] });
}));

module.exports = router;
