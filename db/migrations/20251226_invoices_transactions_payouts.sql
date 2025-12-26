-- Migration: invoices, transactions, payouts

-- Invoices table
create table if not exists invoices (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null, -- beneficiary/freelancer who should receive payout
  project_id uuid null,
  description text,
  amount numeric not null,
  currency text default 'BRL',
  due_date date,
  status text default 'pending', -- pending, paid, cancelled
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  paid_at timestamptz null
);
create index if not exists idx_invoices_user on invoices(user_id);
create index if not exists idx_invoices_status on invoices(status);

-- Transactions table (record of payments made)
create table if not exists transactions (
  id uuid default gen_random_uuid() primary key,
  invoice_id uuid references invoices(id) on delete cascade,
  amount numeric not null,
  provider text,
  provider_payload jsonb default '{}'::jsonb,
  status text default 'pending', -- pending, success, failed
  created_at timestamptz default now()
);
create index if not exists idx_transactions_invoice on transactions(invoice_id);

-- Payouts table (scheduled payouts to freelancers)
create table if not exists payouts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null,
  amount numeric not null,
  status text default 'scheduled', -- scheduled, processed, failed
  scheduled_date date,
  processed_at timestamptz null,
  created_at timestamptz default now(),
  metadata jsonb default '{}'::jsonb
);
create index if not exists idx_payouts_user on payouts(user_id);

-- Notes: enable RLS and add policies appropriate for your application.
-- Example (manual steps in Supabase SQL editor):
-- alter table invoices enable row level security;
-- create policy "insert invoices authenticated" on invoices for insert using (auth.role() = 'authenticated');
-- create policy "select invoices admin or owner" on invoices for select using (auth.role() = 'authenticated' and (auth.uid() = user_id or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')));

-- Adjust policies to your security model and test in Supabase.
