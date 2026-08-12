-- Supabase PostgreSQL schema for recruitment portal
-- This file contains only schema and RLS policy definitions.
-- It does not execute any SQL.

-- Enable UUID extension
create extension if not exists "pgcrypto";

create sequence if not exists public.applicants_seq start 1 increment 1;

-- Applicants table
create table if not exists public.applicants (
  id uuid primary key default gen_random_uuid(),
  application_number text not null unique default ('W3-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.applicants_seq')::text, 6, '0')),
  full_name text not null,
  email text not null unique check (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  mobile text not null,
  dob date,
  gender text,
  country text,
  state text,
  city text,
  postal_code text,
  address text,
  qualification text,
  college text,
  university text,
  percentage text,
  passing_year text,
  experience text,
  skills text,
  linkedin text,
  portfolio text,
  resume_url text,
  email_verified boolean not null default false,
  profile_completion_percent integer not null default 0 check (profile_completion_percent between 0 and 100),
  payment_status text not null default 'pending' check (payment_status in ('pending','verified','failed')),
  application_status text not null default 'draft' check (application_status in ('draft','submitted','review','shortlisted','rejected')),
  is_deleted boolean not null default false,
  created_by uuid,
  updated_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.applicants is 'Stores applicant profile and application lifecycle information.';
comment on column public.applicants.id is 'Unique applicant identifier.';
comment on column public.applicants.application_number is 'Human-readable unique application number.';
comment on column public.applicants.full_name is 'Applicant full name.';
comment on column public.applicants.email is 'Applicant email address used for contact and verification.';
comment on column public.applicants.mobile is 'Applicant mobile number.';
comment on column public.applicants.dob is 'Applicant date of birth.';
comment on column public.applicants.gender is 'Applicant gender.';
comment on column public.applicants.country is 'Applicant country.';
comment on column public.applicants.state is 'Applicant state.';
comment on column public.applicants.city is 'Applicant city.';
comment on column public.applicants.postal_code is 'Applicant postal code.';
comment on column public.applicants.address is 'Applicant full address.';
comment on column public.applicants.qualification is 'Highest qualification.';
comment on column public.applicants.college is 'College name.';
comment on column public.applicants.university is 'University name.';
comment on column public.applicants.percentage is 'Percentage or CGPA value.';
comment on column public.applicants.passing_year is 'Passing year.';
comment on column public.applicants.experience is 'Professional experience summary.';
comment on column public.applicants.skills is 'Comma-separated skills.';
comment on column public.applicants.linkedin is 'LinkedIn profile URL.';
comment on column public.applicants.portfolio is 'Portfolio URL.';
comment on column public.applicants.resume_url is 'Resume document URL.';
comment on column public.applicants.email_verified is 'Whether the applicant email has been verified.';
comment on column public.applicants.profile_completion_percent is 'Estimated profile completion percentage.';
comment on column public.applicants.payment_status is 'Current payment status.';
comment on column public.applicants.application_status is 'Current application status.';
comment on column public.applicants.is_deleted is 'Soft delete flag.';
comment on column public.applicants.created_by is 'Admin or system user who created the record.';
comment on column public.applicants.updated_by is 'Admin or system user who updated the record.';
comment on column public.applicants.created_at is 'Record creation timestamp.';
comment on column public.applicants.updated_at is 'Record last update timestamp.';

create sequence if not exists public.applicants_seq start 1 increment 1;

create index if not exists applicants_application_number_idx on public.applicants (application_number);
create index if not exists applicants_email_idx on public.applicants (email);
create index if not exists applicants_mobile_idx on public.applicants (mobile);
create index if not exists applicants_status_idx on public.applicants (application_status, payment_status);
create index if not exists applicants_city_idx on public.applicants (city);
create index if not exists applicants_country_idx on public.applicants (country);
create index if not exists applicants_created_at_idx on public.applicants (created_at desc);
create index if not exists applicants_updated_at_idx on public.applicants (updated_at desc);
create index if not exists applicants_is_deleted_idx on public.applicants (is_deleted);

-- Payments table
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  applicant_id uuid not null references public.applicants(id) on delete cascade,
  razorpay_order_id text,
  razorpay_payment_id text,
  razorpay_signature text,
  payment_method text not null default 'razorpay' check (payment_method in ('razorpay','bank_transfer','offline')),
  amount numeric(10,2) not null default 49.00,
  currency text not null default 'INR' check (currency = 'INR'),
  status text not null default 'pending' check (status in ('pending','captured','failed','refunded')),
  payment_timestamp timestamptz,
  is_deleted boolean not null default false,
  created_by uuid,
  updated_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.payments is 'Stores payment records for each applicant application.';
comment on column public.payments.id is 'Unique payment identifier.';
comment on column public.payments.applicant_id is 'Reference to the related applicant.';
comment on column public.payments.razorpay_order_id is 'Razorpay order identifier.';
comment on column public.payments.razorpay_payment_id is 'Razorpay payment identifier.';
comment on column public.payments.razorpay_signature is 'Razorpay signature used for verification.';
comment on column public.payments.payment_method is 'Configured payment method.';
comment on column public.payments.amount is 'Payment amount.';
comment on column public.payments.currency is 'Payment currency.';
comment on column public.payments.status is 'Current payment status.';
comment on column public.payments.payment_timestamp is 'Timestamp when the payment was processed.';
comment on column public.payments.is_deleted is 'Soft delete flag.';
comment on column public.payments.created_by is 'Admin or system user who created the record.';
comment on column public.payments.updated_by is 'Admin or system user who updated the record.';
comment on column public.payments.created_at is 'Record creation timestamp.';
comment on column public.payments.updated_at is 'Record last update timestamp.';

create index if not exists payments_applicant_id_idx on public.payments (applicant_id);
create index if not exists payments_status_idx on public.payments (status);
create index if not exists payments_payment_method_idx on public.payments (payment_method);
create index if not exists payments_created_at_idx on public.payments (created_at desc);
create index if not exists payments_updated_at_idx on public.payments (updated_at desc);
create index if not exists payments_is_deleted_idx on public.payments (is_deleted);

-- Admins table
create table if not exists public.admins (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique check (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  password_hash text not null,
  role text not null default 'admin' check (role in ('admin','super_admin')),
  is_deleted boolean not null default false,
  created_by uuid,
  updated_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.admins is 'Stores system administrators for the recruitment portal.';
comment on column public.admins.id is 'Unique admin identifier.';
comment on column public.admins.name is 'Admin display name.';
comment on column public.admins.email is 'Admin email address.';
comment on column public.admins.password_hash is 'Password hash for admin authentication.';
comment on column public.admins.role is 'Admin role.';
comment on column public.admins.is_deleted is 'Soft delete flag.';
comment on column public.admins.created_by is 'Admin or system user who created the record.';
comment on column public.admins.updated_by is 'Admin or system user who updated the record.';
comment on column public.admins.created_at is 'Record creation timestamp.';
comment on column public.admins.updated_at is 'Record last update timestamp.';

create index if not exists admins_email_idx on public.admins (email);
create index if not exists admins_role_idx on public.admins (role);
create index if not exists admins_created_at_idx on public.admins (created_at desc);
create index if not exists admins_updated_at_idx on public.admins (updated_at desc);
create index if not exists admins_is_deleted_idx on public.admins (is_deleted);

-- Trigger function to update updated_at automatically
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_applicants_updated_at
before update on public.applicants
for each row execute function public.set_updated_at();

create trigger set_payments_updated_at
before update on public.payments
for each row execute function public.set_updated_at();

create trigger set_admins_updated_at
before update on public.admins
for each row execute function public.set_updated_at();

-- Enable Row Level Security
alter table public.applicants enable row level security;
alter table public.payments enable row level security;
alter table public.admins enable row level security;

-- Secure RLS policies: deny-by-default until authentication is implemented.
drop policy if exists applicants_select_restricted on public.applicants;
create policy applicants_select_restricted
  on public.applicants
  for select
  using (false);

drop policy if exists applicants_insert_restricted on public.applicants;
create policy applicants_insert_restricted
  on public.applicants
  for insert
  with check (false);

drop policy if exists applicants_update_restricted on public.applicants;
create policy applicants_update_restricted
  on public.applicants
  for update
  using (false)
  with check (false);

drop policy if exists applicants_delete_restricted on public.applicants;
create policy applicants_delete_restricted
  on public.applicants
  for delete
  using (false);

drop policy if exists payments_select_restricted on public.payments;
create policy payments_select_restricted
  on public.payments
  for select
  using (false);

drop policy if exists payments_insert_restricted on public.payments;
create policy payments_insert_restricted
  on public.payments
  for insert
  with check (false);

drop policy if exists payments_update_restricted on public.payments;
create policy payments_update_restricted
  on public.payments
  for update
  using (false)
  with check (false);

drop policy if exists payments_delete_restricted on public.payments;
create policy payments_delete_restricted
  on public.payments
  for delete
  using (false);

drop policy if exists admins_select_restricted on public.admins;
create policy admins_select_restricted
  on public.admins
  for select
  using (false);

drop policy if exists admins_insert_restricted on public.admins;
create policy admins_insert_restricted
  on public.admins
  for insert
  with check (false);

drop policy if exists admins_update_restricted on public.admins;
create policy admins_update_restricted
  on public.admins
  for update
  using (false)
  with check (false);

drop policy if exists admins_delete_restricted on public.admins;
create policy admins_delete_restricted
  on public.admins
  for delete
  using (false);
