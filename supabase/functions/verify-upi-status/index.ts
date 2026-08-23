import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || supabaseAnonKey;

    if (!supabaseUrl || !supabaseAnonKey) {
      return new Response(
        JSON.stringify({ error: 'Supabase environment variables not configured.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing Authorization header.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Authenticate client user session
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized user session.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { transaction_reference } = body;

    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch payment record safely by transaction_reference or user's latest payment
    let paymentRecord = null;

    if (transaction_reference) {
      const { data } = await adminClient
        .from('payments')
        .select('id, applicant_id, amount, currency, status, transaction_reference, created_at, verified_at, applicants(id, user_id, email, payment_status)')
        .eq('transaction_reference', transaction_reference)
        .maybeSingle();
      paymentRecord = data;
    } else {
      const { data: applicant } = await adminClient
        .from('applicants')
        .select('id, payment_status')
        .or(`user_id.eq.${user.id},email.eq.${user.email}`)
        .maybeSingle();

      if (applicant) {
        const { data: latestPayment } = await adminClient
          .from('payments')
          .select('id, applicant_id, amount, currency, status, transaction_reference, created_at, verified_at, applicants(id, user_id, email, payment_status)')
          .eq('applicant_id', applicant.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        paymentRecord = latestPayment;
      }
    }

    if (!paymentRecord) {
      return new Response(
        JSON.stringify({ error: 'Payment order record not found.' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // SECURITY GUARANTEE:
    // This status query NEVER alters status from PENDING to PAID.
    // It strictly reads the current state from the database.
    // Status can ONLY be updated to PAID by trusted server-side reconciliation (e.g. bank webhook or admin portal).
    const isPaid = paymentRecord.status === 'PAID' || paymentRecord.status === 'paid' || paymentRecord.status === 'captured';

    return new Response(
      JSON.stringify({
        success: true,
        status: isPaid ? 'PAID' : paymentRecord.status || 'PENDING',
        transaction_reference: paymentRecord.transaction_reference,
        amount: paymentRecord.amount,
        currency: paymentRecord.currency,
        created_at: paymentRecord.created_at,
        verified_at: paymentRecord.verified_at,
        source: 'database_record',
        message: isPaid
          ? 'Payment is verified.'
          : 'Payment verification is pending bank reconciliation. Once confirmed by server, status will update to PAID.',
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('[verify-upi-status] Unexpected error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
