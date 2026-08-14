insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'sermon-media',
  'sermon-media',
  true,
  1073741824,
  array[
    'audio/mpeg', 'audio/mp4', 'audio/wav', 'audio/ogg', 'audio/webm', 'audio/x-m4a',
    'video/mp4', 'video/webm', 'video/quicktime', 'video/x-m4v'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy sermon_media_public_read on storage.objects for select
  using (bucket_id = 'sermon-media');
create policy sermon_media_staff_insert on storage.objects for insert to authenticated
  with check (bucket_id = 'sermon-media' and public.current_role() in ('admin', 'editor', 'author'));
create policy sermon_media_staff_update on storage.objects for update to authenticated
  using (bucket_id = 'sermon-media' and public.current_role() in ('admin', 'editor', 'author'))
  with check (bucket_id = 'sermon-media' and public.current_role() in ('admin', 'editor', 'author'));
create policy sermon_media_editor_delete on storage.objects for delete to authenticated
  using (bucket_id = 'sermon-media' and public.current_role() in ('admin', 'editor'));
