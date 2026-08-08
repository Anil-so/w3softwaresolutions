const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { supabase } = require('../config/supabase');
const { asyncHandler } = require('../utils/asyncHandler');
const { AppError } = require('../utils/appError');
const { validate } = require('../middleware/validate');
const { sendOtpSchema, verifyOtpSchema, registerSchema, loginSchema } = require('../validators/auth.validator');
const { createOtpRecord, verifyOtpRecord } = require('../services/otpService');
const { sendOtpEmail } = require('../services/emailService');

const router = express.Router();

function generateToken(payload) {
  const jwtSecret = process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' ? '' : 'dev-jwt-secret-change-me');
  return jwt.sign(payload, jwtSecret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  });
}

router.post('/send-otp', validate(sendOtpSchema), asyncHandler(async (req, res) => {
  const { email } = req.body;
  const normalizedEmail = email.trim().toLowerCase();

  const { data: existingApplicant, error: existingError } = await supabase
    .from('applicants')
    .select('id')
    .eq('email', normalizedEmail)
    .maybeSingle();

  if (existingError) {
    throw existingError;
  }

  if (!existingApplicant) {
    const { error: insertError } = await supabase.from('applicants').insert([
      {
        email: normalizedEmail,
        full_name: '',
        mobile: '',
      },
    ]);

    if (insertError) {
      throw insertError;
    }
  }

  const { otp } = await createOtpRecord(normalizedEmail, Number(process.env.OTP_TTL_MINUTES || 10));
  await sendOtpEmail(normalizedEmail, otp);

  res.json({ success: true, message: 'OTP sent successfully.' });
}));

router.post('/verify-otp', validate(verifyOtpSchema), asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const normalizedEmail = email.trim().toLowerCase();

  const isValidOtp = await verifyOtpRecord(normalizedEmail, otp);
  if (!isValidOtp) {
    throw new AppError(401, 'Invalid or expired OTP.');
  }

  const { data: applicant, error: fetchError } = await supabase
    .from('applicants')
    .select('id, email, full_name, mobile, email_verified')
    .eq('email', normalizedEmail)
    .maybeSingle();

  if (fetchError) {
    throw fetchError;
  }

  if (!applicant) {
    throw new AppError(404, 'Applicant not found.');
  }

  const { error: updateError } = await supabase
    .from('applicants')
    .update({ email_verified: true, updated_at: new Date().toISOString() })
    .eq('id', applicant.id);

  if (updateError) {
    throw updateError;
  }

  const token = generateToken({
    sub: applicant.id,
    role: 'applicant',
    email: applicant.email,
  });

  res.json({
    success: true,
    message: 'OTP verified successfully.',
    token,
    applicant: {
      id: applicant.id,
      email: applicant.email,
      fullName: applicant.full_name,
      mobile: applicant.mobile,
      emailVerified: true,
    },
  });
}));

router.post('/register', validate(registerSchema), asyncHandler(async (req, res) => {
  const { fullName, email, password, phone } = req.body;
  const normalizedEmail = email.trim().toLowerCase();

  const { data: existingApplicant, error: existingError } = await supabase
    .from('applicants')
    .select('id')
    .eq('email', normalizedEmail)
    .maybeSingle();

  if (existingError) {
    throw existingError;
  }

  if (!existingApplicant) {
    throw new AppError(404, 'Applicant profile not found. Please request an OTP first.');
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const { error: updateError } = await supabase
    .from('applicants')
    .update({
      full_name: fullName,
      mobile: phone,
      password_hash: passwordHash,
      updated_at: new Date().toISOString(),
    })
    .eq('id', existingApplicant.id);

  if (updateError) {
    throw updateError;
  }

  res.json({ success: true, message: 'Applicant profile completed successfully.' });
}));

router.post('/login', validate(loginSchema), asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email.trim().toLowerCase();

  const { data: applicant, error } = await supabase
    .from('applicants')
    .select('id, email, full_name, mobile, password_hash, email_verified')
    .eq('email', normalizedEmail)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!applicant) {
    throw new AppError(404, 'Applicant not found.');
  }

  if (!applicant.email_verified) {
    throw new AppError(403, 'Please verify your email first.');
  }

  const isValidPassword = await bcrypt.compare(password, applicant.password_hash || '');
  if (!isValidPassword) {
    throw new AppError(401, 'Invalid credentials.');
  }

  const token = generateToken({
    sub: applicant.id,
    role: 'applicant',
    email: applicant.email,
  });

  res.json({
    success: true,
    message: 'Login successful.',
    token,
    applicant: {
      id: applicant.id,
      email: applicant.email,
      fullName: applicant.full_name,
      mobile: applicant.mobile,
    },
  });
}));

module.exports = router;
