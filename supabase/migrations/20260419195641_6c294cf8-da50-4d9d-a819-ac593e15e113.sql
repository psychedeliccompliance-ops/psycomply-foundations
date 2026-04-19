-- Create the documents storage bucket (private)
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

-- RLS policies on storage.objects for the 'documents' bucket
-- Authenticated users can read files in the documents bucket
create policy "Authenticated can read documents"
on storage.objects
for select
to authenticated
using (bucket_id = 'documents');

-- Authenticated users can upload to the documents bucket
create policy "Authenticated can upload documents"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'documents');

-- Users can update their own files (folder name = user id)
create policy "Users can update own documents"
on storage.objects
for update
to authenticated
using (bucket_id = 'documents' and auth.uid()::text = (storage.foldername(name))[1]);

-- Users can delete their own files
create policy "Users can delete own documents"
on storage.objects
for delete
to authenticated
using (bucket_id = 'documents' and auth.uid()::text = (storage.foldername(name))[1]);