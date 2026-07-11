# Decision Distortion Assessment — Codebase Reference

This file exists so any new chat session is fully oriented on the codebase without needing to ask.

> Regenerated July 11, 2026 after the native-report + Calendly CTA work shipped.
> Corrected against the repo on July 3, consolidated July 10, updated July 11.
> Where this doc and the code ever disagree, the code (and `CLAUDE.md`) win — fix the doc, not your memory.

---

## Status: SHIPPED ✓
*Last updated: July 11, 2026*

The assessment is complete, live, and working. All planned Phase 1+2 build work is done, including
the scoring corrections, the band-only display, the tie nudge, the native on-screen report, and the
Calendly call-to-action on both the results screen and the report email — all operational in
production. The app is parked at a stable, functional state. Future work (paid tier, benchmarks,
debrief upsell) is possible but not scheduled. Do not make changes without a clear reason.

**Most recent change (July 10–11):** the per-force report now renders as native HTML on the results
screen (replacing a silent auto-download of the PDF), and a Calendly CTA ("Book a 30-minute
conversation" → `calendly.com/rcleander/15min`) was added to both the on-screen report and the
report email. Production email confirmed delivering with the PDF attached and the booking block.

---

## Repo & Access

- **GitHub:** `badcallai/decision-distortion-assessment` (private repo)
- **Local path:** `C:\Users\Acer\projects\decision-distortion-assessment`
- **Live URL:** `assessment.lfbholdings.com` ✓ (subdomain live via Cloudflare) — *not verifiable from the repo*
- **Fallback URL:** `decision-distortion-assessment.vercel.app`
- **Linked from:** `lfbholdings.com` homepage — Assessment tab added by UENI ✓ — *not verifiable from the repo*
- **Production branch:** `main` (this is the branch Vercel deploys production from). Renamed from
  `claude/brave-volta-rehga0` on July 11, 2026; GitHub's default branch, Vercel's Production Branch
  setting, and the local clone were all updated to match, and the chain was verified with a live
  production deploy.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase (Postgres) |
| Hosting | Vercel |
| Email | Resend |
| PDF | pdf-lib (in-memory cover-page generation) |

---

## Key File Paths

| File | What it does |
|---|---|
| `src/app/page.tsx` | Main assessment UI — 20 questions on one scrolling page, answered-count + progress bar, email gate, results screen, score bars, band labels. **Renders `<AssessmentReport />` natively below the bars** and a "Download as PDF" button. The old silent auto-download `useEffect` has been removed. |
| `src/app/layout.tsx` | Root layout — fonts (Geist sans/mono + Playfair Display for the wordmark) |
| `src/app/globals.css` | Tailwind import + the navy palette tokens (navy/card/hero/select/accent/ink/muted/line) |
| `src/lib/scoring.ts` | Scoring logic — reverse-scores answers, normalizes to 0–100, assigns bands, picks the dominant force (earlier-force tie-break) |
| `src/lib/questions.ts` | All 20 questions with force labels (N, B, A, I) and reverse-score flags |
| `src/lib/report-content.ts` | Report copy structured by force + question id — 4 base reports, 20 signal paragraphs, and the **CTA object (the single source of truth for the Calendly link, LFB link, and Bad Call link)**. Exports `getReport`, `normalizeForce`, `normalizeQuestion`, `FORCES`, `SIGNALS`, `CTA`. Single source for on-screen report copy. |
| `src/components/AssessmentReport.tsx` | Native-HTML report component for the results screen. Takes `{ force, q }` straight from `saveLead` and renders masthead → force badge → opening → what it is → how it shows up → signal callout → where to start → research → what's next → CTA (including the Calendly button). Imports `CTA` from `report-content.ts`. **Lives at `src/components/` — the old repo-root copy is gone.** |
| `src/lib/report-email.ts` | Builds the report email — `reportEmailHtml` + `reportEmailText`. Separate module, imported by `actions.ts`. **Includes the Calendly booking block in both HTML and plain-text bodies, importing `CTA` from `report-content.ts`** (so the URL lives in exactly one place across the app). |
| `src/lib/cover-page.ts` | Builds a spare one-page transmittal cover with pdf-lib and prepends it to the selected whitepaper PDF **entirely in memory, never touching disk**. Used only when the respondent provided a company / engagement name (`prependCoverPage`). No native dependencies; runs cleanly on Vercel. |
| `src/app/actions.ts` | Server Action `saveLead` — scores answers, saves the lead to Supabase, selects the PDF, optionally prepends the cover page, sends the email via Resend (BCC owner). Returns `report: { force, q }` |
| `src/app/api/download-report/route.ts` | Serves the selected PDF — inline by default, `?dl=1` forces download. **Live, not dead code:** the "Download as PDF" button on the results screen depends on it (it links with `&dl=1`). Do not remove it or the `outputFileTracingIncludes` config. |
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

## On-screen report — LIVE ✓

The results screen renders the report **natively as HTML** via `src/components/AssessmentReport.tsx`,
which takes `{ force, q }` straight from `saveLead`. It renders masthead → force badge → opening →
what it is → how it shows up → signal callout → where to start → research → what's next → CTA, styled
with the locked navy palette tokens.

- The old PDF `<iframe>` and the silent auto-download-on-mount are **both gone.**
- A "Download as PDF" button remains below the report for anyone who wants the file; it links to
  `/api/download-report?...&dl=1` (a deliberate click, so it forces the download).
- The **signal callout** uses `bg-card` (not `bg-hero`) — an earlier dark-on-dark readability bug
  was fixed here.
- The Calendly CTA button lives inside this component and reads `CTA.calendly` from
  `report-content.ts`.

---

## CTA / Calendly — single source of truth

- The Calendly link, LFB link, and Bad Call link all live in the **`CTA` object in
  `report-content.ts`**. The on-screen report and the email both import `CTA` — change the URL or
  label in one place and both surfaces update.
- **Calendly URL:** `calendly.com/rcleander/15min` · **Button label:** "Book a 30-minute conversation"
- **Known cosmetic mismatch:** the URL slug says `15min` but the actual Calendly event is 30 minutes.
  The slug is just the event-type name Calendly assigned at creation; it does not govern duration.
  Leave it unless you rename the event in Calendly (which would change the link and break any already
  sent).
- **Calendly delivery note:** the event type must be set to **"Email confirmation"** (not "Calendar
  invitation"). When it was set to Calendar invitation, invitees never received a Calendly email.
  This is now set correctly.

---

## PDF Selection (email attachments)

- 20 pre-built PDFs stored in **`pdfs/`** at the repo root (read at runtime with `readFileSync`)
- Within the dominant force, the **worst-scored question** (lowest 1–5 answer = most distortion)
  decides which PDF is sent
- Filename on disk is **`"<force> - <id>.pdf"`** — lowercased id, with a space:
  e.g. `noise - n3.pdf`, `bias - b2.pdf`, `accumulation - a5.pdf`
- Client-facing attachment name is clean and per-force: `Noise.pdf`, `Bias.pdf`,
  `Accumulation.pdf`, `Incentives.pdf`
- **The static PDFs deliberately do NOT carry the Calendly link** (decision, July 11, 2026). The CTA
  lives on the results screen and in the email body only. An `appendCtaPage` (pdf-lib, alongside
  `prependCoverPage`) was considered and explicitly declined — do not build it without a new decision.

---

## Email

- Sent via Resend inside the `saveLead` Server Action, after the lead is saved
- HTML + plain-text templates live in **`src/lib/report-email.ts`** (a separate module),
  imported by `actions.ts` — not inlined
- Includes: full score profile (band labels + bars, no numeric scores), dominant force callout,
  **the Calendly booking block** (from the `CTA` object), and the PDF attached
- BCC copy goes to the owner (`rleander@lfbholdings.com`) on every report
- Sending address: `results@lfbholdings.com` (domain verified in Resend)
- Email delivery is wrapped in try/catch: a missing PDF or Resend failure is logged but never
  fails the submission — the lead is already saved and the user still sees their profile
- **Production email confirmed** delivering with the PDF attached and the booking block (July 11).

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
- **Signal callout:** `bg-card` (readable), accent left border

---

## Report Copy — Source of Truth

- Original manuscript: `DD_Assessment_Reports_Draft2.docx` (4 base reports + 20 signal paragraphs)
- **Edit copy in `src/lib/report-content.ts`**, not the docx — that module is what the UI reads
- Email copy lives separately in `src/lib/report-email.ts`; the 20 PDFs are pre-built and static

---

## Branches

- **Production / default:** `main` — the branch Vercel deploys from. Renamed from
  `claude/brave-volta-rehga0` on July 11, 2026 (GitHub default updated, Vercel Production Branch
  setting updated, local clone re-pointed to `origin/main`, verified with a production deploy).
- **`feature/native-report-cta`:** carried the native report + Calendly work; merged into `main`,
  then deleted July 11, 2026.
- **`feature/auto-download-report`:** superseded, deleted July 11, 2026.

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
