alter table public.authors
  add column if not exists is_staff boolean not null default false,
  add column if not exists admin_menu_access text[] not null default '{}'::text[];

alter table public.authors
  add constraint authors_editorial_role_check
  check (editorial_role in ('Founder', 'Managing Editor', 'Deputy Editor', 'Contributor', 'Guest Author'))
  not valid;

update public.authors
set
  editorial_role = case
    when lower(name) = 'kwesi sena' then 'Founder'
    when lower(name) like 'michael franco smit%' then 'Managing Editor'
    when lower(name) like 'ebenezer foster-nyarko%' then 'Deputy Editor'
    when lower(name) in ('enoch anti', 'andrews ampomah', 'francis sowani') then 'Contributor'
    else 'Guest Author'
  end,
  is_staff = lower(name) = 'kwesi sena'
    or lower(name) like 'michael franco smit%'
    or lower(name) like 'ebenezer foster-nyarko%'
    or lower(name) in ('enoch anti', 'andrews ampomah', 'francis sowani'),
  admin_menu_access = '{}'::text[];

alter table public.authors validate constraint authors_editorial_role_check;

update public.profiles as profile
set role = case
  when author.editorial_role = 'Founder' then 'admin'::public.app_role
  when author.editorial_role in ('Managing Editor', 'Deputy Editor') then 'editor'::public.app_role
  else 'author'::public.app_role
end
from public.authors as author
where author.profile_id = profile.id;

create index if not exists authors_staff_role_idx
  on public.authors (is_staff, editorial_role)
  where status = 'active';
