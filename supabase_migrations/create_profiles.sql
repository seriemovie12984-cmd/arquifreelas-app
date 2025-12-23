CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE,
  full_name text,
  avatar_url text,
  provider text,
  stripe_customer_id text,
  role text DEFAULT 'user',
  created_at timestamptz DEFAULT now()
);
