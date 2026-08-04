-- Lets a daily check-in optionally carry a photo/video proof, so the
-- Proof-of-Identity Wall can show real photos instead of sport icons.
-- Safe to re-run.

alter table public.checkins
  add column if not exists proof_id uuid references public.proofs (id) on delete set null;
