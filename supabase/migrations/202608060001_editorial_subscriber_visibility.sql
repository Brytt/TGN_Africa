-- Editorial leadership may view the subscriber directory.
-- Contributors, guest authors, and public readers remain unable to access PII.
drop policy if exists newsletter_subscribers_admin_read on public.newsletter_subscribers;
drop policy if exists newsletter_subscribers_editorial_read on public.newsletter_subscribers;

create policy newsletter_subscribers_editorial_read
  on public.newsletter_subscribers
  for select
  to authenticated
  using (public.current_role() in ('admin', 'editor'));
