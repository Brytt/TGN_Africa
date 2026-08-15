create table if not exists public.admin_activity_log (
  id bigint generated always as identity primary key,
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null check (action in ('created', 'updated', 'deleted')),
  entity_type text not null,
  entity_id text,
  entity_label text,
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz not null default now()
);

create index if not exists admin_activity_created_idx on public.admin_activity_log (created_at desc);
create index if not exists admin_activity_actor_idx on public.admin_activity_log (actor_id, created_at desc);
create index if not exists admin_activity_entity_idx on public.admin_activity_log (entity_type, entity_id, created_at desc);

alter table public.admin_activity_log enable row level security;
create policy admin_activity_staff_read on public.admin_activity_log for select to authenticated using (public.is_editor());

create or replace function public.record_admin_activity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  payload jsonb;
  record_id text;
  record_label text;
begin
  payload := case when tg_op = 'DELETE' then to_jsonb(old) else to_jsonb(new) end;
  record_id := payload->>'id';
  record_label := coalesce(payload->>'title', payload->>'name', payload->>'subject', payload->>'email', payload->>'slug', record_id);
  insert into public.admin_activity_log (actor_id, action, entity_type, entity_id, entity_label, old_data, new_data)
  values (
    auth.uid(),
    case tg_op when 'INSERT' then 'created' when 'UPDATE' then 'updated' else 'deleted' end,
    tg_table_name,
    record_id,
    record_label,
    case when tg_op in ('UPDATE', 'DELETE') then to_jsonb(old) end,
    case when tg_op in ('INSERT', 'UPDATE') then to_jsonb(new) end
  );
  return case when tg_op = 'DELETE' then old else new end;
end;
$$;

do $$
declare
  table_name text;
begin
  foreach table_name in array array['sermons', 'publications', 'authors', 'topics', 'comments', 'newsletter_subscribers', 'email_updates']
  loop
    execute format('drop trigger if exists audit_%I_activity on public.%I', table_name, table_name);
    execute format('create trigger audit_%I_activity after insert or update or delete on public.%I for each row execute function public.record_admin_activity()', table_name, table_name);
  end loop;
end $$;
