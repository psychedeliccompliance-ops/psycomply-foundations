drop policy if exists "Authenticated can upload documents" on storage.objects;

create policy "Users can upload own documents"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'documents' and auth.uid()::text = (storage.foldername(name))[1]);