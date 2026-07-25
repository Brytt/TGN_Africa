alter table public.publications
  add column if not exists body_format text not null default 'plain',
  add column if not exists import_metadata jsonb not null default '{}'::jsonb;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'publications_body_format_check'
      and conrelid = 'public.publications'::regclass
  ) then
    alter table public.publications
      add constraint publications_body_format_check
      check (body_format in ('plain', 'html'));
  end if;
end $$;

update storage.buckets
set allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
where id = 'publication-media';
