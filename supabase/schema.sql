-- Canonical database schema for the Decision Distortion Self-Assessment.
--
-- Run this in the Supabase SQL Editor to set up a fresh project. It uses
-- IF NOT EXISTS so it won't clobber an existing table. After creating the
-- table, run supabase/policies.sql to apply Row Level Security.
--
-- One table for now: `leads`. Each row is one completed assessment plus the
-- email that unlocked the results. Scores are 0-100 (higher = more distortion).
-- The raw 1-5 answers are kept as JSON for future analysis.

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  company_name text, -- optional company / engagement name the respondent typed
  noise_score integer not null,
  bias_score integer not null,
  accumulation_score integer not null,
  incentive_score integer not null,
  dominant_force text not null,
  answers jsonb not null,
  created_at timestamptz not null default now()
);

-- Adds company_name to a table created before this column existed. Safe to run
-- repeatedly, and required before deploying the optional company-name field.
alter table public.leads add column if not exists company_name text;
