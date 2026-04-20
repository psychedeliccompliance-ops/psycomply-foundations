
-- Add column to cache preview URLs
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS preview_pages text[];

-- Create public previews bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('previews', 'previews', true)
ON CONFLICT (id) DO NOTHING;

-- Public read for previews bucket
CREATE POLICY "Previews are publicly readable"
ON storage.objects FOR SELECT
USING (bucket_id = 'previews');

-- Service role can write (no policy needed; service role bypasses RLS)
