-- Adds the missing UPDATE policy for protocol_progress.
-- Without it, re-submitting an already-completed step (which upserts with
-- ON CONFLICT DO UPDATE) is rejected by row-level security.
-- Safe to re-run.

drop policy if exists "protocol_progress: update own" on public.protocol_progress;
create policy "protocol_progress: update own" on public.protocol_progress
  for update using (auth.uid() = user_id);
