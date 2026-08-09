function validateEnvironment() {
  const warnings = [];

  if (!process.env.SUPABASE_URL && !process.env.VITE_SUPABASE_URL) {
    warnings.push('SUPABASE_URL is not configured; database operations will fail until it is set.');
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY && !process.env.SUPABASE_ANON_KEY && !process.env.VITE_SUPABASE_ANON_KEY) {
    warnings.push('Supabase credentials are not configured.');
  }

  if (!process.env.RAZORPAY_KEY_ID && !process.env.VITE_RAZORPAY_KEY_ID) {
    warnings.push('RAZORPAY_KEY_ID is not configured; payment order creation will fail.');
  }

  if (!process.env.RAZORPAY_KEY_SECRET) {
    warnings.push('RAZORPAY_KEY_SECRET is not configured; payment signature verification will fail.');
  }

  return { warnings };
}

module.exports = { validateEnvironment };

