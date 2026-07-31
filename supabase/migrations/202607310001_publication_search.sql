create extension if not exists pg_trgm;

create index if not exists publications_search_document_idx
on public.publications using gin (
  to_tsvector(
    'english',
    coalesce(title, '') || ' ' ||
    coalesce(subtitle, '') || ' ' ||
    coalesce(excerpt, '') || ' ' ||
    coalesce(scripture, '') || ' ' ||
    coalesce(publication_type, '') || ' ' ||
    coalesce(import_metadata::text, '') || ' ' ||
    regexp_replace(coalesce(body, ''), '<[^>]+>', ' ', 'g')
  )
)
where status = 'published';

create index if not exists publications_title_trgm_idx
on public.publications using gin (lower(title) gin_trgm_ops)
where status = 'published';

create or replace function public.search_publications(
  p_query text,
  p_limit integer default 20,
  p_offset integer default 0
)
returns table (
  id uuid,
  slug text,
  title text,
  subtitle text,
  excerpt text,
  publication_type text,
  scripture text,
  cover_path text,
  published_at timestamptz,
  author_name text,
  author_slug text,
  topic_title text,
  topic_slug text,
  rank real,
  total_count bigint
)
language sql
stable
security invoker
set search_path = public
as $$
  with source as (
    select
      publication.*,
      author.name as matched_author_name,
      author.slug as matched_author_slug,
      topic.title as matched_topic_title,
      topic.slug as matched_topic_slug,
      parent.title as parent_topic_title,
      grandparent.title as grandparent_topic_title,
      concat_ws(' ',
        publication.title,
        publication.subtitle,
        publication.excerpt,
        publication.scripture,
        publication.publication_type,
        publication.import_metadata::text,
        regexp_replace(publication.body, '<[^>]+>', ' ', 'g'),
        author.name,
        topic.title,
        parent.title,
        grandparent.title
      ) as search_text
    from public.publications as publication
    join public.authors as author on author.id = publication.author_id
    left join public.topics as topic on topic.id = publication.topic_id
    left join public.topics as parent on parent.id = topic.parent_id
    left join public.topics as grandparent on grandparent.id = parent.parent_id
    where publication.status = 'published'
  ),
  matched as (
    select
      source.*,
      (
        case when lower(source.title) = lower(trim(p_query)) then 12 else 0 end +
        case when lower(source.title) like lower(trim(p_query)) || '%' then 7 else 0 end +
        case when lower(source.title) like '%' || lower(trim(p_query)) || '%' then 4 else 0 end +
        case when lower(source.matched_author_name) like '%' || lower(trim(p_query)) || '%' then 3 else 0 end +
        case when lower(coalesce(source.matched_topic_title, '')) like '%' || lower(trim(p_query)) || '%' then 3 else 0 end +
        case when lower(source.publication_type) = lower(trim(p_query)) then 2 else 0 end +
        ts_rank_cd(
          setweight(to_tsvector('english', coalesce(source.title, '')), 'A') ||
          setweight(to_tsvector('english', concat_ws(' ', source.subtitle, source.excerpt, source.scripture, source.publication_type, source.import_metadata::text, source.matched_author_name, source.matched_topic_title, source.parent_topic_title, source.grandparent_topic_title)), 'B') ||
          setweight(to_tsvector('english', regexp_replace(coalesce(source.body, ''), '<[^>]+>', ' ', 'g')), 'C'),
          websearch_to_tsquery('english', trim(p_query))
        ) * 4 +
        similarity(lower(source.title), lower(trim(p_query))) * 3
      )::real as search_rank
    from source
    where trim(p_query) <> '' and (
      to_tsvector('english', source.search_text) @@ websearch_to_tsquery('english', trim(p_query))
      or lower(source.search_text) like '%' || lower(trim(p_query)) || '%'
      or similarity(lower(source.title), lower(trim(p_query))) >= 0.12
    )
  )
  select
    matched.id,
    matched.slug,
    matched.title,
    matched.subtitle,
    matched.excerpt,
    matched.publication_type,
    matched.scripture,
    matched.cover_path,
    matched.published_at,
    matched.matched_author_name,
    matched.matched_author_slug,
    matched.matched_topic_title,
    matched.matched_topic_slug,
    matched.search_rank,
    count(*) over()
  from matched
  order by matched.search_rank desc, matched.published_at desc nulls last
  limit least(greatest(p_limit, 1), 50)
  offset greatest(p_offset, 0);
$$;

grant execute on function public.search_publications(text, integer, integer) to anon, authenticated;
