# Decision Distortion Assessment — Codebase Reference

This file exists so any new chat session is fully oriented on the codebase without needing to ask.

> Corrected to match the repo on July 3, 2026. Where this doc and the code ever disagree,
> the code (and `CLAUDE.md`) win — fix the doc, not your memory.

---

## Status: SHIPPED ✓
*Last updated: July 3, 2026*

The assessment is complete, live, and working. All planned Phase 1+2 build work is done.
The app is parked at a stable, functional state. Future work (paid tier, benchmarks, debrief
upsell) is possible but not scheduled. Do not make changes without a clear reason.

---

## Repo & Access

- **GitHub:** `badcallai/decision-distortion-assessment` (private repo)
- **Local path:** `C:\Users\Acer\projects\decision-distortion-assessment`
- **Live URL:** `assessment.lfbholdings.com` ✓ (subdomain live via Cloudflare) — *not verifiable from the repo*
- **Fallback URL:** `decision-distortion-assessment.vercel.app`
- **Linked from:** `lfbholdings.com` homepage — Assessment tab added by UENI ✓ — *not verifiable from the repo*

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router), TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase (Postgres) |
| Hosting | Vercel |
| Email | Resend |

---

## Key File Paths

| File | What it does |
|---|---|
| `src/app/page.tsx` | Main assessment UI — 20 questions on one scrolling page, answered-count + progress bar, email gate, results screen, score bars, band labels |
| `src/app/layout.tsx` | Root layout — fonts (Geist sans/mono + Playfair Display for the wordmark) |
| `src/app/globals.css` | Tailwind import + the navy palette tokens (navy/card/hero/select/accent/ink/muted/line) |
| `src/lib/scoring.ts` | Scoring logic — reverse-scores answers, normalizes to 0–100, assigns bands, picks the dominant force (earlier-force tie-break) |
| `src/lib/questions.ts` | All 20 questions with force labels (N, B, A, I) and reverse-score flags |
| `src/lib/report-email.ts` | Builds the report email — `reportEmailHtml` + `reportEmailText`. Separate module, imported by `actions.ts` |
| `src/app/actions.ts` | Server Action `saveLead` — scores answers, saves the lead to Supabase, selects the PDF, sends the email via Resend (BCC owner) |
| `src/lib/supabase.ts` | Supabase client setup (server-only, no credentials sent to browser) |
| `supabase/schema.sql` | Database schema |
| `supabase/policies.sql` | RLS policies (INSERT only — anon key cannot read or delete leads) |
| `CLAUDE.md` | Build rules for Claude Code sessions — read this before touching anything |
| `BUILDLOG.md` | Running log of what was built and what changed |

---

## Assessment Structure

- **20 questions total**, 5 per force. All 20 render on a **single scrolling page**, grouped
  force-by-force, with a live answered-count and progress bar and one submit at the bottom.
  (There is no per-force Back/Next navigation.)
- **4 forces:** Noise (N1–N5), Bias (B1–B5), Accumulation (A1–A5), Incentive Misalignment (I1–I5)
- **Scale:** 1–5 (1 = Not true of us → 5 = Consistently true), shown as five text buttons with no numbers
- **Reverse scoring:** **all 20 questions are reverse-scored, including A1.** Flip before
  averaging (1→5, 2→4, 3→3, 4→2, 5→1). High score = high distortion present. Every question
  is worded as a healthy behavior, so "Not true of us" = distortion present.

---

## Scoring Logic

- Per-force score = average of the five flipped responses, normalized to 0–100
- **Band thresholds:** Low = 0–33 · Moderate = 34–66 · High = 67–100
- **Display:** Band label + visual bar only — numeric score (X/100) removed ✓
- **Dominant force:** highest-scoring force drives report framing and PDF selection
- **Tie rule:** on an **exact tie** for the highest score, the **earlier force in canonical
  order** (Noise → Bias → Accumulation → Incentive) wins and drives PDF selection. That winning
  force's bar is nudged up a **fixed +8%** visually (clamped at 100%) so the user sees a clear
  winner; all other bars keep their true width. Visual only — score and band values are unchanged. ✓

---

## Design — Locked

- **Base navy:** `#1b2f4e` throughout — no white backgrounds anywhere
- **Cards:** `#1e3458`
- **Hero band:** `#223662`
- **Accent:** `#5ba3e0` (selections, borders, progress bar)
- **Selected state:** `#1a4878` fill, `#5ba3e0` border, light text
- **Header:** "LFB Holdings" in Playfair Display serif + "Strategic Advisory · lfbholdings.com" in small caps
- **Button labels:** Not true of us · Rarely true · Sometimes true · Often true · Consistently true
- **Progress bar:** thin, blue fill, in the sticky bottom footer

---

## PDF Selection

- 20 pre-built PDFs stored in **`pdfs/`** at the repo root (read at runtime with `readFileSync`)
- Within the dominant force, the **worst-scored question** (lowest 1–5 answer = most distortion)
  decides which PDF is sent
- Filename on disk is **`"<force> - <id>.pdf"`** — lowercased id, with a space:
  e.g. `noise - n3.pdf`, `bias - b2.pdf`, `accumulation - a5.pdf`
- Client-facing attachment name is clean and per-force: `Noise.pdf`, `Bias.pdf`,
  `Accumulation.pdf`, `Incentives.pdf`

---

## Email

- Sent via Resend inside the `saveLead` Server Action, after the lead is saved
- HTML + plain-text templates live in **`src/lib/report-email.ts`** (a separate module),
  imported by `actions.ts` — not inlined
- Includes: full score profile (band labels + bars, no numeric scores), dominant force callout,
  PDF attached
- BCC copy goes to the owner (`rleander@lfbholdings.com`) on every report
- Sending address: `results@lfbholdings.com` (domain verified in Resend)
- Email delivery is wrapped in try/catch: a missing PDF or Resend failure is logged but never
  fails the submission — the lead is already saved and the user still sees their profile

---

## Environment Variables

Required in `.env.local` (local) and Vercel dashboard (production), all server-only (no `NEXT_PUBLIC_`):

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `RESEND_API_KEY`

---

## Possible Future Work (not scheduled)

- Paid tier ($49–$199) with richer reporting, benchmarks, debrief call upsell — requires Stripe
- Traffic analytics to see which forces dominate across respondents
- Retake / comparison flow for returning users
