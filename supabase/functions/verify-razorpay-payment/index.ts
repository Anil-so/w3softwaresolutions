import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function generateHmacSha256Hex(text: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(text);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
  const hashArray = Array.from(new Uint8Array(signatureBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || supabaseAnonKey;
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');

    if (!supabaseUrl || !supabaseAnonKey) {
      return new Response(
        JSON.stringify({ error: 'Supabase environment variables not configured.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!razorpayKeySecret) {
      return new Response(
        JSON.stringify({ error: 'RAZORPAY_KEY_SECRET not configured in Edge Function secrets.' }),
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

    // Authenticate user
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

    // Parse request body
    const body = await req.json().catch(() => ({}));
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: razorpay_order_id, razorpay_payment_id, razorpay_signature' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // Find applicant record with fallback for missing user_id column
    let applicant = null;
    let applicantError = null;

    const primaryRes = await adminClient
      .from('applicants')
      .select('id, payment_status, full_name, email')
      .or(`user_id.eq.${user.id},email.eq.${user.email}`)
      .maybeSingle();

    if (primaryRes.data) {
      applicant = primaryRes.data;
    } else if (primaryRes.error && (primaryRes.error.message?.includes('user_id') || primaryRes.error.code === '42703' || primaryRes.error.code === 'PGRST204')) {
      console.warn('[verify-razorpay-payment] user_id column query failed, using email fallback.');
      const fallbackRes = await adminClient
        .from('applicants')
        .select('id, payment_status, full_name, email')
        .eq('email', user.email)
        .maybeSingle();
      applicant = fallbackRes.data;
      applicantError = fallbackRes.error;
    } else {
      applicantError = primaryRes.error;
    }

    if (applicantError || !applicant) {
      return new Response(
        JSON.stringify({ error: 'Applicant record not found.' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Find payment record for this order_id
    const { data: paymentRecord, error: paymentError } = await adminClient
      .from('payments')
      .select('id, applicant_id, status')
      .eq('razorpay_order_id', razorpay_order_id)
      .maybeSingle();

    if (paymentError || !paymentRecord) {
      return new Response(
        JSON.stringify({ error: 'Payment order record not found in database.' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Security check: verify payment belongs to current applicant
    if (paymentRecord.applicant_id !== applicant.id) {
      return new Response(
        JSON.stringify({ error: 'Payment order does not belong to current applicant.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if already verified/paid
    if (applicant.payment_status === 'verified' && (paymentRecord.status === 'paid' || paymentRecord.status === 'captured')) {
      return new Response(
        JSON.stringify({ success: true, message: 'Payment was already verified.', applicant_id: applicant.id }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify Razorpay signature using HMAC SHA256
    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = await generateHmacSha256Hex(payload, razorpayKeySecret);

    if (expectedSignature !== razorpay_signature) {
      console.error('Razorpay signature mismatch!');

      // Update payment record status to failed
      await adminClient
        .from('payments')
        .update({
          status: 'failed',
          razorpay_payment_id: razorpay_payment_id,
          razorpay_signature: razorpay_signature,
          updated_at: new Date().toISOString(),
        })
        .eq('id', paymentRecord.id);

      return new Response(
        JSON.stringify({ error: 'Invalid payment signature. Verification failed.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const nowIso = new Date().toISOString();

    // Update payment record in database
    const { error: updatePaymentError } = await adminClient
      .from('payments')
      .update({
        status: 'paid',
        razorpay_payment_id: razorpay_payment_id,
        razorpay_signature: razorpay_signature,
        paid_at: nowIso,
        payment_timestamp: nowIso,
        updated_at: nowIso,
      })
      .eq('id', paymentRecord.id);

    if (updatePaymentError) {
      console.error('Failed to update payment record status:', updatePaymentError);
      return new Response(
        JSON.stringify({ error: 'Database update failed while recording payment.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update applicant record payment_status to 'verified'
    const { error: updateApplicantError } = await adminClient
      .from('applicants')
      .update({
        payment_status: 'verified',
        application_status: 'submitted',
        updated_at: nowIso,
      })
      .eq('id', applicant.id);

    if (updateApplicantError) {
      console.error('Failed to update applicant payment_status:', updateApplicantError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Payment verified successfully.',
        applicant_id: applicant.id,
        payment_id: razorpay_payment_id,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('Unexpected error in verify-razorpay-payment:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Internal server error.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
