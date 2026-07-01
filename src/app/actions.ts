"use server";

import { getSupabase } from "@/lib/supabase";
import { scoreAssessment, type Answers } from "@/lib/scoring";

// Saves one lead: their email plus the computed profile and raw answers. The
// scores are recomputed here on the server from the answers, so the numbers we
// store don't rely on anything the browser sends beyond the raw responses.
export async function saveLead(
  email: string,
  answers: Answers,
): Promise<{ ok: boolean; error?: string }> {
  const trimmedEmail = email.trim();
  if (!trimmedEmail.includes("@")) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  const profile = scoreAssessment(answers);
  const scoreByForce: Record<string, number> = {};
  for (const result of profile.results) {
    scoreByForce[result.force] = result.score;
  }

  const supabase = getSupabase();
  const { error } = await supabase.from("leads").insert({
    email: trimmedEmail,
    noise_score: scoreByForce.noise,
    bias_score: scoreByForce.bias,
    accumulation_score: scoreByForce.accumulation,
    incentive_score: scoreByForce.incentive,
    dominant_force: profile.dominant.force,
    answers,
  });

  if (error) {
    return {
      ok: false,
      error: "Something went wrong saving your results. Please try again.",
    };
  }

  return { ok: true };
}
