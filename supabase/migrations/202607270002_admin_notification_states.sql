create table if not exists public.admin_notification_states (
  user_id uuid not null references public.profiles(id) on delete cascade,
  notification_id text not null,
  read_at timestamptz,
  cleared_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, notification_id)
);

create index if not exists admin_notification_states_user_updated_idx
  on public.admin_notification_states(user_id, updated_at desc);

alter table public.admin_notification_states enable row level security;

create policy admin_notification_states_owner_select
  on public.admin_notification_states for select
  to authenticated using (user_id = auth.uid());

create policy admin_notification_states_owner_insert
  on public.admin_notification_states for insert
  to authenticated with check (user_id = auth.uid());

create policy admin_notification_states_owner_update
  on public.admin_notification_states for update
  to authenticated using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy admin_notification_states_owner_delete
  on public.admin_notification_states for delete
  to authenticated using (user_id = auth.uid());

drop trigger if exists admin_notification_states_updated on public.admin_notification_states;
create trigger admin_notification_states_updated
  before update on public.admin_notification_states
  for each row execute function public.set_updated_at();
