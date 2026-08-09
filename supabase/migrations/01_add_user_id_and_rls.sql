-- Migration: Add user_id to public.applicants and configure RLS policies for Supabase Auth

-- 1. Add user_id column referencing auth.users if it doesn't exist
do $$
begin
  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'public' and table_name = 'applicants' and column_name = 'user_id'
  ) then
    alter table public.applicants add column user_id uuid references auth.users(id) on delete cascade;
  end if;
end $$;

-- 2. Create index on user_id for faster lookups
create index if not exists applicants_user_id_idx on public.applicants (user_id);

-- 3. Enable RLS on applicants and payments
alter table public.applicants enable row level security;
alter table public.payments enable row level security;

-- 4. RLS policies for public.applicants
drop policy if exists applicants_select_own on public.applicants;
create policy applicants_select_own on public.applicants
  for select
  using (auth.uid() = user_id or auth.uid() is not null and email = auth.email());

drop policy if exists applicants_insert_own on public.applicants;
create policy applicants_insert_own on public.applicants
  for insert
  with check (auth.uid() = user_id or auth.uid() is not null);

drop policy if exists applicants_update_own on public.applicants;
create policy applicants_update_own on public.applicants
  for update
  using (auth.uid() = user_id or auth.uid() is not null and email = auth.email())
  with check (auth.uid() = user_id or auth.uid() is not null and email = auth.email());

-- 5. RLS policies for public.payments
drop policy if exists payments_select_own on public.payments;
create policy payments_select_own on public.payments
  for select
  using (
    exists (
      select 1 from public.applicants 
      where applicants.id = payments.applicant_id 
      and (applicants.user_id = auth.uid() or applicants.email = auth.email())
    )
  );

drop policy if exists payments_insert_own on public.payments;
create policy payments_insert_own on public.payments
  for insert
  with check (
    exists (
      select 1 from public.applicants 
      where applicants.id = payments.applicant_id 
      and (applicants.user_id = auth.uid() or applicants.email = auth.email())
    )
  );
