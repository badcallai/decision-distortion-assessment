"use client";

import { useState } from "react";
import { FORCES, QUESTIONS } from "@/lib/questions";
import { scoreAssessment, type Answers, type Band } from "@/lib/scoring";
import { saveLead } from "./actions";

// The 1-5 Likert scale, shown under each question.
const SCALE = [
  { value: 1, label: "Strongly disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Agree" },
  { value: 5, label: "Strongly agree" },
];

// Color styling for each band, used on the results screen.
const BAND_STYLES: Record<Band, string> = {
  Low: "bg-green-100 text-green-800",
  Moderate: "bg-amber-100 text-amber-800",
  High: "bg-red-100 text-red-800",
};

// The three screens the page moves through in order.
type Phase = "questions" | "email" | "results";

export default function Home() {
  const [answers, setAnswers] = useState<Answers>({});
  const [phase, setPhase] = useState<Phase>("questions");
  const [email, setEmail] = useState("");
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
    setError("");
    setPhase("questions");
    window.scrollTo({ top: 0 });
  }

  async function submitEmail(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const result = await saveLead(email, answers);

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

    return (
      <main className="mx-auto max-w-2xl p-6 sm:p-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          Your Decision Distortion profile
        </h1>
        <p className="mt-2 text-zinc-600">
          Higher scores mean the force is more active in your organization.
        </p>

        <p className="mt-6 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
          Your dominant force is{" "}
          <span className="font-semibold">{profile.dominant.name}</span> — the
          area where distortion appears most active.
        </p>

        <p className="mt-3 text-zinc-600">
          Your personalized report is on its way to{" "}
          <span className="font-medium">{email.trim()}</span>.
        </p>

        <ul className="mt-6 space-y-3">
          {profile.results.map((result) => (
            <li
              key={result.force}
              className="rounded-lg border border-zinc-200 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium">{result.name}</span>
                <span className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${BAND_STYLES[result.band]}`}
                  >
                    {result.band}
                  </span>
                  <span className="tabular-nums text-zinc-600">
                    {result.score}/100
                  </span>
                </span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-zinc-100">
                <div
                  className="h-full rounded-full bg-zinc-700"
                  style={{ width: `${result.score}%` }}
                />
              </div>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={startOver}
          className="mt-8 rounded-lg border border-zinc-300 px-4 py-2 hover:bg-zinc-100"
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
        <h1 className="text-2xl font-semibold tracking-tight">
          Your results are ready
        </h1>
        <p className="mt-2 text-zinc-600">
          Enter your email to see which of the four Decision Distortion forces
          are most active in your organization.
        </p>

        <form onSubmit={submitEmail} className="mt-6 space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@company.com"
            className="w-full rounded-lg border border-zinc-300 px-3 py-2"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-lg bg-zinc-800 px-5 py-2 text-white hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {saving ? "Saving…" : "Show my profile"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setPhase("questions")}
          className="mt-4 text-sm text-zinc-500 hover:underline"
        >
          ← Back to the questions
        </button>
      </main>
    );
  }

  // Screen 1 — the questionnaire.
  return (
    <main className="mx-auto max-w-2xl p-6 sm:p-8">
      <h1 className="text-2xl font-semibold tracking-tight">
        Decision Distortion Self-Assessment
      </h1>
      <p className="mt-2 text-zinc-600">
        Rate how strongly each statement describes your organization. Answer all
        20 to see where the four distortion forces are most active.
      </p>

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
            <h2 className="text-lg font-semibold">{force.name}</h2>
            <p className="mt-1 text-sm text-zinc-500">{force.description}</p>

            <ol className="mt-4 space-y-6">
              {QUESTIONS.filter((question) => question.force === force.id).map(
                (question) => (
                  <li
                    key={question.id}
                    className="rounded-lg border border-zinc-200 p-4"
                  >
                    <p className="font-medium">{question.text}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {SCALE.map((option) => {
                        const selected = answers[question.id] === option.value;
                        return (
                          <label
                            key={option.value}
                            className={`cursor-pointer rounded-lg border px-3 py-2 text-sm ${
                              selected
                                ? "border-zinc-800 bg-zinc-800 text-white"
                                : "border-zinc-300 hover:bg-zinc-100"
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
                            {option.value} · {option.label}
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

        <div className="sticky bottom-0 flex items-center justify-between gap-4 border-t border-zinc-200 bg-white py-4">
          <span className="text-sm text-zinc-500">
            {answeredCount} / {QUESTIONS.length} answered
          </span>
          <button
            type="submit"
            disabled={!allAnswered}
            className="rounded-lg bg-zinc-800 px-5 py-2 text-white hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            See my profile
          </button>
        </div>
      </form>
    </main>
  );
}
