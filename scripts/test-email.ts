// Manual verification that the report email actually sends through Resend.
//
// It builds a real profile with the app's own scoring and email builders, reads
// a real whitepaper PDF, and sends the message — the same shape saveLead uses.
// This does NOT touch Supabase; it only exercises the email path.
//
// Run it (reads RESEND_API_KEY from the environment):
//   RESEND_API_KEY=$(grep '^RESEND_API_KEY=' .env.local | cut -d= -f2-) \
//     npx tsx scripts/test-email.ts you@example.com
//
// The recipient is the first argument; it defaults to the LFB owner address.

import { Resend } from "resend";
import { readFileSync } from "fs";
import { join } from "path";
import { QUESTIONS } from "../src/lib/questions";
import { scoreAssessment, type Answers } from "../src/lib/scoring";
import { reportEmailHtml, reportEmailText } from "../src/lib/report-email";

const to = process.argv[2] ?? "rleander@lfbholdings.com";

if (!process.env.RESEND_API_KEY) {
  console.error("Missing RESEND_API_KEY in the environment.");
  process.exit(1);
}

// Sample answers that make "bias" the clear dominant force: bias questions are
// answered "Strongly disagree" (max distortion once reverse-scored), the rest
// "Agree" (low distortion). Enough to produce a realistic four-force profile.
const answers: Answers = {};
for (const question of QUESTIONS) {
  answers[question.id] = question.force === "bias" ? 1 : 4;
}

const profile = scoreAssessment(answers);

// Attach the PDF for the dominant force's worst-scored question, mirroring the
// action's routing. With every bias answer tied, the first bias question wins.
const worst = QUESTIONS.filter((q) => q.force === profile.dominant.force).reduce(
  (prev, curr) => ((answers[curr.id] ?? 5) < (answers[prev.id] ?? 5) ? curr : prev),
);
const filename = `${profile.dominant.force} - ${worst.id.toLowerCase()}.pdf`;
const pdfBuffer = readFileSync(join(process.cwd(), "pdfs", filename));

// Clean, client-facing attachment name — mirrors ATTACHMENT_NAME in actions.ts.
const attachmentName: Record<string, string> = {
  noise: "Noise.pdf",
  bias: "Bias.pdf",
  accumulation: "Accumulation.pdf",
  incentive: "Incentives.pdf",
};
const displayName = attachmentName[profile.dominant.force];

const resend = new Resend(process.env.RESEND_API_KEY);

async function main() {
  console.log(`Dominant force: ${profile.dominant.name} (${profile.dominant.score}/100)`);
  console.log(`Attaching: ${filename} as "${displayName}" (${pdfBuffer.length} bytes)`);
  console.log(`Sending to: ${to} ...`);

  const { data, error } = await resend.emails.send({
    from: "LFB Holdings <results@lfbholdings.com>",
    to,
    subject: `[TEST] Your Decision Distortion Report — ${profile.dominant.name}`,
    html: reportEmailHtml(profile),
    text: reportEmailText(profile),
    attachments: [{ filename: displayName, content: pdfBuffer }],
  });

  if (error) {
    console.error("SEND FAILED:", error);
    process.exit(1);
  }

  console.log("SENT OK. Resend id:", data?.id);
}

main();
