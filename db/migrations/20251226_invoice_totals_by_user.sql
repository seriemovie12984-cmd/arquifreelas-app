-- Create a helper function to aggregate invoice totals by user
create or replace function invoice_totals_by_user()
returns table(user_id uuid, email text, total_paid numeric, total_invoiced numeric)
language sql stable as $$
  select p.id as user_id, p.email,
    coalesce(sum(case when i.status = 'paid' then i.amount end),0) as total_paid,
    coalesce(sum(i.amount),0) as total_invoiced
  from profiles p
  left join invoices i on i.user_id = p.id
  group by p.id, p.email
  order by total_paid desc;
$$;

-- You can call: select * from invoice_totals_by_user();
