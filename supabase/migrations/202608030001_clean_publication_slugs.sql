-- Remove the timestamp suffix previously added to publication URLs. Preserve the
-- former value so incoming links can still be resolved and redirected.
with generated_slugs as (
  select
    id,
    slug as previous_slug,
    regexp_replace(slug, '-[a-z0-9]{8}$', '') as clean_slug,
    row_number() over (
      partition by regexp_replace(slug, '-[a-z0-9]{8}$', '')
      order by published_at asc nulls last, created_at asc, id asc
    ) as clean_slug_rank
  from public.publications
  where slug ~ '-[a-z0-9]{8}$'
), safe_updates as (
  select candidate.*
  from generated_slugs candidate
  where candidate.clean_slug <> ''
    and candidate.clean_slug_rank = 1
    and not exists (
      select 1
      from public.publications existing
      where existing.slug = candidate.clean_slug
        and existing.id <> candidate.id
    )
)
update public.publications publication
set
  slug = safe_updates.clean_slug,
  import_metadata = jsonb_set(
    coalesce(publication.import_metadata, '{}'::jsonb),
    '{previous_slugs}',
    coalesce(publication.import_metadata->'previous_slugs', '[]'::jsonb) || to_jsonb(safe_updates.previous_slug),
    true
  )
from safe_updates
where publication.id = safe_updates.id;
