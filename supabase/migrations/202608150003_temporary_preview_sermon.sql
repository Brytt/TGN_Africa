insert into public.sermons (
  slug,
  title,
  speaker,
  scripture,
  series,
  description,
  media_type,
  audio_url,
  video_url,
  cover_path,
  status,
  preached_at,
  published_at
)
select
  'temporary-sermon-preview',
  'Faithful Through Every Season — Temporary Preview',
  'TGN Preview Speaker',
  'Psalm 46:1–3',
  'Temporary Design Preview',
  'This temporary sermon was created to preview the public sermon archive, media presentation, filtering, pagination, and related-sermon experience. It can be safely removed after the design has been reviewed.',
  media_type,
  audio_url,
  video_url,
  cover_path,
  'published',
  current_date,
  now()
from public.sermons
where status = 'published'
order by preached_at desc, published_at desc nulls last
limit 1
on conflict (slug) do update set
  title = excluded.title,
  speaker = excluded.speaker,
  scripture = excluded.scripture,
  series = excluded.series,
  description = excluded.description,
  media_type = excluded.media_type,
  audio_url = excluded.audio_url,
  video_url = excluded.video_url,
  cover_path = excluded.cover_path,
  status = excluded.status,
  preached_at = excluded.preached_at,
  published_at = excluded.published_at,
  updated_at = now();
