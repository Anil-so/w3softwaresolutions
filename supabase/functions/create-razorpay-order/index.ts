import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || supabaseAnonKey;
    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID');
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('[create-razorpay-order] Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables.');
      return new Response(
        JSON.stringify({ error: 'Supabase environment variables not configured on server.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!razorpayKeyId || !razorpayKeySecret) {
      console.error('[create-razorpay-order] Missing Edge Function secrets: RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET.');
      return new Response(
        JSON.stringify({ error: 'Razorpay API keys (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET) not configured in Supabase Edge Function secrets.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('[create-razorpay-order] Missing Authorization header in request.');
      return new Response(
        JSON.stringify({ error: 'Missing Authorization token in request header.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Authenticate user with Supabase Auth
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      console.error('[create-razorpay-order] User authentication failed:', userError?.message || 'No user session');
      return new Response(
        JSON.stringify({ error: 'Unauthorized user session. Please log in again.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[create-razorpay-order] User authenticated successfully. User ID: ${user.id}, Email: ${user.email}`);

    // Admin/Service client for database queries
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // Query applicant with fallback for missing user_id column
    let applicant = null;
    let applicantError = null;

    const primaryRes = await adminClient
      .from('applicants')
      .select('id, application_number, payment_status, full_name, email')
      .or(`user_id.eq.${user.id},email.eq.${user.email}`)
      .maybeSingle();

    if (primaryRes.data) {
      applicant = primaryRes.data;
    } else if (primaryRes.error && (primaryRes.error.message?.includes('user_id') || primaryRes.error.code === '42703' || primaryRes.error.code === 'PGRST204')) {
      console.warn('[create-razorpay-order] user_id column query failed, using email fallback.');
      const fallbackRes = await adminClient
        .from('applicants')
        .select('id, application_number, payment_status, full_name, email')
        .eq('email', user.email)
        .maybeSingle();
      applicant = fallbackRes.data;
      applicantError = fallbackRes.error;
    } else {
      applicantError = primaryRes.error;
    }

    if (applicantError || !applicant) {
      console.error('[create-razorpay-order] Applicant lookup failed:', applicantError?.message || 'Applicant record not found');
      return new Response(
        JSON.stringify({ error: `Applicant record not found for user ${user.email}. Please submit your application form first.` }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[create-razorpay-order] Applicant record found. Applicant ID: ${applicant.id}, Payment status: ${applicant.payment_status}`);

    // Check if applicant already paid
    if (applicant.payment_status === 'verified') {
      console.log(`[create-razorpay-order] Applicant ${applicant.id} has already verified payment.`);
      return new Response(
        JSON.stringify({ error: 'Applicant payment has already been verified.', already_paid: true }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate registration fee server-side (₹49 = 4900 paise)
    const amountInPaise = 4900;
    const receiptId = `rec_${applicant.id.replace(/-/g, '').slice(0, 12)}_${Date.now().toString().slice(-6)}`;

    // Create Razorpay Order via REST API
    const authString = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);
    const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: 'INR',
        receipt: receiptId,
        payment_capture: 1,
        notes: {
          applicant_id: applicant.id,
          user_id: user.id,
          application_number: applicant.application_number || '',
        },
      }),
    });

    const razorpayData = await razorpayResponse.json();
    console.log(`[create-razorpay-order] Razorpay Orders API response status: ${razorpayResponse.status}`);

    if (!razorpayResponse.ok) {
      console.error('[create-razorpay-order] Razorpay API order creation failed:', JSON.stringify(razorpayData));
      const razorpayErrMsg = razorpayData.error?.description || razorpayData.error?.code || 'Failed to create order with Razorpay.';
      return new Response(
        JSON.stringify({ error: `Razorpay Error: ${razorpayErrMsg}` }),
        { status: razorpayResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[create-razorpay-order] Razorpay order created successfully. Order ID: ${razorpayData.id}`);

    // Insert pending payment record in payments table
    const { error: dbError } = await adminClient
      .from('payments')
      .insert({
        applicant_id: applicant.id,
        razorpay_order_id: razorpayData.id,
        payment_method: 'razorpay',
        amount: 49.00,
        currency: 'INR',
        status: 'pending',
        created_by: user.id,
      });

    if (dbError) {
      console.error('[create-razorpay-order] DB insertion into payments failed:', dbError.message);
      // Non-fatal: return created order so checkout is not blocked
    } else {
      console.log(`[create-razorpay-order] Pending payment record inserted into DB.`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        order_id: razorpayData.id,
        amount: amountInPaise,
        currency: 'INR',
        key_id: razorpayKeyId,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('[create-razorpay-order] Unexpected server error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Internal server error in create-razorpay-order.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
