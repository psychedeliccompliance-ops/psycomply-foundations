-- Create states table
CREATE TABLE public.states (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT false,
  substances TEXT[] NOT NULL DEFAULT '{}',
  overview TEXT NOT NULL DEFAULT '',
  licensing_info TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.states ENABLE ROW LEVEL SECURITY;
CREATE POLICY "States are publicly readable" ON public.states FOR SELECT USING (true);

-- Create substances table
CREATE TABLE public.substances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  legal_status TEXT NOT NULL DEFAULT '',
  states TEXT[] NOT NULL DEFAULT '{}',
  clinical_requirements TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.substances ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Substances are publicly readable" ON public.substances FOR SELECT USING (true);

-- Create assets table
CREATE TABLE public.assets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  state TEXT NOT NULL,
  substance TEXT NOT NULL,
  price NUMERIC NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  why_you_need TEXT NOT NULL DEFAULT '',
  format TEXT NOT NULL DEFAULT '',
  is_bundle BOOLEAN NOT NULL DEFAULT false,
  bundle_contents TEXT,
  bundle_value NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Assets are publicly readable" ON public.assets FOR SELECT USING (true);