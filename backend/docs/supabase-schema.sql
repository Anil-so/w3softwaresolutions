create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null unique,
  phone text not null,
  password_hash text not null,
  otp_hash text,
  otp_expires_at timestamptz,
  is_verified boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  order_id text not null,
  payment_id text not null unique,
  signature text not null,
  amount integer not null default 500,
  currency text not null default 'INR',
  status text not null default 'captured',
  created_at timestamptz default now()
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  job_title text not null,
  full_name text not null,
  email text not null,
  phone text not null,
  message text,
  resume_url text,
  status text not null default 'submitted',
  created_at timestamptz default now()
);
