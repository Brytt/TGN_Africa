alter table public.authors
  add column if not exists deleted_at timestamptz;

create index if not exists authors_deleted_at_idx
  on public.authors (deleted_at);
