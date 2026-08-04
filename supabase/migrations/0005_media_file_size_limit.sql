-- Raises the "media" bucket's per-file size limit to 200MB so a ~1 minute
-- 4K phone video (commonly 100-200MB) can be uploaded. Uploads now go
-- directly from the browser to Storage, so this is the only real limit —
-- Vercel's own function size limits no longer apply to file uploads.
-- Safe to re-run.

update storage.buckets
set file_size_limit = 209715200 -- 200MB in bytes
where id = 'media';
