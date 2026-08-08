const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const isConfigured = Boolean(supabaseUrl && supabaseServiceRoleKey);

const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : {
      from() {
        return {
          select() {
            return this;
          },
          eq() {
            return this;
          },
          order() {
            return this;
          },
          limit() {
            return this;
          },
          maybeSingle() {
            return Promise.resolve({ data: null, error: new Error('Supabase is not configured.') });
          },
          insert() {
            return Promise.resolve({ data: null, error: new Error('Supabase is not configured.') });
          },
          update() {
            return Promise.resolve({ data: null, error: new Error('Supabase is not configured.') });
          },
        };
      },
    };

module.exports = { supabase, isConfigured };
