-- Index foreign keys and user-filtered columns used by RLS and common requests.
create index if not exists authors_profile_id_idx on public.authors(profile_id) where profile_id is not null;
create index if not exists editorial_tasks_assignee_idx on public.editorial_tasks(assignee_id) where assignee_id is not null;
create index if not exists comments_user_id_idx on public.comments(user_id);
create index if not exists likes_user_id_idx on public.likes(user_id);
create index if not exists bookmarks_user_id_idx on public.bookmarks(user_id);
create index if not exists analytics_events_user_id_idx on public.analytics_events(user_id) where user_id is not null;
create index if not exists reminder_dismissals_user_id_idx on public.reminder_dismissals(user_id);
create index if not exists comment_likes_user_id_idx on public.comment_likes(user_id);

-- Evaluate auth.uid() once per statement rather than once for every candidate row.
drop policy if exists profiles_self_read on public.profiles;
create policy profiles_self_read on public.profiles for select to authenticated
using (id = (select auth.uid()) or public.is_editor());

drop policy if exists comments_public_read on public.comments;
create policy comments_public_read on public.comments for select
using (status = 'approved' or user_id = (select auth.uid()) or public.is_editor());

drop policy if exists comments_reader_insert on public.comments;
create policy comments_reader_insert on public.comments for insert to authenticated
with check (user_id = (select auth.uid()) and status = 'pending');

drop policy if exists likes_owner_write on public.likes;
create policy likes_owner_write on public.likes for insert to authenticated
with check (user_id = (select auth.uid()));

drop policy if exists likes_owner_delete on public.likes;
create policy likes_owner_delete on public.likes for delete to authenticated
using (user_id = (select auth.uid()));

drop policy if exists bookmarks_owner_read on public.bookmarks;
create policy bookmarks_owner_read on public.bookmarks for select to authenticated
using (user_id = (select auth.uid()));

drop policy if exists bookmarks_owner_write on public.bookmarks;
create policy bookmarks_owner_write on public.bookmarks for insert to authenticated
with check (user_id = (select auth.uid()));

drop policy if exists bookmarks_owner_delete on public.bookmarks;
create policy bookmarks_owner_delete on public.bookmarks for delete to authenticated
using (user_id = (select auth.uid()));

drop policy if exists comment_likes_owner_insert on public.comment_likes;
create policy comment_likes_owner_insert on public.comment_likes for insert to authenticated
with check (user_id = (select auth.uid()));

drop policy if exists comment_likes_owner_delete on public.comment_likes;
create policy comment_likes_owner_delete on public.comment_likes for delete to authenticated
using (user_id = (select auth.uid()));
