# CLAUDE.md

## What this is
The **Decision Distortion Self-Assessment** — an interactive self-assessment for
founders and credit-union executives, built by LFB Holdings as a lead magnet
(Lesson 2.2 of the AI Mastery Plan). A respondent answers 20 questions on a 1–5
scale and receives a profile showing which of the four **Decision Distortion
forces** are most active in their organization. The full report is later gated
behind an email capture, routed to a matching whitepaper edition, with a
consultation call-to-action.

This file is the source of truth for the project. Re-read it at the top of every
session. The repo — not any handoff document — is the authority; a document is a
proposal until it is real in the repo.

## The four forces
- **Noise** — unwanted variability in judgment: identical inputs producing
  different conclusions, with no principled reason.
- **Bias** — directional distortion: the same kind of mistake, repeatedly,
  pointing the same way (confirmation, overconfidence, anchoring).
- **Accumulation** — individually defensible decisions that become unsteerable in
  aggregate; the subtractive option stays invisible.
- **Incentive Misalignment** — the environmental layer (metrics, comp, reward
  structures) that governs how fast the other three compound.

## Locked data shape and scoring (single source of truth)
Settled with the owner on 2026-07-01. Do not change without asking.

**Questions:** 20 total, five per force. The canonical copy lives in
`src/lib/questions.ts` (`QUESTIONS`). Each question has an id (e.g. `N1`), a
force, the exact wording, and a `reverseScored` flag.

**Scale:** 1–5 Likert (1 = Strongly Disagree … 5 = Strongly Agree).

**Scoring:** every question is worded as a healthy behavior and is reverse-scored.
Reverse-scoring flips the response (`6 - response`) so that Disagree = distortion
present (Strongly Agree = no distortion). A force's score is the average of its
five adjusted item scores, normalized to a 0–100 scale where high = more
distortion. The canonical logic lives in `src/lib/scoring.ts`.

**Bands (per force, 0–100):** Low 0–33 · Moderate 34–66 · High 67–100.

**Dominant force:** the highest-scoring force. On a tie, the earlier force in the
canonical order wins (proper tie-handling is deferred).

## Tech stack — use these, don't substitute
- **Next.js** (App Router) + **TypeScript**
- **Tailwind CSS** — all styling, no other CSS framework
- **Supabase** — database (later phases); server-only always
- **Vercel** — deployment

## Standing rules (carried from the handoff)
- **Plan before Act.** Show planned changes before editing; wait for go-ahead.
- **One feature per conversation.** Don't stack features.
- **Git commit after each working feature.** Keep `BUILDLOG.md` current.
- **Server-only Supabase.** Server Components read, Server Actions write. No
  database credential in client code, no `NEXT_PUBLIC_` on it.
- **Start each session from committed state, not imagined state.**
- **Keep it simple.** A beginner should be able to read any file. No unnecessary
  abstractions, no dependencies without asking, no features not requested.
- Explain code as outcomes, not line-by-line syntax. When something breaks, ask
  for the exact error, explain what it means, then fix it.

## Build phases
- **Phase 0 — Skeleton.** Next.js scaffold, deployed. (scaffold done)
- **Phase 1+2 — Questionnaire + profile.** Render 20 questions, collect answers,
  compute the four-force scores, show the profile on screen. (this build)
- **Phase 3 — Email gate + capture.** Gate the full report; write lead + scores to
  Supabase.
- **Phase 4 — Routing + CTA.** Dominant force routes to the matching whitepaper +
  consultation CTA.
- **Phase 5 — Copy + placement.** Voice pass; place/link on lfbholdings.com.

## Open decisions (not yet resolved)
- Which whitepaper editions exist and how each force maps to one (Phase 4).
- Where on lfbholdings.com the tool lives (Phase 5).
- Email delivery: capture-only first; actual sending is a later, separate decision.
