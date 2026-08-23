function validateEnvironment() {
  const warnings = [];

  if (!process.env.SUPABASE_URL && !process.env.VITE_SUPABASE_URL) {
    warnings.push('SUPABASE_URL is not configured; database operations will fail until it is set.');
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY && !process.env.SUPABASE_ANON_KEY && !process.env.VITE_SUPABASE_ANON_KEY) {
    warnings.push('Supabase credentials are not configured.');
  }

  if (!process.env.COMPANY_UPI_ID && !process.env.VITE_COMPANY_UPI_ID && !process.env.NEXT_PUBLIC_COMPANY_UPI_ID) {
    warnings.push('COMPANY_UPI_ID is not configured; UPI Intent generation will use default payee ID.');
  }

  return { warnings };
}

module.exports = { validateEnvironment };
