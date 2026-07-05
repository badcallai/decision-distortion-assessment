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
| `src/app/layout.tsx` | Root layout — fonts (Archivo for headings/wordmark + Roboto for body) |
| `src/app/globals.css` | Tailwind import + the light palette tokens (page/card/line/hero/ink/heading/muted/accent/select/bar/track) |
| `src/lib/scoring.ts` | Scoring logic — reverse-scores answers, normalizes to 0–100, assigns bands, picks the dominant force (earlier-force tie-break) |
| `src/lib/questions.ts` | All 20 questions with force labels (N, B, A, I) and reverse-score flags |
| `src/lib/report-email.ts` | Builds the report email — `reportEmailHtml` + `reportEmailText`. Separate module, imported by `actions.ts` |
| `src/lib/cover-page.ts` | Generates a one-page transmittal cover (pdf-lib) and prepends it to the whitepaper when a company name was given |
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

Light theme matched to lfbholdings.com (replaced the earlier all-navy dark theme on July 5, 2026).

- **Fonts:** Archivo (headings + the "LFB Holdings" wordmark) + Roboto (body), both via `next/font`
- **Page background:** `#f3f5f7` (light cool gray)
- **Cards / inputs:** white `#ffffff`, borders `#d4dce3`
- **Hero band:** solid navy `#1b263b` with white text (a photo is optional — drop a large image at
  `public/hero.jpg` and wire it into the hero band later)
- **Text:** body `#1a1a1a`, navy headings `#1b263b`, muted slate `#5b6b7f`
- **Accent:** burnt orange `#bb6108` (buttons, progress bar, selected state), hover `#944232`
- **Selected answer:** orange border `#bb6108` + light-orange fill `#fbeee0` + navy text
- **Score bars:** navy `#1b263b` fill on track `#e4e8ed`; results band chips kept green/amber/red
- **Header:** "LFB Holdings" (Archivo bold) + "Strategic Advisory · lfbholdings.com" in small caps
- **Button labels:** Not true of us · Rarely true · Sometimes true · Often true · Consistently true
- **Progress bar:** thin, orange fill, in the sticky bottom footer
- Palette lives as Tailwind tokens in `src/app/globals.css`
  (page/card/line/hero/ink/heading/muted/accent/select/bar/track)

---

## PDF Selection

- 20 pre-built PDFs stored in **`pdfs/`** at the repo root (read at runtime with `readFileSync`)
- Within the dominant force, the **worst-scored question** (lowest 1–5 answer = most distortion)
  decides which PDF is sent
- Filename on disk is **`"<force> - <id>.pdf"`** — lowercased id, with a space:
  e.g. `noise - n3.pdf`, `bias - b2.pdf`, `accumulation - a5.pdf`
- Client-facing attachment name is clean and per-force: `Noise.pdf`, `Bias.pdf`,
  `Accumulation.pdf`, `Incentives.pdf`
- If a company/engagement name was provided, a one-page cover ("LFB Holdings" /
  "Decision Distortion Assessment" / "Prepared for {name}" / date) is generated at
  runtime with **pdf-lib** and prepended as page 1 — in memory, disk PDFs untouched.
  Blank name → whitepaper attached unchanged. A cover failure falls back to the plain
  PDF and never blocks the email. Logic in `src/lib/cover-page.ts`, called from `actions.ts`.

---

## Email

- Sent via Resend inside the `saveLead` Server Action, after the lead is saved
- HTML + plain-text templates live in **`src/lib/report-email.ts`** (a separate module),
  imported by `actions.ts` — not inlined
- Includes: full score profile (band labels + bars, no numeric scores), dominant force callout,
  PDF attached
- If the respondent filled the optional company/engagement name, it's stored in
  `leads.company_name` and echoed as "Prepared for {name}" on the results screen and in the email
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
