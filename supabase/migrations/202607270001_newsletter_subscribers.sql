create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  display_name text,
  status text not null default 'active' check (status in ('active', 'unsubscribed')),
  consented_at timestamptz not null default now(),
  unsubscribed_at timestamptz,
  unsubscribe_token uuid not null default gen_random_uuid() unique,
  source text not null default 'website',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists newsletter_subscribers_email_lower_idx
  on public.newsletter_subscribers(lower(email));
create index if not exists newsletter_subscribers_status_created_idx
  on public.newsletter_subscribers(status, created_at desc);

alter table public.newsletter_subscribers enable row level security;
create policy newsletter_subscribers_admin_read on public.newsletter_subscribers
  for select to authenticated using (public.current_role() = 'admin');

drop trigger if exists newsletter_subscribers_updated on public.newsletter_subscribers;
create trigger newsletter_subscribers_updated
  before update on public.newsletter_subscribers
  for each row execute function public.set_updated_at();
