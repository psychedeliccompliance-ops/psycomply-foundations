ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS asset_name text,
  ADD COLUMN IF NOT EXISTS amount_paid numeric,
  ADD COLUMN IF NOT EXISTS download_expires_at timestamp with time zone;