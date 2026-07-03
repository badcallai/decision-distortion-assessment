# Build Log

A running record of what was decided and built, newest at the bottom.

## 2026-07-01 — Project kickoff and scoring lock
- Scaffolded the app with Next.js (App Router) + TypeScript + Tailwind CSS.
- Reviewed the Lesson 2.2 handoff. Resolved the question-count discrepancy: the
  set is **20 questions** (five per force), not 19.
- Locked scoring for v1:
  - Simple average per force, normalized to 0–100 (high = more distortion).
  - Reverse-score all questions except `A1`.
  - Bands: Low 0–33 · Moderate 34–66 · High 67–100.
  - Dominant force = highest score; ties break to the earlier force.
- Deferred: email gate, Supabase, whitepaper routing, consultation CTA, copy
  polish, Vercel deploy.

## 2026-07-01 — Phase 1+2: Questionnaire + profile
- Added `src/lib/questions.ts` — the 20 questions as data (id, force, wording,
  reverse-scored flag) and the four force definitions.
- Added `src/lib/scoring.ts` — reverse-scoring, per-force average → 0–100, band
  assignment, and dominant-force selection. Pure functions.
- Built `src/app/page.tsx` — renders the 20 questions grouped by force with a 1–5
  selector each, collects answers in state, and shows the four-force profile
  (scores, bands, dominant force) on submit. No database or email gate yet.
- Flagged that A1's "Agree = distortion" scoring runs opposite to its healthy
  wording. After a quick back-and-forth, owner corrected the handoff: A1 should be
  treated like every other healthy behavior. **A1 is now reverse-scored** (Strongly
  Agree = no distortion), so all 20 questions score uniformly. Updated
  `questions.ts`, `scoring.ts`, and `CLAUDE.md` to match.

## 2026-07-01 — Deployed to Vercel
- Imported the repo into Vercel and deployed. Live and public at
  https://decision-distortion-assessment.vercel.app/ (confirmed reachable from a
  logged-out browser). Production branch is `claude/brave-volta-rehga0`; every push
  auto-deploys. No environment variables set yet (Supabase comes in Phase 3).

## 2026-07-01 — Phase 3: Email gate + Supabase capture
- Added the `@supabase/supabase-js` dependency (approved: part of the stack).
- Owner decisions: **new Supabase project** for this app (isolated from the writing
  tracker), and **gate everything** (email required before any scores show).
- Added `supabase/schema.sql` (`leads` table) and `supabase/policies.sql`
  (INSERT-only RLS — public cannot read leads back).
- Added `src/lib/supabase.ts` (lazy server-only client) and `src/app/actions.ts`
  (`saveLead` Server Action — validates email, recomputes scores server-side,
  inserts the row).
- Reworked `src/app/page.tsx` into three screens: questionnaire → email gate →
  profile. Answers stay in state; the email gate calls `saveLead`.
- Added `.env.example`. Env vars `SUPABASE_URL` / `SUPABASE_ANON_KEY` still need to
  be set in `.env.local` and in Vercel before capture works end to end.

## 2026-07-02 — Phase 4 (in progress): report routing + email delivery
- Added the `resend` dependency for transactional email (server-only).
- Added the 20 whitepaper PDFs under `pdfs/`, named `<force> - <id>.pdf`.
- Extended `saveLead` (`src/app/actions.ts`): after the lead is stored, it picks
  the respondent's **worst-scored question within the dominant force**, loads the
  matching PDF, and emails the personalized report via Resend with a consultation
  link. The routing is per-question (finer than per-force).
- The email step is wrapped in try/catch: a missing PDF or a Resend failure is
  logged but never fails the submission — capture already succeeded, so the user
  still sees their profile.
- New env var `RESEND_API_KEY` (server-only) must be set in `.env.local` and in
  Vercel. Updated `CLAUDE.md` (stack, env vars, phases, resolved the email-delivery
  open decision).

## 2026-07-03 — Display: hide numeric scores, nudge tie winner
- Removed the numeric `X/100` from both display surfaces. The results screen and
  the report email (HTML table + dominant callout + plain-text lines) now show the
  band label only; the results screen keeps its visual bar. Scores are still
  computed and written to Supabase — only hidden from the respondent.
- Left the email without a bar (owner decision): band label only there.
- Tie nudge (results screen, visual only): when two or more forces share the top
  score, the dominant (PDF-routing) force's bar renders at `min(score + 8, 100)
## 2026-07-03 — Display: hide numeric scores, nudge tie winner
- Removed the numeric `X/100` from both display surfaces. The results screen and
  the report email (HTML table + dominant callout + plain-text lines) now show the
  band label only; the results screen keeps its visual bar. Scores are still
  computed and written to Supabase — only hidden from the respondent.
- Left the email without a bar (owner decision): band label only there.
- Tie nudge (results screen, visual only): when two or more forces share the top
  score, the dominant (PDF-routing) force's bar renders at `min(score + 8, 100)%`
  so it reads as the clear winner. All other bars, including the tied loser, keep
  their true width; score and band values are untouched. Reuses the existing
  `profile.dominant` from `scoring.ts` — no scoring change.

## 2026-07-03 — Copy: frequency scale anchors
- Replaced the generic Likert anchors (Strongly disagree … Strongly agree) with a
  frequency scale: Consistently true (5), Often true (4), Sometimes true (3),
  Rarely true (2), Not true of us (1). "Consistently true" stays at 5, so the
  healthy-behavior / reverse-scoring direction is unchanged — no scoring math moved.
- Updated `src/app/page.tsx` (the `SCALE` array), `CLAUDE.md` (locked scale +
  scoring description), and the stale anchor references in `scoring.ts`,
  `questions.ts`, and `scripts/test-email.ts`.
