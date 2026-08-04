-- Movi Body — initial schema
-- Run this in the Supabase SQL Editor (Project → SQL Editor → New query → paste → Run)

create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────────────────────
-- profiles: one row per authenticated user, holds game state
-- ─────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null default 'New member',
  email text,
  avatar_initial text not null default 'M',
  xp integer not null default 0,
  level integer not null default 1,
  streak_current integer not null default 0,
  streak_longest integer not null default 0,
  shields_available integer not null default 0,
  checkins_this_week integer not null default 0,
  day_in_season integer not null default 0,
  season_current integer not null default 1,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles: read own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles: update own" on public.profiles
  for update using (auth.uid() = id);
create policy "profiles: insert own" on public.profiles
  for insert with check (auth.uid() = id);

-- auto-create a profile row whenever a new auth user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, avatar_initial)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    new.email,
    upper(left(coalesce(new.raw_user_meta_data ->> 'name', new.email, 'M'), 1))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─────────────────────────────────────────────────────────────
-- checkins: one row per daily "did you show up" confirmation
-- ─────────────────────────────────────────────────────────────
create table if not exists public.checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  sport_id text not null,
  season integer not null,
  day_in_season integer not null,
  created_at timestamptz not null default now()
);

alter table public.checkins enable row level security;

create policy "checkins: read own" on public.checkins
  for select using (auth.uid() = user_id);
create policy "checkins: insert own" on public.checkins
  for insert with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- proofs: uploaded media (photo/video/audio) backing a checkin or a
-- protocol step submission — files live in Supabase Storage
-- ─────────────────────────────────────────────────────────────
create table if not exists public.proofs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  kind text not null check (kind in ('photo', 'video', 'audio')),
  storage_path text not null,
  caption text,
  created_at timestamptz not null default now()
);

alter table public.proofs enable row level security;

create policy "proofs: read own" on public.proofs
  for select using (auth.uid() = user_id);
create policy "proofs: insert own" on public.proofs
  for insert with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- protocol_progress: completed steps of the 90-day protocol
-- ─────────────────────────────────────────────────────────────
create table if not exists public.protocol_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  step_id integer not null,
  response_text text,
  proof_id uuid references public.proofs (id) on delete set null,
  completed_at timestamptz not null default now(),
  unique (user_id, step_id)
);

alter table public.protocol_progress enable row level security;

create policy "protocol_progress: read own" on public.protocol_progress
  for select using (auth.uid() = user_id);
create policy "protocol_progress: insert own" on public.protocol_progress
  for insert with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- journal_entries: nightly reflection text
-- ─────────────────────────────────────────────────────────────
create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

alter table public.journal_entries enable row level security;

create policy "journal_entries: read own" on public.journal_entries
  for select using (auth.uid() = user_id);
create policy "journal_entries: insert own" on public.journal_entries
  for insert with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- transformations: short "changes noticed" bullets on the profile
-- ─────────────────────────────────────────────────────────────
create table if not exists public.transformations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

alter table public.transformations enable row level security;

create policy "transformations: read own" on public.transformations
  for select using (auth.uid() = user_id);
create policy "transformations: insert own" on public.transformations
  for insert with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- daily_interactions: like / save / share state per daily message
-- ─────────────────────────────────────────────────────────────
create table if not exists public.daily_interactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  day integer not null,
  liked boolean not null default false,
  saved boolean not null default false,
  shared boolean not null default false,
  updated_at timestamptz not null default now(),
  unique (user_id, day)
);

alter table public.daily_interactions enable row level security;

create policy "daily_interactions: read own" on public.daily_interactions
  for select using (auth.uid() = user_id);
create policy "daily_interactions: upsert own" on public.daily_interactions
  for insert with check (auth.uid() = user_id);
create policy "daily_interactions: update own" on public.daily_interactions
  for update using (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- chat_messages: shared community room, messages "expire" after 24h
-- (the app filters by created_at; run the cleanup query below on a
-- schedule — e.g. Supabase's pg_cron — if you want them actually deleted)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  initial text not null,
  kind text not null check (kind in ('text', 'media')),
  body text,
  storage_path text,
  created_at timestamptz not null default now()
);

alter table public.chat_messages enable row level security;

-- any authenticated member can read the shared room
create policy "chat_messages: read all" on public.chat_messages
  for select using (auth.role() = 'authenticated');
create policy "chat_messages: insert own" on public.chat_messages
  for insert with check (auth.uid() = user_id);

-- optional: delete messages older than 24h (schedule with pg_cron if available)
-- select cron.schedule('purge-chat', '0 * * * *',
--   $$ delete from public.chat_messages where created_at < now() - interval '24 hours'; $$);

-- ─────────────────────────────────────────────────────────────
-- realtime: broadcast chat inserts to subscribed clients
-- ─────────────────────────────────────────────────────────────
alter publication supabase_realtime add table public.chat_messages;
