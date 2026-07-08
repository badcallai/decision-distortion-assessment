"use server";

import { getSupabase } from "@/lib/supabase";
import { scoreAssessment, type Answers } from "@/lib/scoring";
import { QUESTIONS, type Force } from "@/lib/questions";
import { reportEmailHtml, reportEmailText } from "@/lib/report-email";
import { prependCoverPage } from "@/lib/cover-page";
import { Resend } from "resend";
import { readFileSync } from "fs";
import { join } from "path";

// Within the dominant force, find the question the respondent scored worst on
// (the lowest 1-5 answer means the most distortion). That single question
// decides which whitepaper PDF we send them.
function dominantQuestion(dominantForce: string, answers: Answers): string {
  const forceQuestions = QUESTIONS.filter((q) => q.force === dominantForce);
  const worst = forceQuestions.reduce((prev, curr) => {
    const prevScore = answers[prev.id] ?? 5;
    const currScore = answers[curr.id] ?? 5;
    return currScore < prevScore ? curr : prev;
  });
  return worst.id;
}

// The PDFs in /pdfs are named "<force> - <id>.pdf", e.g. "noise - n1.pdf".
function pdfFilename(dominantForce: string, questionId: string): string {
  return `${dominantForce} - ${questionId.toLowerCase()}.pdf`;
}

// Clean, client-facing name for the attachment. The file we read from disk is
// unchanged — this only controls what the recipient sees the attachment called.
const ATTACHMENT_NAME: Record<Force, string> = {
  noise: "Noise.pdf",
  bias: "Bias.pdf",
  accumulation: "Accumulation.pdf",
  incentive: "Incentives.pdf",
};

// Saves one lead: their email plus the computed profile and raw answers. The
// scores are recomputed here on the server from the answers, so the numbers we
// store don't rely on anything the browser sends beyond the raw responses.
export async function saveLead(
  email: string,
  answers: Answers,
  companyName?: string,
): Promise<{ ok: boolean; error?: string; report?: { force: Force; q: string } }> {
  const trimmedEmail = email.trim();
  if (!trimmedEmail.includes("@")) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  // The company / engagement name is optional — store null when it's left blank.
  const company = companyName?.trim() || null;

  const profile = scoreAssessment(answers);
  const scoreByForce: Record<string, number> = {};
  for (const result of profile.results) {
    scoreByForce[result.force] = result.score;
  }

  const supabase = getSupabase();
  const { error } = await supabase.from("leads").insert({
    email: trimmedEmail,
    company_name: company,
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

  // Selection needed by both the email and the results-screen auto-download —
  // compute once, return below, so a failed email never blocks the download.
  const questionId = dominantQuestion(profile.dominant.force, answers);

  // Email the personalized report. This runs only after the lead is safely
  // stored, and everything here is wrapped so that a missing PDF or an email
  // failure is logged but never fails the user's submission — their capture has
  // already succeeded, so they should still see their profile.
  try {
    const filename = pdfFilename(profile.dominant.force, questionId);
    const pdfBuffer = readFileSync(join(process.cwd(), "pdfs", filename));

    // When a company / engagement name was provided, prepend a cover page naming
    // them. A blank name skips this entirely and attaches the whitepaper as-is.
    // If cover generation fails for any reason, fall back to the plain whitepaper
    // so a cover problem never blocks the email.
    let attachment: Buffer = pdfBuffer;
    if (company) {
      try {
        attachment = await prependCoverPage(pdfBuffer, company);
      } catch (coverError) {
        console.error("Cover page generation failed:", coverError);
      }
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error: emailError } = await resend.emails.send({
      from: "LFB Holdings <results@lfbholdings.com>",
      to: trimmedEmail,
      // Blind-copy the owner on every report so leads land in the mailbox too.
      bcc: "rleander@lfbholdings.com",
      subject: `Your Decision Distortion Report — ${profile.dominant.name}`,
      html: reportEmailHtml(profile, company),
      text: reportEmailText(profile, company),
      attachments: [
        {
          filename: ATTACHMENT_NAME[profile.dominant.force],
          content: attachment,
        },
      ],
    });

    if (emailError) {
      console.error("Resend failed:", emailError);
    }
  } catch (err) {
    console.error("Report email failed:", err);
  }

  return {
    ok: true,
    report: { force: profile.dominant.force, q: questionId.toLowerCase() },
  };
}
