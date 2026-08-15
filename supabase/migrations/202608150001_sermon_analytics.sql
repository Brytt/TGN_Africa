create table if not exists public.sermon_analytics_events (
  id bigint generated always as identity primary key,
  sermon_id uuid not null references public.sermons(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  event_type text not null check (event_type in ('page_view', 'listen', 'watch')),
  anonymous_session_hash text,
  referrer_host text,
  created_at timestamptz not null default now()
);

create index if not exists sermon_analytics_sermon_time_idx
  on public.sermon_analytics_events (sermon_id, created_at desc);
create index if not exists sermon_analytics_type_time_idx
  on public.sermon_analytics_events (event_type, created_at desc);

alter table public.sermon_analytics_events enable row level security;

create policy sermon_analytics_public_insert
  on public.sermon_analytics_events for insert
  with check (
    event_type in ('page_view', 'listen', 'watch')
    and (user_id is null or user_id = auth.uid())
  );

create policy sermon_analytics_staff_read
  on public.sermon_analytics_events for select to authenticated
  using (public.is_editor());
