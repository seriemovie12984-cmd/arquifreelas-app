-- Seed: mark two users as admin by email
update profiles set role = 'admin' where email in ('arquifreelas1@gmail.com', 'alex6gavalda@gmail.com');

-- Verify with:
-- select id, email, role from profiles where email in ('arquifreelas1@gmail.com','alex6gavalda@gmail.com');
