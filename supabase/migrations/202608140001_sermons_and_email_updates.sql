create table if not exists public.sermons (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  speaker text not null,
  scripture text,
  series text,
  description text,
  media_type text not null check (media_type in ('audio', 'video', 'both')),
  audio_url text,
  video_url text,
  cover_path text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  preached_at date not null,
  published_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint sermons_required_media check (
    (media_type = 'audio' and audio_url is not null and video_url is null) or
    (media_type = 'video' and video_url is not null and audio_url is null) or
    (media_type = 'both' and audio_url is not null and video_url is not null)
  )
);

create index if not exists sermons_public_archive_idx
  on public.sermons (preached_at desc, published_at desc)
  where status = 'published';
create index if not exists sermons_series_idx on public.sermons (series) where status = 'published';
create index if not exists sermons_speaker_idx on public.sermons (speaker) where status = 'published';

drop trigger if exists sermons_updated on public.sermons;
create trigger sermons_updated before update on public.sermons
for each row execute function public.set_updated_at();

alter table public.sermons enable row level security;
create policy sermons_public_read on public.sermons for select
  using (status = 'published' or public.current_role() in ('admin', 'editor', 'author'));
create policy sermons_staff_insert on public.sermons for insert to authenticated
  with check (public.current_role() in ('admin', 'editor', 'author'));
create policy sermons_staff_update on public.sermons for update to authenticated
  using (public.current_role() in ('admin', 'editor', 'author'))
  with check (public.current_role() in ('admin', 'editor', 'author'));
create policy sermons_editor_delete on public.sermons for delete to authenticated
  using (public.current_role() in ('admin', 'editor'));

create table if not exists public.email_updates (
  id uuid primary key default gen_random_uuid(),
  subject text not null,
  preheader text,
  message text not null,
  recipient_count integer not null default 0 check (recipient_count >= 0),
  failed_count integer not null default 0 check (failed_count >= 0),
  sent_by uuid references auth.users(id) on delete set null,
  sent_at timestamptz not null default now()
);

create index if not exists email_updates_sent_at_idx on public.email_updates (sent_at desc);
alter table public.email_updates enable row level security;
create policy email_updates_editor_read on public.email_updates for select to authenticated
  using (public.current_role() in ('admin', 'editor'));
create policy email_updates_editor_insert on public.email_updates for insert to authenticated
  with check (public.current_role() in ('admin', 'editor'));
