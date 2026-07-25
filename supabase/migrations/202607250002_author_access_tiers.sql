-- Normalize contributor access into the three editorial tiers used by the app.
-- Super Authors retain administrator privileges; every other existing staff
-- contributor starts at the safest Author tier.
update public.authors as author
set editorial_role = case
  when exists (
    select 1
    from public.profiles as profile
    where profile.id = author.profile_id
      and profile.role = 'admin'
  ) then 'Super Author'
  when author.editorial_role = 'Contributing Author' then 'Contributing Author'
  else 'Author'
end;

update public.profiles as profile
set role = case
  when exists (
    select 1
    from public.authors as author
    where author.profile_id = profile.id
      and author.editorial_role = 'Super Author'
  ) then 'admin'::public.app_role
  when profile.role in ('admin', 'editor', 'author') then 'author'::public.app_role
  else profile.role
end;
