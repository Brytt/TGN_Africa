alter table public.authors
  add column if not exists linkedin_url text,
  add column if not exists instagram_url text,
  add column if not exists facebook_url text;

alter table public.comments
  add column if not exists parent_id uuid references public.comments(id) on delete set null;

create table if not exists public.comment_likes (
  comment_id uuid not null references public.comments(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (comment_id, user_id)
);

create index if not exists comments_parent_idx on public.comments(parent_id);
alter table public.comment_likes enable row level security;
create policy comment_likes_public_read on public.comment_likes for select using (true);
create policy comment_likes_owner_insert on public.comment_likes for insert to authenticated with check (user_id = auth.uid());
create policy comment_likes_owner_delete on public.comment_likes for delete to authenticated using (user_id = auth.uid());
