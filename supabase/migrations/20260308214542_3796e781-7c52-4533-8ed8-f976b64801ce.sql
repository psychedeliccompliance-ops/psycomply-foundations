ALTER TABLE public.assets ADD COLUMN is_active boolean NOT NULL DEFAULT true;
ALTER TABLE public.assets ADD COLUMN drive_link text DEFAULT '';