
-- Add stripe_price_id and toc columns to assets
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS stripe_price_id text;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS toc text[] DEFAULT '{}'::text[];

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL UNIQUE,
  asset_slug text NOT NULL,
  customer_email text,
  download_url text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Orders are readable by session_id (public, no auth needed for download page)
CREATE POLICY "Orders readable by session_id" ON public.orders
  FOR SELECT TO public USING (true);
