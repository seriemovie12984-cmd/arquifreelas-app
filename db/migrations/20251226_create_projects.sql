-- Migration: create projects table
-- Run this in Supabase SQL editor or psql connected to your project

create table if not exists projects (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid not null,
  title text not null,
  category text not null,
  description text,
  budget numeric,
  deadline text,
  location text,
  requirements text,
  status text default 'aberto',
  files jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Index on owner
create index if not exists idx_projects_owner on projects(owner_id);

-- NOTE: Configure RLS policies in Supabase Dashboard to allow authenticated users
-- to insert/select their own projects, e.g. (example policy):
--
-- Enable RLS:
-- alter table projects enable row level security;
--
-- Allow insert for authenticated users:
-- create policy "allow authenticated insert" on projects
-- for insert using (auth.role() = 'authenticated');
--
-- If you want to restrict select to owner only:
-- create policy "select own" on projects
-- for select using (auth.uid() = owner_id);

-- Adjust policies according to your security model.
