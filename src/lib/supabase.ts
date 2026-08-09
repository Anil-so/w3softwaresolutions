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

export async function sendEmailOtp(email: string) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase credentials are not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
  }
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
    },
  });
  if (error) throw error;
  return data;
}

export async function verifyEmailOtp(email: string, token: string) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase credentials are not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
  }

  // Primary verification attempt with type: 'email' (for passwordless OTP)
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  });

  if (error) {
    // Secondary fallback with type: 'signup' for newly registered users
    const signupRes = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'signup',
    });

    if (signupRes.error) {
      throw error;
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

