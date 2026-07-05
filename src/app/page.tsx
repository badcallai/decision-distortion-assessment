"use client";

import { useState } from "react";
import { FORCES, QUESTIONS } from "@/lib/questions";
import { scoreAssessment, type Answers, type Band } from "@/lib/scoring";
import { saveLead } from "./actions";

// The 1-5 frequency scale, shown as buttons under each question. Ordered low to
// high so value 5 ("Consistently true") means the healthy behavior is fully
// present (no distortion) and value 1 ("Not true of us") means it's absent.
const SCALE = [
  { value: 1, label: "Not true of us" },
  { value: 2, label: "Rarely true" },
  { value: 3, label: "Sometimes true" },
  { value: 4, label: "Often true" },
  { value: 5, label: "Consistently true" },
];

// Color styling for each band, used on the results screen. Semantic green/amber/
// red chips, kept for at-a-glance severity on the light cards.
const BAND_STYLES: Record<Band, string> = {
  Low: "bg-green-100 text-green-800",
  Moderate: "bg-amber-100 text-amber-800",
  High: "bg-red-100 text-red-800",
};

// The three screens the page moves through in order.
type Phase = "questions" | "email" | "results";

// The LFB Holdings wordmark + tagline, shown at the top of every screen.
function Header() {
  return (
    <header className="mb-8">
      <div className="font-heading text-2xl font-bold tracking-tight text-heading">
        LFB Holdings
      </div>
      <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-muted">
        Strategic Advisory · lfbholdings.com
      </div>
    </header>
  );
}

