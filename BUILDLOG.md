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

## 2026-07-03 — Look & feel: all-navy overhaul
- Reskinned the entire app (all three screens) from the light zinc theme to an
  all-navy palette with a blue accent. No white backgrounds anywhere.
- Palette as Tailwind tokens in `globals.css`: navy #1b2f4e (base), card #1e3458,
  hero #223662, select #1a4878, accent #5ba3e0, plus ink/muted/line text+border
  tokens. Body background set to navy globally.
- `layout.tsx`: added Playfair Display (next/font) for the "LFB Holdings" wordmark.
- `page.tsx`: shared header (wordmark + "Strategic Advisory" small-caps tagline) on
  every screen; hero band with the new hero line + sub-copy; section headers are
  the force name only with an italic muted description; answer buttons show the
  five frequency labels with no numbers on one row (grid-cols-5), selected = navy
  fill + blue border + light text; thin blue progress bar in the footer. Email gate
  and results screen re-themed to match (navy input, blue-accent bars/callout).
  Green/amber/red band chips kept for at-a-glance severity; tie-nudge unchanged.
- The transactional report email was left light (dark HTML emails render poorly
  across clients). Scoring and the email builder untouched.

## 2026-07-05 — Look & feel: light theme matched to lfbholdings.com
- Reversed the all-navy dark overhaul in favor of a light theme pulled from the live
  lfbholdings.com site (which is light with a navy + burnt-orange identity). Extracted the
  site's actual tokens: fonts Archivo (headings) + Roboto (body); page bg #f3f5f7; white
  cards; navy #1b263b; accent burnt orange #bb6108.
- `globals.css`: new light palette tokens (page/card/line/hero/ink/heading/muted/accent/
  accent-hover/select/bar/track); body background now light.
- `layout.tsx`: swapped Playfair/Geist for Archivo (headings + wordmark) + Roboto (body).
- `page.tsx`: light canvas, white cards, navy hero band with white text, orange buttons +
  progress bar, selected answer = orange border + light-orange fill + navy text, navy score
  bars on a light track. Green/amber/red band chips kept. Scoring + tie-nudge unchanged.
- Hero band is solid navy for now; a photo can be added later at public/hero.jpg (the image
  the owner first supplied was a 200x97 thumbnail, too small to use).
- Updated the "Design — Locked" section of app-codebase-context.md to the new palette.

## 2026-07-05 — Fix: tie-nudge at the 100% ceiling
- The tie-nudge only bumped the winner's bar up (`min(score + 8, 100)`), so when
  forces tied at 100 the winner couldn't pull ahead — all bars showed 100% even
  though the report named a dominant force (reproduced by maxing out all four).
- Now the winner keeps an 8-point gap either way: it bumps up when there's headroom,
  and when it's already at 100 the tied bars are marked down to 92 instead. Non-tied
  forces keep their true width. Below the ceiling the behavior is unchanged.
- Display-only (`page.tsx` results screen). Scoring, dominant-force pick, bands, and
  the email are untouched. Verified with the all-maxed case: Noise 100%, others 92%.

## 2026-07-05 — Feature: optional company / engagement name
- Added an optional "Company or engagement name — optional" text field on the email
  gate (above the email; not required; blank is stored as null). Useful for the
  consultant use case (one respondent assessing a named client).
- New nullable column `leads.company_name`. Ran `alter table public.leads add column
  if not exists company_name text;` in Supabase before deploying; also added it to
  `supabase/schema.sql` (create + safe alter).
- `saveLead` now takes an optional companyName, stores it, and passes it to the email
  builder. `report-email.ts` echoes "Prepared for {name}" (HTML-escaped) when present;
  the results screen shows the same line. Both hidden when the field is left blank.
- Docs updated: CLAUDE.md leads schema + app-codebase-context.md. Scoring, bands,
  tie-nudge, and PDF routing untouched.

## 2026-07-05 — Results screen: exit to lfbholdings.com
- The results screen previously ended with only "Start over", so a finished
  respondent had no way out of the app. Added a primary "Return to lfbholdings.com"
  link (same-tab navigation to the homepage) alongside Start over.
- Display-only addition to page.tsx; nothing else touched.

## 2026-07-05 — Email gate + results polish
- Results screen: "Prepared for {name}" now matches the "A longer bar…" line size
  (dropped text-sm so both are base 16px).
- Email gate: reordered so the email field is first and the optional company field
  second. Replaced the company field's separate label + "Acme Credit Union"
  placeholder with a single placeholder "Company or engagement name — optional"
  (kept an aria-label for screen readers), matching the email field's style.

## 2026-07-05 — Feature: PDF cover page when a company name is given
- When the respondent fills the optional company/engagement name, the emailed
  whitepaper now gets a generated one-page transmittal cover as page 1. Blank name
  attaches the whitepaper unchanged (no cover).
- Added `pdf-lib` (approved). New `src/lib/cover-page.ts` builds a spare cover in
  memory — "LFB Holdings", "Decision Distortion Assessment", "Prepared for {name}",
  and the generation date, centered — then prepends the whitepaper pages. Disk PDFs
  are never touched; everything stays in memory.
- `actions.ts` calls it only when a company name is present, wrapped in try/catch:
  any cover failure logs and falls back to the plain whitepaper so it never blocks
  the email. Client-facing attachment filename (Noise.pdf, etc.) is unchanged.
- Verified: helper merge (2-page whitepaper → 3 pages; cover text/order confirmed
  by extraction) and two live submissions — with a company (cover path, ~4.5s) and
  without (skipped, ~1.9s), both succeeding with no cover/email errors logged.

## 2026-07-05 — Email gate: autocomplete hints
- Browsers were offering credit-card/contact autofill on the email field because it
  carried no autocomplete hint (type="email" alone doesn't steer autofill).
- Email field: added `name="email"` + `autoComplete="email"` so browsers offer saved
  addresses only. Company/engagement field: added `autoComplete="off"` to suppress
  unwanted suggestions without asserting a value type — it stays free-form (org,
  project name, code, or number all still accepted).
- Display-only change to page.tsx; input handling, scoring, and storage untouched.

## 2026-07-05 — Branding: LFB Holdings logo on app + PDF cover
- Added the LFB Holdings logo across all three app screens and the PDF cover. The
  owner supplied a 4x transparent PNG; cropped it tight to the artwork and saved as
  `public/logo.png` (708x411, transparent). The earlier text-based SVG was unusable
  (Google-Font `<text>`, renders as the wrong typeface via `<img>`), and the first
  PNG had a baked-in cream background — the transparent 4x PNG is the source of truth.
- `page.tsx` `Header()`: replaced the text "LFB Holdings" wordmark with the logo
  (`next/image`, 150px wide) on the light page background. Kept the tagline beneath
  it and trimmed it from "Strategic Advisory · lfbholdings.com" to just
  "Strategic Advisory" (owner request).
- `cover-page.ts`: embed the logo (`doc.embedPng`, 200pt wide, centered near the top)
  in place of the drawn "LFB Holdings" text line; title/"Prepared for"/date sit below.
  Reads bytes from `public/logo.png` server-side. Dropped the now-unused bold font.
- Verified: `npm run build` clean; cover smoke test (2-page whitepaper → 3 pages) with
  the embedded image carrying its alpha (SMask) and the text lines intact; header
  eyeballed on the dev server. Scoring, routing, capture, and email content untouched.
