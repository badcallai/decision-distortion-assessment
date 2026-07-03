// Turns a set of 1-5 answers into a four-force distortion profile.
// See CLAUDE.md for the locked scoring rules.

import { FORCES, QUESTIONS, type Force, type Question } from "./questions";

// A respondent's answers: question id -> chosen value (1 through 5).
export type Answers = Record<string, number>;

export type Band = "Low" | "Moderate" | "High";

export type ForceResult = {
  force: Force;
  name: string;
  score: number; // 0-100, higher means more distortion
  band: Band;
};

export type Profile = {
  results: ForceResult[];
  dominant: ForceResult;
};

// Reverse-scored questions flip the response so that "Not true of us" = distortion.
// All 20 questions are currently reverse-scored; the raw-response branch stays
// for any future standard-scored item.
function adjustedScore(question: Question, response: number): number {
  return question.reverseScored ? 6 - response : response;
}

// Average a force's five adjusted answers (each 1-5) and stretch to 0-100.
function scoreForce(force: Force, answers: Answers): number {
  const questions = QUESTIONS.filter((question) => question.force === force);
  const total = questions.reduce(
    (sum, question) => sum + adjustedScore(question, answers[question.id]),
    0,
  );
  const average = total / questions.length; // 1 to 5
  return Math.round(((average - 1) / 4) * 100); // 0 to 100
}

function bandForScore(score: number): Band {
  if (score <= 33) return "Low";
  if (score <= 66) return "Moderate";
  return "High";
}

export function scoreAssessment(answers: Answers): Profile {
  const results: ForceResult[] = FORCES.map((force) => {
    const score = scoreForce(force.id, answers);
    return { force: force.id, name: force.name, score, band: bandForScore(score) };
  });

  // Highest score wins. reduce keeps the earlier force on a tie, matching the
  // canonical order in FORCES.
  const dominant = results.reduce((highest, current) =>
    current.score > highest.score ? current : highest,
  );

  return { results, dominant };
}
