-- Milestone-based protocol (18 milestones, 6/season) replaces the old 90
-- mandatory daily challenges. This migration is purely additive — it does
-- NOT touch existing checkins/protocol_progress/proofs data, so anything
-- completed under the old system stays intact as history.
-- Safe to re-run.

-- ─────────────────────────────────────────────────────────────
-- milestone_progress: completion of one of the 18 intentional milestones
-- ─────────────────────────────────────────────────────────────
create table if not exists public.milestone_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  milestone_id integer not null,
  response_text text,
  proof_id uuid references public.proofs (id) on delete set null,
  completed_at timestamptz not null default now(),
  unique (user_id, milestone_id)
);

alter table public.milestone_progress enable row level security;

drop policy if exists "milestone_progress: read own" on public.milestone_progress;
create policy "milestone_progress: read own" on public.milestone_progress
  for select using (auth.uid() = user_id);
drop policy if exists "milestone_progress: insert own" on public.milestone_progress;
create policy "milestone_progress: insert own" on public.milestone_progress
  for insert with check (auth.uid() = user_id);
drop policy if exists "milestone_progress: update own" on public.milestone_progress;
create policy "milestone_progress: update own" on public.milestone_progress
  for update using (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- mission_log: optional "Need a reset?" mini-missions — completed or
-- abandoned without affecting the streak
-- ─────────────────────────────────────────────────────────────
create table if not exists public.mission_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  mission_id integer not null,
  status text not null check (status in ('completed', 'abandoned')),
  created_at timestamptz not null default now()
);

alter table public.mission_log enable row level security;

drop policy if exists "mission_log: read own" on public.mission_log;
create policy "mission_log: read own" on public.mission_log
  for select using (auth.uid() = user_id);
drop policy if exists "mission_log: insert own" on public.mission_log;
create policy "mission_log: insert own" on public.mission_log
  for insert with check (auth.uid() = user_id);
