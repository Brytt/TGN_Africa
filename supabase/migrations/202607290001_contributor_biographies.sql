alter table public.authors
  add column if not exists short_bio text;

comment on column public.authors.bio is
  'Full contributor profile biography, recommended length 250 to 300 words.';

comment on column public.authors.short_bio is
  'Concise contributor biography shown beneath publications, recommended length 20 to 25 words.';