export default function Home() {
  const [answers, setAnswers] = useState<Answers>({});
  const [phase, setPhase] = useState<Phase>("questions");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === QUESTIONS.length;

  function chooseAnswer(questionId: string, value: number) {
    setAnswers((previous) => ({ ...previous, [questionId]: value }));
  }

  function startOver() {
    setAnswers({});
    setEmail("");
    setCompany("");
    setError("");
    setPhase("questions");
    window.scrollTo({ top: 0 });
  }

  async function submitEmail(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const result = await saveLead(email, answers, company);

    setSaving(false);
    if (result.ok) {
      setPhase("results");
      window.scrollTo({ top: 0 });
    } else {
      setError(result.error ?? "Something went wrong. Please try again.");
    }
  }

  // Screen 3 — the full profile, shown after the email is captured.
  if (phase === "results") {
    const profile = scoreAssessment(answers);

    // On a tie for the top score, keep an 8-point visual gap so the dominant
    // force (the one that routes the PDF — earlier force in canonical order wins)
    // reads as a clear winner. If there's headroom the winner's bar bumps up; if
    // it's already maxed at 100, the tied bars are marked down instead. Visual
    // only — scores and bands are unchanged.
    const topScore = profile.dominant.score;
    const tiedForTop =
      profile.results.filter((result) => result.score === topScore).length > 1;
    const winnerWidth = Math.min(topScore + 8, 100);

    return (
      <main className="mx-auto max-w-2xl p-6 sm:p-8">
        <Header />
        <h1 className="font-heading text-2xl font-bold tracking-tight text-heading">
          Your Decision Distortion profile
        </h1>
        <p className="mt-2 text-muted">
          A longer bar means the force is more active in your organization.
        </p>
        {company.trim() && (
          <p className="mt-3 text-sm font-medium text-heading">
            Prepared for {company.trim()}
          </p>
        )}

        <p className="mt-6 rounded-lg border border-line border-l-4 border-l-accent bg-card p-4 text-ink">
          Your dominant force is{" "}
          <span className="font-semibold">{profile.dominant.name}</span> — the
          area where distortion appears most active.
        </p>

        <p className="mt-3 text-muted">
          Your personalized report is on its way to{" "}
          <span className="font-medium text-ink">{email.trim()}</span>.
        </p>

        <ul className="mt-6 space-y-3">
          {profile.results.map((result) => {
            const isWinner = result.force === profile.dominant.force;
            const isTiedLoser =
              tiedForTop && !isWinner && result.score === topScore;
            let barWidth = result.score;
            if (tiedForTop && isWinner) barWidth = winnerWidth;
            else if (isTiedLoser) barWidth = winnerWidth - 8;

            return (
              <li
                key={result.force}
                className="rounded-lg border border-line bg-card p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium text-ink">{result.name}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${BAND_STYLES[result.band]}`}
                  >
                    {result.band}
                  </span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-track">
                  <div
                    className="h-full rounded-full bg-bar"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          onClick={startOver}
          className="mt-8 rounded-lg border border-accent px-4 py-2 text-accent hover:bg-select"
        >
          Start over
        </button>
      </main>
    );
  }

  // Screen 2 — the email gate, shown once all questions are answered.
  if (phase === "email") {
    return (
      <main className="mx-auto max-w-md p-6 sm:p-8">
        <Header />
        <h1 className="font-heading text-2xl font-bold tracking-tight text-heading">
          Your results are ready
        </h1>
        <p className="mt-2 text-muted">
          Enter your email to see which of the four Decision Distortion forces
          are most active in your organization.
        </p>

        <form onSubmit={submitEmail} className="mt-6 space-y-3">
          <div>
            <label
              htmlFor="company"
              className="mb-1 block text-sm text-muted"
            >
              Company or engagement name{" "}
              <span className="text-muted">— optional</span>
            </label>
            <input
              id="company"
              type="text"
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              placeholder="Acme Credit Union"
              className="w-full rounded-lg border border-line bg-card px-3 py-2 text-ink placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </div>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@company.com"
            className="w-full rounded-lg border border-line bg-card px-3 py-2 text-ink placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-lg bg-accent px-5 py-2 font-medium text-white hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
          >
            {saving ? "Saving…" : "Show my profile"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setPhase("questions")}
          className="mt-4 text-sm text-muted hover:text-accent"
        >
          ← Back to the questions
        </button>
      </main>
    );
  }

  // Screen 1 — the questionnaire.
  return (
    <main className="mx-auto max-w-2xl p-6 sm:p-8">
      <Header />

      <div className="rounded-xl bg-hero p-6 sm:p-8">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Decision distortion is amplifying every risk you&apos;re already
          managing.
        </h1>
        <p className="mt-3 text-white/75">
          Rate how strongly each statement describes your organization. Answer
          all 20 questions to see where noise, bias, accumulation, and incentive
          misalignment are most active — and receive a tailored report.
        </p>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          setPhase("email");
          window.scrollTo({ top: 0 });
        }}
        className="mt-8 space-y-10"
      >
        {FORCES.map((force) => (
          <section key={force.id}>
            <h2 className="font-heading text-lg font-bold text-heading">
              {force.name}
            </h2>
            <p className="mt-1 text-sm italic text-muted">
              {force.description}
            </p>

            <ol className="mt-4 space-y-4">
              {QUESTIONS.filter((question) => question.force === force.id).map(
                (question) => (
                  <li
                    key={question.id}
                    className="rounded-lg border border-line bg-card p-4"
                  >
                    <p className="font-medium text-ink">{question.text}</p>
                    <div className="mt-3 grid grid-cols-5 gap-2">
                      {SCALE.map((option) => {
                        const selected = answers[question.id] === option.value;
                        return (
                          <label
                            key={option.value}
                            className={`cursor-pointer rounded-lg border px-2 py-2 text-center text-xs leading-tight sm:text-sm ${
                              selected
                                ? "border-accent bg-select font-medium text-heading"
                                : "border-line text-ink hover:border-accent hover:text-accent"
                            }`}
                          >
                            <input
                              type="radio"
                              name={question.id}
                              value={option.value}
                              checked={selected}
                              onChange={() =>
                                chooseAnswer(question.id, option.value)
                              }
                              className="sr-only"
                            />
                            {option.label}
                          </label>
                        );
                      })}
                    </div>
                  </li>
                ),
              )}
            </ol>
          </section>
        ))}

        <div className="sticky bottom-0 border-t border-line bg-page py-4">
          <div className="mb-3 h-1 w-full overflow-hidden rounded-full bg-track">
            <div
              className="h-full rounded-full bg-accent transition-all"
              style={{
                width: `${(answeredCount / QUESTIONS.length) * 100}%`,
              }}
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-muted">
              {answeredCount} / {QUESTIONS.length} answered
            </span>
            <button
              type="submit"
              disabled={!allAnswered}
              className="rounded-lg bg-accent px-5 py-2 font-medium text-white hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
            >
              See my profile
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
