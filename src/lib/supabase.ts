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

export async function getSupabaseHealth() {
  if (!isSupabaseConfigured) {
    return { ok: false, message: 'Supabase is not configured.' };
  }

  try {
    const { error } = await supabase.from('profiles').select('id').limit(1);
    if (error) {
      return { ok: false, message: error.message };
    }

    return { ok: true, message: 'Supabase connection is available.' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown Supabase error.';
    return { ok: false, message };
  }
}
