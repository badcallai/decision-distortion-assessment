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
  wording. Owner confirmed this is deliberate: **keep A1 as the exception** as the
  handoff specifies. Left the code unchanged; noted in `questions.ts` so it is not
  reverted later.
