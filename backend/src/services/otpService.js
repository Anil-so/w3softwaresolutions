const crypto = require('crypto');
const { supabase } = require('../config/supabase');

function generateOtp() {
  return crypto.randomInt(100000, 999999).toString();
}

async function createOtpRecord(email, ttlMinutes = 10) {
  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000).toISOString();
  const otpHash = crypto.createHash('sha256').update(otp).digest('hex');

  const { error } = await supabase.from('otp_requests').insert([
    {
      email: email.toLowerCase(),
      otp_hash: otpHash,
      expires_at: expiresAt,
      used: false,
      created_at: new Date().toISOString(),
    },
  ]);

  if (error) {
    throw error;
  }

  return { otp, expiresAt };
}

function hashOtp(otp) {
  return crypto.createHash('sha256').update(otp).digest('hex');
}

async function verifyOtpRecord(email, otp) {
  const otpHash = hashOtp(otp);
  const { data, error } = await supabase
    .from('otp_requests')
    .select('*')
    .eq('email', email.toLowerCase())
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return false;
  }

  if (data.used || new Date(data.expires_at) < new Date()) {
    return false;
  }

  if (data.otp_hash !== otpHash) {
    return false;
  }

  const { error: updateError } = await supabase
    .from('otp_requests')
    .update({ used: true })
    .eq('id', data.id);

  if (updateError) {
    throw updateError;
  }

  return true;
}

module.exports = { createOtpRecord, verifyOtpRecord };
