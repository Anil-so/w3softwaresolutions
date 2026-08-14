import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not configured yet.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export function formatAuthError(error: any): string {
  if (!error) return 'An unexpected error occurred. Please try again.';
  const msg = typeof error === 'string' ? error : error.message || String(error);

  if (
    msg.includes('Error sending confirmation email') ||
    msg.includes('confirmation email') ||
    msg.includes('Error sending email') ||
    (typeof error === 'object' && error.status === 500)
  ) {
    return 'Unable to send the verification code. Please verify that your Gmail SMTP is configured in Supabase Dashboard (Authentication -> Settings -> SMTP Settings).';
  }

  if (msg.includes('Token has expired') || msg.includes('otp_expired') || msg.includes('expired')) {
    return 'Verification code has expired. Please request a new code.';
  }

  if (msg.includes('Invalid token') || msg.includes('invalid') || msg.includes('Token is invalid')) {
    return 'Invalid verification code. Please check your email and try again.';
  }

  if (msg.includes('rate limit') || msg.includes('too many requests') || msg.includes('Over email rate limit')) {
    return 'Too many attempts. Please wait a moment before trying again.';
  }

  if (msg.includes('FetchError') || msg.includes('Failed to fetch') || msg.includes('network')) {
    return "We couldn't connect to the service. Please check your internet connection and try again.";
  }

  return msg;
}

export async function sendEmailOtp(email: string) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase credentials are not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.');
  }

  const cleanEmail = email.trim().toLowerCase();
  const { data, error } = await supabase.auth.signInWithOtp({
    email: cleanEmail,
    options: {
      shouldCreateUser: true,
    },
  });

  if (error) {
    throw new Error(formatAuthError(error));
  }

  return data;
}

export async function verifyEmailOtp(email: string, token: string) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase credentials are not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanToken = token.trim();

  const { data, error } = await supabase.auth.verifyOtp({
    email: cleanEmail,
    token: cleanToken,
    type: 'email',
  });

  if (error) {
    const signupRes = await supabase.auth.verifyOtp({
      email: cleanEmail,
      token: cleanToken,
      type: 'signup',
    });

    if (signupRes.error) {
      throw new Error(formatAuthError(error));
    }
    return signupRes.data;
  }

  return data;
}

export async function getSupabaseHealth() {
  if (!isSupabaseConfigured) {
    return { ok: false, message: 'Supabase is not configured.' };
  }

  try {
    const { error } = await supabase.from('applicants').select('id').limit(1);
    if (error) {
      return { ok: false, message: error.message };
    }

    return { ok: true, message: 'Supabase connection is available.' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown Supabase error.';
    return { ok: false, message };
  }
}
