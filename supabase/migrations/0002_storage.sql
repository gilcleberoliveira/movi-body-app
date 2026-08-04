-- Movi Body — storage bucket for proofs & chat media
-- Run this after 0001_init.sql, also in the Supabase SQL Editor.

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Files are stored under a path prefixed with the uploader's user id,
-- e.g. "media/<user_id>/<uuid>.jpg" — anyone can read (public bucket,
-- these are meant to be seen in the wall/community feed), only the
-- owner can write into their own folder.

create policy "media: public read" on storage.objects
  for select using (bucket_id = 'media');

create policy "media: authenticated upload to own folder" on storage.objects
  for insert with check (
    bucket_id = 'media'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "media: owner can delete" on storage.objects
  for delete using (
    bucket_id = 'media'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
