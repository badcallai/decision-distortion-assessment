// src/components/AssessmentReport.tsx
// Native-HTML report rendered directly on the results screen (no PDF viewer).
// Renders the assembled report for the dominant force + the signal paragraph
// for the worst-scored question in that force.
//
// Usage on the results screen (report comes from saveLead: `report: { force, q }`):
//   <AssessmentReport force={report.force} q={report.q} />
//
// COLOR TOKENS: uses the project palette utilities already present in page.tsx
// (bg-card, bg-accent, text-accent, text-ink, text-muted, border-line,
// hover:bg-accent-hover). All are defined in globals.css.
//
// NOTE: the signal callout uses bg-card, NOT bg-hero. bg-hero is the dark navy
// band from the questionnaire header and expects white text over it; the report
// body is text-ink, which is unreadable against it.
//
// FONT: the editorial title/wordmark use --font-playfair (the same font as the
// app wordmark) with a Georgia fallback.

import { getReport, CTA } from "@/lib/report-content";

interface AssessmentReportProps {
  /** report.force from saveLead — accepts "N"/"noise"/"Noise" etc. */
  force: string;
  /** report.q from saveLead — the worst-scored question id, e.g. "n3". Optional. */
  q?: string | null;
  className?: string;
}

const SERIF = "var(--font-playfair, Georgia, 'Times New Roman', serif)";

function Paras({ items, lead = false }: { items: string[]; lead?: boolean }) {
  return (
    <>
      {items.map((t, i) => (
        <p
          key={i}
          className={
            "mb-3.5 leading-relaxed text-ink " +
            (lead && i === 0 ? "text-[16px] sm:text-[17px]" : "text-[15px] sm:text-base")
          }
        >
          {t}
        </p>
      ))}
    </>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-8 mb-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
      {children}
    </h2>
  );
}

export default function AssessmentReport({ force, q, className }: AssessmentReportProps) {
  const report = getReport(force, q);
  if (!report) return null; // unrecognized force — parent can render its own fallback
  const { force: f, signal } = report;

  return (
    <article className={"w-full " + (className ?? "")}>
      {/* masthead */}
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line pb-3.5">
        <span style={{ fontFamily: SERIF }} className="text-lg tracking-tight text-ink">
          LFB&nbsp;Holdings
        </span>
        <span className="text-[11px] uppercase tracking-[0.12em] text-muted">
          Strategic Advisory · lfbholdings.com
        </span>
      </div>

      {/* force badge + title */}
      <p className="mt-6 mb-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
        Force {f.number} · {f.name}
      </p>
      <p className="mb-1.5 text-sm text-muted">{f.eyebrow}</p>
      <h1
        style={{ fontFamily: SERIF }}
        className="mb-5 text-[26px] font-semibold leading-tight text-ink sm:text-[32px]"
      >
        {f.title}
      </h1>

      {/* body */}
      <Paras items={f.opening} lead />

      <SectionHeading>{f.whatItIs.heading}</SectionHeading>
      <Paras items={f.whatItIs.body} />

      <SectionHeading>{f.howItShowsUp.heading}</SectionHeading>
      <Paras items={f.howItShowsUp.body} />

      {signal && (
        <aside className="my-6 rounded-r-xl border border-line border-l-[3px] border-l-accent bg-card px-4 py-4 sm:px-5">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">
            What your assessment flagged
          </p>
          <p className="mb-3 text-[15px] italic leading-relaxed text-ink">
            &ldquo;{signal.signalOn}&rdquo;
          </p>
          <p className="text-[15px] leading-relaxed text-ink">{signal.body}</p>
        </aside>
      )}

      <SectionHeading>{f.whereToStart.heading}</SectionHeading>
      <Paras items={f.whereToStart.body} />

      <SectionHeading>{f.research.heading}</SectionHeading>
      <Paras items={f.research.body} />

      <SectionHeading>{f.whatsNext.heading}</SectionHeading>
      <Paras items={f.whatsNext.body} />

      {/* CTA */}
      <div className="mt-9 border-t border-line pt-5">
        <p className="mb-4 text-[15px] leading-relaxed text-ink">{CTA.talk}</p>

        <a
          href={CTA.calendly.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-7 inline-block rounded-lg bg-accent px-5 py-3 text-[15px] font-medium text-white no-underline hover:bg-accent-hover"
        >
          {CTA.calendly.label} &rarr;
        </a>

        <p className="mb-3.5 text-[15px] text-ink">
          <span className="font-semibold">{CTA.lfb.label}:</span>{" "}
          <a href={CTA.lfb.href} className="border-b border-accent text-accent no-underline">
            {CTA.lfb.url}
          </a>
        </p>
        <p className="mb-3.5 text-[15px] leading-relaxed text-ink">{CTA.badCallIntro}</p>
        <p className="text-[15px] text-ink">
          <span className="font-semibold">{CTA.badCall.label}:</span>{" "}
          <a href={CTA.badCall.href} className="border-b border-accent text-accent no-underline">
            {CTA.badCall.url}
          </a>
        </p>
        <p className="mt-6 border-t border-line pt-3.5 text-xs tracking-wide text-muted">
          Decision Distortion Assessment · LFB Holdings · badcall.ai
        </p>
      </div>
    </article>
  );
}
