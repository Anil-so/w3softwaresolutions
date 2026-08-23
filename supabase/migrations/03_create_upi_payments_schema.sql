-- Migration: Adapt payments table for direct UPI Intent payment integration

-- 1. Add UPI-specific columns to public.payments if they don't exist
do $$
begin
  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'public' and table_name = 'payments' and column_name = 'transaction_reference'
  ) then
    alter table public.payments add column transaction_reference text;
  end if;

  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'public' and table_name = 'payments' and column_name = 'upi_reference'
  ) then
    alter table public.payments add column upi_reference text;
  end if;

  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'public' and table_name = 'payments' and column_name = 'payment_note'
  ) then
    alter table public.payments add column payment_note text;
  end if;

  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'public' and table_name = 'payments' and column_name = 'verified_at'
  ) then
    alter table public.payments add column verified_at timestamptz;
  end if;
end $$;

-- 2. Create unique index on transaction_reference
create unique index if not exists payments_transaction_reference_key 
on public.payments (transaction_reference) 
where transaction_reference is not null;

-- 3. Update status constraint to include UPI payment statuses
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
  check (status in ('PENDING', 'PAID', 'FAILED', 'CANCELLED', 'pending', 'paid', 'failed', 'cancelled', 'captured'));

-- 4. Update payment_method constraint to include upi_intent
do $$
begin
  if exists (
    select 1 from information_schema.table_constraints
    where constraint_name = 'payments_payment_method_check' and table_name = 'payments'
  ) then
    alter table public.payments drop constraint payments_payment_method_check;
  end if;
end $$;

alter table public.payments 
  add constraint payments_payment_method_check 
  check (payment_method in ('upi_intent', 'razorpay', 'bank_transfer', 'offline'));

-- 5. Ensure RLS policies prevent direct client modification of status
-- Clients can only read their own payments, backend service role updates status
drop policy if exists payments_update_restricted on public.payments;
create policy payments_update_restricted
  on public.payments
  for update
  using (false)
  with check (false);
