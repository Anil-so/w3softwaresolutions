function validateEnvironment() {
  const warnings = [];

  if (!process.env.JWT_SECRET) {
    warnings.push('JWT_SECRET is not configured; authentication will fail until it is set.');
  }

  if (!process.env.SUPABASE_URL && !process.env.VITE_SUPABASE_URL) {
    warnings.push('SUPABASE_URL is not configured; Supabase-backed routes will fail until it is set.');
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY && !process.env.SUPABASE_ANON_KEY && !process.env.VITE_SUPABASE_ANON_KEY) {
    warnings.push('Supabase credentials are not configured; database operations will fail until one is provided.');
  }

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    warnings.push('SMTP credentials are not configured; OTP emails will be skipped until they are provided.');
  }

  return { warnings };
}

module.exports = { validateEnvironment };
