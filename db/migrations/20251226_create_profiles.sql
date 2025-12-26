-- Migration: create profiles table linked to auth.users
-- This table extends Supabase auth with additional user metadata

create table if not exists public.profiles (
  id uuid not null primary key references auth.users on delete cascade,
  email text unique,
  full_name text,
  avatar_url text,
  role text default 'user',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Allow users to view their own profile
create policy "allow users to view own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Allow users to update their own profile
create policy "allow users to update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Allow authenticated users to insert their profile
create policy "allow insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Index for email lookups
create index if not exists idx_profiles_email on public.profiles(email);

-- NOTE: After creating this table, seed the admin emails with:
-- update public.profiles set role = 'admin' 
-- where email in ('arquifreelas1@gmail.com', 'alex6gavalda@gmail.com');
