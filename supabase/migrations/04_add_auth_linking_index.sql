-- Migration: Add indexes for applicants user_id and email lookups, and configure permissive RLS policies for candidate access

-- 1. Ensure user_id column exists
do $$
begin
  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'public' and table_name = 'applicants' and column_name = 'user_id'
  ) then
    alter table public.applicants add column user_id uuid references auth.users(id) on delete cascade;
  end if;
end $$;

-- 2. Indexes for user_id and email lookups
create index if not exists applicants_user_id_idx on public.applicants (user_id);
create index if not exists applicants_email_idx on public.applicants (email);

-- 3. RLS Policies for public.applicants
alter table public.applicants enable row level security;

-- SELECT Policy
drop policy if exists applicants_select_own on public.applicants;
create policy applicants_select_own on public.applicants
  for select
  using (
    auth.uid() = user_id 
    or (auth.uid() is not null and lower(email) = lower(auth.email()))
    or (auth.role() = 'service_role')
  );

-- INSERT Policy: Allow authenticated users to insert rows cleanly
drop policy if exists applicants_insert_own on public.applicants;
create policy applicants_insert_own on public.applicants
  for insert
  with check (
    auth.uid() = user_id 
    or (auth.uid() is not null and lower(email) = lower(auth.email()))
    or (auth.uid() is not null)
    or (auth.role() = 'service_role')
  );

-- UPDATE Policy
drop policy if exists applicants_update_own on public.applicants;
create policy applicants_update_own on public.applicants
  for update
  using (
    auth.uid() = user_id 
    or (auth.uid() is not null and lower(email) = lower(auth.email()))
    or (auth.role() = 'service_role')
  )
  with check (
    auth.uid() = user_id 
    or (auth.uid() is not null and lower(email) = lower(auth.email()))
    or (auth.uid() is not null)
    or (auth.role() = 'service_role')
  );
