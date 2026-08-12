-- Migration: Add paid_at column and indexes to public.payments for Razorpay integration

-- 1. Add paid_at column to public.payments if it doesn't exist
do $$
begin
  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'public' and table_name = 'payments' and column_name = 'paid_at'
  ) then
    alter table public.payments add column paid_at timestamptz;
  end if;
end $$;

-- 2. Create index on razorpay_order_id for fast verification lookups
create index if not exists payments_razorpay_order_id_idx on public.payments (razorpay_order_id);

-- 3. Ensure payments status constraint allows 'paid', 'captured', 'pending', 'failed', 'refunded'
do $$
begin
  if exists (
    select 1 from information_schema.table_constraints
    where constraint_name = 'payments_status_check' and table_name = 'payments'
  ) then
    alter table public.payments drop constraint payments_status_check;
  end if;
end $$;

alter table public.payments 
  add constraint payments_status_check 
  check (status in ('pending', 'captured', 'paid', 'failed', 'refunded'));
