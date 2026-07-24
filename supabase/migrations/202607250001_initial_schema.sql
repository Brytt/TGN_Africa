create extension if not exists pgcrypto;

create type public.app_role as enum ('admin', 'editor', 'author', 'reader');
create type public.author_status as enum ('active', 'inactive');
create type public.topic_level as enum ('main', 'subtopic', 'subsection');
create type public.publication_status as enum ('draft', 'in_review', 'scheduled', 'published', 'archived');
create type public.comment_status as enum ('pending', 'approved', 'rejected', 'hidden');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  avatar_path text,
  role public.app_role not null default 'reader',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.authors (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid unique references public.profiles(id) on delete set null,
  slug text not null unique,
  name text not null,
  email text not null unique,
  phone text,
  date_of_birth date,
  editorial_role text not null default 'Author',
  qualification text,
  church text,
  denomination text,
  city text,
  country text,
  bio text,
  expertise text,
  website text,
  avatar_path text,
  status public.author_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.topics (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.topics(id) on delete cascade,
  level public.topic_level not null,
  title text not null,
  slug text not null unique,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint topic_parent_shape check (
    (level = 'main' and parent_id is null) or
    (level in ('subtopic', 'subsection') and parent_id is not null)
  ),
  unique(parent_id, title)
);

create table public.publications (
  id uuid primary key default gen_random_uuid(),
  legacy_id text unique,
  slug text not null unique,
  title text not null,
  subtitle text,
  excerpt text,
  body text not null default '',
  publication_type text not null,
  author_id uuid not null references public.authors(id) on delete restrict,
  topic_id uuid references public.topics(id) on delete set null,
  scripture text,
  cover_path text,
  status public.publication_status not null default 'draft',
  reading_time_minutes integer not null default 1 check (reading_time_minutes > 0),
  seo_title text,
  seo_description text,
  scheduled_at timestamptz,
  published_at timestamptz,
  archived_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.editorial_tasks (
  id uuid primary key default gen_random_uuid(),
  publication_id uuid references public.publications(id) on delete cascade,
  assignee_id uuid references public.profiles(id) on delete set null,
  label text not null,
  notes text,
  due_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  publication_id uuid not null references public.publications(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  author_name text not null,
  body text not null check (char_length(body) between 1 and 4000),
  status public.comment_status not null default 'pending',
  moderated_by uuid references public.profiles(id) on delete set null,
  moderated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.likes (
  publication_id uuid not null references public.publications(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (publication_id, user_id)
);

create table public.bookmarks (
  publication_id uuid not null references public.publications(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (publication_id, user_id)
);

create table public.analytics_events (
  id bigint generated always as identity primary key,
  publication_id uuid references public.publications(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  event_type text not null check (event_type in ('page_view', 'read', 'share', 'download')),
  anonymous_session_hash text,
  referrer_host text,
  created_at timestamptz not null default now()
);

create table public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

create table public.reminder_dismissals (
  user_id uuid not null references public.profiles(id) on delete cascade,
  reminder_key text not null,
  dismissed_on date not null default current_date,
  primary key (user_id, reminder_key, dismissed_on)
);

create index publications_status_published_idx on public.publications (status, published_at desc);
create index publications_author_idx on public.publications (author_id, status);
create index publications_topic_idx on public.publications (topic_id, status);
create index topics_parent_sort_idx on public.topics (parent_id, sort_order, title);
create index comments_publication_status_idx on public.comments (publication_id, status, created_at);
create index comments_pending_idx on public.comments (created_at) where status = 'pending';
create index tasks_open_due_idx on public.editorial_tasks (due_at) where completed_at is null;
create index analytics_publication_time_idx on public.analytics_events (publication_id, created_at desc);
create index analytics_type_time_idx on public.analytics_events (event_type, created_at desc);

create or replace function public.current_role()
returns public.app_role language sql stable security definer set search_path = ''
as $$ select coalesce((select role from public.profiles where id = auth.uid()), 'reader'::public.app_role) $$;

create or replace function public.is_editor()
returns boolean language sql stable security definer set search_path = ''
as $$ select public.current_role() in ('admin', 'editor') $$;

create or replace function public.owns_author(author_uuid uuid)
returns boolean language sql stable security definer set search_path = ''
as $$ select exists(select 1 from public.authors where id = author_uuid and profile_id = auth.uid()) $$;

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = ''
as $$ begin new.updated_at = now(); return new; end $$;

create or replace function public.publish_due_publications()
returns integer language plpgsql security definer set search_path = ''
as $$
declare affected integer;
begin
  update public.publications
  set status = 'published', published_at = coalesce(scheduled_at, now()), updated_at = now()
  where status = 'scheduled' and scheduled_at <= now();
  get diagnostics affected = row_count;
  return affected;
end $$;
grant execute on function public.publish_due_publications() to anon, authenticated;

create trigger profiles_updated before update on public.profiles for each row execute function public.set_updated_at();
create trigger authors_updated before update on public.authors for each row execute function public.set_updated_at();
create trigger topics_updated before update on public.topics for each row execute function public.set_updated_at();
create trigger publications_updated before update on public.publications for each row execute function public.set_updated_at();
create trigger comments_updated before update on public.comments for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$ begin
  insert into public.profiles (id, display_name, role)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', ''), 'reader')
  on conflict (id) do nothing;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.authors enable row level security;
alter table public.topics enable row level security;
alter table public.publications enable row level security;
alter table public.editorial_tasks enable row level security;
alter table public.comments enable row level security;
alter table public.likes enable row level security;
alter table public.bookmarks enable row level security;
alter table public.analytics_events enable row level security;
alter table public.site_settings enable row level security;
alter table public.reminder_dismissals enable row level security;

create policy profiles_self_read on public.profiles for select to authenticated using (id = auth.uid() or public.is_editor());
create policy profiles_self_update on public.profiles for update to authenticated
using (id = auth.uid() or public.current_role() = 'admin')
with check ((id = auth.uid() and role = public.current_role()) or public.current_role() = 'admin');
create policy authors_public_read on public.authors for select using (status = 'active' or public.is_editor() or public.owns_author(id));
create policy authors_editor_insert on public.authors for insert to authenticated with check (public.is_editor());
create policy authors_staff_update on public.authors for update to authenticated using (public.is_editor() or public.owns_author(id)) with check (public.is_editor() or public.owns_author(id));
create policy authors_editor_delete on public.authors for delete to authenticated using (public.is_editor());
create policy topics_public_read on public.topics for select using (true);
create policy topics_editor_write on public.topics for all to authenticated using (public.is_editor()) with check (public.is_editor());
create policy publications_public_read on public.publications for select using (status = 'published' or public.is_editor() or public.owns_author(author_id));
create policy publications_staff_insert on public.publications for insert to authenticated with check (public.is_editor() or public.owns_author(author_id));
create policy publications_staff_update on public.publications for update to authenticated using (public.is_editor() or public.owns_author(author_id)) with check (public.is_editor() or public.owns_author(author_id));
create policy publications_editor_delete on public.publications for delete to authenticated using (public.is_editor());
create policy tasks_staff on public.editorial_tasks for all to authenticated using (public.is_editor() or assignee_id = auth.uid()) with check (public.is_editor() or assignee_id = auth.uid());
create policy comments_public_read on public.comments for select using (status = 'approved' or user_id = auth.uid() or public.is_editor());
create policy comments_reader_insert on public.comments for insert to authenticated with check (user_id = auth.uid() and status = 'pending');
create policy comments_owner_update on public.comments for update to authenticated using (user_id = auth.uid() or public.is_editor()) with check (user_id = auth.uid() or public.is_editor());
create policy comments_owner_delete on public.comments for delete to authenticated using (user_id = auth.uid() or public.is_editor());
create policy likes_public_read on public.likes for select using (true);
create policy likes_owner_write on public.likes for insert to authenticated with check (user_id = auth.uid());
create policy likes_owner_delete on public.likes for delete to authenticated using (user_id = auth.uid());
create policy bookmarks_owner_read on public.bookmarks for select to authenticated using (user_id = auth.uid());
create policy bookmarks_owner_write on public.bookmarks for insert to authenticated with check (user_id = auth.uid());
create policy bookmarks_owner_delete on public.bookmarks for delete to authenticated using (user_id = auth.uid());
create policy analytics_public_insert on public.analytics_events for insert
with check (event_type in ('page_view', 'read', 'share', 'download') and (user_id is null or user_id = auth.uid()));
create policy analytics_staff_read on public.analytics_events for select to authenticated using (public.is_editor());
create policy settings_public_read on public.site_settings for select using (true);
create policy settings_admin_write on public.site_settings for all to authenticated using (public.current_role() = 'admin') with check (public.current_role() = 'admin');
create policy dismissals_owner on public.reminder_dismissals for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('publication-media', 'publication-media', true, 10485760, array['image/jpeg','image/png','image/webp']),
  ('author-avatars', 'author-avatars', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy storage_public_read on storage.objects for select using (bucket_id in ('publication-media', 'author-avatars'));
create policy storage_staff_insert on storage.objects for insert to authenticated with check (bucket_id in ('publication-media', 'author-avatars') and public.current_role() in ('admin','editor','author'));
create policy storage_staff_update on storage.objects for update to authenticated using (bucket_id in ('publication-media', 'author-avatars') and public.current_role() in ('admin','editor','author'));
create policy storage_editor_delete on storage.objects for delete to authenticated using (bucket_id in ('publication-media', 'author-avatars') and public.is_editor());

create or replace view public.publication_metrics
with (security_invoker = true)
as
select
  p.id,
  count(distinct ae.id) filter (where ae.event_type = 'page_view')::bigint as views,
  count(distinct l.user_id)::bigint as likes,
  count(distinct c.id) filter (where c.status = 'approved')::bigint as comments
from public.publications p
left join public.analytics_events ae on ae.publication_id = p.id
left join public.likes l on l.publication_id = p.id
left join public.comments c on c.publication_id = p.id
group by p.id;
