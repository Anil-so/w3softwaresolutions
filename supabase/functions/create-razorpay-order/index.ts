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
      return new Response(
        JSON.stringify({ error: 'Supabase environment variables not configured.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!razorpayKeyId || !razorpayKeySecret) {
      return new Response(
        JSON.stringify({ error: 'Razorpay API keys (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET) not configured in Edge Function secrets.' }),
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

    // Authenticate user with Supabase
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

    // Admin/Service client for database queries
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // Find applicant record
    const { data: applicant, error: applicantError } = await adminClient
      .from('applicants')
      .select('id, application_number, payment_status, full_name, email')
      .or(`user_id.eq.${user.id},email.eq.${user.email}`)
      .maybeSingle();

    if (applicantError || !applicant) {
      return new Response(
        JSON.stringify({ error: 'Applicant record not found for authenticated user.' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if applicant already paid
    if (applicant.payment_status === 'verified') {
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
        notes: {
          applicant_id: applicant.id,
          user_id: user.id,
          application_number: applicant.application_number || '',
        },
      }),
    });

    const razorpayData = await razorpayResponse.json();

    if (!razorpayResponse.ok) {
      console.error('Razorpay order creation failed:', razorpayData);
      return new Response(
        JSON.stringify({ error: razorpayData.error?.description || 'Failed to create order with Razorpay.' }),
        { status: razorpayResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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
      console.error('Failed to store pending payment record:', dbError);
      // Even if DB log fails, return order data so user flow is not broken
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
    console.error('Unexpected error in create-razorpay-order:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Internal server error.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
