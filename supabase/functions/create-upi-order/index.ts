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

    const payeeUpiId = Deno.env.get('COMPANY_UPI_ID') || Deno.env.get('NEXT_PUBLIC_COMPANY_UPI_ID') || Deno.env.get('VITE_COMPANY_UPI_ID') || 'khadoliyavikash-1@okhdfcbank';
    const payeeName = Deno.env.get('COMPANY_NAME') || Deno.env.get('NEXT_PUBLIC_COMPANY_NAME') || Deno.env.get('VITE_COMPANY_NAME') || 'W3 Software Solutions';

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

    // Authenticate user session
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

    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch applicant record
    let applicant = null;
    const primaryRes = await adminClient
      .from('applicants')
      .select('id, application_number, payment_status, full_name, email')
      .or(`user_id.eq.${user.id},email.eq.${user.email}`)
      .maybeSingle();

    if (primaryRes.data) {
      applicant = primaryRes.data;
    } else {
      const fallbackRes = await adminClient
        .from('applicants')
        .select('id, application_number, payment_status, full_name, email')
        .eq('email', user.email)
        .maybeSingle();
      applicant = fallbackRes.data;
    }

    if (!applicant) {
      return new Response(
        JSON.stringify({ error: 'Applicant record not found. Please submit your application form first.' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (applicant.payment_status === 'verified') {
      return new Response(
        JSON.stringify({ error: 'Applicant payment has already been verified.', already_paid: true }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Server-determined payable amount (never trust client input)
    const amount = 49.00;
    const currency = 'INR';
    const applicationRef = applicant.application_number || `APP-${applicant.id.slice(0, 8)}`;
    const note = `Registration Fee - Order #${applicationRef}`;

    // Idempotency: Check if an existing PENDING payment exists for this applicant to prevent duplicate orders
    const { data: existingPayment } = await adminClient
      .from('payments')
      .select('id, transaction_reference, status')
      .eq('applicant_id', applicant.id)
      .eq('status', 'PENDING')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    let finalTxRef = `TR_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    if (existingPayment && existingPayment.transaction_reference) {
      finalTxRef = existingPayment.transaction_reference;
    } else {
      // Insert new pending payment attempt record
      const { error: insertErr } = await adminClient
        .from('payments')
        .insert({
          applicant_id: applicant.id,
          amount,
          currency,
          payment_method: 'upi_intent',
          status: 'PENDING',
          transaction_reference: finalTxRef,
          payment_note: note,
          created_by: user.id,
        });

      if (insertErr) {
        console.error('[create-upi-order] Failed to insert payment record:', insertErr.message);
      }
    }

    // Construct standard UPI URI with exact parameters
    const upiParams = new URLSearchParams({
      pa: payeeUpiId,
      pn: payeeName,
      am: amount.toFixed(2),
      cu: currency,
      tn: note,
      tr: finalTxRef,
    });
    const upiUri = `upi://pay?${upiParams.toString()}`;

    return new Response(
      JSON.stringify({
        success: true,
        transaction_reference: finalTxRef,
        upi_uri: upiUri,
        amount,
        currency,
        payee_vpa: payeeUpiId,
        payee_name: payeeName,
        note,
        applicant_id: applicant.id,
        application_number: applicationRef,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('[create-upi-order] Internal error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
