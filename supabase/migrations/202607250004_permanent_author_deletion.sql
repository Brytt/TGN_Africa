alter table public.publications
  alter column author_id drop not null;

alter table public.publications
  drop constraint if exists publications_author_id_fkey;

alter table public.publications
  add constraint publications_author_id_fkey
  foreign key (author_id) references public.authors(id) on delete set null;

-- Release accounts archived by the previous removal workflow.
delete from auth.users
where id in (
  select profile_id
  from public.authors
  where deleted_at is not null and profile_id is not null
);

delete from public.authors where deleted_at is not null;

-- Clean up author login accounts left behind by the older hard-delete route.
delete from auth.users as auth_user
using public.profiles as profile
where auth_user.id = profile.id
  and profile.role = 'author'
  and not exists (
    select 1
    from public.authors as author
    where author.profile_id = auth_user.id
  );

drop index if exists public.authors_deleted_at_idx;

alter table public.authors
  drop column if exists deleted_at;
