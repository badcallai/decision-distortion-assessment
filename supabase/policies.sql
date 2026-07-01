-- Row Level Security (RLS) policies for the Decision Distortion Self-Assessment.
--
-- The app writes leads with the anon key, so RLS applies to it. We allow INSERT
-- only. There is deliberately NO select/update/delete policy: with RLS enabled
-- and no read policy, the public anon key cannot read, change, or remove leads,
-- so captured emails stay private. Read your lead list in the Supabase dashboard
-- (Table Editor), which uses the service role and bypasses RLS.
--
-- Safe to run repeatedly: the policy is dropped first, and enabling RLS that is
-- already enabled is a no-op. Run this in the Supabase SQL Editor.

alter table public.leads enable row level security;

drop policy if exists "leads are insertable" on public.leads;
create policy "leads are insertable"
  on public.leads for insert
  with check (true);
