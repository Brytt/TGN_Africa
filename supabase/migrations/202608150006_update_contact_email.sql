insert into public.site_settings (key, value)
values ('contactEmail', to_jsonb('info@tgnafrica.com'::text))
on conflict (key) do update
set value = excluded.value;
