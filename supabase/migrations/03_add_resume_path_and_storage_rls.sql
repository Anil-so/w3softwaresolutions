-- Migration: Add resume_path to public.applicants and setup private 'resumes' bucket RLS policies

-- 1. Add resume_path column to public.applicants if it doesn't exist
do $$
begin
  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'public' and table_name = 'applicants' and column_name = 'resume_path'
  ) then
    alter table public.applicants add column resume_path text;
  end if;
end $$;

-- 2. Ensure 'resumes' private bucket exists in storage.buckets
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'resumes', 
  'resumes', 
  false, 
  5242880, -- 5 MB
  array['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
on conflict (id) do update set
  public = false,
  file_size_limit = 5242880,
  allowed_mime_types = array['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

-- 3. RLS Policies for storage.objects on 'resumes' bucket

-- Allow authenticated users to INSERT files into their own folder {user_id}/*
drop policy if exists "Authenticated users can upload resumes to their own folder" on storage.objects;
create policy "Authenticated users can upload resumes to their own folder"
  on storage.objects for insert
  with check (
    bucket_id = 'resumes'
    and auth.uid() is not null
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow authenticated users to SELECT files from their own folder {user_id}/*
drop policy if exists "Authenticated users can view their own resume" on storage.objects;
create policy "Authenticated users can view their own resume"
  on storage.objects for select
  using (
    bucket_id = 'resumes'
    and auth.uid() is not null
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow authenticated users to UPDATE files in their own folder {user_id}/*
drop policy if exists "Authenticated users can update their own resume" on storage.objects;
create policy "Authenticated users can update their own resume"
  on storage.objects for update
  using (
    bucket_id = 'resumes'
    and auth.uid() is not null
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow authenticated users to DELETE files from their own folder {user_id}/*
drop policy if exists "Authenticated users can delete their own resume" on storage.objects;
create policy "Authenticated users can delete their own resume"
  on storage.objects for delete
  using (
    bucket_id = 'resumes'
    and auth.uid() is not null
    and (storage.foldername(name))[1] = auth.uid()::text
  );
