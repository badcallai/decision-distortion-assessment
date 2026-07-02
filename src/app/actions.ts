"use server";

import { getSupabase } from "@/lib/supabase";
import { scoreAssessment, type Answers, type Band, type Profile } from "@/lib/scoring";
import { QUESTIONS } from "@/lib/questions";
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

// Band badge colors for the email, mirroring the results screen. Email clients
// need styles inline (they strip <style> blocks and CSS classes), so these are
// raw inline declarations rather than Tailwind classes.
const BAND_EMAIL_STYLES: Record<Band, string> = {
  Low: "background:#dcfce7;color:#166534;",
  Moderate: "background:#fef3c7;color:#92400e;",
  High: "background:#fee2e2;color:#991b1b;",
};

// The HTML body of the report email: the dominant force called out at the top,
// then all four forces with their 0-100 score and band. Table-based with inline
// styles so it renders consistently across email clients.
function reportEmailHtml(profile: Profile): string {
  const rows = profile.results
    .map((result) => {
      const isDominant = result.force === profile.dominant.force;
      return `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #e4e4e7;font-weight:${isDominant ? 700 : 400};">
            ${result.name}${isDominant ? " &middot; dominant" : ""}
          </td>
          <td style="padding:10px 12px;border-bottom:1px solid #e4e4e7;text-align:right;color:#52525b;white-space:nowrap;">
            ${result.score}/100
          </td>
          <td style="padding:10px 12px;border-bottom:1px solid #e4e4e7;text-align:right;">
            <span style="display:inline-block;padding:2px 10px;border-radius:9999px;font-size:12px;font-weight:600;${BAND_EMAIL_STYLES[result.band]}">
              ${result.band}
            </span>
          </td>
        </tr>`;
    })
    .join("");

  return `
  <div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#18181b;max-width:560px;margin:0 auto;padding:24px;">
    <h1 style="font-size:20px;margin:0 0 4px;">Your Decision Distortion profile</h1>
    <p style="margin:0 0 20px;color:#52525b;font-size:14px;">
      Higher scores mean the force is more active in your organization.
    </p>

    <div style="background:#f4f4f5;border:1px solid #e4e4e7;border-radius:8px;padding:16px;margin-bottom:20px;font-size:14px;line-height:1.5;">
      Your dominant force is
      <strong>${profile.dominant.name}</strong>
      (${profile.dominant.score}/100, ${profile.dominant.band}) — the area where
      distortion appears most active. Your personalized report is attached.
    </div>

    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <tbody>
        ${rows}
      </tbody>
    </table>

    <p style="margin:24px 0 0;font-size:14px;">
      <a href="https://lfbholdings.com" style="color:#2563eb;">Learn more or book a conversation &rarr;</a>
    </p>
    <p style="margin:16px 0 0;color:#a1a1aa;font-size:12px;">LFB Holdings</p>
  </div>`;
}

// Plain-text fallback, sent alongside the HTML for clients that don't render it.
function reportEmailText(profile: Profile): string {
  const lines = profile.results
    .map((result) => `- ${result.name}: ${result.score}/100 (${result.band})`)
    .join("\n");
  return `Your Decision Distortion profile

Your dominant force is ${profile.dominant.name} (${profile.dominant.score}/100, ${profile.dominant.band}) — the area where distortion appears most active. Your personalized report is attached.

${lines}

Learn more or book a conversation: https://lfbholdings.com

LFB Holdings`;
}

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

  // Email the personalized report. This runs only after the lead is safely
  // stored, and everything here is wrapped so that a missing PDF or an email
  // failure is logged but never fails the user's submission — their capture has
  // already succeeded, so they should still see their profile.
  try {
    const questionId = dominantQuestion(profile.dominant.force, answers);
    const filename = pdfFilename(profile.dominant.force, questionId);
    const pdfBuffer = readFileSync(join(process.cwd(), "pdfs", filename));

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error: emailError } = await resend.emails.send({
      from: "LFB Holdings <results@lfbholdings.com>",
      to: trimmedEmail,
      subject: `Your Decision Distortion Report — ${profile.dominant.name}`,
      html: reportEmailHtml(profile),
      text: reportEmailText(profile),
      attachments: [
        {
          filename,
          content: pdfBuffer,
        },
      ],
    });

    if (emailError) {
      console.error("Resend failed:", emailError);
    }
  } catch (err) {
    console.error("Report email failed:", err);
  }

  return { ok: true };
}
